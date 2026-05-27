using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IStaffStorage : IStorage<MedicalStaff>
    {
        void UpdateSchedule(Guid staffId, IEnumerable<Shift> shifts);
        Task UpdateScheduleAsync(Guid staffId, IEnumerable<Shift> shifts, CancellationToken token);
    }
}
