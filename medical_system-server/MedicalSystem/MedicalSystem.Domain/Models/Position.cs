using System;
using System.Collections.Generic;

namespace MedicalSystem.Domain.Models
{
    public class Position
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        // Navigation properties
        public virtual ICollection<MedicalStaff> MedicalStaff { get; set; }
    }
}
