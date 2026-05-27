using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class PatientListDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Status { get; set; }
    }
}
