using System;

namespace MedicalSystem.Domain.Models
{
    public class VitalSign
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public DateTime RecordedAt { get; set; }
        public short? BloodPressureSystolic { get; set; }
        public short? BloodPressureDiastolic { get; set; }
        public decimal? Temperature { get; set; }
        public short? Pulse { get; set; }
        public short? SpO2 { get; set; }
        public short? RespiratoryRate { get; set; }

        // Navigation property
        public virtual Patient Patient { get; set; }
    }
}
