using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class CreateEncounterRequest
    {
        public DateTime DateTime { get; set; }
        public string Type { get; set; }
        public string Conclusion { get; set; }
        public string? Complaints { get; set; }
        public string? Objective { get; set; }
        public string? Recommendations { get; set; }
        public string? FormData { get; set; }
    }
}
