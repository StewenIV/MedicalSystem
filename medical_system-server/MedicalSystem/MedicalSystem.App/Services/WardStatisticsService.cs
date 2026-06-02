using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;

namespace MedicalSystem.App.Services
{
    public class WardStatisticsService
    {
        private readonly IWardStatisticsQuery _query;

        public WardStatisticsService(IWardStatisticsQuery query)
        {
            _query = query;
        }

        public Task<WardStatisticsDto> GetWardStatisticsAsync(CancellationToken token = default)
        {
            return _query.GetWardStatisticsAsync(token);
        }
    }
}
