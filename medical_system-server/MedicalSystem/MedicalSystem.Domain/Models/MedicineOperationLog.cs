using System;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Domain.Models
{
    public class MedicineOperationLog
    {
        public Guid Id { get; set; }
        public Guid MedicineId { get; set; }
        public DateTime PerformedAt { get; set; }
        public OperationType Type { get; set; }
        public decimal Quantity { get; set; }
        public decimal BalanceAfter { get; set; }
        public Guid PerformedById { get; set; }
        public string? Comment { get; set; }
        public string? Supplier { get; set; }
        public WriteOffReason? Reason { get; set; }
        public Guid? PatientId { get; set; }
        public Guid? PrescriptionId { get; set; }
        
        public virtual Medicine Medicine { get; set; }
        public virtual MedicalStaff PerformedBy { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual PatientMedication Prescription { get; set; }
    }
}
