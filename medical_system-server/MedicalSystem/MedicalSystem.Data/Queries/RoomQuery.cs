using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Queries
{
    public class RoomQuery : IRoomQuery
    {
        private readonly MedicalSystemDbContext _context;

        public RoomQuery(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<RoomListItemDto>> GetRoomsAsync(int? floorFilter, string? typeFilter, string? search, int page, int pageSize, CancellationToken token = default)
        {
            var query = _context.Rooms.Include(r => r.HospitalBeds).AsNoTracking();

            if (floorFilter.HasValue)
                query = query.Where(r => r.Floor == floorFilter.Value);

            if (!string.IsNullOrEmpty(typeFilter) && Enum.TryParse<RoomType>(typeFilter, true, out var roomType))
                query = query.Where(r => r.Type == roomType);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(r => r.RoomNumber.Contains(search));

            var totalCount = await query.CountAsync(token);

            var rooms = await query
                .OrderBy(r => r.RoomNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RoomListItemDto
                {
                    Id = r.Id,
                    Number = r.RoomNumber,
                    Floor = r.Floor,
                    Type = r.Type,
                    Gender = r.Gender,
                    Priority = r.Priority,
                    BedsCount = r.HospitalBeds.Count,
                    OccupiedBedsCount = r.HospitalBeds.Count(b => b.PatientId != null),
                    FreeBedsCount = r.HospitalBeds.Count(b => b.PatientId == null)
                })
                .ToListAsync(token);

            return new PagedResultDto<RoomListItemDto>
            {
                Items = rooms,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<RoomDetailsDto?> GetRoomByIdAsync(Guid roomId, CancellationToken token = default)
        {
            var roomDto = await _context.Rooms
                .AsNoTracking()
                .Where(r => r.Id == roomId)
                .Select(room => new RoomDetailsDto
                {
                    Id = room.Id,
                    Number = room.RoomNumber,
                    Floor = room.Floor,
                    Type = room.Type,
                    Gender = room.Gender,
                    Priority = room.Priority,
                    Beds = room.HospitalBeds.Select(b => new BedDto
                    {
                        Id = b.Id,
                        RoomNumber = room.RoomNumber,
                        BedNumber = b.BedNumber,
                        Status = b.Status.ToString(),
                        PatientId = b.PatientId,
                        PatientName = b.Patient != null ? b.Patient.FirstName : null,
                        PatientLastName = b.Patient != null ? b.Patient.LastName : null,
                        PatientMiddleName = b.Patient != null ? b.Patient.MiddleName : null,
                        PatientGender = b.Patient != null ? (b.Patient.Gender == Gender.Male ? "Мужской" : "Женский") : null,
                        PatientAge = b.Patient != null ? (int)((DateTime.UtcNow - b.Patient.DateOfBirth).TotalDays / 365.25) : null,
                        Diagnosis = b.Patient != null ? b.Patient.MedicalProblems.Where(mp => mp.IsActive).OrderByDescending(mp => mp.Description == "Основной").Select(mp => mp.Name).FirstOrDefault() : null,
                        DoctorName = b.Patient != null && b.Patient.Doctor != null ? b.Patient.Doctor.Name : null,
                        DoctorRole = b.Patient != null && b.Patient.Doctor != null ? b.Patient.Doctor.Position.ToString() : null,
                        AdmissionDate = b.AdmissionDate,
                        BedNote = b.BedNote
                    }).ToList()
                })
                .FirstOrDefaultAsync(token);

            return roomDto;
        }

        public async Task<List<int>> GetAvailableFloorsAsync(CancellationToken token = default)
        {
            return await _context.Rooms
                .AsNoTracking()
                .Select(r => r.Floor)
                .Distinct()
                .OrderBy(f => f)
                .ToListAsync(token);
        }

        public async Task<List<RoomListItemDto>> GetRoomsByFloorAsync(int floor, CancellationToken token = default)
        {
            return await _context.Rooms
                .Include(r => r.HospitalBeds)
                .AsNoTracking()
                .Where(r => r.Floor == floor)
                .OrderBy(r => r.RoomNumber)
                .Select(r => new RoomListItemDto
                {
                    Id = r.Id,
                    Number = r.RoomNumber,
                    Floor = r.Floor,
                    Type = r.Type,
                    Gender = r.Gender,
                    Priority = r.Priority,
                    BedsCount = r.HospitalBeds.Count,
                    OccupiedBedsCount = r.HospitalBeds.Count(b => b.PatientId != null),
                    FreeBedsCount = r.HospitalBeds.Count(b => b.PatientId == null)
                })
                .ToListAsync(token);
        }
    }
}
