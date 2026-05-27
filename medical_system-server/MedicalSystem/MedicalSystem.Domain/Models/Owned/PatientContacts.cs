using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models.Owned
{
    public class PatientContacts
    {
        [StringLength(20)]
        [Phone]
        public string? PhoneMobile { get; set; }

        [StringLength(20)]
        [Phone]
        public string? PhoneHome { get; set; }

        [StringLength(150)]
        [EmailAddress]
        public string? Email { get; set; }

        [StringLength(300)]
        public string? Address { get; set; }

        [StringLength(10)]
        public string? Zip { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(100)]
        public string? Region { get; set; }

        [StringLength(100)]
        public string? City { get; set; }
    }
}
