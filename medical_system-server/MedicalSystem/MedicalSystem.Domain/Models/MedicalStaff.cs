using System;
using System.Collections.Generic;

namespace MedicalSystem.Domain.Models
{
    public class MedicalStaff
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid PositionId { get; set; }
        public Guid DepartmentId { get; set; }

        // Navigation properties
        public virtual Position Position { get; set; }
        public virtual Department Department { get; set; }
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
