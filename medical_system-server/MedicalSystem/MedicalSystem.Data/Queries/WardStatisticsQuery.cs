using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Queries
{
    public class WardStatisticsQuery : IWardStatisticsQuery
    {
        private readonly MedicalSystemDbContext _context;

        public WardStatisticsQuery(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task<WardStatisticsDto> GetWardStatisticsAsync(CancellationToken token = default)
        {
            var totalBeds = await _context.HospitalBeds.CountAsync(token);
            var occupiedBeds = await _context.HospitalBeds.CountAsync(b => b.PatientId != null, token);
            var totalRooms = await _context.Rooms.CountAsync(token);
            
            var roomsByType = await _context.Rooms
                .GroupBy(r => r.Type.ToString())
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Type, x => x.Count, token);

            var roomsByFloor = await _context.Rooms
                .GroupBy(r => r.Floor)
                .Select(g => new { Floor = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Floor, x => x.Count, token);

            return new WardStatisticsDto
            {
                TotalBeds = totalBeds,
                OccupiedBeds = occupiedBeds,
                FreeBeds = totalBeds - occupiedBeds,
                TotalRooms = totalRooms,
                RoomsByType = roomsByType,
                RoomsByFloor = roomsByFloor
            };
        }
    }
}
