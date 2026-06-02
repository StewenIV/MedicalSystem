using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class VitalSignDto
    {
        public Guid Id { get; set; }
        public DateTime RecordedAt { get; set; }
        public decimal? Temperature { get; set; }
        public short? BloodPressureSystolic { get; set; }
        public short? BloodPressureDiastolic { get; set; }
        public short? Pulse { get; set; }
        public short? SpO2 { get; set; }
        public short? RespiratoryRate { get; set; }
        
        // Formatted versions for display
        public string? BloodPressure => 
            BloodPressureSystolic.HasValue && BloodPressureDiastolic.HasValue
                ? $"{BloodPressureSystolic}/{BloodPressureDiastolic}"
                : null;
        
        // Date string for graph (e.g., "12.05")
        public string DateLabel => RecordedAt.ToString("dd.MM");
    }
}
