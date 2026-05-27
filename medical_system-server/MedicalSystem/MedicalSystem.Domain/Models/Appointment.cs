using System;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Domain.Models
{
    public class Appointment
    {
        public Guid Id { get; set; }
        public Guid? PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public DateTime Time { get; set; }
        public string? Reason { get; set; }
        public AppointmentStatus Status { get; set; }
        public AppointmentType Type { get; set; }
        
        public virtual Patient Patient { get; set; }
        public virtual MedicalStaff Doctor { get; set; }
    }
}
