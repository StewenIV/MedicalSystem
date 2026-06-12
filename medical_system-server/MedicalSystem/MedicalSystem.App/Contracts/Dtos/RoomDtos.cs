using System;
using System.Collections.Generic;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class RoomListItemDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; }
        public int Floor { get; set; }
        public RoomType Type { get; set; }
        public RoomGender Gender { get; set; }
        public RoomPriority Priority { get; set; }
        public int BedsCount { get; set; }
        public int OccupiedBedsCount { get; set; }
        public int FreeBedsCount { get; set; }
    }

    public class RoomDetailsDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; }
        public int Floor { get; set; }
        public RoomType Type { get; set; }
        public RoomGender Gender { get; set; }
        public RoomPriority Priority { get; set; }
        public List<BedDto> Beds { get; set; } = new List<BedDto>();
    }

    public class UpdateRoomBedDto
    {
        public Guid? Id { get; set; }
        public bool IsNew { get; set; }
    }

    public class CreateRoomDto
    {
        public string Number { get; set; }
        public int Floor { get; set; }
        public RoomType Type { get; set; }
        public RoomGender Gender { get; set; }
        public RoomPriority Priority { get; set; }
        public List<UpdateRoomBedDto> Beds { get; set; } = new List<UpdateRoomBedDto>();
    }

    public class UpdateRoomDto
    {
        public Guid RoomId { get; set; }
        public string Number { get; set; }
        public int Floor { get; set; }
        public RoomType Type { get; set; }
        public RoomGender Gender { get; set; }
        public RoomPriority Priority { get; set; }
        public List<UpdateRoomBedDto> Beds { get; set; } = new List<UpdateRoomBedDto>();
    }
}
