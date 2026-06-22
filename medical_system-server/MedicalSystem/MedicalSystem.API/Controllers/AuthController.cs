using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.API.DTOs.Auth;
using MedicalSystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;

        public AuthController(AuthService authService, EmailService emailService, IConfiguration config)
        {
            _authService = authService;
            _emailService = emailService;
            _config = config;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto, CancellationToken token)
        {
            if (string.IsNullOrWhiteSpace(dto.Login) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Логин и пароль обязательны." });

            var result = await _authService.LoginAsync(dto.Login, dto.Password, token);
            if (result == null)
                return Unauthorized(new { message = "Неверный логин или пароль." });

            return Ok(result);
        }


        [HttpPost("logout")]
        [AllowAnonymous]
        public IActionResult Logout()
        {
            return Ok(new { message = "Выход выполнен успешно." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me(CancellationToken token)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);

            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized(new { message = "Некорректный ID пользователя." });

            var user = await _authService.GetUserByIdAsync(userId, token);
            if (user == null)
                return Unauthorized(new { message = "Пользователь был удален." });

            var login = user.Login;
            var role = user.Role;
            
            var patientName = user.Patient != null 
                ? $"{user.Patient.LastName} {user.Patient.FirstName} {user.Patient.MiddleName}".Trim() 
                : null;
                
            var displayName = user.MedicalStaff?.Name ?? patientName ?? user.DisplayName ?? user.Login;
            var patientId = user.PatientId?.ToString();

            return Ok(new
            {
                userId = userIdStr,
                login,
                role,
                displayName,
                patientId
            });
        }

        [HttpPost("register")]
        [Authorize(Roles = "ChiefDoctor")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto, CancellationToken token)
        {
            try
            {
                var user = await _authService.RegisterAsync(dto, token);
                return Ok(new
                {
                    user.Id,
                    user.Login,
                    user.Role,
                    user.DisplayName
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register-patient")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterPatient([FromBody] RegisterPatientRequestDto dto, CancellationToken token)
        {
            try
            {
                var user = await _authService.RegisterPatientAsync(dto, token);
                return Ok(new
                {
                    user.Id,
                    user.Login,
                    user.Role,
                    user.DisplayName
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("google-config")]
        [AllowAnonymous]
        public IActionResult GetGoogleConfig()
        {
            var clientId = _config["Google:ClientId"] ?? string.Empty;
            return Ok(new { clientId });
        }

        [HttpPost("google-login")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDto dto, CancellationToken token)
        {
            try
            {
                var result = await _authService.GoogleLoginAsync(dto.AccessToken, token);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Внутренняя ошибка сервера при авторизации через Google: {ex.Message}" });
            }
        }

        [HttpPost("google-register")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleRegister([FromBody] GoogleRegisterRequestDto dto, CancellationToken token)
        {
            try
            {
                var result = await _authService.GoogleRegisterAsync(dto, token);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Внутренняя ошибка сервера при регистрации через Google: {ex.Message}" });
            }
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto dto, CancellationToken token)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { message = "Email обязателен." });

            try
            {
                var (displayName, code) = await _authService.GenerateResetCodeAsync(dto.Email, token);
                await _emailService.SendResetCodeEmailAsync(dto.Email, displayName, code);
                return Ok(new { message = "Код восстановления отправлен на вашу почту." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                var detail = ex.InnerException != null ? $"{ex.Message} Внутренняя ошибка: {ex.InnerException.Message}" : ex.Message;
                return StatusCode(500, new { message = $"Ошибка при отправке письма: {detail}" });
            }
        }

        [HttpPost("verify-reset-code")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeRequestDto dto, CancellationToken token)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Code))
                return BadRequest(new { message = "Email и код обязательны." });

            var isValid = await _authService.VerifyResetCodeAsync(dto.Email, dto.Code, token);
            if (!isValid)
                return BadRequest(new { message = "Неверный или истекший код подтверждения." });

            return Ok(new { message = "Код подтвержден успешно." });
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto dto, CancellationToken token)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Code) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Все поля обязательны." });

            if (dto.Password.Length < 8 || 
                !System.Text.RegularExpressions.Regex.IsMatch(dto.Password, "[A-Z]") || 
                !System.Text.RegularExpressions.Regex.IsMatch(dto.Password, "[0-9]"))
            {
                return BadRequest(new { message = "Пароль должен содержать минимум 8 символов, одну заглавную букву и одну цифру." });
            }

            try
            {
                await _authService.ResetPasswordAsync(dto.Email, dto.Code, dto.Password, token);
                return Ok(new { message = "Пароль успешно изменен." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
            }
        }
    }
}

