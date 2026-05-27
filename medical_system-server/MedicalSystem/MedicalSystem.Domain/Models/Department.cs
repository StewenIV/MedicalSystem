using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class Department
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Название отделения обязательно для заполнения")]
        [StringLength(100, ErrorMessage = "Длина названия не должна превышать 100 символов")]
        public string Name { get; set; }

        // Navigation properties
        public virtual ICollection<Patient> Patients { get; set; }
        public virtual ICollection<Room> Rooms { get; set; }
        public virtual ICollection<MedicalStaff> MedicalStaff { get; set; }
    }
}
