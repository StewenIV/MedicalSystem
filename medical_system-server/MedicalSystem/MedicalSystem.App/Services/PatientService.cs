using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.App.Services
{
    public class PatientService
    {
        private readonly IPatientQuery _patientQuery;

        public PatientService(IPatientQuery patientQuery)
        {
            _patientQuery = patientQuery;
        }

        public async Task<PatientCardDto?> GetPatientCardAsync(Guid patientId, CancellationToken token)
        {
            return await _patientQuery.GetCardByIdAsync(patientId, token);
        }

        public async Task<IEnumerable<PatientLookupDto>> GetHospitalizedPatientsAsync(CancellationToken token)
        {
            return await _patientQuery.GetPatientsByStatusAsync(PatientStatus.Hospitalized, token);
        }
    }
}
