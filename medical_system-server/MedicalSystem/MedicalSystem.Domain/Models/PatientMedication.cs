using System;
using System.Collections.Generic;

namespace MedicalSystem.Domain.Models
{
    public class PatientMedication
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public Guid? MedicineId { get; set; }
        public string Name { get; set; }
        public string? Dose { get; set; }
        public string? Form { get; set; }
        public string? Route { get; set; }
        public string? Regimen { get; set; }
        public string? Comment { get; set; }
        public Guid? DoctorId { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public byte? Status { get; set; } // enum

        // Navigation properties
        public virtual Patient Patient { get; set; }
        public virtual Medicine Medicine { get; set; }
        public virtual MedicalStaff Doctor { get; set; }
        public virtual ICollection<BedPrescription> BedPrescriptions { get; set; }
        public virtual ICollection<MedicineOperationLog> MedicineOperationLogs { get; set; }
    }
}
