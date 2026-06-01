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

        private static readonly Dictionary<string, (decimal min, decimal max)> NormalRanges = new()
        {
            { nameof(VitalSign.Temperature),           (36.0m, 37.2m) },
            { nameof(VitalSign.BloodPressureSystolic), (100,   130)   },
            { nameof(VitalSign.BloodPressureDiastolic),(60,    90)    },
            { nameof(VitalSign.Pulse),                 (60,    100)   },
            { nameof(VitalSign.SpO2),                  (95,    100)   },
            { nameof(VitalSign.RespiratoryRate),        (12,    20)    }
        };

        public VitalSignService(IVitalSignStorage vitalSignStorage)
        {
            _vitalSignStorage = vitalSignStorage;
        }

        // GET api/patients/{patientId}/vitals
        public async Task<IEnumerable<VitalSignDto>> GetVitalSignsAsync(Guid patientId, CancellationToken token)
        {
            var vitals = await _vitalSignStorage.GetAllAsync(token);
            return vitals
                .Where(vs => vs.PatientId == patientId)
                .OrderByDescending(vs => vs.RecordedAt)
                .Select(vs => new VitalSignDto
                {
                    Id                    = vs.Id,
                    RecordedAt            = vs.RecordedAt,
                    Temperature           = vs.Temperature,
                    BloodPressureSystolic  = vs.BloodPressureSystolic,
                    BloodPressureDiastolic = vs.BloodPressureDiastolic,
                    Pulse                 = vs.Pulse,
                    SpO2                  = vs.SpO2,
                    RespiratoryRate       = vs.RespiratoryRate
                });
        }

        // POST api/patients/{patientId}/vitals
        public async Task AddVitalSignAsync(Guid patientId, CreateVitalSignRequest request, CancellationToken token)
        {
            var vitalSign = new VitalSign
            {
                Id                    = Guid.NewGuid(),
                PatientId             = patientId,
                RecordedAt            = DateTime.UtcNow,
                Temperature           = request.Temperature,
                BloodPressureSystolic  = request.BloodPressureSystolic,
                BloodPressureDiastolic = request.BloodPressureDiastolic,
                Pulse                 = request.Pulse,
                SpO2                  = request.SpO2,
                RespiratoryRate       = request.RespiratoryRate
            };
            await _vitalSignStorage.AddAsync(vitalSign, token);
        }

        // GET api/patients/{patientId}/vitals/warnings
        public async Task<List<VitalSignWarningDto>> GetWarningsAsync(Guid patientId, CancellationToken token)
        {
            var vitals = await _vitalSignStorage.GetAllAsync(token);
            var latest = vitals
                .Where(vs => vs.PatientId == patientId)
                .OrderByDescending(vs => vs.RecordedAt)
                .FirstOrDefault();

            if (latest == null) return new List<VitalSignWarningDto>();

            var warnings = new List<VitalSignWarningDto>();
            CheckWarning(warnings, nameof(VitalSign.Temperature),           latest.Temperature);
            CheckWarning(warnings, nameof(VitalSign.BloodPressureSystolic),  latest.BloodPressureSystolic);
            CheckWarning(warnings, nameof(VitalSign.BloodPressureDiastolic), latest.BloodPressureDiastolic);
            CheckWarning(warnings, nameof(VitalSign.Pulse),                  latest.Pulse);
            CheckWarning(warnings, nameof(VitalSign.SpO2),                   latest.SpO2);
            CheckWarning(warnings, nameof(VitalSign.RespiratoryRate),        latest.RespiratoryRate);

            return warnings;
        }

        // GET api/patients/{patientId}/vitals/trends
        public async Task<List<VitalSignTrendDto>> GetTrendsAsync(Guid patientId, CancellationToken token)
        {
            var vitals = await _vitalSignStorage.GetAllAsync(token);
            var lastTwo = vitals
                .Where(vs => vs.PatientId == patientId)
                .OrderByDescending(vs => vs.RecordedAt)
                .Take(2)
                .ToList();

            if (lastTwo.Count < 2) return new List<VitalSignTrendDto>();

            var latest   = lastTwo[0];
            var previous = lastTwo[1];

            return new List<VitalSignTrendDto>
            {
                GetTrend(nameof(VitalSign.Temperature),           latest.Temperature,           previous.Temperature),
                GetTrend(nameof(VitalSign.BloodPressureSystolic),  latest.BloodPressureSystolic,  previous.BloodPressureSystolic),
                GetTrend(nameof(VitalSign.BloodPressureDiastolic), latest.BloodPressureDiastolic, previous.BloodPressureDiastolic),
                GetTrend(nameof(VitalSign.Pulse),                  latest.Pulse,                  previous.Pulse),
                GetTrend(nameof(VitalSign.SpO2),                   latest.SpO2,                   previous.SpO2),
                GetTrend(nameof(VitalSign.RespiratoryRate),        latest.RespiratoryRate,        previous.RespiratoryRate)
            };
        }
        
        private void CheckWarning(List<VitalSignWarningDto> warnings, string field, decimal? value)
        {
            if (!value.HasValue || !NormalRanges.ContainsKey(field)) return;
            var (min, max) = NormalRanges[field];
            if (value < min)
                warnings.Add(new VitalSignWarningDto { FieldName = field, Value = value.ToString(), Direction = "low" });
            if (value > max)
                warnings.Add(new VitalSignWarningDto { FieldName = field, Value = value.ToString(), Direction = "high" });
        }

        private static VitalSignTrendDto GetTrend(string field, decimal? latest, decimal? previous)
        {
            var direction = "stable";
            if (latest.HasValue && previous.HasValue)
            {
                if (latest > previous) direction = "up";
                if (latest < previous) direction = "down";
            }
            return new VitalSignTrendDto { FieldName = field, Direction = direction };
        }
    }
}
