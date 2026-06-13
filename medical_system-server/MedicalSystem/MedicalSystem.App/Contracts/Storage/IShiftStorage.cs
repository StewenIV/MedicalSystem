using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IShiftStorage : IStorage<Shift>
    {
        Task<Shift?> GetByStaffAndDateAsync(Guid staffId, DateTime date, CancellationToken token);
    }
}
