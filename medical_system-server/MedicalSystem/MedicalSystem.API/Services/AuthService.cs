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
                DisplayName = user.DisplayName
            };
        }

        /// <summary>
        /// Регистрирует нового пользователя (только ChiefDoctor).
        /// </summary>
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

            _context.Users.Add(user);
            await _context.SaveChangesAsync(token);
            return user;
        }

        /// <summary>
        /// Регистрирует нового пациента (общедоступно).
        /// </summary>
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


        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim("login", user.Login),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("displayName", user.DisplayName ?? user.Login),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var expiry = int.TryParse(_config["Jwt:ExpiryMinutes"], out var mins) ? mins : 60;

            var jwtToken = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiry),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
