using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Storages
{
    public class RoomStorage : IRoomStorage
    {
        private readonly MedicalSystemDbContext _context;

        public RoomStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Room entity, CancellationToken token)
        {
            await _context.Rooms.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<Room?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.Rooms.Include(r => r.HospitalBeds).FirstOrDefaultAsync(r => r.Id == id, token);
        }

        public async Task<IReadOnlyCollection<Room>> GetAllAsync(CancellationToken token)
        {
            return await _context.Rooms.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var room = await GetAsync(id, token);
            if (room != null)
            {
                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(Room entity, CancellationToken token)
        {
            _context.Rooms.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task AddBedAsync(Guid roomId, HospitalBed bed, CancellationToken token)
        {
            var room = await GetAsync(roomId, token);
            if (room != null)
            {
                room.HospitalBeds.Add(bed);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task RemoveBedAsync(Guid roomId, Guid bedId, CancellationToken token)
        {
            var room = await GetAsync(roomId, token);
            var bed = room?.HospitalBeds.FirstOrDefault(b => b.Id == bedId);
            if (bed != null)
            {
                _context.HospitalBeds.Remove(bed);
                await _context.SaveChangesAsync(token);
            }
        }

        public void Add(Room entity) => throw new NotImplementedException();
        public Room? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<Room> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(Room entity) => throw new NotImplementedException();
        public void AddBed(Guid roomId, HospitalBed bed) => throw new NotImplementedException();
        public void RemoveBed(Guid roomId, Guid bedId) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.Rooms.AnyAsync(r => r.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
