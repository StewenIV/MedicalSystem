using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IMedicineQuery
    {
        Task<MedicineDashboardDto> GetDashboardAsync(CancellationToken token);
    }
}
