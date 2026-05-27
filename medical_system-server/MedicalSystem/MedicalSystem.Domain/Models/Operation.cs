using System;

namespace MedicalSystem.Domain.Models
{
    public class Operation
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        public string? Diagnosis { get; set; }
        public string? Description { get; set; }
        public string? Complications { get; set; }
        public string? Implants { get; set; }
        public string? Result { get; set; }
        
        public virtual Patient Patient { get; set; }
    }
}
