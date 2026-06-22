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
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Status { get; set; }
        public string StatusText { get; set; }
        public string MedcardNum { get; set; }
        public string? HistoryNum { get; set; }
        public string? MaritalStatus { get; set; }
        public string? Institution { get; set; }
        public DateTime LastUpdated { get; set; }
        
        public string? DoctorName { get; set; }
        public string? DepartmentName { get; set; }
        public string? RoomNumber { get; set; }
        public int? BedNumber { get; set; }

        // Owned entities
        public PassportInfoDto? Passport { get; set; }
        public ContactsInfoDto? Contacts { get; set; }
        public WorkInfoDto? Work { get; set; }
        public OtherInfoDto? Other { get; set; }

        // Vitals
        public VitalsDto? Vitals { get; set; }

        // Lists
        public List<RelativeDto>? Relatives { get; set; }
        public List<AllergyDto>? Allergies { get; set; }
        public List<MedicationDto>? CurrentMeds { get; set; }
        public List<OperationDto>? Operations { get; set; }
        public List<MedicalProblemDto>? MedicalProblems { get; set; }
        public List<PrescriptionDto>? Prescriptions { get; set; }
        public List<LabDto>? Labs { get; set; }
        public List<VaccineDto>? Vaccines { get; set; }
        public List<DocumentDto>? Documents { get; set; }
        public List<HistoryEntryDto>? History { get; set; }
        
        // For backward compatibility
        public List<EncounterDto>? Encounters { get; set; }
        public List<PatientMedicationDto>? Medications { get; set; }
    }

    public class PassportInfoDto
    {
        public string? SeriesNumber { get; set; }
        public string? IssuedBy { get; set; }
        public DateTime? DateIssued { get; set; }
    }

    public class ContactsInfoDto
    {
        public string? Country { get; set; }
        public string? Region { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }
        public string? Zip { get; set; }
        public string? PhoneMobile { get; set; }
        public string? PhoneHome { get; set; }
        public string? Email { get; set; }
    }

    public class WorkInfoDto
    {
        public string? Profession { get; set; }
        public string? Organization { get; set; }
        public string? Address { get; set; }
    }

    public class OtherInfoDto
    {
        public string? Language { get; set; }
        public string? Nationality { get; set; }
        public DateTime? DateOfDeath { get; set; }
        public string? CauseOfDeath { get; set; }
    }

    public class VitalsDto
    {
        public string? Temp { get; set; }
        public string? Bp { get; set; }
        public string? Hr { get; set; }
        public string? Resp { get; set; }
        public string? Spo2 { get; set; }
    }

    public class RelativeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Relation { get; set; }
        public string? Phone { get; set; }
    }

    public class AllergyDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Reaction { get; set; }
        public DateTime? Date { get; set; }
        public string? Comment { get; set; }
    }

    public class MedicationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Dose { get; set; }
        public string? Form { get; set; }
        public string? Regimen { get; set; }
    }

    public class OperationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        public string? Diagnosis { get; set; }
        public string? Description { get; set; }
        public string? Complications { get; set; }
        public string? Implants { get; set; }
        public string? Result { get; set; }
    }

    public class MedicalProblemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime? DiagnosisDate { get; set; }
        public string? DiseaseStatus { get; set; }
        public string? Severity { get; set; }
        public string? Description { get; set; }
        public string? Complications { get; set; }
        public bool IsActive { get; set; }
    }

    public class PrescriptionDto
    {
        public Guid Id { get; set; }
        public string Drug { get; set; }
        public string? Dose { get; set; }
        public string? Form { get; set; }
        public string? Route { get; set; }
        public string? Regimen { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public string? DoctorName { get; set; }
        public string? Comment { get; set; }
    }

    public class LabDto
    {
        public Guid Id { get; set; }
        public DateTime? Date { get; set; }
        public string Type { get; set; }
        public string? Reason { get; set; }
        public string? DoctorName { get; set; }
        public string? StatusText { get; set; }
        public string? ResultData { get; set; }
        public string? Comments { get; set; }
        public string? PdfDocumentPath { get; set; }
        public Guid? LaboratoryEmployeeId { get; set; }
        public string? LaboratoryEmployeeName { get; set; }
        public DateTime? DateUpdated { get; set; }
    }

    public class VaccineDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Disease { get; set; }
        public DateTime? Date { get; set; }
        public string? Validity { get; set; }
        public string? Manufacturer { get; set; }
        public string? Series { get; set; }
    }

    public class DocumentDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        public string? FilePath { get; set; }
    }

    public class HistoryEntryDto
    {
        public Guid Id { get; set; }
        public DateTime DateTime { get; set; }
        public string? Type { get; set; }
        public string? DoctorName { get; set; }
        public string? Complaints { get; set; }
        public string? Objective { get; set; }
        public string? Conclusion { get; set; }
        public string? Recommendations { get; set; }
        public string? FormData { get; set; }
    }

    // Backward compatible classes
    public class EncounterDto
    {
        public Guid Id { get; set; }
        public DateTime DateTime { get; set; }
        public string Type { get; set; }
        public string DoctorName { get; set; }
        public string Conclusion { get; set; }
        public string? FormData { get; set; }
    }

    public class PatientMedicationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Dose { get; set; }
        public string Regimen { get; set; }
        public MedicationStatus? Status { get; set; }
    }
}
