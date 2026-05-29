using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IPatientQuery
    {
        Task<PatientCardDto?> GetCardByIdAsync(Guid patientId, CancellationToken token);
        Task<IEnumerable<PatientLookupDto>> GetPatientsByStatusAsync(PatientStatus status, CancellationToken token);
    }
}
