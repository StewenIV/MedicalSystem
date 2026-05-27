using System;

namespace MedicalSystem.Domain.Models
{
    public class Appointment
    {
        public Guid Id { get; set; }
        public Guid? PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public DateTime Time { get; set; }
        public string? Reason { get; set; }
        public byte Status { get; set; } // enum
        public byte Type { get; set; } // enum

        // Navigation properties
        public virtual Patient Patient { get; set; }
        public virtual MedicalStaff Doctor { get; set; }
    }
}
