using System;
using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class PatientDetailsDto
    {
        public string DoctorNote { get; set; }
        public List<BedPrescriptionDto> Prescriptions { get; set; } = new();
        public List<MedicationInStockDto> Meds { get; set; } = new();
        public List<ActionLogDto> Log { get; set; } = new();
    }

    public class BedPrescriptionDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Dose { get; set; }
        public string Time { get; set; }
        public bool Done { get; set; }
    }

    public class MedicationInStockDto
    {
        public string Name { get; set; }
        public string Qty { get; set; }
    }

    public class ActionLogDto
    {
        public string Who { get; set; }
        public string Action { get; set; }
        public string Time { get; set; }
        public string Amount { get; set; }
    }
}
