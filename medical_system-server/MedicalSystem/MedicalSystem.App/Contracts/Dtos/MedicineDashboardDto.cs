using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class MedicineDashboardDto
    {
        public List<MedicineDto> Medicines { get; set; }
    }

    public class MedicineDto
    {
        public string Name { get; set; }
        public decimal CurrentBalance { get; set; }
        public string Status { get; set; }
    }
}
