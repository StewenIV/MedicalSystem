using System;

namespace MedicalSystem.Domain.Models
{
    public class PatientDocument
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        public string? FilePath { get; set; }
        
        public virtual Patient Patient { get; set; }
    }
}
