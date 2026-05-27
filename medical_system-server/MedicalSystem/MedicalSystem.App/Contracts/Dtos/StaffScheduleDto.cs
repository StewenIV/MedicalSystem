using System;
using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class StaffScheduleDto
    {
        public Guid StaffId { get; set; }
        public string StaffName { get; set; }
        public Dictionary<int, string> Schedule { get; set; } // Day -> ShiftType
    }
}
