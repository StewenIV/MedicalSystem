using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IMedicationStorage : IStorage<PatientMedication>
    {
        void Complete(Guid medicationId);
        Task CompleteAsync(Guid medicationId, CancellationToken token);
        void Cancel(Guid medicationId);
        Task CancelAsync(Guid medicationId, CancellationToken token);
    }
}
