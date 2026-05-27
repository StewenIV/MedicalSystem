using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface INotificationStorage : IStorage<Notification>
    {
        void MarkAsRead(Guid notificationId);
        Task MarkAsReadAsync(Guid notificationId, CancellationToken token);
    }
}
