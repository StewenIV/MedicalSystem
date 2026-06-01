using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class BedPrescription
    {
        public Guid Id { get; set; }
        [Required]
        public Guid PatientId { get; set; }
        public Guid? PatientMedicationId { get; set; }
        [Required]
        [StringLength(200)]
        public string Name { get; set; }
        [StringLength(50)]
        public string? Dose { get; set; }
        public TimeSpan? ScheduledTime { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public bool IsDone { get; set; }
        public DateTime? DoneAt { get; set; }
        [StringLength(100)]
        public string? DoneBy { get; set; }
        
        public virtual Patient Patient { get; set; }
        public virtual PatientMedication PatientMedication { get; set; }
    }
}
