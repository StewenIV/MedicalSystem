namespace MedicalSystem.API.DTOs
{
    public class MedicalProblemDTO
    {
        public string Name { get; set; }
        public string DiagnosisDate { get; set; }
        public string DiseaseStatus { get; set; }
        public string Severity { get; set; }
        public string Description { get; set; }
        public string Complications { get; set; }
    }
}
