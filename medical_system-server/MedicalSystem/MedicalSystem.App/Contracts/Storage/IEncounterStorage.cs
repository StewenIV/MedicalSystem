using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IEncounterStorage : IStorage<Encounter>
    {
        Task<Encounter> CreateEncounterWithUserAsync(Encounter encounter, Guid? userId, CancellationToken token);
        Task<IReadOnlyCollection<Encounter>> GetPatientEncountersAsync(Guid patientId, CancellationToken token);
        void AddPrimaryInspection(Guid patientId, Encounter encounter);
        Task AddPrimaryInspectionAsync(Guid patientId, Encounter encounter, CancellationToken token);
        void AddDailyRound(Guid patientId, Encounter encounter);
        Task AddDailyRoundAsync(Guid patientId, Encounter encounter, CancellationToken token);
        void CompleteEncounter(Guid encounterId);
        Task CompleteEncounterAsync(Guid encounterId, CancellationToken token);
    }
}
