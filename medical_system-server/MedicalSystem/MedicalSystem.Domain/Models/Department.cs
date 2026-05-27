using System;
using System.Collections.Generic;

namespace MedicalSystem.Domain.Models
{
    public class Department
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        // Navigation properties
        public virtual ICollection<Patient> Patients { get; set; }
        public virtual ICollection<Room> Rooms { get; set; }
        public virtual ICollection<MedicalStaff> MedicalStaff { get; set; }
    }
}
