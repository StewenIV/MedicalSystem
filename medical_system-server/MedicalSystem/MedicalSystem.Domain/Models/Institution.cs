using System;
using System.Collections.Generic;

namespace MedicalSystem.Domain.Models
{
    public class Institution
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        // Navigation properties
        public virtual ICollection<Patient> Patients { get; set; }
    }
}
