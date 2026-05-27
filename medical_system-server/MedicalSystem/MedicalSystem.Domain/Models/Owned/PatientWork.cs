using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models.Owned
{
    public class PatientWork
    {
        [StringLength(150)]
        public string? Profession { get; set; }

        [StringLength(200)]
        public string? Organization { get; set; }

        [StringLength(300)]
        public string? Address { get; set; }
    }
}
