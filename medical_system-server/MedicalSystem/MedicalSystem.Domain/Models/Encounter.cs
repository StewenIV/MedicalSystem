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

        [StringLength(1000, ErrorMessage = "Длина заключения не должна превышать 1000 символов")]
        public string? Conclusion { get; set; }

        [StringLength(1000, ErrorMessage = "Длина жалоб не должна превышать 1000 символов")]
        public string? Complaints { get; set; }

        [StringLength(1000, ErrorMessage = "Длина объективного статуса не должна превышать 1000 символов")]
        public string? Objective { get; set; }

        [StringLength(1000, ErrorMessage = "Длина рекомендаций не должна превышать 1000 символов")]
        public string? Recommendations { get; set; }

        // Navigation properties
        public virtual Patient Patient { get; set; }
        public virtual MedicalStaff Doctor { get; set; }
    }
}
