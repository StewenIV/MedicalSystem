using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models.Owned; // Добавляем using

namespace MedicalSystem.Domain.Models
{
    public class Patient
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Имя обязательно для заполнения")]
        [StringLength(100, ErrorMessage = "Длина имени не должна превышать 100 символов")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Фамилия обязательна для заполнения")]
        [StringLength(100, ErrorMessage = "Длина фамилии не должна превышать 100 символов")]
        public string LastName { get; set; }

        [StringLength(100, ErrorMessage = "Длина отчества не должна превышать 100 символов")]
        public string? MiddleName { get; set; }

        [Required(ErrorMessage = "Пол обязателен для выбора")]
        public Gender Gender { get; set; }

        [Required(ErrorMessage = "Дата рождения обязательна для заполнения")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Номер медкарты обязателен для заполнения")]
        [StringLength(50, ErrorMessage = "Длина номера медкарты не должна превышать 50 символов")]
        public string MedcardNum { get; set; }

        [StringLength(50, ErrorMessage = "Длина номера истории болезни не должна превышать 50 символов")]
        public string? HistoryNum { get; set; }

        [Required(ErrorMessage = "Статус пациента обязателен для выбора")]
        public PatientStatus Status { get; set; }

        [StringLength(50, ErrorMessage = "Длина семейного положения не должна превышать 50 символов")]
        public string? MaritalStatus { get; set; }

        public Guid? DoctorId { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid? InstitutionId { get; set; }

        [Required]
        public DateTime LastUpdated { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        // Owned Entities
        public PatientContacts Contacts { get; set; } = new PatientContacts();
        public PatientPassport Passport { get; set; } = new PatientPassport();
        public PatientWork Work { get; set; } = new PatientWork();
        public PatientOther Other { get; set; } = new PatientOther();

        // Navigation properties
        public virtual MedicalStaff Doctor { get; set; }
        public virtual Department Department { get; set; }
        public virtual Institution Institution { get; set; }
        public virtual ICollection<PatientRelative> PatientRelatives { get; set; }
        public virtual ICollection<Allergy> Allergies { get; set; }
        public virtual ICollection<MedicalProblem> MedicalProblems { get; set; }
        public virtual ICollection<Encounter> Encounters { get; set; }
        public virtual ICollection<PatientMedication> PatientMedications { get; set; }
        public virtual ICollection<LabResult> LabResults { get; set; }
        public virtual ICollection<Operation> Operations { get; set; }
        public virtual ICollection<Vaccine> Vaccines { get; set; }
        public virtual ICollection<PatientDocument> PatientDocuments { get; set; }
        public virtual ICollection<VitalSign> VitalSigns { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<BedPrescription> BedPrescriptions { get; set; }
        public virtual ICollection<BedActionLog> BedActionLogs { get; set; }
        public virtual ICollection<MedicineOperationLog> MedicineOperationLogs { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
