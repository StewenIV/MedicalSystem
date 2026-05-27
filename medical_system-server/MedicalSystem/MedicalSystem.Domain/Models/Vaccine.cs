using System;

namespace MedicalSystem.Domain.Models
{
    public class Vaccine
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Name { get; set; }
        public string? Disease { get; set; }
        public DateTime? Date { get; set; }
        public string? Validity { get; set; }
        public string? Manufacturer { get; set; }
        public string? Series { get; set; }

        // Navigation property
        public virtual Patient Patient { get; set; }
    }
}
