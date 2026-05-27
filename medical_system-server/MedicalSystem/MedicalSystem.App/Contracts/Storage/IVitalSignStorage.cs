using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IVitalSignStorage : IStorage<VitalSign>
    {
        void AddRange(Guid patientId, IEnumerable<VitalSign> signs);
        Task AddRangeAsync(Guid patientId, IEnumerable<VitalSign> signs, CancellationToken token);
    }
}
