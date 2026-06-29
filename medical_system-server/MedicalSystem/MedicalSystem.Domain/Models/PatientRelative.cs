using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class PatientRelative
    {
        public Guid Id { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        [Required(ErrorMessage = "ФИО родственника обязательно для заполнения")]
        [StringLength(200, ErrorMessage = "Длина ФИО не должна превышать 200 символов")]
        public string Name { get; set; }

        [StringLength(100, ErrorMessage = "Длина степени родства не должна превышать 100 символов")]
        public string? Relation { get; set; }

        [StringLength(20, ErrorMessage = "Длина номера телефона не должна превышать 20 символов")]
        [Phone(ErrorMessage = "Некорректный формат номера телефона")]
        public string? Phone { get; set; }

        
        public virtual Patient Patient { get; set; }
    }
}
