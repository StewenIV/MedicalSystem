namespace MedicalSystem.API.DTOs
{
    public class PatientShortDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string DateOfBirth { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Doctor { get; set; }
        public string Department { get; set; }
        public string Status { get; set; }
        public string StatusText { get; set; }
        public string MedcardNum { get; set; }
        public string HistoryNum { get; set; }
        public string Room { get; set; }
        public List<string> ActiveProblems { get; set; }
    }
}
