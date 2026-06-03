using System;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class AssignPatientRequestDto
    {
        public Guid BedId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime AdmissionDateTime { get; set; }
        public string? Notes { get; set; }
        public Guid DoctorId { get; set; }
    }

    public class TransferBedRequestDto
    {
        public Guid FromBedId { get; set; }
        public Guid ToBedId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime TransferDateTime { get; set; }
        public string? Notes { get; set; }
    }

    public class PatientSearchItemDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? MiddleName { get; set; }
        public Gender Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string NumberCard { get; set; }
        public int Age { get; set; }
    }

    public class DoctorSelectItemDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string? Position { get; set; }
        public string? Department { get; set; }
    }
}
