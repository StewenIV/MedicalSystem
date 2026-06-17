using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class UpdatePatientGeneralInfoDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public MedicalSystem.Domain.Enums.Gender Gender { get; set; }
        public string? MaritalStatus { get; set; }
    }

    public class UpdatePatientPassportDto
    {
        public string? SeriesNumber { get; set; }
        public string? IssuedBy { get; set; }
        public DateTime? DateIssued { get; set; }
    }

    public class UpdatePatientOtherDto
    {
        public string? Language { get; set; }
        public string? Nationality { get; set; }
        public DateTime? DateOfDeath { get; set; }
        public string? CauseOfDeath { get; set; }
    }

    public class UpdatePatientWorkDto
    {
        public string? Profession { get; set; }
        public string? Organization { get; set; }
        public string? Address { get; set; }
    }

    public class UpdatePatientRelativeDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Relation { get; set; }
        public string? Phone { get; set; }
    }

    public class UpdatePatientContactsDto
    {
        public string? PhoneMobile { get; set; }
        public string? PhoneHome { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Region { get; set; }
        public string? Zip { get; set; }
        public string? Country { get; set; }
    }

    // Keep this for backward compatibility if needed by the frontend currently
    public class UpdateTrustedPersonDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Relation { get; set; }
        public string? Phone { get; set; }
    }

    public class ChangePasswordDto
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class PatientNotificationDto
    {
        public Guid Id { get; set; }

        public string Type { get; set; } = string.Empty;

        public string? Severity { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string? Details { get; set; }
        public string Time { get; set; } = string.Empty;
        public bool Read { get; set; }
    }

    public class PatientDocumentDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? DocumentType { get; set; }
        public string? Content { get; set; }
        public string? DoctorName { get; set; }
        public string? Date { get; set; }
        public string? FilePath { get; set; }
    }
}
