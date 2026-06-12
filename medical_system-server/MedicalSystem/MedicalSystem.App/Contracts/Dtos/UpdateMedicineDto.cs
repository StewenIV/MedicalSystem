namespace MedicalSystem.App.Contracts.Dtos
{
    public class UpdateMedicineDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public decimal CurrentBalance { get; set; }
        public decimal MinBalance { get; set; }
    }
}
