using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class Allergy
    {
        public Guid Id { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        [Required(ErrorMessage = "Название аллергена обязательно для заполнения")]
        [StringLength(200, ErrorMessage = "Длина названия аллергена не должна превышать 200 символов")]
        public string Name { get; set; }

        [StringLength(300, ErrorMessage = "Длина типа реакции не должна превышать 300 символов")]
        public string? Reaction { get; set; }

        public DateTime? Date { get; set; }

        [StringLength(500, ErrorMessage = "Длина комментария не должна превышать 500 символов")]
        public string? Comment { get; set; }

        
        public virtual Patient Patient { get; set; }
    }
}
