namespace MedicalSystem.API.DTOs
{
    public class PrescriptionDTO
    {
        public System.Guid? MedicineId { get; set; }
        public string Drug { get; set; }
        public string Dose { get; set; }
        public string Form { get; set; }
        public string Route { get; set; }
        public string Regimen { get; set; }
        public string DateStart { get; set; }
        public string DateEnd { get; set; }
        public string Doctor { get; set; }
        public string Comment { get; set; }
    }
}
