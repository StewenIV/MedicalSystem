using System;
using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class RoomConfigDto
    {
        public Dictionary<string, GenderConfig> Rooms { get; set; } = new();
    }

    public class GenderConfig
    {
        public string Gender { get; set; }
        public int Priority { get; set; }
    }

    public class FloorsDto
    {
        public List<int> Floors { get; set; } = new();
    }

    public class AlertsDto
    {
        public List<AlertBedDto> Urgent { get; set; } = new();
        public List<AlertBedDto> Attention { get; set; } = new();
    }

    public class AlertBedDto
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; }
        public string PatientLastName { get; set; }
    }

    public class UpdateBedStatusRequest
    {
        public string Status { get; set; }
        public string? AttentionNote { get; set; }
    }

    public class AdmitPatientRequest
    {
        public Guid PatientId { get; set; }
        public string Diagnosis { get; set; }
        public Guid DoctorId { get; set; }
        public DateTime AdmissionDate { get; set; }
    }
}
