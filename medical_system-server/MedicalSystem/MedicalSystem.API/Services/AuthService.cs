using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.API.DTOs.Auth;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models.Owned;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

namespace MedicalSystem.API.Services
{
    public class AuthService
    {
        private readonly MedicalSystemDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(MedicalSystemDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<LoginResponseDto?> LoginAsync(string login, string password, CancellationToken token = default)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Login == login, token);

            if (user == null)
                return null;

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return null;

            var jwtToken = GenerateToken(user);

            return new LoginResponseDto
            {
                Token = jwtToken,
                Role = user.Role,
                UserId = user.Id.ToString(),
                Login = user.Login,
                DisplayName = user.DisplayName,
                PatientId = user.PatientId?.ToString()
            };
        }

        public async Task<User> RegisterAsync(RegisterRequestDto dto, CancellationToken token = default)
        {
            var existing = await _context.Users
                .AnyAsync(u => u.Login == dto.Login, token);

            if (existing)
                throw new InvalidOperationException($"Пользователь с логином '{dto.Login}' уже существует.");

            var allowed = new HashSet<string> { "Doctor", "Nurse", "HeadNurse", "ChiefDoctor", "LaboratoryEmployee", "Patient" };
            if (!allowed.Contains(dto.Role))
                throw new ArgumentException($"Недопустимая роль: {dto.Role}");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Login = dto.Login,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                DisplayName = dto.DisplayName,
                MedicalStaffId = dto.MedicalStaffId,
                CreatedAt = DateTime.UtcNow
            };

                var staffRoles = new[] { "Doctor", "Nurse", "HeadNurse", "ChiefDoctor", "LaboratoryEmployee" };
            if (dto.MedicalStaffId == null && staffRoles.Contains(dto.Role))
            {
                var position = dto.Role switch
                {
                    "Doctor" => "Врач",
                    "ChiefDoctor" => "Главный врач",
                    "HeadNurse" => "Старшая медицинская сестра",
                    "Nurse" => "Медицинская сестра",
                    "LaboratoryEmployee" => "Лаборант",
                    _ => "Сотрудник"
                };

                var staff = new MedicalStaff
                {
                    Id = Guid.NewGuid(),
                    Name = dto.DisplayName ?? dto.Login,
                    Position = position
                };
                
                _context.MedicalStaff.Add(staff);
                user.MedicalStaffId = staff.Id;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync(token);
            return user;
        }

        public async Task<User> RegisterPatientAsync(RegisterPatientRequestDto dto, CancellationToken token = default)
        {
            var existing = await _context.Users
                .AnyAsync(u => u.Login == dto.Email, token);

            if (existing)
                throw new InvalidOperationException($"Пользователь с email '{dto.Email}' уже зарегистрирован.");

            var userId = Guid.NewGuid();
            var displayName = $"{dto.LastName} {dto.FirstName} {dto.MiddleName}".Trim();

            var user = new User
            {
                Id = userId,
                Login = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Patient",
                DisplayName = displayName,
                PatientId = userId,
                CreatedAt = DateTime.UtcNow
            };

            var patient = new Patient
            {
                Id = userId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                MiddleName = dto.MiddleName,
                Gender = Gender.Male,
                DateOfBirth = dto.DateOfBirth,
                MedcardNum = new Random().Next(10000000, 99999999).ToString(),
                Status = PatientStatus.Outpatient,
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                Contacts = new PatientContacts
                {
                    Email = dto.Email,
                    PhoneMobile = dto.Phone
                }
            };

            using var transaction = await _context.Database.BeginTransactionAsync(token);
            try
            {
                _context.Users.Add(user);
                _context.Patients.Add(patient);
                await _context.SaveChangesAsync(token);
                await transaction.CommitAsync(token);
            }
            catch
            {
                await transaction.RollbackAsync(token);
                throw;
            }

            return user;
        }

        public async Task<GoogleAuthResponseDto> GoogleLoginAsync(string accessToken, CancellationToken token = default)
        {
            var googleUser = await VerifyGoogleTokenAsync(accessToken, token);
            
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Login == googleUser.Email, token);

            if (user == null)
            {
                return new GoogleAuthResponseDto
                {
                    IsNewUser = true,
                    Email = googleUser.Email,
                    FirstName = googleUser.GivenName ?? "",
                    LastName = googleUser.FamilyName ?? ""
                };
            }

            if (user.Role != "Patient")
            {
                throw new UnauthorizedAccessException("Вход через Google доступен только для пациентов. Медицинский персонал должен использовать стандартный вход.");
            }

            if (user.PatientId == null)
            {
                var patientExists = await _context.Patients.AnyAsync(p => p.Id == user.Id, token);
                if (patientExists)
                {
                    user.PatientId = user.Id;
                    await _context.SaveChangesAsync(token);
                }
            }

            var jwtToken = GenerateToken(user);

            return new GoogleAuthResponseDto
            {
                IsNewUser = false,
                Token = jwtToken,
                Role = user.Role,
                UserId = user.Id.ToString(),
                Login = user.Login,
                DisplayName = user.DisplayName,
                PatientId = user.PatientId?.ToString()
            };
        }

        public async Task<GoogleAuthResponseDto> GoogleRegisterAsync(GoogleRegisterRequestDto dto, CancellationToken token = default)
        {
            var googleUser = await VerifyGoogleTokenAsync(dto.AccessToken, token);

            var existing = await _context.Users
                .AnyAsync(u => u.Login == googleUser.Email, token);

            if (existing)
                throw new InvalidOperationException($"Пользователь с email '{googleUser.Email}' уже зарегистрирован.");

            var userId = Guid.NewGuid();
            var firstName = googleUser.GivenName ?? "";
            var lastName = googleUser.FamilyName ?? "";
            var displayName = $"{lastName} {firstName}".Trim();

            var user = new User
            {
                Id = userId,
                Login = googleUser.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                Role = "Patient",
                DisplayName = displayName,
                PatientId = userId,
                CreatedAt = DateTime.UtcNow
            };

            var parsedGender = Gender.Male;
            if (string.Equals(dto.Gender, "Female", System.StringComparison.OrdinalIgnoreCase) || 
                string.Equals(dto.Gender, "Женский", System.StringComparison.OrdinalIgnoreCase))
            {
                parsedGender = Gender.Female;
            }

            var patient = new Patient
            {
                Id = userId,
                FirstName = firstName,
                LastName = lastName,
                MiddleName = "",
                Gender = parsedGender,
                DateOfBirth = dto.DateOfBirth,
                MedcardNum = new Random().Next(10000000, 99999999).ToString(),
                Status = PatientStatus.Outpatient,
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                Contacts = new PatientContacts
                {
                    Email = googleUser.Email,
                    PhoneMobile = dto.Phone
                }
            };

            using var transaction = await _context.Database.BeginTransactionAsync(token);
            try
            {
                _context.Users.Add(user);
                _context.Patients.Add(patient);
                await _context.SaveChangesAsync(token);
                await transaction.CommitAsync(token);
            }
            catch
            {
                await transaction.RollbackAsync(token);
                throw;
            }

            var jwtToken = GenerateToken(user);

            return new GoogleAuthResponseDto
            {
                IsNewUser = false,
                Token = jwtToken,
                Role = user.Role,
                UserId = user.Id.ToString(),
                Login = user.Login,
                DisplayName = user.DisplayName,
                PatientId = user.PatientId?.ToString()
            };
        }

        private async Task<GoogleUserResult> VerifyGoogleTokenAsync(string accessToken, CancellationToken token)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            var response = await client.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo", token);
            if (!response.IsSuccessStatusCode)
            {
                throw new ArgumentException("Недействительный токен доступа Google.");
            }

            var content = await response.Content.ReadAsStringAsync(token);
            var googleUser = System.Text.Json.JsonSerializer.Deserialize<GoogleUserResult>(content);
            if (googleUser == null || string.IsNullOrWhiteSpace(googleUser.Email))
            {
                throw new ArgumentException("Не удалось получить информацию о пользователе Google.");
            }

            var isVerified = false;
            if (googleUser.EmailVerified is bool bVal)
            {
                isVerified = bVal;
            }
            else if (googleUser.EmailVerified is string sVal)
            {
                isVerified = string.Equals(sVal, "true", StringComparison.OrdinalIgnoreCase);
            }
            else if (googleUser.EmailVerified is System.Text.Json.JsonElement je)
            {
                if (je.ValueKind == System.Text.Json.JsonValueKind.True) isVerified = true;
                else if (je.ValueKind == System.Text.Json.JsonValueKind.String)
                {
                    isVerified = string.Equals(je.GetString(), "true", StringComparison.OrdinalIgnoreCase);
                }
            }

            if (!isVerified)
            {
                throw new InvalidOperationException("Email в аккаунте Google не подтвержден.");
            }

            return googleUser;
        }

        private class GoogleUserResult
        {
            [System.Text.Json.Serialization.JsonPropertyName("sub")]
            public string Sub { get; set; } = string.Empty;

            [System.Text.Json.Serialization.JsonPropertyName("email")]
            public string Email { get; set; } = string.Empty;

            [System.Text.Json.Serialization.JsonPropertyName("email_verified")]
            public object? EmailVerified { get; set; }

            [System.Text.Json.Serialization.JsonPropertyName("given_name")]
            public string? GivenName { get; set; }

            [System.Text.Json.Serialization.JsonPropertyName("family_name")]
            public string? FamilyName { get; set; }
        }


        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claimsList = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim("login", user.Login),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("displayName", user.DisplayName ?? user.Login),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (user.PatientId.HasValue)
            {
                claimsList.Add(new Claim("patientId", user.PatientId.Value.ToString()));
            }

            var expiry = int.TryParse(_config["Jwt:ExpiryMinutes"], out var mins) ? mins : 60;

            var jwtToken = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claimsList,
                expires: DateTime.UtcNow.AddMinutes(expiry),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
