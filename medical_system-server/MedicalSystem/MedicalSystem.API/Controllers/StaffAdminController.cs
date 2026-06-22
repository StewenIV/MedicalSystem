using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/staff-admin")]
    [Authorize(Roles = "ChiefDoctor")]
    public class StaffAdminController : ControllerBase
    {
        private readonly MedicalSystemDbContext _context;

        public StaffAdminController(MedicalSystemDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStaff(CancellationToken token)
        {
            try
            {
                var query = from ms in _context.MedicalStaff
                            join u in _context.Users on ms.Id equals u.MedicalStaffId into uj
                            from subUser in uj.DefaultIfEmpty()
                            select new StaffMemberDto
                            {
                                Id = ms.Id,
                                Name = ms.Name,
                                Position = ms.Position,
                                UserId = subUser != null ? (Guid?)subUser.Id : null,
                                Login = subUser != null ? subUser.Login : null,
                                Role = subUser != null ? subUser.Role : null
                            };

                var list = await query.ToListAsync(token);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffDto dto, CancellationToken token)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Position) ||
                string.IsNullOrWhiteSpace(dto.Login) || string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { message = "Все поля (ФИО, должность, логин, пароль, роль) обязательны для заполнения." });
            }

            var allowedRoles = new[] { "Doctor", "Nurse", "HeadNurse", "ChiefDoctor", "LaboratoryEmployee" };
            if (!allowedRoles.Contains(dto.Role))
            {
                return BadRequest(new { message = $"Недопустимая системная роль: {dto.Role}" });
            }

            if (!IsValidPassword(dto.Password, out var pwdError))
            {
                return BadRequest(new { message = pwdError });
            }

            using var transaction = await _context.Database.BeginTransactionAsync(token);
            try
            {
                var exists = await _context.Users.AnyAsync(u => u.Login.ToLower() == dto.Login.ToLower(), token);
                if (exists)
                {
                    return BadRequest(new { message = $"Пользователь с логином '{dto.Login}' уже существует." });
                }

                var staff = new MedicalStaff
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name.Trim(),
                    Position = dto.Position.Trim()
                };

                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Login = dto.Login.Trim(),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = dto.Role,
                    DisplayName = dto.Name.Trim(),
                    MedicalStaffId = staff.Id,
                    CreatedAt = DateTime.UtcNow
                };

                _context.MedicalStaff.Add(staff);
                _context.Users.Add(user);

                await _context.SaveChangesAsync(token);
                await transaction.CommitAsync(token);

                return Ok(new StaffMemberDto
                {
                    Id = staff.Id,
                    Name = staff.Name,
                    Position = staff.Position,
                    UserId = user.Id,
                    Login = user.Login,
                    Role = user.Role
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(token);
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(Guid id, [FromBody] UpdateStaffDto dto, CancellationToken token)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Position) ||
                string.IsNullOrWhiteSpace(dto.Login) || string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { message = "Поля ФИО, должность, логин и системная роль обязательны." });
            }

            var allowedRoles = new[] { "Doctor", "Nurse", "HeadNurse", "ChiefDoctor", "LaboratoryEmployee" };
            if (!allowedRoles.Contains(dto.Role))
            {
                return BadRequest(new { message = $"Недопустимая системная роль: {dto.Role}" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync(token);
            try
            {
                var staff = await _context.MedicalStaff.FindAsync(new object[] { id }, token);
                if (staff == null)
                {
                    return NotFound(new { message = "Сотрудник не найден." });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.MedicalStaffId == id, token);
                var loginExists = await _context.Users.AnyAsync(u => u.Login.ToLower() == dto.Login.ToLower() && u.MedicalStaffId != id, token);
                if (loginExists)
                {
                    return BadRequest(new { message = $"Логин '{dto.Login}' уже занят другим пользователем." });
                }

                staff.Name = dto.Name.Trim();
                staff.Position = dto.Position.Trim();

                if (user == null)
                {
                    if (string.IsNullOrWhiteSpace(dto.Password))
                    {
                        return BadRequest(new { message = "Пароль обязателен для создания учетной записи." });
                    }

                    if (!IsValidPassword(dto.Password, out var pwdError))
                    {
                        return BadRequest(new { message = pwdError });
                    }

                    user = new User
                    {
                        Id = Guid.NewGuid(),
                        Login = dto.Login.Trim(),
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                        Role = dto.Role,
                        DisplayName = dto.Name.Trim(),
                        MedicalStaffId = staff.Id,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Users.Add(user);
                }
                else
                {
                    user.Login = dto.Login.Trim();
                    user.Role = dto.Role;
                    user.DisplayName = dto.Name.Trim();
                    if (!string.IsNullOrWhiteSpace(dto.Password))
                    {
                        if (!IsValidPassword(dto.Password, out var pwdError))
                        {
                            return BadRequest(new { message = pwdError });
                        }
                        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                    }
                }

                await _context.SaveChangesAsync(token);
                await transaction.CommitAsync(token);

                return Ok(new StaffMemberDto
                {
                    Id = staff.Id,
                    Name = staff.Name,
                    Position = staff.Position,
                    UserId = user.Id,
                    Login = user.Login,
                    Role = user.Role
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(token);
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(Guid id, CancellationToken token)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(token);
            try
            {
                var staff = await _context.MedicalStaff.FindAsync(new object[] { id }, token);
                if (staff == null)
                {
                    return NotFound(new { message = "Сотрудник не найден." });
                }

                var hasEncounters = await _context.Encounters.AnyAsync(e => e.DoctorId == id, token);
                var hasPrescriptions = await _context.Set<Prescription>().AnyAsync(p => p.DoctorId == id, token);
                var hasLabResults = await _context.LabResults.AnyAsync(l => l.DoctorId == id || l.LaboratoryEmployeeId == id, token);
                var hasAppointments = await _context.Appointments.AnyAsync(a => a.DoctorId == id, token);
                var hasBedLogs = await _context.BedActionLogs.AnyAsync(b => b.PerformedById == id, token);

                if (hasEncounters || hasPrescriptions || hasLabResults || hasAppointments || hasBedLogs)
                {
                    return BadRequest(new { message = "Невозможно удалить сотрудника, так как у него есть связанные медицинские записи (события, назначения, результаты анализов, приемы или логи действий)." });
                }

                await _context.Patients
                    .Where(p => p.DoctorId == id)
                    .ExecuteUpdateAsync(s => s.SetProperty(p => p.DoctorId, (Guid?)null), token);

                await _context.Shifts
                    .Where(s => s.StaffId == id)
                    .ExecuteDeleteAsync(token);

                var user = await _context.Users.FirstOrDefaultAsync(u => u.MedicalStaffId == id, token);
                if (user != null)
                {
                    _context.Users.Remove(user);
                }

                _context.MedicalStaff.Remove(staff);

                await _context.SaveChangesAsync(token);
                await transaction.CommitAsync(token);

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(token);
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        private bool IsValidPassword(string password, out string errorMessage)
        {
            errorMessage = string.Empty;
            if (string.IsNullOrEmpty(password))
            {
                errorMessage = "Пароль не может быть пустым.";
                return false;
            }
            if (password.Length < 8)
            {
                errorMessage = "Пароль должен содержать не менее 8 символов.";
                return false;
            }
            if (!password.Any(c => c >= 'A' && c <= 'Z'))
            {
                errorMessage = "Пароль должен содержать хотя бы одну заглавную букву.";
                return false;
            }
            if (!password.Any(char.IsDigit))
            {
                errorMessage = "Пароль должен содержать хотя бы одну цифру.";
                return false;
            }
            return true;
        }
    }

    public class StaffMemberDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public Guid? UserId { get; set; }
        public string? Login { get; set; }
        public string? Role { get; set; }
    }

    public class CreateStaffDto
    {
        public string Name { get; set; }
        public string Position { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }

    public class UpdateStaffDto
    {
        public string Name { get; set; }
        public string Position { get; set; }
        public string Login { get; set; }
        public string? Password { get; set; }
        public string Role { get; set; }
    }
}
