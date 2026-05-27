using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Infrastructure.Storages
{
    public class PatientStorage : IPatientStorage
    {
        private readonly MedicalSystemDbContext _context;

        public PatientStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Patient entity, CancellationToken token)
        {
            await _context.Patients.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<Patient?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.Patients.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<Patient>> GetAllAsync(CancellationToken token)
        {
            return await _context.Patients.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var patient = await GetAsync(id, token);
            if (patient != null)
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(Patient entity, CancellationToken token)
        {
            _context.Patients.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task AssignDoctorAsync(Guid patientId, Guid doctorId, CancellationToken token)
        {
            var patient = await GetAsync(patientId, token);
            if (patient != null)
            {
                patient.DoctorId = doctorId;
                await UpdateAsync(patient, token);
            }
        }

        public async Task DischargeAsync(Guid patientId, CancellationToken token)
        {
            var patient = await GetAsync(patientId, token);
            if (patient != null)
            {
                patient.Status = Domain.Enums.PatientStatus.Discharged;
                await UpdateAsync(patient, token);
            }
        }

        public async Task TransferAsync(Guid patientId, Guid departmentId, CancellationToken token)
        {
            var patient = await GetAsync(patientId, token);
            if (patient != null)
            {
                patient.DepartmentId = departmentId;
                await UpdateAsync(patient, token);
            }
        }

        // Синхронные методы я пока оставлю нереализованными, 
        // так как в веб-приложениях предпочтительно использовать асинхронные операции.
        public void Add(Patient entity) => throw new NotImplementedException();
        public Patient? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<Patient> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(Patient entity) => throw new NotImplementedException();
        public void AssignDoctor(Guid patientId, Guid doctorId) => throw new NotImplementedException();
        public void Discharge(Guid patientId) => throw new NotImplementedException();
        public void Transfer(Guid patientId, Guid departmentId) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.Patients.AnyAsync(p => p.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
