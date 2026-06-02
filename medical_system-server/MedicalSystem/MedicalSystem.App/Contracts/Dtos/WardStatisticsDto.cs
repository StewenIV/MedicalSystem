using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class WardStatisticsDto
    {
        public int TotalRooms { get; set; }
        public int TotalBeds { get; set; }
        public int OccupiedBeds { get; set; }
        public int FreeBeds { get; set; }
        public Dictionary<string, int> RoomsByType { get; set; } = new Dictionary<string, int>();
        public Dictionary<int, int> RoomsByFloor { get; set; } = new Dictionary<int, int>();
    }
}
