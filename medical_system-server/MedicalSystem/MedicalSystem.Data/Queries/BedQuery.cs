using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Data.Queries
{
    public class BedQuery : IBedQuery
    {
        private readonly MedicalSystemDbContext _context;

        public BedQuery(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task<BedsSummaryDto> GetBedsSummaryAsync(int? floor, string? status, CancellationToken token)
        {
            var bedsQuery = _context.HospitalBeds.AsNoTracking();

            if (floor.HasValue)
            {
                bedsQuery = bedsQuery.Where(b => b.Room.RoomNumber.StartsWith(floor.Value.ToString()));
            }
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<BedStatus>(status, true, out var bedStatus))
            {
                bedsQuery = bedsQuery.Where(b => b.Status == bedStatus);
            }

            var beds = await bedsQuery
                .Include(b => b.Patient).ThenInclude(p => p.Doctor)
                .Include(b => b.Room)
                .Select(b => new BedDto
                {
                    Id = b.Id,
                    RoomNumber = b.Room.RoomNumber,
                    BedNumber = b.BedNumber,
                    Status = b.Status.ToString().ToLower(),
                    PatientId = b.PatientId,
                    PatientName = b.Patient.FirstName,
                    PatientLastName = b.Patient.LastName,
                    PatientMiddleName = b.Patient.MiddleName,
                    PatientAge = (int)((DateTime.Now - b.Patient.DateOfBirth).TotalDays / 365.25),
                    Diagnosis = b.Patient.MedicalProblems.FirstOrDefault(mp => mp.IsActive).Name,
                    DoctorName = b.Patient.Doctor.Name,
                    AdmissionDate = b.AdmissionDate,
                    BedNote = b.BedNote
                }).ToListAsync(token);

            var stats = new BedStatsDto
            {
                Total = await _context.HospitalBeds.CountAsync(token),
                Occupied = await _context.HospitalBeds.CountAsync(b => b.PatientId != null, token),
                Free = await _context.HospitalBeds.CountAsync(b => b.PatientId == null, token),
            };
            stats.OccupancyPct = stats.Total > 0 ? (int)Math.Round((double)stats.Occupied / stats.Total * 100) : 0;

            return new BedsSummaryDto { Beds = beds, Stats = stats };
        }

        public async Task<RoomsWithBedsDto> GetRoomsWithBedsAsync(int? floor, CancellationToken token)
        {
            var roomsQuery = _context.Rooms.AsNoTracking();
            if (floor.HasValue)
            {
                roomsQuery = roomsQuery.Where(r => r.RoomNumber.StartsWith(floor.Value.ToString()));
            }

            var rooms = await roomsQuery
                .Include(r => r.HospitalBeds).ThenInclude(b => b.Patient)
                .Select(r => new RoomWithBedsDto
                {
                    Id = r.Id,
                    Name = $"Палата {r.RoomNumber}",
                    Floor = int.Parse(r.RoomNumber.Substring(0, 1)),
                    Gender = r.Gender.ToString().ToLower(),
                    Urgency = r.HospitalBeds.Any(b => b.Status == BedStatus.Urgent) ? "urgent" : r.HospitalBeds.Any(b => b.Status == BedStatus.Attention) ? "attention" : "normal",
                    Beds = r.HospitalBeds.Select(b => new BedInRoomDto
                    {
                        Id = b.Id,
                        BedNumber = b.BedNumber,
                        Status = b.Status.ToString().ToLower(),
                        PatientLastName = b.Patient.LastName,
                        PatientName = b.Patient.FirstName
                    }).ToList()
                }).ToListAsync(token);

            return new RoomsWithBedsDto { Rooms = rooms };
        }
        
        public Task<RoomConfigDto> GetRoomConfigAsync(CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task<FloorsDto> GetFloorsAsync(CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task<AlertsDto> GetAlertsAsync(CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task<BedDto> GetBedByIdAsync(Guid bedId, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task<PatientDetailsDto> GetPatientDetailsAsync(Guid patientId, CancellationToken token)
        {
            throw new NotImplementedException();
        }
    }
}
