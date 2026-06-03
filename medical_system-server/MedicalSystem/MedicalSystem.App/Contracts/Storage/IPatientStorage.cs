using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IPatientStorage : IStorage<Patient>
    {
        void AssignDoctor(Guid patientId, Guid doctorId);
        Task AssignDoctorAsync(Guid patientId, Guid doctorId, CancellationToken token);
        void Discharge(Guid patientId);
        Task DischargeAsync(Guid patientId, CancellationToken token);
        void Transfer(Guid patientId, Guid departmentId);
        Task TransferAsync(Guid patientId, Guid departmentId, CancellationToken token);
        Task UpdatePatientCardAsync(Guid patientId, MedicalSystem.App.Contracts.Dtos.PatientCardDto dto, CancellationToken token);
        Task<Patient> AddPatientAsync(MedicalSystem.App.Contracts.Dtos.PatientCardDto dto, CancellationToken token);
        Task DeletePatientAsync(Guid patientId, CancellationToken token);
    }
}
