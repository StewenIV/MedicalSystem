using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/patient-cabinet")]
    [Authorize(Roles = "Patient")]
    public class PatientCabinetController : ControllerBase
    {
        private readonly PatientCabinetService _cabinetService;
        private readonly PatientService _patientService;
        private readonly MedicalSystem.API.Services.AuthService _authService;

        public PatientCabinetController(PatientCabinetService cabinetService, PatientService patientService, MedicalSystem.API.Services.AuthService authService)
        {
            _cabinetService = cabinetService;
            _patientService = patientService;
            _authService = authService;
        }
        
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                var patientCard = await _patientService.GetPatientCardAsync(patientId, token);
                if (patientCard == null)
                    return NotFound(new { message = "Профиль пациента не найден." });
                return Ok(patientCard);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("profile/general")]
        public async Task<IActionResult> UpdateGeneralInfo(
            [FromBody] UpdatePatientGeneralInfoDto dto, CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.UpdateGeneralInfoAsync(patientId, dto, token);
                return Ok(new { message = "Основные данные успешно обновлены." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("profile/other")]
        public async Task<IActionResult> UpdateOtherInfo(
            [FromBody] UpdatePatientOtherDto dto, CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.UpdateOtherAsync(patientId, dto, token);
                return Ok(new { message = "Дополнительные данные успешно обновлены." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("profile/work")]
        public async Task<IActionResult> UpdateWorkInfo(
            [FromBody] UpdatePatientWorkDto dto, CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.UpdateWorkAsync(patientId, dto, token);
                return Ok(new { message = "Данные о работе успешно обновлены." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPost("relatives")]
        public async Task<IActionResult> AddRelative(
            [FromBody] UpdatePatientRelativeDto dto, CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.AddRelativeAsync(patientId, dto, token);
                return Ok(new { message = "Родственник успешно добавлен." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("relatives/{id}")]
        public async Task<IActionResult> UpdateRelative(
            Guid id, [FromBody] UpdatePatientRelativeDto dto, CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.UpdateRelativeAsync(patientId, id, dto, token);
                return Ok(new { message = "Данные родственника успешно обновлены." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpDelete("relatives/{id}")]
        public async Task<IActionResult> DeleteRelative(
            Guid id, CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.DeleteRelativeAsync(patientId, id, token);
                return Ok(new { message = "Родственник успешно удален." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("profile/contacts")]
        public async Task<IActionResult> UpdateContacts(
            [FromBody] UpdatePatientContactsDto dto, CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.UpdateContactsAsync(patientId, dto, token);
                return Ok(new { message = "Контактные данные успешно обновлены." });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("profile/trusted")]
        public async Task<IActionResult> UpdateTrustedPerson(
            [FromBody] UpdateTrustedPersonDto dto, CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.UpdateTrustedPersonAsync(patientId, dto, token);
                return Ok(new { message = "Данные доверенного лица успешно обновлены." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPost("profile/change-password")]
        public async Task<IActionResult> ChangePassword(
            [FromBody] ChangePasswordDto dto, CancellationToken token)
        {
            try
            {
                var userId = GetUserId();
                await _cabinetService.ChangePasswordAsync(userId, dto, token);
                return Ok(new { message = "Пароль успешно изменен." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount(CancellationToken token)
        {
            try
            {
                var userId = GetUserId();
                await _authService.DeleteUserAndPatientAsync(userId, token);
                return Ok(new { message = "Аккаунт успешно удален." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications(CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                var notifications = await _cabinetService.GetNotificationsAsync(patientId, token);
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPost("notifications/{id}/mark-read")]
        public async Task<IActionResult> MarkRead(Guid id, CancellationToken token)
        {
            try
            {
                await _cabinetService.MarkNotificationReadAsync(id, token);
                return Ok(new { message = "Уведомление отмечено как прочитанное." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPost("notifications/mark-all-read")]
        public async Task<IActionResult> MarkAllRead(CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                await _cabinetService.MarkAllNotificationsReadAsync(patientId, token);
                return Ok(new { message = "Все уведомления отмечены как прочитанные." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("documents")]
        public async Task<IActionResult> GetDocuments(CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                var documents = await _cabinetService.GetDocumentsAsync(patientId, token);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("exams")]
        public async Task<IActionResult> GetExams(CancellationToken token)
        {
            try
            {
                var patientId = GetPatientId();
                var exams = await _cabinetService.GetExamsAsync(patientId, token);
                return Ok(exams);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        private Guid GetPatientId()
        {
            var patientIdStr = User.FindFirstValue("patientId");
            if (!string.IsNullOrEmpty(patientIdStr) && Guid.TryParse(patientIdStr, out var patientId))
            {
                return patientId;
            }

            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(idStr, out var id))
                throw new InvalidOperationException("Не удалось определить идентификатор пациента.");
            return id;
        }

        private Guid GetUserId()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(idStr, out var id))
                throw new InvalidOperationException("Не удалось определить идентификатор пользователя.");
            return id;
        }
    }
}
