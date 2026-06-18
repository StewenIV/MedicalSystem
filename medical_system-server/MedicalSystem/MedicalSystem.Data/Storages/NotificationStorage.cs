using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Data.Storages
{
    public class NotificationStorage : INotificationStorage
    {
        private readonly MedicalSystemDbContext _context;

        public NotificationStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Notification entity, CancellationToken token)
        {
            await _context.Notifications.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<Notification?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.Notifications.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<Notification>> GetAllAsync(CancellationToken token)
        {
            return await _context.Notifications
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(token);
        }

        public async Task<IReadOnlyCollection<Notification>> GetByPatientIdAsync(Guid patientId, CancellationToken token)
        {
            return await _context.Notifications
                .Where(n => n.PatientRecipientId == patientId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(token);
        }

        public async Task<IReadOnlyCollection<Notification>> GetByRecipientIdAsync(Guid recipientId, CancellationToken token)
        {
            return await _context.Notifications
                .Where(n => n.RecipientId == recipientId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(token);
        }

        public async Task<IReadOnlyCollection<Notification>> GetStaffNotificationsAsync(Guid staffId, CancellationToken token)
        {
            return await _context.Notifications
                .Where(n => n.RecipientId == staffId || (n.RecipientType == RecipientType.Staff && n.RecipientId == null))
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(token);
        }

        public async Task MarkAllAsReadByPatientAsync(Guid patientId, CancellationToken token)
        {
            var notifications = await _context.Notifications
                .Where(n => n.PatientRecipientId == patientId && !n.IsRead)
                .ToListAsync(token);

            foreach (var n in notifications)
                n.IsRead = true;

            await _context.SaveChangesAsync(token);
        }

        public async Task MarkAllAsReadByStaffAsync(Guid staffId, CancellationToken token)
        {
            var notifications = await _context.Notifications
                .Where(n => (n.RecipientId == staffId || (n.RecipientType == RecipientType.Staff && n.RecipientId == null)) && !n.IsRead)
                .ToListAsync(token);

            foreach (var n in notifications)
                n.IsRead = true;

            await _context.SaveChangesAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var notification = await GetAsync(id, token);
            if (notification != null)
            {
                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(Notification entity, CancellationToken token)
        {
            _context.Notifications.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task MarkAsReadAsync(Guid notificationId, CancellationToken token)
        {
            var notification = await GetAsync(notificationId, token);
            if (notification != null)
            {
                notification.IsRead = true;
                await UpdateAsync(notification, token);
            }
        }

        public void Add(Notification entity) => throw new NotImplementedException();
        public Notification? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<Notification> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(Notification entity) => throw new NotImplementedException();
        public void MarkAsRead(Guid notificationId) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.Notifications.AnyAsync(n => n.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
