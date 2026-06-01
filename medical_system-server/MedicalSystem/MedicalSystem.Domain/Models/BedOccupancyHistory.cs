using System;

namespace MedicalSystem.Domain.Models
{
    public class BedOccupancyHistory
    {
        public Guid Id { get; set; }
        public Guid BedId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime AdmittedAt { get; set; }
        public DateTime? DischargedAt { get; set; }

        public virtual HospitalBed Bed { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
