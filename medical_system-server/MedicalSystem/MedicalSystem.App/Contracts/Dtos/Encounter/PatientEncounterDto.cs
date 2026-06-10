using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class PatientEncounterDto
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public DateTime DateTime { get; set; }
        public string? Type { get; set; }
        public string? Complaints { get; set; }
        public string? Objective { get; set; }
        public string? Conclusion { get; set; }
        public string? Recommendations { get; set; }
        public string? FormData { get; set; }
    }
}
