using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class Position
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Название должности обязательно для заполнения")]
        [StringLength(100, ErrorMessage = "Длина названия не должна превышать 100 символов")]
        public string Name { get; set; }

        // Navigation properties
        public virtual ICollection<MedicalStaff> MedicalStaff { get; set; }
    }
}
