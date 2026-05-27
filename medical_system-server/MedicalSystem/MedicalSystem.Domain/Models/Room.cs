using System;
using System.Collections.Generic;

namespace MedicalSystem.Domain.Models
{
    public class Room
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; }
        public byte Gender { get; set; } // enum
        public Guid? DepartmentId { get; set; }

        // Navigation properties
        public virtual Department Department { get; set; }
        public virtual ICollection<HospitalBed> HospitalBeds { get; set; }
    }
}
