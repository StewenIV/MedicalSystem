using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Services
{
    public class VitalSignService
    {
        private readonly IVitalSignStorage _vitalSignStorage;

        public VitalSignService(IVitalSignStorage vitalSignStorage)
        {
            _vitalSignStorage = vitalSignStorage;
        }

        public async Task<IEnumerable<VitalSignDto>> GetVitalSignsAsync(Guid patientId, DateTime? from, DateTime? to, CancellationToken token)
        {
            // Логика фильтрации по дате будет в репозитории
            var vitals = await _vitalSignStorage.GetAllAsync(token); // Упрощенно, нужна фильтрация
            return vitals
                .Where(vs => vs.PatientId == patientId)
                .Select(vs => new VitalSignDto
                {
                    Id = vs.Id,
                    RecordedAt = vs.RecordedAt,
                    Temperature = vs.Temperature,
                    BloodPressure = $"{vs.BloodPressureSystolic}/{vs.BloodPressureDiastolic}",
                    Pulse = vs.Pulse,
                    SpO2 = vs.SpO2
                });
        }

        public async Task AddVitalSignAsync(Guid patientId, VitalSign vitalSign, CancellationToken token)
        {
            vitalSign.PatientId = patientId;
            vitalSign.RecordedAt = DateTime.UtcNow;
            await _vitalSignStorage.AddAsync(vitalSign, token);
        }
    }
}
