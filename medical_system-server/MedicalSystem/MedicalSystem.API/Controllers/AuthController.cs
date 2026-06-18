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
        private readonly IConfiguration _config;

        public AuthController(AuthService authService, IConfiguration config)
        {
            _authService = authService;
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
        public IActionResult Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            var login = User.FindFirstValue("login");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var displayName = User.FindFirstValue("displayName");
            var patientId = User.FindFirstValue("patientId");

            return Ok(new
            {
                userId,
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
    }
}

