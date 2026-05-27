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
    public class EncounterStorage : IEncounterStorage
    {
        private readonly MedicalSystemDbContext _context;

        public EncounterStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Encounter entity, CancellationToken token)
        {
            await _context.Encounters.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<Encounter?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.Encounters.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<Encounter>> GetAllAsync(CancellationToken token)
        {
            return await _context.Encounters.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var encounter = await GetAsync(id, token);
            if (encounter != null)
            {
                _context.Encounters.Remove(encounter);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(Encounter entity, CancellationToken token)
        {
            _context.Encounters.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task AddPrimaryInspectionAsync(Guid patientId, Encounter encounter, CancellationToken token)
        {
            encounter.PatientId = patientId;
            encounter.Type = "Primary Inspection";
            await AddAsync(encounter, token);
        }

        public async Task AddDailyRoundAsync(Guid patientId, Encounter encounter, CancellationToken token)
        {
            encounter.PatientId = patientId;
            encounter.Type = "Daily Round";
            await AddAsync(encounter, token);
        }

        public async Task CompleteEncounterAsync(Guid encounterId, CancellationToken token)
        {
            var encounter = await GetAsync(encounterId, token);
            if (encounter != null)
            {
                // Assuming completing an encounter means setting a conclusion or similar
                // For now, just updating the entity to show the concept
                await UpdateAsync(encounter, token);
            }
        }

        public void Add(Encounter entity) => throw new NotImplementedException();
        public Encounter? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<Encounter> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(Encounter entity) => throw new NotImplementedException();
        public void AddPrimaryInspection(Guid patientId, Encounter encounter) => throw new NotImplementedException();
        public void AddDailyRound(Guid patientId, Encounter encounter) => throw new NotImplementedException();
        public void CompleteEncounter(Guid encounterId) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.Encounters.AnyAsync(e => e.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
