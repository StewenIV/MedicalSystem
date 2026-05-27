using System;

namespace MedicalSystem.Domain.Models
{
    public class Encounter
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public DateTime DateTime { get; set; }
        public string? Type { get; set; }
        public string? Conclusion { get; set; }
        public string? Complaints { get; set; }
        public string? Objective { get; set; }
        public string? Recommendations { get; set; }

        // Navigation properties
        public virtual Patient Patient { get; set; }
        public virtual MedicalStaff Doctor { get; set; }
    }
}
