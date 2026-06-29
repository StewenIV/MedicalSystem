using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Domain.Models
{
    public class Medicine
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Название медикамента обязательно для заполнения")]
        [StringLength(200, ErrorMessage = "Длина названия не должна превышать 200 символов")]
        public string Name { get; set; }

        [StringLength(1000, ErrorMessage = "Длина описания не должна превышать 1000 символов")]
        public string? Description { get; set; }

        [Required]
        public MedicineCategory Category { get; set; }

        [Required]
        public MedicineUnit Unit { get; set; }

        [Required]
        [Range(0, 9999999.999, ErrorMessage = "Недопустимое значение баланса")]
        public decimal CurrentBalance { get; set; }

        [Required]
        [Range(0, 9999999.999, ErrorMessage = "Недопустимое значение баланса")]
        public decimal MinBalance { get; set; }

        [Required]
        public decimal TotalReceived { get; set; }

        [Required]
        public decimal TotalWrittenOff { get; set; }

        public DateTime? LastReceiptDate { get; set; }
        public DateTime? LastWriteOffDate { get; set; }

        [StringLength(200, ErrorMessage = "Длина поставщика не должна превышать 200 символов")]
        public string? LastReceiptFrom { get; set; }

        public OperationType? LastOperation { get; set; }
        public Guid? LastChangedById { get; set; }
        public DateTime? LastUpdated { get; set; }

        [Required]
        public MedicineStatus Status { get; set; }

        [Required]
        public bool IsArchived { get; set; }

        
        public virtual MedicalStaff LastChangedBy { get; set; }
        public virtual ICollection<PatientMedication> PatientMedications { get; set; }
        public virtual ICollection<MedicineOperationLog> MedicineOperationLogs { get; set; }
    }
}
