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
    public class AppointmentStorage : IAppointmentStorage
    {
        private readonly MedicalSystemDbContext _context;

        public AppointmentStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Appointment entity, CancellationToken token)
        {
            await _context.Appointments.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<Appointment?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.Appointments.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<Appointment>> GetAllAsync(CancellationToken token)
        {
            return await _context.Appointments.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var appointment = await GetAsync(id, token);
            if (appointment != null)
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(Appointment entity, CancellationToken token)
        {
            _context.Appointments.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task ChangeStatusAsync(Guid appointmentId, AppointmentStatus status, CancellationToken token)
        {
            var appointment = await GetAsync(appointmentId, token);
            if (appointment != null)
            {
                appointment.Status = status;
                await UpdateAsync(appointment, token);
            }
        }

        public async Task CancelAsync(Guid appointmentId, CancellationToken token)
        {
            var appointment = await GetAsync(appointmentId, token);
            if (appointment != null)
            {
                appointment.Status = AppointmentStatus.Free;
                await UpdateAsync(appointment, token);
            }
        }

        public void Add(Appointment entity) => throw new NotImplementedException();
        public Appointment? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<Appointment> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(Appointment entity) => throw new NotImplementedException();
        public void ChangeStatus(Guid appointmentId, AppointmentStatus status) => throw new NotImplementedException();
        public void Cancel(Guid appointmentId) => throw new NotImplementedException();
        
        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.Appointments.AnyAsync(a => a.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
