using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;

namespace MedicalSystem.App.Services
{
    public class BedService
    {
        private readonly IBedQuery _bedQuery;

        public BedService(IBedQuery bedQuery)
        {
            _bedQuery = bedQuery;
        }

        public Task<BedsSummaryDto> GetBedsSummaryAsync(int? floor, string? status, CancellationToken token)
        {
            return _bedQuery.GetBedsSummaryAsync(floor, status, token);
        }

        public Task<RoomsWithBedsDto> GetRoomsWithBedsAsync(int? floor, CancellationToken token)
        {
            return _bedQuery.GetRoomsWithBedsAsync(floor, token);
        }
    }
}
