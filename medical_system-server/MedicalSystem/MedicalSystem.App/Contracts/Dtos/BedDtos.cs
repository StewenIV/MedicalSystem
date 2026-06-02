using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class FreeBedRequestDto
    {
        public string Reason { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateBedNoteRequestDto
    {
        public string Note { get; set; }
    }
}
