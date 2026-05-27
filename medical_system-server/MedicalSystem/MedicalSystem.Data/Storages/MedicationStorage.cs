using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Data.Storages
{
    public class MedicationStorage : IMedicationStorage
    {
        private readonly MedicalSystemDbContext _context;

        public MedicationStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(PatientMedication entity, CancellationToken token)
        {
            await _context.PatientMedications.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<PatientMedication?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.PatientMedications.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<PatientMedication>> GetAllAsync(CancellationToken token)
        {
            return await _context.PatientMedications.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var medication = await GetAsync(id, token);
            if (medication != null)
            {
                _context.PatientMedications.Remove(medication);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(PatientMedication entity, CancellationToken token)
        {
            _context.PatientMedications.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task CompleteAsync(Guid medicationId, CancellationToken token)
        {
            var medication = await GetAsync(medicationId, token);
            if (medication != null)
            {
                medication.Status = MedicationStatus.Completed;
                await UpdateAsync(medication, token);
            }
        }

        public async Task CancelAsync(Guid medicationId, CancellationToken token)
        {
            var medication = await GetAsync(medicationId, token);
            if (medication != null)
            {
                medication.Status = MedicationStatus.Cancelled;
                await UpdateAsync(medication, token);
            }
        }

        public void Add(PatientMedication entity) => throw new NotImplementedException();
        public PatientMedication? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<PatientMedication> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(PatientMedication entity) => throw new NotImplementedException();
        public void Complete(Guid medicationId) => throw new NotImplementedException();
        public void Cancel(Guid medicationId) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.PatientMedications.AnyAsync(pm => pm.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
