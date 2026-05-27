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
    public class HospitalBedStorage : IHospitalBedStorage
    {
        private readonly MedicalSystemDbContext _context;

        public HospitalBedStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(HospitalBed entity, CancellationToken token)
        {
            await _context.HospitalBeds.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<HospitalBed?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.HospitalBeds.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<HospitalBed>> GetAllAsync(CancellationToken token)
        {
            return await _context.HospitalBeds.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var bed = await GetAsync(id, token);
            if (bed != null)
            {
                _context.HospitalBeds.Remove(bed);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(HospitalBed entity, CancellationToken token)
        {
            _context.HospitalBeds.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task OccupyAsync(Guid bedId, Guid patientId, CancellationToken token)
        {
            var bed = await GetAsync(bedId, token);
            if (bed != null)
            {
                bed.PatientId = patientId;
                bed.Status = Domain.Enums.BedStatus.Attention; // Or some default status
                await UpdateAsync(bed, token);
            }
        }

        public async Task ReleaseAsync(Guid bedId, CancellationToken token)
        {
            var bed = await GetAsync(bedId, token);
            if (bed != null)
            {
                bed.PatientId = null;
                bed.Status = Domain.Enums.BedStatus.Free;
                await UpdateAsync(bed, token);
            }
        }

        public async Task TransferAsync(Guid patientId, Guid targetBedId, CancellationToken token)
        {
            var currentBed = await _context.HospitalBeds.FirstOrDefaultAsync(b => b.PatientId == patientId, token);
            if (currentBed != null)
            {
                await ReleaseAsync(currentBed.Id, token);
            }
            await OccupyAsync(targetBedId, patientId, token);
        }

        public async Task UpdateNoteAsync(Guid bedId, string note, CancellationToken token)
        {
            var bed = await GetAsync(bedId, token);
            if (bed != null)
            {
                bed.BedNote = note;
                await UpdateAsync(bed, token);
            }
        }

        public void Add(HospitalBed entity) => throw new NotImplementedException();
        public HospitalBed? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<HospitalBed> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(HospitalBed entity) => throw new NotImplementedException();
        public void Occupy(Guid bedId, Guid patientId) => throw new NotImplementedException();
        public void Release(Guid bedId) => throw new NotImplementedException();
        public void Transfer(Guid patientId, Guid targetBedId) => throw new NotImplementedException();
        public void UpdateNote(Guid bedId, string note) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.HospitalBeds.AnyAsync(b => b.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
