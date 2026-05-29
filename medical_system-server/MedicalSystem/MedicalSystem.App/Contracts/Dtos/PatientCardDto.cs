using System;
using System.Collections.Generic;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class PatientCardDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? MiddleName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Status { get; set; }
        public string MedcardNum { get; set; }
        public string? HistoryNum { get; set; }
        public string? MaritalStatus { get; set; }
        
        public string? DoctorName { get; set; }
        public string? DepartmentName { get; set; }
        public string? RoomNumber { get; set; }
        public int? BedNumber { get; set; }
        
        public List<EncounterDto> Encounters { get; set; } = new();
        public List<PatientMedicationDto> Medications { get; set; } = new();
        public List<AllergyDto> Allergies { get; set; } = new();
        public List<MedicalProblemDto> MedicalProblems { get; set; } = new();
        public List<VitalSignDto> VitalSigns { get; set; } = new();
    }
    
    public class EncounterDto
    {
        public Guid Id { get; set; }
        public DateTime DateTime { get; set; }
        public string Type { get; set; }
        public string DoctorName { get; set; }
        public string Conclusion { get; set; }
    }

    public class PatientMedicationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Dose { get; set; }
        public string Regimen { get; set; }
        public MedicationStatus? Status { get; set; }
    }

    public class AllergyDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Reaction { get; set; }
    }

    public class MedicalProblemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

}
