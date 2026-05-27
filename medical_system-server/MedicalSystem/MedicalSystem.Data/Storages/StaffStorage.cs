using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Storages
{
    public class StaffStorage : IStaffStorage
    {
        private readonly MedicalSystemDbContext _context;

        public StaffStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(MedicalStaff entity, CancellationToken token)
        {
            await _context.MedicalStaff.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<MedicalStaff?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.MedicalStaff.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<MedicalStaff>> GetAllAsync(CancellationToken token)
        {
            return await _context.MedicalStaff.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var staff = await GetAsync(id, token);
            if (staff != null)
            {
                _context.MedicalStaff.Remove(staff);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(MedicalStaff entity, CancellationToken token)
        {
            _context.MedicalStaff.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task UpdateScheduleAsync(Guid staffId, IEnumerable<Shift> shifts, CancellationToken token)
        {
            var staff = await _context.MedicalStaff.Include(s => s.Shifts).FirstOrDefaultAsync(s => s.Id == staffId, token);
            if (staff != null)
            {
                // This is a simple implementation. A more robust one would handle conflicts.
                staff.Shifts = shifts.ToList();
                await _context.SaveChangesAsync(token);
            }
        }

        public void Add(MedicalStaff entity) => throw new NotImplementedException();
        public MedicalStaff? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<MedicalStaff> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(MedicalStaff entity) => throw new NotImplementedException();
        public void UpdateSchedule(Guid staffId, IEnumerable<Shift> shifts) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.MedicalStaff.AnyAsync(s => s.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
