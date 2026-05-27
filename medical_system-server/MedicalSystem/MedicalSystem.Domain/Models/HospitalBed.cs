using System;

namespace MedicalSystem.Domain.Models
{
    public class HospitalBed
    {
        public Guid Id { get; set; }
        public Guid RoomId { get; set; }
        public int BedNumber { get; set; }
        public Guid? PatientId { get; set; }
        public byte Status { get; set; } // enum
        public string? BedNote { get; set; }
        public DateTime? AdmissionDate { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
