using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.Domain.Models
{
    public class MedicalStaff
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "ФИО сотрудника обязательно для заполнения")]
        [StringLength(200, ErrorMessage = "Длина ФИО не должна превышать 200 символов")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Пожалуйста, укажите должность")]
        [StringLength(100, ErrorMessage = "Длина должности не должна превышать 100 символов")]
        public string Position { get; set; }

        
        public virtual ICollection<Patient> Patients { get; set; }
        public virtual ICollection<Encounter> Encounters { get; set; }
        public virtual ICollection<PatientMedication> PatientMedications { get; set; }
        public virtual ICollection<LabResult> LabResults { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<BedActionLog> BedActionLogs { get; set; }
        public virtual ICollection<Medicine> Medicines { get; set; }
        public virtual ICollection<MedicineOperationLog> MedicineOperationLogs { get; set; }
        public virtual ICollection<Shift> Shifts { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
