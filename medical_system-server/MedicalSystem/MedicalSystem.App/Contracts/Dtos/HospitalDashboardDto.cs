using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class HospitalDashboardDto
    {
        public List<RoomDto> Rooms { get; set; }
    }

    public class RoomDto
    {
        public string RoomNumber { get; set; }
        public List<BedDto> Beds { get; set; }
    }

    public class BedDto
    {
        public int BedNumber { get; set; }
        public string PatientName { get; set; }
        public string Status { get; set; }
    }
}
