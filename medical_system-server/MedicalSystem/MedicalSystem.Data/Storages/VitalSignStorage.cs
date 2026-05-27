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
    public class VitalSignStorage : IVitalSignStorage
    {
        private readonly MedicalSystemDbContext _context;

        public VitalSignStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(VitalSign entity, CancellationToken token)
        {
            await _context.VitalSigns.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<VitalSign?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.VitalSigns.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<VitalSign>> GetAllAsync(CancellationToken token)
        {
            return await _context.VitalSigns.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var vitalSign = await GetAsync(id, token);
            if (vitalSign != null)
            {
                _context.VitalSigns.Remove(vitalSign);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(VitalSign entity, CancellationToken token)
        {
            _context.VitalSigns.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task AddRangeAsync(Guid patientId, IEnumerable<VitalSign> signs, CancellationToken token)
        {
            foreach (var sign in signs)
            {
                sign.PatientId = patientId;
            }
            await _context.VitalSigns.AddRangeAsync(signs, token);
            await _context.SaveChangesAsync(token);
        }

        public void Add(VitalSign entity) => throw new NotImplementedException();
        public VitalSign? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<VitalSign> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(VitalSign entity) => throw new NotImplementedException();
        public void AddRange(Guid patientId, IEnumerable<VitalSign> signs) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.VitalSigns.AnyAsync(vs => vs.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
