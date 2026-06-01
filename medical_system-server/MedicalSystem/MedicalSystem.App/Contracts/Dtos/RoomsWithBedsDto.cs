using System;
using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class RoomsWithBedsDto
    {
        public List<RoomWithBedsDto> Rooms { get; set; } = new();
    }

    public class RoomWithBedsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Floor { get; set; }
        public string Gender { get; set; }
        public string Urgency { get; set; }
        public List<BedInRoomDto> Beds { get; set; } = new();
    }

    public class BedInRoomDto
    {
        public Guid Id { get; set; }
        public int BedNumber { get; set; }
        public string Status { get; set; }
        public string? PatientLastName { get; set; }
        public string? PatientName { get; set; }
    }
}
