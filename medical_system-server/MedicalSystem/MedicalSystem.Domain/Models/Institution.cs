using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class Institution
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Название учреждения обязательно для заполнения")]
        [StringLength(200, ErrorMessage = "Длина названия не должна превышать 200 символов")]
        public string Name { get; set; }

        
        public virtual ICollection<Patient> Patients { get; set; }
    }
}
