using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Domain.Models
{
    public class PatientMedication
    {
        public Guid Id { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        public Guid? MedicineId { get; set; }

        [Required(ErrorMessage = "Название препарата обязательно для заполнения")]
        [StringLength(200, ErrorMessage = "Длина названия не должна превышать 200 символов")]
        public string Name { get; set; }

        [StringLength(50, ErrorMessage = "Длина дозы не должна превышать 50 символов")]
        public string? Dose { get; set; }

        [StringLength(100, ErrorMessage = "Длина лекарственной формы не должна превышать 100 символов")]
        public string? Form { get; set; }

        [StringLength(100, ErrorMessage = "Длина пути введения не должна превышать 100 символов")]
        public string? Route { get; set; }

        [StringLength(200, ErrorMessage = "Длина режима приёма не должна превышать 200 символов")]
        public string? Regimen { get; set; }

        [StringLength(500, ErrorMessage = "Длина комментария не должна превышать 500 символов")]
        public string? Comment { get; set; }

        public Guid? DoctorId { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public MedicationStatus? Status { get; set; }

        // Navigation properties
        public virtual Patient Patient { get; set; }
        public virtual Medicine Medicine { get; set; }
        public virtual MedicalStaff Doctor { get; set; }
        public virtual ICollection<BedPrescription> BedPrescriptions { get; set; }
        public virtual ICollection<MedicineOperationLog> MedicineOperationLogs { get; set; }
    }
}
