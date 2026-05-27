using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IRoomStorage : IStorage<Room>
    {
        void AddBed(Guid roomId, HospitalBed bed);
        Task AddBedAsync(Guid roomId, HospitalBed bed, CancellationToken token);
        void RemoveBed(Guid roomId, Guid bedId);
        Task RemoveBedAsync(Guid roomId, Guid bedId, CancellationToken token);
    }
}
