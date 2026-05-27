using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IPatientQuery
    {
        Task<IReadOnlyCollection<PatientListDto>> SearchAsync(PatientFilter filter, CancellationToken token);
        Task<PatientCardDto?> GetCardAsync(Guid patientId, CancellationToken token);
    }
}
