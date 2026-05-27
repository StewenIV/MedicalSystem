using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IVitalSignQuery
    {
        Task<IReadOnlyCollection<VitalSign>> GetPeriodAsync(Guid patientId, DateTime from, DateTime to, CancellationToken token);
    }
}
