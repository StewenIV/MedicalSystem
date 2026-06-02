namespace MedicalSystem.API.DTOs
{
    public class HistoryEntryDTO
    {
        public string DateTime { get; set; }
        public string Type { get; set; }
        public string Doctor { get; set; }
        public string Complaints { get; set; }
        public string Objective { get; set; }
        public string Conclusion { get; set; }
        public string Recommendations { get; set; }
    }
}
