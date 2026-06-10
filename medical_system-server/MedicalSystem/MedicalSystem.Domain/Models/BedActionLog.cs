using System;

namespace MedicalSystem.Domain.Models
{
    public class BedActionLog
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public Guid? PerformedById { get; set; }
        public string? PerformedByName { get; set; }
        public string Action { get; set; }
        public DateTime PerformedAt { get; set; }
        public string? Amount { get; set; }
        
        public virtual Patient Patient { get; set; }
        public virtual MedicalStaff PerformedBy { get; set; }
    }
}
