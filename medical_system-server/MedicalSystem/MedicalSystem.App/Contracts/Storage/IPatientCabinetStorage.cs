using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IPatientCabinetStorage
    {
        Task UpdateGeneralInfoAsync(Guid patientId, UpdatePatientGeneralInfoDto dto, CancellationToken token);
        Task UpdatePassportAsync(Guid patientId, UpdatePatientPassportDto dto, CancellationToken token);
        Task UpdateOtherAsync(Guid patientId, UpdatePatientOtherDto dto, CancellationToken token);
        Task UpdateWorkAsync(Guid patientId, UpdatePatientWorkDto dto, CancellationToken token);
        Task UpdateContactsAsync(Guid patientId, UpdatePatientContactsDto dto, CancellationToken token);
        Task AddRelativeAsync(Guid patientId, UpdatePatientRelativeDto dto, CancellationToken token);
        Task UpdateRelativeAsync(Guid patientId, Guid relativeId, UpdatePatientRelativeDto dto, CancellationToken token);
        Task DeleteRelativeAsync(Guid patientId, Guid relativeId, CancellationToken token);
        
        Task UpdateTrustedPersonAsync(Guid patientId, UpdateTrustedPersonDto dto, CancellationToken token);
        Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto, CancellationToken token);
        Task<IReadOnlyCollection<PatientDocument>> GetDocumentsAsync(Guid patientId, CancellationToken token);
        Task<IReadOnlyCollection<LabResult>> GetExamsAsync(Guid patientId, CancellationToken token);
    }
}
