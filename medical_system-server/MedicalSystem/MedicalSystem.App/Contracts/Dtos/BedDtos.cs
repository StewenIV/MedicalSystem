using System;
using MedicalSystem.Domain.Enums;

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

    public class AddBedRequestDto
    {
        public Guid RoomId { get; set; }
        public int BedNumber { get; set; }
        public BedStatus Status { get; set; } = BedStatus.Free;
    }
}
