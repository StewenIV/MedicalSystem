using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class Encounter
    {
        public Guid Id { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        public Guid? DoctorId { get; set; }

        [Required]
        public DateTime DateTime { get; set; }

        [StringLength(100, ErrorMessage = "Длина типа события не должна превышать 100 символов")]
        public string? Type { get; set; }

        public string? Conclusion { get; set; }

        public string? Complaints { get; set; }

        public string? Objective { get; set; }

        public string? Recommendations { get; set; }

        public string? FormData { get; set; }

        
        public virtual Patient Patient { get; set; }
        public virtual MedicalStaff Doctor { get; set; }
    }
}
