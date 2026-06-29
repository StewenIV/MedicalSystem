using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class PatientListDto
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
        public string? DoctorName { get; set; }
        public string? DepartmentName { get; set; }
        public string? RoomNumber { get; set; }
        public int? BedNumber { get; set; }
        public DateTime? AdmissionDate { get; set; }
        public string[]? ActiveProblems { get; set; }
    }
}
