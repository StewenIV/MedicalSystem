using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Services
{
    public class StaffScheduleService
    {
        private readonly IStaffScheduleQuery _scheduleQuery;
        private readonly IShiftStorage _shiftStorage;

        public StaffScheduleService(IStaffScheduleQuery scheduleQuery, IShiftStorage shiftStorage)
        {
            _scheduleQuery = scheduleQuery;
            _shiftStorage = shiftStorage;
        }

        public async Task<IReadOnlyCollection<StaffScheduleDto>> GetMonthScheduleAsync(int year, int month, CancellationToken token)
        {
            return await _scheduleQuery.GetMonthAsync(year, month, token);
        }

        public async Task UpdateShiftAsync(UpdateShiftDto dto, CancellationToken token)
        {
            var existingShift = await _shiftStorage.GetByStaffAndDateAsync(dto.StaffId, dto.Date, token);

            if (dto.Type == "empty")
            {
                if (existingShift != null)
                {
                    await _shiftStorage.RemoveAsync(existingShift.Id, token);
                }
            }
            else
            {
                var shiftType = MapStringToShiftType(dto.Type);

                if (existingShift != null)
                {
                    existingShift.Type = shiftType;
                    existingShift.Hours = dto.Hours;
                    await _shiftStorage.UpdateAsync(existingShift, token);
                }
                else
                {
                    var newShift = new Shift
                    {
                        Id = Guid.NewGuid(),
                        StaffId = dto.StaffId,
                        Date = dto.Date.Date,
                        Type = shiftType,
                        Hours = dto.Hours
                    };
                    await _shiftStorage.AddAsync(newShift, token);
                }
            }
        }

        private static ShiftType MapStringToShiftType(string type)
        {
            return type switch
            {
                "day" => ShiftType.Day,
                "night" => ShiftType.Night,
                "day-off" => ShiftType.DayOff,
                _ => throw new ArgumentException($"Unknown shift type: {type}")
            };
        }
    }
}
