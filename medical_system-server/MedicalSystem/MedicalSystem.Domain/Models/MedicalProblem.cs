using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class MedicalProblem
    {
        public Guid Id { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        [Required(ErrorMessage = "Название диагноза обязательно для заполнения")]
        [StringLength(300, ErrorMessage = "Длина диагноза не должна превышать 300 символов")]
        public string Name { get; set; }

        public DateTime? DiagnosisDate { get; set; }

        [StringLength(50, ErrorMessage = "Длина статуса болезни не должна превышать 50 символов")]
        public string? DiseaseStatus { get; set; }

        [StringLength(50, ErrorMessage = "Длина степени тяжести не должна превышать 50 символов")]
        public string? Severity { get; set; }

        [StringLength(1000, ErrorMessage = "Длина описания не должна превышать 1000 символов")]
        public string? Description { get; set; }

        [StringLength(500, ErrorMessage = "Длина осложнений не должна превышать 500 символов")]
        public string? Complications { get; set; }

        [Required]
        public bool IsActive { get; set; }

        // Navigation property
        public virtual Patient Patient { get; set; }
    }
}
