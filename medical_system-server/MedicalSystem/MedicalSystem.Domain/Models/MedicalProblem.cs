using System;

namespace MedicalSystem.Domain.Models
{
    public class MedicalProblem
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Name { get; set; }
        public DateTime? DiagnosisDate { get; set; }
        public string? DiseaseStatus { get; set; }
        public string? Severity { get; set; }
        public string? Description { get; set; }
        public string? Complications { get; set; }
        public bool IsActive { get; set; }

        // Navigation property
        public virtual Patient Patient { get; set; }
    }
}
