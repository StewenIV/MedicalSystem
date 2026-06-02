namespace MedicalSystem.API.DTOs
{
    public class CreateVitalSignDTO
    {
        public string Date { get; set; }
        public double Temperature { get; set; }
        public int BloodPressureSystolic { get; set; }
        public int BloodPressureDiastolic { get; set; }
        public int Pulse { get; set; }
        public int Spo2 { get; set; }
        public int RespiratoryRate { get; set; }
    }
}
