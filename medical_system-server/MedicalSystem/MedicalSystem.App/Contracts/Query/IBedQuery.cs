using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IBedQuery
    {
        Task<BedsSummaryDto> GetBedsSummaryAsync(int? floor, string? status, CancellationToken token);
        Task<RoomsWithBedsDto> GetRoomsWithBedsAsync(int? floor, CancellationToken token);
        Task<RoomConfigDto> GetRoomConfigAsync(CancellationToken token);
        Task<FloorsDto> GetFloorsAsync(CancellationToken token);
        Task<AlertsDto> GetAlertsAsync(CancellationToken token);
        Task<BedDto> GetBedByIdAsync(Guid bedId, CancellationToken token);
        Task<PatientDetailsDto> GetPatientDetailsAsync(Guid patientId, CancellationToken token);
        Task<List<BedDto>> GetBedsByRoomAsync(Guid roomId, bool onlyFree = false, CancellationToken token = default);
    }
}
