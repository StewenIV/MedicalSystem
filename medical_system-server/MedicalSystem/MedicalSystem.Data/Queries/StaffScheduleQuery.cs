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
    public class StaffScheduleQuery : IStaffScheduleQuery
    {
        private readonly MedicalSystemDbContext _context;

        public StaffScheduleQuery(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyCollection<StaffScheduleDto>> GetMonthAsync(int year, int month, CancellationToken token)
        {
            var staffList = await _context.MedicalStaff
                .AsNoTracking()
                .Include(s => s.Shifts.Where(sh => sh.Date.Year == year && sh.Date.Month == month))
                .ToListAsync(token);

            var result = new List<StaffScheduleDto>();

            foreach (var staff in staffList)
            {
                var schedule = staff.Shifts
                    .Select(s => new ShiftDto
                    {
                        Day = s.Date.Day,
                        Type = MapShiftTypeToString(s.Type),
                        Hours = s.Hours
                    })
                    .ToList();

                result.Add(new StaffScheduleDto
                {
                    StaffId = staff.Id,
                    StaffName = staff.Name,
                    StaffPosition = staff.Position ?? "Сотрудник",
                    StaffDepartment = "Пульмонология",
                    Schedule = schedule
                });
            }

            return result;
        }

        private static string MapShiftTypeToString(ShiftType type)
        {
            return type switch
            {
                ShiftType.Day => "day",
                ShiftType.Night => "night",
                ShiftType.DayOff => "day-off",
                _ => "day-off"
            };
        }
    }
}
