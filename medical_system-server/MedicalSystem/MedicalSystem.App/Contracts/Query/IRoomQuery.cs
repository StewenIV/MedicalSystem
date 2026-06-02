using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IRoomQuery
    {
        Task<PagedResultDto<RoomListItemDto>> GetRoomsAsync(int? floorFilter, string? typeFilter, string? search, int page, int pageSize, CancellationToken token = default);
        Task<RoomDetailsDto?> GetRoomByIdAsync(Guid roomId, CancellationToken token = default);
        Task<List<int>> GetAvailableFloorsAsync(CancellationToken token = default);
        Task<List<RoomListItemDto>> GetRoomsByFloorAsync(int floor, CancellationToken token = default);
    }
}
