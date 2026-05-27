using System;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Domain.Models
{
    public class Shift
    {
        public Guid Id { get; set; }
        public Guid StaffId { get; set; }
        public DateTime Date { get; set; }
        public ShiftType Type { get; set; }
        public short Hours { get; set; }
        
        public virtual MedicalStaff Staff { get; set; }
    }
}
