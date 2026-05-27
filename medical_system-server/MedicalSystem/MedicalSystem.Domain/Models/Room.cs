using System;
using System.Collections.Generic;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Domain.Models
{
    public class Room
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; }
        public RoomGender Gender { get; set; }
        public Guid? DepartmentId { get; set; }
        
        public virtual Department Department { get; set; }
        public virtual ICollection<HospitalBed> HospitalBeds { get; set; }
    }
}
