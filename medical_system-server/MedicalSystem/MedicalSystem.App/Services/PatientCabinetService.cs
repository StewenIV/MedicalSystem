using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Services
{
    public class PatientCabinetService
    {
        private readonly IPatientCabinetStorage _cabinetStorage;
        private readonly INotificationStorage _notificationStorage;

        public PatientCabinetService(
            IPatientCabinetStorage cabinetStorage,
            INotificationStorage notificationStorage)
        {
            _cabinetStorage = cabinetStorage;
            _notificationStorage = notificationStorage;
        }

        public async Task UpdateGeneralInfoAsync(Guid patientId, UpdatePatientGeneralInfoDto dto, CancellationToken token)
        {
            await _cabinetStorage.UpdateGeneralInfoAsync(patientId, dto, token);
        }

        public async Task UpdateOtherAsync(Guid patientId, UpdatePatientOtherDto dto, CancellationToken token)
        {
            await _cabinetStorage.UpdateOtherAsync(patientId, dto, token);
        }

        public async Task UpdateWorkAsync(Guid patientId, UpdatePatientWorkDto dto, CancellationToken token)
        {
            await _cabinetStorage.UpdateWorkAsync(patientId, dto, token);
        }

        public async Task AddRelativeAsync(Guid patientId, UpdatePatientRelativeDto dto, CancellationToken token)
        {
            await _cabinetStorage.AddRelativeAsync(patientId, dto, token);
        }

        public async Task UpdateRelativeAsync(Guid patientId, Guid relativeId, UpdatePatientRelativeDto dto, CancellationToken token)
        {
            await _cabinetStorage.UpdateRelativeAsync(patientId, relativeId, dto, token);
        }

        public async Task DeleteRelativeAsync(Guid patientId, Guid relativeId, CancellationToken token)
        {
            await _cabinetStorage.DeleteRelativeAsync(patientId, relativeId, token);
        }

        public async Task UpdateContactsAsync(Guid patientId, UpdatePatientContactsDto dto, CancellationToken token)
        {
            await _cabinetStorage.UpdateContactsAsync(patientId, dto, token);
        }

        public async Task UpdateTrustedPersonAsync(Guid patientId, UpdateTrustedPersonDto dto, CancellationToken token)
        {
            await _cabinetStorage.UpdateTrustedPersonAsync(patientId, dto, token);
        }

        public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto, CancellationToken token)
        {
            await _cabinetStorage.ChangePasswordAsync(userId, dto, token);
        }

        public async Task<IReadOnlyCollection<PatientNotificationDto>> GetNotificationsAsync(
            Guid patientId, CancellationToken token)
        {
            var notifications = await _notificationStorage.GetByPatientIdAsync(patientId, token);
            return notifications.Select(MapToPatientNotificationDto).ToList();
        }

        public async Task MarkNotificationReadAsync(Guid notificationId, CancellationToken token)
        {
            await _notificationStorage.MarkAsReadAsync(notificationId, token);
        }

        public async Task MarkAllNotificationsReadAsync(Guid patientId, CancellationToken token)
        {
            await _notificationStorage.MarkAllAsReadByPatientAsync(patientId, token);
        }

        public async Task<IReadOnlyCollection<PatientDocumentDto>> GetDocumentsAsync(
            Guid patientId, CancellationToken token)
        {
            var documents = await _cabinetStorage.GetDocumentsAsync(patientId, token);

            return documents.Select(d => new PatientDocumentDto
            {
                Id = d.Id,
                Name = d.Name,
                DocumentType = d.DocumentType,
                Content = d.Content,
                DoctorName = d.DoctorName,
                Date = d.Date.HasValue
                    ? d.Date.Value.ToString("dd.MM.yyyy")
                    : null,
                FilePath = d.FilePath
            }).ToList();
        }

        public async Task<IReadOnlyCollection<object>> GetExamsAsync(Guid patientId, CancellationToken token)
        {
            var labs = await _cabinetStorage.GetExamsAsync(patientId, token);

            return labs.Select(l => (object)new
            {
                id = l.Id,
                name = l.Type ?? "Исследование",
                date = l.Date.HasValue ? l.Date.Value.ToString("dd.MM.yyyy") : "—",
                resultDate = l.Date.HasValue ? l.Date.Value.ToString("dd.MM.yyyy") : "—",
                type = "lab",
                status = GetExamStatusKey(l.StatusText),
                statusText = GetExamStatusText(l.StatusText),
                doctor = l.Doctor?.Name,
                filePath = l.PdfDocumentPath,
                details = l.StatusText
            }).ToList();
        }

        private static string GetExamStatusKey(string? statusText)
        {
            return NormalizeExamStatusText(statusText) switch
            {
                "Назначено" => "assigned",
                "В работе" => "processing",
                "Выполнено" => "completed",
                _ => "assigned"
            };
        }

        private static string GetExamStatusText(string? statusText)
        {
            return NormalizeExamStatusText(statusText);
        }

        private static string NormalizeExamStatusText(string? statusText)
        {
            var value = statusText?.Trim();

            return value switch
            {
                null or "" => "Назначено",
                "Назначено" => "Назначено",
                "В работе" => "В работе",
                "Завершено" => "Выполнено",
                "Выполнено" => "Выполнено",
                "Готово" => "Выполнено",
                _ => value
            };
        }

        private static PatientNotificationDto MapToPatientNotificationDto(Notification n)
        {
            var type = n.Type switch
            {
                NotificationType.LabResult => "medical",
                NotificationType.Consultation => "consultation",
                NotificationType.System => "system",
                _ => "medical"
            };

            var severity = n.Severity switch
            {
                SeverityType.Critical => "critical",
                SeverityType.Warning => "warning",
                SeverityType.Info => "info",
                _ => null
            };

            return new PatientNotificationDto
            {
                Id = n.Id,
                Type = type,
                Severity = severity,
                Title = string.IsNullOrEmpty(n.Title) ? n.Message : n.Title,
                Text = n.Message,
                Details = n.Details,
                Time = n.CreatedAt.ToString("dd.MM.yyyy, HH:mm"),
                Read = n.IsRead
            };
        }
    }
}
