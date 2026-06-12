using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;

using System.Linq;

namespace MedicalSystem.App.Services
{
    public class RoomService
    {
        private readonly IRoomQuery _roomQuery;
        private readonly IRoomStorage _roomStorage;
        private readonly IBedQuery _bedQuery;
        private readonly IHospitalBedStorage _bedStorage;

        public RoomService(IRoomQuery roomQuery, IRoomStorage roomStorage, IBedQuery bedQuery, IHospitalBedStorage bedStorage)
        {
            _roomQuery = roomQuery;
            _roomStorage = roomStorage;
            _bedQuery = bedQuery;
            _bedStorage = bedStorage;
        }

        public Task<PagedResultDto<RoomListItemDto>> GetRoomsAsync(int? floorFilter, string? typeFilter, string? search, int page, int pageSize, CancellationToken token = default)
        {
            return _roomQuery.GetRoomsAsync(floorFilter, typeFilter, search, page, pageSize, token);
        }

        public Task<RoomDetailsDto?> GetRoomByIdAsync(Guid roomId, CancellationToken token = default)
        {
            return _roomQuery.GetRoomByIdAsync(roomId, token);
        }

        public async Task<Room> CreateRoomAsync(CreateRoomDto dto, CancellationToken token = default)
        {
            var room = new Room
            {
                Id = Guid.NewGuid(),
                RoomNumber = dto.Number,
                Floor = dto.Floor,
                Type = dto.Type,
                Gender = dto.Gender,
                Priority = dto.Priority
            };
            await _roomStorage.AddAsync(room, token);

            if (dto.Beds != null && dto.Beds.Any())
            {
                int maxBedNumber = 0;
                var newBedsCount = dto.Beds.Count;
                for (int i = 0; i < newBedsCount; i++)
                {
                    var newBed = new HospitalBed
                    {
                        Id = Guid.NewGuid(),
                        RoomId = room.Id,
                        BedNumber = maxBedNumber + i + 1,
                        Status = Domain.Enums.BedStatus.Free
                    };
                    await _bedStorage.AddAsync(newBed, token);
                }
            }

            return room;
        }

        public async Task<Room?> UpdateRoomAsync(UpdateRoomDto dto, CancellationToken token = default)
        {
            var room = await _roomStorage.GetAsync(dto.RoomId, token);
            if (room != null)
            {
                room.RoomNumber = dto.Number;
                room.Floor = dto.Floor;
                room.Type = dto.Type;
                room.Gender = dto.Gender;
                room.Priority = dto.Priority;
                await _roomStorage.UpdateAsync(room, token);

                if (dto.Beds != null)
                {
                    var existingBeds = await _bedQuery.GetBedsByRoomAsync(dto.RoomId, false, token);
                    var inputBedIds = dto.Beds.Where(b => b.Id.HasValue && !b.IsNew).Select(b => b.Id.Value).ToHashSet();

                    foreach (var bed in existingBeds)
                    {
                        if (!inputBedIds.Contains(bed.Id))
                        {
                            if (bed.PatientId != null)
                                throw new InvalidOperationException($"Cannot delete bed {bed.BedNumber} because it is occupied.");

                            await _bedStorage.RemoveAsync(bed.Id, token);
                        }
                    }

                    var newBedsCount = dto.Beds.Count(b => b.IsNew || !b.Id.HasValue);
                    if (newBedsCount > 0)
                    {
                        int maxBedNumber = existingBeds.Any() ? existingBeds.Max(b => b.BedNumber) : 0;
                        for (int i = 0; i < newBedsCount; i++)
                        {
                            var newBed = new HospitalBed
                            {
                                Id = Guid.NewGuid(),
                                RoomId = dto.RoomId,
                                BedNumber = maxBedNumber + i + 1,
                                Status = Domain.Enums.BedStatus.Free
                            };
                            await _bedStorage.AddAsync(newBed, token);
                        }
                    }
                }
            }
            return room;
        }

        public async Task UpdateRoomPriorityAsync(Guid roomId, Domain.Enums.RoomPriority priority, CancellationToken token = default)
        {
            var room = await _roomStorage.GetAsync(roomId, token);
            if (room != null)
            {
                room.Priority = priority;
                await _roomStorage.UpdateAsync(room, token);
            }
        }

        public async Task DeleteRoomAsync(Guid roomId, CancellationToken token = default)
        {
            var beds = await _bedQuery.GetBedsByRoomAsync(roomId, false, token);
            if (beds.Any(b => b.PatientId != null))
            {
                throw new InvalidOperationException("Cannot delete room with occupied beds.");
            }

            foreach (var bed in beds)
            {
                await _bedStorage.RemoveAsync(bed.Id, token);
            }
            await _roomStorage.RemoveAsync(roomId, token);
        }

        public Task<List<int>> GetAvailableFloorsAsync(CancellationToken token = default)
        {
            return _roomQuery.GetAvailableFloorsAsync(token);
        }

        public Task<List<RoomListItemDto>> GetRoomsByFloorAsync(int floor, CancellationToken token = default)
        {
            return _roomQuery.GetRoomsByFloorAsync(floor, token);
        }
    }
}
