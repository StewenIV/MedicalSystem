using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Services;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.API.Hubs;

namespace MedicalSystem.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationStorage _notificationStorage;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(
            INotificationStorage notificationStorage,
            IHubContext<NotificationHub> hubContext)
        {
            _notificationStorage = notificationStorage;
            _hubContext = hubContext;
        }

        public async Task SendNotificationAsync(Notification notification, CancellationToken cancellationToken = default)
        {
            notification.Id = Guid.NewGuid();
            notification.CreatedAt = DateTime.UtcNow;
            notification.IsRead = false;

            await _notificationStorage.AddAsync(notification, cancellationToken);

            if (notification.RecipientId.HasValue)
            {
                await _hubContext.Clients.Group(notification.RecipientId.Value.ToString())
                    .SendAsync("ReceiveNotification", notification, cancellationToken);
            }
            if (notification.PatientRecipientId.HasValue)
            {
                await _hubContext.Clients.Group(notification.PatientRecipientId.Value.ToString())
                    .SendAsync("ReceiveNotification", notification, cancellationToken);
            }
        }

        public async Task BroadcastToMedicalStaffAsync(Notification notification, CancellationToken cancellationToken = default)
        {
            notification.Id = Guid.NewGuid();
            notification.CreatedAt = DateTime.UtcNow;
            notification.IsRead = false;

            await _notificationStorage.AddAsync(notification, cancellationToken);

            await _hubContext.Clients.Group("MedicalStaff")
                .SendAsync("ReceiveNotification", notification, cancellationToken);
        }
    }
}
