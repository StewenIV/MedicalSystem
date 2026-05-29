using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Queries
{
    public class PatientQuery : IPatientQuery
    {
        private readonly MedicalSystemDbContext _context;

        public PatientQuery(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task<PatientCardDto?> GetCardByIdAsync(Guid patientId, CancellationToken token)
        {
            var patient = await _context.Patients
                .AsNoTracking()
                .Include(p => p.Doctor)
                .Include(p => p.Department)
                .Include(p => p.Encounters).ThenInclude(e => e.Doctor)
                .Include(p => p.PatientMedications)
                .Include(p => p.Allergies)
                .Include(p => p.MedicalProblems)
                .Include(p => p.VitalSigns)
                .FirstOrDefaultAsync(p => p.Id == patientId, token);

            if (patient == null)
            {
                return null;
            }

            var bed = await _context.HospitalBeds
                .AsNoTracking()
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.PatientId == patientId, token);

            // Маппинг в DTO
            return new PatientCardDto
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                MiddleName = patient.MiddleName,
                Age = (int)((DateTime.Now - patient.DateOfBirth).TotalDays / 365.25),
                Gender = patient.Gender.ToString(),
                Status = patient.Status.ToString(),
                MedcardNum = patient.MedcardNum,
                HistoryNum = patient.HistoryNum,
                MaritalStatus = patient.MaritalStatus,
                DoctorName = patient.Doctor?.Name,
                DepartmentName = patient.Department?.Name,
                RoomNumber = bed?.Room?.RoomNumber,
                BedNumber = bed?.BedNumber,

                Encounters = patient.Encounters.Select(e => new EncounterDto
                {
                    Id = e.Id,
                    DateTime = e.DateTime,
                    Type = e.Type,
                    DoctorName = e.Doctor?.Name,
                    Conclusion = e.Conclusion
                }).ToList(),

                Medications = patient.PatientMedications.Select(pm => new PatientMedicationDto
                {
                    Id = pm.Id,
                    Name = pm.Name,
                    Dose = pm.Dose,
                    Regimen = pm.Regimen,
                    Status = pm.Status
                }).ToList(),

                Allergies = patient.Allergies.Select(a => new AllergyDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Reaction = a.Reaction
                }).ToList(),

                MedicalProblems = patient.MedicalProblems.Select(mp => new MedicalProblemDto
                {
                    Id = mp.Id,
                    Name = mp.Name,
                    IsActive = mp.IsActive
                }).ToList(),

                VitalSigns = patient.VitalSigns.Select(vs => new VitalSignDto
                {
                    Id = vs.Id,
                    RecordedAt = vs.RecordedAt,
                    Temperature = vs.Temperature,
                    BloodPressure = $"{vs.BloodPressureSystolic}/{vs.BloodPressureDiastolic}",
                    Pulse = vs.Pulse,
                    SpO2 = vs.SpO2
                }).ToList()
            };
        }
    }
}
