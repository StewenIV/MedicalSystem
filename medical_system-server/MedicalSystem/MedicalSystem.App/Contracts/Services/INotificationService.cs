using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(Notification notification, CancellationToken cancellationToken = default);
        Task BroadcastToMedicalStaffAsync(Notification notification, CancellationToken cancellationToken = default);
    }
}
