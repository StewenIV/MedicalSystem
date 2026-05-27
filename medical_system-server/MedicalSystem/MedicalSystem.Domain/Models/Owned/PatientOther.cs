using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models.Owned
{
    public class PatientOther
    {
        [StringLength(50)]
        public string? Language { get; set; }

        [StringLength(100)]
        public string? Nationality { get; set; }

        public DateTime? DateOfDeath { get; set; }

        [StringLength(500)]
        public string? CauseOfDeath { get; set; }
    }
}
