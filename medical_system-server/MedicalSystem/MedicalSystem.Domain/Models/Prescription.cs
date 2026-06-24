using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class Prescription
    {
        public Guid Id { get; set; }

        [Required]
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        [Required]
        [StringLength(200)]
        public string Drug { get; set; }

        [StringLength(100)]
        public string Dose { get; set; }

        [StringLength(100)]
        public string Form { get; set; }

        [StringLength(100)]
        public string Route { get; set; }

        [StringLength(200)]
        public string Regimen { get; set; }

        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }

        public Guid? DoctorId { get; set; }
        public virtual MedicalStaff Doctor { get; set; }

        public Guid? MedicineId { get; set; }
        public virtual Medicine? Medicine { get; set; }

        [StringLength(500)]
        public string Comment { get; set; }
    }
}
