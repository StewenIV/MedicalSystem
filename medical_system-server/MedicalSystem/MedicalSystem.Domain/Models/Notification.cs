using System;

namespace MedicalSystem.Domain.Models
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid RecipientId { get; set; }
        public Guid? PatientId { get; set; }
        public byte Type { get; set; } // enum
        public byte? Severity { get; set; } // enum
        public string Message { get; set; }
        public string? Details { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }

        // Navigation properties
        public virtual MedicalStaff Recipient { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
