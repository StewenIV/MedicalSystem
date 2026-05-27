using System;

namespace MedicalSystem.Domain.Models
{
    public class MedicineOperationLog
    {
        public Guid Id { get; set; }
        public Guid MedicineId { get; set; }
        public DateTime PerformedAt { get; set; }
        public byte Type { get; set; } // enum
        public decimal Quantity { get; set; }
        public decimal BalanceAfter { get; set; }
        public Guid PerformedById { get; set; }
        public string? Comment { get; set; }
        public string? Supplier { get; set; }
        public byte? Reason { get; set; } // enum
        public Guid? PatientId { get; set; }
        public Guid? PrescriptionId { get; set; }

        // Navigation properties
        public virtual Medicine Medicine { get; set; }
        public virtual MedicalStaff PerformedBy { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual PatientMedication Prescription { get; set; }
    }
}
