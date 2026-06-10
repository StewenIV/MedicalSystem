using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Services
{
    public class EncounterService
    {
        private readonly IEncounterStorage _encounterStorage;

        public EncounterService(IEncounterStorage encounterStorage)
        {
            _encounterStorage = encounterStorage;
        }

        public async Task<IEnumerable<PatientEncounterDto>> GetPatientEncountersAsync(Guid patientId, CancellationToken token)
        {
            var encounters = await _encounterStorage.GetPatientEncountersAsync(patientId, token);
            return encounters.Select(MapToDto);
        }

        public async Task<IEnumerable<PatientEncounterDto>> GetTodayEncountersAsync(CancellationToken token)
        {
            var encounters = await _encounterStorage.GetAllAsync(token);
            var today = DateTime.Today;
            return encounters
                .Where(e => e.DateTime.Date == today)
                .Select(MapToDto);
        }

        public async Task<PatientEncounterDto> CreateEncounterAsync(Guid patientId, CreateEncounterRequest request, Guid? userId, CancellationToken token)
        {
            var encounter = new Encounter
            {
                Id = Guid.NewGuid(),
                PatientId = patientId,
                DateTime = request.DateTime == default ? DateTime.Now : request.DateTime,
                Type = request.Type,
                Complaints = request.Complaints,
                Objective = request.Objective,
                Conclusion = request.Conclusion,
                Recommendations = request.Recommendations,
                FormData = request.FormData
            };

            var saved = await _encounterStorage.CreateEncounterWithUserAsync(encounter, userId, token);
            
            var reloaded = await _encounterStorage.GetPatientEncountersAsync(patientId, token);
            var reloadedItem = reloaded.FirstOrDefault(e => e.Id == saved.Id) ?? saved;

            return MapToDto(reloadedItem);
        }

        public async Task<PatientEncounterDto> UpdateEncounterAsync(Guid patientId, Guid encounterId, CreateEncounterRequest request, Guid? userId, CancellationToken token)
        {
            var encounter = await _encounterStorage.GetAsync(encounterId, token);
            if (encounter == null)
            {
                throw new KeyNotFoundException($"Encounter with ID {encounterId} not found");
            }

            encounter.DateTime = request.DateTime == default ? DateTime.Now : request.DateTime;
            encounter.Type = request.Type;
            encounter.Complaints = request.Complaints;
            encounter.Objective = request.Objective;
            encounter.Conclusion = request.Conclusion;
            encounter.Recommendations = request.Recommendations;
            encounter.FormData = request.FormData;

            await _encounterStorage.UpdateAsync(encounter, token);

            var reloaded = await _encounterStorage.GetPatientEncountersAsync(patientId, token);
            var reloadedItem = reloaded.FirstOrDefault(e => e.Id == encounterId) ?? encounter;

            return MapToDto(reloadedItem);
        }

        private static PatientEncounterDto MapToDto(Encounter e)
        {
            return new PatientEncounterDto
            {
                Id = e.Id,
                PatientId = e.PatientId,
                DoctorId = e.DoctorId,
                DoctorName = e.Doctor?.Name,
                DateTime = e.DateTime,
                Type = e.Type,
                Complaints = e.Complaints,
                Objective = e.Objective,
                Conclusion = e.Conclusion,
                Recommendations = e.Recommendations,
                FormData = e.FormData
            };
        }
    }
}
