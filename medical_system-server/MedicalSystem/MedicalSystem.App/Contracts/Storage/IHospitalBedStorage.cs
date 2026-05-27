using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IHospitalBedStorage : IStorage<HospitalBed>
    {
        void Occupy(Guid bedId, Guid patientId);
        Task OccupyAsync(Guid bedId, Guid patientId, CancellationToken token);
        void Release(Guid bedId);
        Task ReleaseAsync(Guid bedId, CancellationToken token);
        void Transfer(Guid patientId, Guid targetBedId);
        Task TransferAsync(Guid patientId, Guid targetBedId, CancellationToken token);
        void UpdateNote(Guid bedId, string note);
        Task UpdateNoteAsync(Guid bedId, string note, CancellationToken token);
    }
}
