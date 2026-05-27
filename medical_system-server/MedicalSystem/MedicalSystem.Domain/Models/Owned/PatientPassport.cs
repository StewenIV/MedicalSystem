using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models.Owned
{
    public class PatientPassport
    {
        [StringLength(20)]
        public string? SeriesNumber { get; set; }

        [StringLength(300)]
        public string? IssuedBy { get; set; }

        public DateTime? DateIssued { get; set; }
    }
}
