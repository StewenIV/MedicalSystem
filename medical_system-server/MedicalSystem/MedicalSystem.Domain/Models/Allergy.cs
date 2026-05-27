using System;

namespace MedicalSystem.Domain.Models
{
    public class Allergy
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Name { get; set; }
        public string? Reaction { get; set; }
        public DateTime? Date { get; set; }
        public string? Comment { get; set; }

        // Navigation property
        public virtual Patient Patient { get; set; }
    }
}
