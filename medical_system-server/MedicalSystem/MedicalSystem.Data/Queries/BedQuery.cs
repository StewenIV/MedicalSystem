using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Services;
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
                string floorStr = floor.Value.ToString();
                bedsQuery = bedsQuery.Where(b => b.Room.RoomNumber.StartsWith(floorStr));
            }
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<BedStatus>(status, true, out var bedStatus))
            {
                bedsQuery = bedsQuery.Where(b => b.Status == bedStatus);
            }

            var rawBeds = await bedsQuery
                .Select(b => new
                {
                    b.Id,
                    RoomNumber = b.Room.RoomNumber,
                    b.BedNumber,
                    b.Status,
                    b.PatientId,
                    Patient = b.Patient == null ? null : new
                    {
                        b.Patient.FirstName,
                        b.Patient.LastName,
                        b.Patient.MiddleName,
                        b.Patient.DateOfBirth,
                        b.Patient.Gender,
                        Diagnosis = b.Patient.MedicalProblems.Where(mp => mp.IsActive).Select(mp => mp.Name).FirstOrDefault(),
                        DoctorName = b.Patient.Doctor != null ? b.Patient.Doctor.Name : null,
                        Doctor = b.Patient.Doctor == null ? null : new { b.Patient.Doctor.Name, b.Patient.Doctor.Position }
                    },
                    b.AdmissionDate,
                    b.BedNote
                })
                .ToListAsync(token);
            
            
            var beds = rawBeds.Select(b => new BedDto
            {
                Id = b.Id,
                RoomNumber = b.RoomNumber,
                BedNumber = b.BedNumber,
                Status = b.Status.ToString().ToLower(),
                PatientId = b.PatientId,
                PatientName = b.Patient?.FirstName,
                PatientLastName = b.Patient?.LastName,
                PatientMiddleName = b.Patient?.MiddleName,
                PatientGender = b.Patient != null ? (b.Patient.Gender == Gender.Male ? "Мужской" : "Женский") : null,
                PatientAge = b.Patient != null ? (int)((DateTime.UtcNow - b.Patient.DateOfBirth).TotalDays / 365.25) : (int?)null,
                Diagnosis = b.Patient?.Diagnosis,
                DoctorName = b.Patient?.Doctor?.Name ?? b.Patient?.DoctorName,
                DoctorRole = b.Patient?.Doctor?.Position?.ToString(),
                AdmissionDate = b.AdmissionDate,
                BedNote = b.BedNote
            }).ToList();

            var today = DateTime.UtcNow.Date;
            var todayAdmissions = await _context.BedOccupancyHistories.CountAsync(h => h.AdmittedAt.Date == today, token);
            var todayDischarges = await _context.BedOccupancyHistories.CountAsync(h => h.DischargedAt != null && h.DischargedAt.Value.Date == today, token);

            var total = await _context.HospitalBeds.CountAsync(token);
            var occupied = await _context.HospitalBeds.CountAsync(b => b.PatientId != null, token);
            var free = await _context.HospitalBeds.CountAsync(b => b.PatientId == null, token);

            var occupancyDelta = todayAdmissions - todayDischarges;
            var freeYesterday = total - (occupied - occupancyDelta);
            var freeDeltaPct = freeYesterday > 0 ? (int)Math.Round((double)(free - freeYesterday) / freeYesterday * 100) : 0;

            var stats = new BedStatsDto
            {
                Total = total,
                Occupied = occupied,
                Free = free,
                TodayAdmissions = todayAdmissions,
                TodayDischarges = todayDischarges,
                OccupancyDelta = occupancyDelta,
                FreeDeltaPct = freeDeltaPct,
                OccupancyPct = total > 0 ? (int)Math.Round((double)occupied / total * 100) : 0
            };

            return new BedsSummaryDto { Beds = beds, Stats = stats };
        }

        public async Task<RoomsWithBedsDto> GetRoomsWithBedsAsync(int? floor, CancellationToken token)
        {
            var roomsQuery = _context.Rooms.AsNoTracking();
            if (floor.HasValue)
            {
                string floorStr = floor.Value.ToString();
                roomsQuery = roomsQuery.Where(r => r.RoomNumber.StartsWith(floorStr));
            }

            var rawRooms = await roomsQuery
                .Select(r => new
                {
                    r.Id,
                    r.RoomNumber,
                    r.Gender,
                    Beds = r.HospitalBeds.Select(b => new
                    {
                        b.Id,
                        b.BedNumber,
                        b.Status,
                        PatientLastName = b.Patient != null ? b.Patient.LastName : null,
                        PatientName = b.Patient != null ? b.Patient.FirstName : null
                    }).ToList()
                })
                .ToListAsync(token);

            var rooms = rawRooms.Select(r => new RoomWithBedsDto
            {
                Id = r.Id,
                Name = $"Палата {r.RoomNumber}",
                Floor = int.TryParse(r.RoomNumber.Substring(0, 1), out int parsedFloor) ? parsedFloor : 0,
                Gender = r.Gender.ToString().ToLower(),
                Urgency = r.Beds.Any(b => b.Status == BedStatus.Urgent) ? "urgent" : r.Beds.Any(b => b.Status == BedStatus.Attention) ? "attention" : "normal",
                Beds = r.Beds.Select(b => new BedInRoomDto
                {
                    Id = b.Id,
                    BedNumber = b.BedNumber,
                    Status = b.Status.ToString().ToLower(),
                    PatientLastName = b.PatientLastName,
                    PatientName = b.PatientName
                }).ToList()
            }).ToList();

            return new RoomsWithBedsDto { Rooms = rooms };
        }

        public async Task<RoomConfigDto> GetRoomConfigAsync(CancellationToken token)
        {
            var rooms = await _context.Rooms.AsNoTracking().ToListAsync(token);
            var config = rooms.ToDictionary(r => r.RoomNumber, r => new GenderConfig { Gender = r.Gender.ToString().ToLower() });
            return new RoomConfigDto { Rooms = config };
        }

        public async Task<FloorsDto> GetFloorsAsync(CancellationToken token)
        {
            var floorStrings = await _context.Rooms.AsNoTracking()
                .Select(r => r.RoomNumber.Substring(0, 1))
                .Distinct()
                .ToListAsync(token);

             var floors = floorStrings
                .Where(f => int.TryParse(f, out _))
                .Select(int.Parse)
                .OrderBy(f => f)
                .ToList();

            return new FloorsDto { Floors = floors };
        }

        public async Task<AlertsDto> GetAlertsAsync(CancellationToken token)
        {
            var rawAlerts = await _context.HospitalBeds.AsNoTracking()
                .Where(b => (b.Status == BedStatus.Urgent || b.Status == BedStatus.Attention) && b.PatientId != null)
                .Select(b => new
                {
                    b.Id,
                    b.Status,
                    RoomNumber = b.Room.RoomNumber,
                    PatientId = b.PatientId.Value, // Гарантированно не null благодаря фильтру
                    PatientName = b.Patient.FirstName,
                    PatientLastName = b.Patient.LastName
                })
                .ToListAsync(token);

            return new AlertsDto
            {
                Urgent = rawAlerts.Where(a => a.Status == BedStatus.Urgent).Select(a => new AlertBedDto { Id = a.Id, RoomNumber = a.RoomNumber, PatientId = a.PatientId, PatientName = a.PatientName, PatientLastName = a.PatientLastName }).ToList(),
                Attention = rawAlerts.Where(a => a.Status == BedStatus.Attention).Select(a => new AlertBedDto { Id = a.Id, RoomNumber = a.RoomNumber, PatientId = a.PatientId, PatientName = a.PatientName, PatientLastName = a.PatientLastName }).ToList()
            };
        }

        public async Task<BedDto> GetBedByIdAsync(Guid bedId, CancellationToken token)
        {
            var rawBed = await _context.HospitalBeds.AsNoTracking()
                .Where(b => b.Id == bedId)
                .Select(b => new
                {
                    b.Id,
                    RoomNumber = b.Room.RoomNumber,
                    b.BedNumber,
                    b.Status,
                    b.PatientId,
                    Patient = b.Patient == null ? null : new
                    {
                        b.Patient.FirstName,
                        b.Patient.LastName,
                        b.Patient.MiddleName,
                        b.Patient.DateOfBirth,
                        b.Patient.Gender,
                        Diagnosis = b.Patient.MedicalProblems.Where(mp => mp.IsActive).Select(mp => mp.Name).FirstOrDefault(),
                        DoctorName = b.Patient.Doctor != null ? b.Patient.Doctor.Name : null,
                        Doctor = b.Patient.Doctor == null ? null : new { b.Patient.Doctor.Name, b.Patient.Doctor.Position }
                    },
                    b.AdmissionDate,
                    b.BedNote
                })
                .FirstOrDefaultAsync(token);

            if (rawBed == null) return null;

            return new BedDto
            {
                Id = rawBed.Id,
                RoomNumber = rawBed.RoomNumber,
                BedNumber = rawBed.BedNumber,
                Status = rawBed.Status.ToString().ToLower(),
                PatientId = rawBed.PatientId,
                PatientName = rawBed.Patient?.FirstName,
                PatientLastName = rawBed.Patient?.LastName,
                PatientMiddleName = rawBed.Patient?.MiddleName,
                PatientGender = rawBed.Patient != null ? (rawBed.Patient.Gender == Gender.Male ? "Мужской" : "Женский") : null,
                PatientAge = rawBed.Patient != null ? (int)((DateTime.UtcNow - rawBed.Patient.DateOfBirth).TotalDays / 365.25) : (int?)null,
                Diagnosis = rawBed.Patient?.Diagnosis,
                DoctorName = rawBed.Patient?.Doctor?.Name ?? rawBed.Patient?.DoctorName,
                DoctorRole = rawBed.Patient?.Doctor?.Position?.ToString(),
                AdmissionDate = rawBed.AdmissionDate,
                BedNote = rawBed.BedNote
            };
        }

        public async Task<List<BedDto>> GetBedsByRoomAsync(Guid roomId, bool onlyFree = false, CancellationToken token = default)
        {
            var query = _context.HospitalBeds.AsNoTracking().Where(b => b.RoomId == roomId);
            if (onlyFree)
            {
                query = query.Where(b => b.PatientId == null);
            }

            var rawBeds = await query
                .Select(b => new
                {
                    b.Id,
                    RoomNumber = b.Room.RoomNumber,
                    b.BedNumber,
                    b.Status,
                    b.PatientId,
                    Patient = b.Patient == null ? null : new
                    {
                        b.Patient.FirstName,
                        b.Patient.LastName,
                        b.Patient.MiddleName,
                        b.Patient.DateOfBirth,
                        b.Patient.Gender,
                        Diagnosis = b.Patient.MedicalProblems.Where(mp => mp.IsActive).Select(mp => mp.Name).FirstOrDefault(),
                        DoctorName = b.Patient.Doctor != null ? b.Patient.Doctor.Name : null,
                        Doctor = b.Patient.Doctor == null ? null : new { b.Patient.Doctor.Name, b.Patient.Doctor.Position }
                    },
                    b.AdmissionDate,
                    b.BedNote
                })
                .ToListAsync(token);

            return rawBeds.Select(rawBed => new BedDto
            {
                Id = rawBed.Id,
                RoomNumber = rawBed.RoomNumber,
                BedNumber = rawBed.BedNumber,
                Status = rawBed.Status.ToString().ToLower(),
                PatientId = rawBed.PatientId,
                PatientName = rawBed.Patient?.FirstName,
                PatientLastName = rawBed.Patient?.LastName,
                PatientMiddleName = rawBed.Patient?.MiddleName,
                PatientGender = rawBed.Patient != null ? (rawBed.Patient.Gender == Gender.Male ? "Мужской" : "Женский") : null,
                PatientAge = rawBed.Patient != null ? (int)((DateTime.UtcNow - rawBed.Patient.DateOfBirth).TotalDays / 365.25) : (int?)null,
                Diagnosis = rawBed.Patient?.Diagnosis,
                DoctorName = rawBed.Patient?.Doctor?.Name ?? rawBed.Patient?.DoctorName,
                DoctorRole = rawBed.Patient?.Doctor?.Position?.ToString(),
                AdmissionDate = rawBed.AdmissionDate,
                BedNote = rawBed.BedNote
            }).ToList();
        }

        public async Task<PatientDetailsDto> GetPatientDetailsAsync(Guid patientId, CancellationToken token)
        {
                var bedNote = await _context.HospitalBeds.AsNoTracking()
                .Where(b => b.PatientId == patientId)
                .Select(b => b.BedNote)
                .FirstOrDefaultAsync(token);

            var dbPrescriptions = await _context.BedPrescriptions.AsNoTracking()
                .Include(p => p.PatientMedication)
                .ThenInclude(pm => pm.Medicine)
                .Where(p => p.PatientId == patientId)
                .OrderBy(p => p.ScheduledTime)
                .ToListAsync(token);
            
            var prescriptions = dbPrescriptions.Select(p => new BedPrescriptionDto 
            { 
                Id = p.Id, 
                Name = p.Name, 
                Dose = p.Dose, 
                Time = p.ScheduledTime?.ToString(@"hh\:mm") ?? "", 
                Done = p.IsDone 
            }).ToList();

            var meds = dbPrescriptions
                .Where(p => p.PatientMedication != null && p.PatientMedication.Medicine != null)
                .Select(p => p.PatientMedication.Medicine)
                .DistinctBy(m => m.Id)
                .Select(m => new MedicationInStockDto 
                { 
                    Name = m.Name, 
                    Qty = $"{Math.Round(m.CurrentBalance, 2)} {MedicineEnumMapper.ToFrontend(m.Unit)}" 
                })
                .ToList();

            var dbLog = await _context.BedActionLogs.AsNoTracking()
                .Include(l => l.PerformedBy)
                    
                .Where(l => l.PatientId == patientId)
                .OrderByDescending(l => l.PerformedAt)
                .ToListAsync(token);

            var log = dbLog.Select(l => new ActionLogDto 
            { 
                Who = !string.IsNullOrEmpty(l.PerformedByName) 
                    ? l.PerformedByName 
                    : (l.PerformedBy != null 
                        ? $"{l.PerformedBy.Name} ({l.PerformedBy.Position})" 
                        : "Неизвестно"), 
                Action = l.Action, 
                Time = DateTime.SpecifyKind(l.PerformedAt, DateTimeKind.Utc).ToString("o"), 
                Amount = l.Amount 
            }).ToList();

            return new PatientDetailsDto
            {
                DoctorNote = bedNote,
                Prescriptions = prescriptions,
                Meds = meds,
                Log = log
            };
        }
    }
}
