using System;

namespace MedicalSystem.Domain.Models
{
    public class BedPrescription
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public Guid? PatientMedicationId { get; set; }
        public string Name { get; set; }
        public string? Dose { get; set; }
        public TimeSpan? ScheduledTime { get; set; }
        public DateTime Date { get; set; }
        public bool IsDone { get; set; }
        
        public virtual Patient Patient { get; set; }
        public virtual PatientMedication PatientMedication { get; set; }
    }
}
