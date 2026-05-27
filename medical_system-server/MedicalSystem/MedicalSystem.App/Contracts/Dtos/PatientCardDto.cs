using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class PatientCardDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string MedcardNum { get; set; }
        public string DoctorName { get; set; }
        // ... и другие поля для карточки пациента
    }
}
