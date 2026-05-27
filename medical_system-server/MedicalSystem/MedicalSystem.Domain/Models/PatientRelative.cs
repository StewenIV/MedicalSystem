using System;

namespace MedicalSystem.Domain.Models
{
    public class PatientRelative
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Name { get; set; }
        public string? Relation { get; set; }
        public string? Phone { get; set; }

        // Navigation property
        public virtual Patient Patient { get; set; }
    }
}
