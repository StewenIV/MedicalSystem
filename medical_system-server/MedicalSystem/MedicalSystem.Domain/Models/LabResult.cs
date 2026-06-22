using System;

namespace MedicalSystem.Domain.Models
{
    public class LabResult
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public string Type { get; set; }
        public DateTime? Date { get; set; }
        public string? StatusText { get; set; }
        public string? Reason { get; set; }
        
        public string? ResultData { get; set; }
        public string? Comments { get; set; }
        public string? PdfDocumentPath { get; set; }
        public Guid? LaboratoryEmployeeId { get; set; }
        public DateTime? DateUpdated { get; set; }
        
        public virtual Patient Patient { get; set; }
        public virtual MedicalStaff Doctor { get; set; }
        public virtual MedicalStaff? LaboratoryEmployee { get; set; }
    }
}
