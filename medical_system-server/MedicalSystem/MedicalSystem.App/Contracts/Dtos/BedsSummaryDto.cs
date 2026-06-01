using System;
using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class BedsSummaryDto
    {
        public List<BedDto> Beds { get; set; } = new();
        public BedStatsDto Stats { get; set; } = new();
    }

    public class BedDto
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; }
        public int BedNumber { get; set; }
        public string Status { get; set; }
        public Guid? PatientId { get; set; }
        public string? PatientName { get; set; }
        public string? PatientLastName { get; set; }
        public string? PatientMiddleName { get; set; }
        public int? PatientAge { get; set; }
        public string? Diagnosis { get; set; }
        public string? DoctorName { get; set; }
        public string? DoctorRole { get; set; }
        public DateTime? AdmissionDate { get; set; }
        public string? BedNote { get; set; }
    }

    public class BedStatsDto
    {
        public int Total { get; set; }
        public int Occupied { get; set; }
        public int Free { get; set; }
        public int OccupancyPct { get; set; }
        public int TodayAdmissions { get; set; }
        public int TodayDischarges { get; set; }
        public int OccupancyDelta { get; set; }
        public int FreeDeltaPct { get; set; }
    }
}
