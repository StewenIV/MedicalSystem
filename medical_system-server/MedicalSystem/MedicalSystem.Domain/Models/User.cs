using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Login { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = string.Empty;

        [StringLength(200)]
        public string? DisplayName { get; set; }

        public Guid? MedicalStaffId { get; set; }

        public virtual MedicalStaff? MedicalStaff { get; set; }

        public Guid? PatientId { get; set; }

        public virtual Patient? Patient { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
