using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface INotificationStorage : IStorage<Notification>
    {
        void MarkAsRead(Guid notificationId);
        Task MarkAsReadAsync(Guid notificationId, CancellationToken token);

        Task<IReadOnlyCollection<Notification>> GetByPatientIdAsync(Guid patientId, CancellationToken token);
        Task MarkAllAsReadByPatientAsync(Guid patientId, CancellationToken token);

        Task<IReadOnlyCollection<Notification>> GetByRecipientIdAsync(Guid recipientId, CancellationToken token);
    }
}
