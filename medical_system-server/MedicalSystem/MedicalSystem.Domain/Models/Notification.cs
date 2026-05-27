using System;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.Domain.Models
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid RecipientId { get; set; }
        public Guid? PatientId { get; set; }
        public NotificationType Type { get; set; }
        public SeverityType? Severity { get; set; }
        public string Message { get; set; }
        public string? Details { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
        
        public virtual MedicalStaff Recipient { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
