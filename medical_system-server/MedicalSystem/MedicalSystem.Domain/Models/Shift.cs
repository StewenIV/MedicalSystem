using System;

namespace MedicalSystem.Domain.Models
{
    public class Shift
    {
        public Guid Id { get; set; }
        public Guid StaffId { get; set; }
        public DateTime Date { get; set; }
        public byte Type { get; set; } // enum
        public short Hours { get; set; }

        // Navigation property
        public virtual MedicalStaff Staff { get; set; }
    }
}
