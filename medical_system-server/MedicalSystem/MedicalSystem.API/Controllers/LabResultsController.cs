using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Services;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MedicalSystem.API.Hubs;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Doctor,Nurse,HeadNurse,ChiefDoctor,LaboratoryEmployee")]
    public class LabResultsController : ControllerBase
    {
        private readonly MedicalSystemDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public LabResultsController(
            MedicalSystemDbContext context,
            INotificationService notificationService,
            IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _notificationService = notificationService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetLabResults(
            [FromQuery] string? search,
            [FromQuery] string? status,
            [FromQuery] string? type,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "date",
            [FromQuery] bool sortDesc = true,
            CancellationToken token = default)
        {
            try
            {
                var query = _context.LabResults
                    .Include(lr => lr.Patient)
                    .Include(lr => lr.Doctor)
                    .Include(lr => lr.LaboratoryEmployee)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(status))
                {
                    query = query.Where(lr => lr.StatusText == status);
                }

                if (!string.IsNullOrWhiteSpace(type))
                {
                    query = query.Where(lr => lr.Type == type);
                }

                if (!string.IsNullOrWhiteSpace(search))
                {
                    var s = search.ToLower().Trim();
                    query = query.Where(lr =>
                        lr.Patient.LastName.ToLower().Contains(s) ||
                        lr.Patient.FirstName.ToLower().Contains(s) ||
                        (lr.Patient.MiddleName != null && lr.Patient.MiddleName.ToLower().Contains(s)) ||
                        lr.Type.ToLower().Contains(s) ||
                        (lr.Doctor != null && lr.Doctor.Name.ToLower().Contains(s)));
                }

                var totalCount = await query.CountAsync(token);

                if (!string.IsNullOrWhiteSpace(sortBy))
                {
                    switch (sortBy.ToLower())
                    {
                        case "patientname":
                            query = sortDesc
                                ? query.OrderByDescending(lr => lr.Patient.LastName).ThenByDescending(lr => lr.Patient.FirstName)
                                : query.OrderBy(lr => lr.Patient.LastName).ThenBy(lr => lr.Patient.FirstName);
                            break;
                        case "doctorname":
                            query = sortDesc
                                ? query.OrderByDescending(lr => lr.Doctor != null ? lr.Doctor.Name : "")
                                : query.OrderBy(lr => lr.Doctor != null ? lr.Doctor.Name : "");
                            break;
                        case "type":
                            query = sortDesc
                                ? query.OrderByDescending(lr => lr.Type)
                                : query.OrderBy(lr => lr.Type);
                            break;
                        case "status":
                            query = sortDesc
                                ? query.OrderByDescending(lr => lr.StatusText ?? "")
                                : query.OrderBy(lr => lr.StatusText ?? "");
                            break;
                        case "date":
                        default:
                            query = sortDesc
                                ? query.OrderByDescending(lr => lr.Date ?? DateTime.MinValue)
                                : query.OrderBy(lr => lr.Date ?? DateTime.MinValue);
                            break;
                    }
                }

                var items = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync(token);

                var patientIds = items.Select(i => i.PatientId).Distinct().ToList();
                var beds = await _context.HospitalBeds
                    .Include(b => b.Room)
                    .Where(b => b.PatientId.HasValue && patientIds.Contains(b.PatientId.Value))
                    .ToListAsync(token);

                var responseItems = items.Select(lr =>
                {
                    var bed = beds.FirstOrDefault(b => b.PatientId == lr.PatientId);
                    return new
                    {
                        id = lr.Id,
                        patientId = lr.PatientId,
                        patientName = $"{lr.Patient.LastName} {lr.Patient.FirstName} {lr.Patient.MiddleName}".Trim(),
                        patientAge = (int)((DateTime.Now - lr.Patient.DateOfBirth).TotalDays / 365.25),
                        patientGender = lr.Patient.Gender == Gender.Male ? "Мужской" : "Женский",
                        roomNumber = bed?.Room?.RoomNumber.ToString() ?? "—",
                        bedNumber = bed?.BedNumber,
                        doctorId = lr.DoctorId,
                        doctorName = lr.Doctor?.Name ?? "—",
                        type = lr.Type,
                        date = lr.Date,
                        statusText = lr.StatusText ?? "Назначено",
                        reason = lr.Reason,
                        comments = lr.Comments,
                        pdfDocumentPath = lr.PdfDocumentPath,
                        dateUpdated = lr.DateUpdated,
                        laboratoryEmployeeName = lr.LaboratoryEmployee?.Name ?? "—"
                    };
                }).ToList();

                return Ok(new
                {
                    items = responseItems,
                    totalCount = totalCount
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLabResult(Guid id, CancellationToken token)
        {
            try
            {
                var lr = await _context.LabResults
                    .Include(lr => lr.Patient).ThenInclude(p => p.MedicalProblems)
                    .Include(lr => lr.Doctor)
                    .Include(lr => lr.LaboratoryEmployee)
                    .FirstOrDefaultAsync(l => l.Id == id, token);

                if (lr == null)
                {
                    return NotFound(new { message = "Направление не найдено." });
                }

                var bed = await _context.HospitalBeds
                    .Include(b => b.Room)
                    .FirstOrDefaultAsync(b => b.PatientId == lr.PatientId, token);

                var activeDiagnosis = lr.Patient.MedicalProblems
                    .Where(mp => mp.IsActive)
                    .OrderByDescending(mp => mp.Description == "Основной")
                    .Select(mp => mp.Name)
                    .FirstOrDefault();

                return Ok(new
                {
                    id = lr.Id,
                    patientId = lr.PatientId,
                    patientName = $"{lr.Patient.LastName} {lr.Patient.FirstName} {lr.Patient.MiddleName}".Trim(),
                    patientAge = (int)((DateTime.Now - lr.Patient.DateOfBirth).TotalDays / 365.25),
                    patientGender = lr.Patient.Gender == Gender.Male ? "Мужской" : "Женский",
                    roomNumber = bed?.Room?.RoomNumber.ToString() ?? "—",
                    bedNumber = bed?.BedNumber,
                    doctorId = lr.DoctorId,
                    doctorName = lr.Doctor?.Name ?? "—",
                    diagnosis = activeDiagnosis ?? "Не указан",
                    type = lr.Type,
                    date = lr.Date,
                    statusText = lr.StatusText ?? "Назначено",
                    reason = lr.Reason,
                    resultData = lr.ResultData,
                    comments = lr.Comments,
                    pdfDocumentPath = lr.PdfDocumentPath,
                    dateUpdated = lr.DateUpdated,
                    laboratoryEmployeeName = lr.LaboratoryEmployee?.Name ?? "—"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateLabStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken token)
        {
            try
            {
                var lr = await _context.LabResults
                    .Include(l => l.Patient)
                    .FirstOrDefaultAsync(l => l.Id == id, token);

                if (lr == null)
                {
                    return NotFound(new { message = "Направление не найдено." });
                }

                lr.StatusText = request.StatusText;

                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                                ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var user = await _context.Users.FindAsync(new object[] { userId }, token);
                    if (user != null && user.MedicalStaffId.HasValue)
                    {
                        lr.LaboratoryEmployeeId = user.MedicalStaffId.Value;
                    }
                }

                await _context.SaveChangesAsync(token);

                var updatePayload = new
                {
                    id = lr.Id,
                    patientId = lr.PatientId,
                    patientName = $"{lr.Patient.LastName} {lr.Patient.FirstName} {lr.Patient.MiddleName}".Trim(),
                    type = lr.Type,
                    statusText = lr.StatusText
                };

                await _hubContext.Clients.Group("LaboratoryEmployee").SendAsync("LabResultStatusChanged", updatePayload, token);
                await _hubContext.Clients.Group("MedicalStaff").SendAsync("LabResultStatusChanged", updatePayload, token);

                return Ok(new { message = "Статус успешно обновлен." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("{id}/results")]
        public async Task<IActionResult> SubmitResults(Guid id, [FromBody] SubmitResultsRequest request, CancellationToken token)
        {
            try
            {
                var lr = await _context.LabResults
                    .Include(l => l.Patient)
                    .FirstOrDefaultAsync(l => l.Id == id, token);

                if (lr == null)
                {
                    return NotFound(new { message = "Направление не найдено." });
                }

                lr.ResultData = request.ResultData;
                lr.Comments = request.Comments;
                lr.PdfDocumentPath = request.PdfDocumentPath;
                lr.StatusText = "Завершено";
                lr.DateUpdated = DateTime.UtcNow;

                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                                ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
                string operatorName = "Лаборант";

                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var user = await _context.Users.Include(u => u.MedicalStaff).FirstOrDefaultAsync(u => u.Id == userId, token);
                    if (user != null)
                    {
                        if (user.MedicalStaffId.HasValue)
                        {
                            lr.LaboratoryEmployeeId = user.MedicalStaffId.Value;
                            operatorName = user.MedicalStaff?.Name ?? user.DisplayName ?? "Лаборант";
                        }
                        else
                        {
                            operatorName = user.DisplayName ?? "Лаборант";
                        }
                    }
                }

                var doc = new PatientDocument
                {
                    Id = Guid.NewGuid(),
                    PatientId = lr.PatientId,
                    Name = $"Результат анализа: {lr.Type} от {DateTime.Now:dd.MM.yyyy}",
                    Date = DateTime.UtcNow,
                    FilePath = request.PdfDocumentPath,
                    DocumentType = "LabResult",
                    DoctorName = operatorName
                };
                _context.PatientDocuments.Add(doc);

                await _context.SaveChangesAsync(token);

                var patientName = $"{lr.Patient.LastName} {lr.Patient.FirstName} {lr.Patient.MiddleName}".Trim();
                
                if (lr.DoctorId.HasValue)
                {
                    await _notificationService.SendNotificationAsync(new Notification
                    {
                        Type = NotificationType.LabResult,
                        Severity = SeverityType.Info,
                        Title = "Результаты анализов готовы",
                        RecipientType = RecipientType.Staff,
                        RecipientId = lr.DoctorId.Value,
                        Message = $"Результаты исследования '{lr.Type}' пациента {patientName} готовы и добавлены в карту.",
                        PatientId = lr.PatientId,
                        Details = lr.Id.ToString()
                    }, token);
                }

                await _notificationService.SendNotificationAsync(new Notification
                {
                    Type = NotificationType.LabResult,
                    Severity = SeverityType.Info,
                    Title = "Результаты анализов готовы",
                    RecipientType = RecipientType.Patient,
                    PatientRecipientId = lr.PatientId,
                    Message = $"Результаты вашего исследования '{lr.Type}' готовы. Вы можете ознакомиться с ними в кабинете.",
                    PatientId = lr.PatientId
                }, token);

                var updatePayload = new
                {
                    id = lr.Id,
                    patientId = lr.PatientId,
                    patientName = patientName,
                    type = lr.Type,
                    statusText = lr.StatusText,
                    pdfUrl = request.PdfDocumentPath
                };

                await _hubContext.Clients.Group("LaboratoryEmployee").SendAsync("LabResultStatusChanged", updatePayload, token);
                await _hubContext.Clients.Group("MedicalStaff").SendAsync("LabResultStatusChanged", updatePayload, token);

                return Ok(new { message = "Результаты успешно отправлены." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }
    }

    public class UpdateStatusRequest
    {
        public string StatusText { get; set; }
    }

    public class SubmitResultsRequest
    {
        public string ResultData { get; set; }
        public string? Comments { get; set; }
        public string PdfDocumentPath { get; set; }
    }
}
