using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IWardStatisticsQuery
    {
        Task<WardStatisticsDto> GetWardStatisticsAsync(CancellationToken token = default);
    }
}
