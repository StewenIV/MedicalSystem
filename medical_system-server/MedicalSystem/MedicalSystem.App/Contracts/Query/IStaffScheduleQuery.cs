using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IStaffScheduleQuery
    {
        Task<IReadOnlyCollection<StaffScheduleDto>> GetMonthAsync(int year, int month, CancellationToken token);
    }
}
