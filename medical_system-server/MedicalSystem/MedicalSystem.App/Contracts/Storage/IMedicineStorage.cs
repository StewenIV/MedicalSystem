using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IMedicineStorage : IStorage<Medicine>
    {
        void Receipt(Guid medicineId, decimal quantity);
        Task ReceiptAsync(Guid medicineId, decimal quantity, CancellationToken token);
        void WriteOff(Guid medicineId, decimal quantity);
        Task WriteOffAsync(Guid medicineId, decimal quantity, CancellationToken token);
        void Archive(Guid medicineId);
        Task ArchiveAsync(Guid medicineId, CancellationToken token);
    }
}
