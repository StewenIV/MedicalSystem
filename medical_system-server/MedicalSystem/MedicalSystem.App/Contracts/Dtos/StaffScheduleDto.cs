using System;
using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class StaffScheduleDto
    {
        public Guid StaffId { get; set; }
        public string StaffName { get; set; }
        public string StaffPosition { get; set; }
        public string StaffDepartment { get; set; }
        public List<ShiftDto> Schedule { get; set; }
    }

    public class UpdateShiftDto
    {
        public Guid StaffId { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; }
        public short Hours { get; set; }
    }
}
