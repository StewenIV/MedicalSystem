using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class PatientLookupDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string? RoomAndBed { get; set; }
    }
}
