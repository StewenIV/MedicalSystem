using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.App.Contracts.Services;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models;
using System.Linq;

namespace MedicalSystem.App.Services
{
    public class PatientService
    {
        private readonly IPatientQuery _patientQuery;
        private readonly IPatientStorage _patientStorage;
        private readonly INotificationService _notificationService;

        public PatientService(IPatientQuery patientQuery, IPatientStorage patientStorage, INotificationService notificationService)
        {
            _patientQuery = patientQuery;
            _patientStorage = patientStorage;
            _notificationService = notificationService;
        }

        public async Task<PatientCardDto?> GetPatientCardAsync(Guid patientId, CancellationToken token)
        {
            return await _patientQuery.GetCardByIdAsync(patientId, token);
        }

        public async Task<IEnumerable<PatientLookupDto>> GetHospitalizedPatientsAsync(CancellationToken token)
        {
            return await _patientQuery.GetPatientsByStatusAsync(PatientStatus.Hospitalized, token);
        }

        public async Task<IEnumerable<PatientLookupDto>> GetActivePatientsAsync(CancellationToken token)
        {
            return await _patientQuery.GetActivePatientsAsync(token);
        }

        public async Task<IEnumerable<PatientListDto>> GetAllPatientsAsync(CancellationToken token)
        {
            return await _patientQuery.GetAllPatientsAsync(token);
        }

        public async Task UpdatePatientCardAsync(Guid patientId, PatientCardDto dto, Guid? userId, CancellationToken token)
        {
            var oldCard = await _patientQuery.GetCardByIdAsync(patientId, token);
            var oldLabIds = oldCard?.Labs?.Select(l => l.Id).ToHashSet() ?? new HashSet<Guid>();

            await _patientStorage.UpdatePatientCardAsync(patientId, dto, userId, token);

            if (dto.Labs != null)
            {
                foreach (var lab in dto.Labs)
                {
                    if (lab.Id == Guid.Empty || !oldLabIds.Contains(lab.Id))
                    {
                        await _notificationService.SendNotificationAsync(new Notification
                        {
                            Type = NotificationType.LabResult,
                            Severity = SeverityType.Info,
                            Title = "Новый анализ",
                            RecipientType = RecipientType.Patient,
                            Message = $"Вам назначен новый анализ: {lab.Type}" + (string.IsNullOrWhiteSpace(lab.Reason) ? "" : $". Причина: {lab.Reason}"),
                            PatientRecipientId = patientId
                        }, token);
                    }
                }
            }
        }

        public async Task<PatientListDto> AddPatientAsync(PatientCardDto dto, CancellationToken token)
        {
            var p = await _patientStorage.AddPatientAsync(dto, token);
            return new PatientListDto
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                MiddleName = p.MiddleName,
                Age = (int)((DateTime.Now - p.DateOfBirth).TotalDays / 365.25),
                DateOfBirth = p.DateOfBirth,
                Gender = p.Gender == Gender.Male ? "Мужской" : "Женский",
                Status = p.Status.ToString(),
                StatusText = p.Status == PatientStatus.Hospitalized ? "Госпитализирован" : p.Status == PatientStatus.Outpatient ? "Амбулаторный" : "Выписан",
                MedcardNum = p.MedcardNum,
                HistoryNum = p.HistoryNum
            };
        }

        public async Task DeletePatientAsync(Guid patientId, CancellationToken token)
        {
            await _patientStorage.DeletePatientAsync(patientId, token);
        }
    }
}
