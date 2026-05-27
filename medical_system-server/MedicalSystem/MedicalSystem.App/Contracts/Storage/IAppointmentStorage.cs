using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IAppointmentStorage : IStorage<Appointment>
    {
        void ChangeStatus(Guid appointmentId, AppointmentStatus status);
        Task ChangeStatusAsync(Guid appointmentId, AppointmentStatus status, CancellationToken token);
        void Cancel(Guid appointmentId);
        Task CancelAsync(Guid appointmentId, CancellationToken token);
    }
}
