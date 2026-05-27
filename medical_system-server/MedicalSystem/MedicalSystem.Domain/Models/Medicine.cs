using System;
using System.Collections.Generic;

namespace MedicalSystem.Domain.Models
{
    public class Medicine
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public byte Category { get; set; } // enum
        public byte Unit { get; set; } // enum
        public decimal CurrentBalance { get; set; }
        public decimal MinBalance { get; set; }
        public decimal TotalReceived { get; set; }
        public decimal TotalWrittenOff { get; set; }
        public DateTime? LastReceiptDate { get; set; }
        public DateTime? LastWriteOffDate { get; set; }
        public string? LastReceiptFrom { get; set; }
        public byte? LastOperation { get; set; } // enum
        public Guid? LastChangedById { get; set; }
        public DateTime? LastUpdated { get; set; }
        public byte Status { get; set; } // enum
        public bool IsArchived { get; set; }

        // Navigation properties
        public virtual MedicalStaff LastChangedBy { get; set; }
        public virtual ICollection<PatientMedication> PatientMedications { get; set; }
        public virtual ICollection<MedicineOperationLog> MedicineOperationLogs { get; set; }
    }
}
