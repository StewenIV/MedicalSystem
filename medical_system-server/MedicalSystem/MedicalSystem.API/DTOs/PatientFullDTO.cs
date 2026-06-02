namespace MedicalSystem.API.DTOs
{
    public class PatientFullDTO : PatientShortDTO
    {
        public string Institution { get; set; }
        public string MaritalStatus { get; set; }
        public string LastUpdated { get; set; }
        public PassportDTO Passport { get; set; }
        public ContactsDTO Contacts { get; set; }
        public OtherDTO Other { get; set; }
        public WorkDTO Work { get; set; }
        public VitalsDTO Vitals { get; set; }
        public List<RelativeDTO> Relatives { get; set; }
        public List<AllergyDTO> Allergies { get; set; }
        public List<MedicationDTO> CurrentMeds { get; set; }
        public List<OperationDTO> Operations { get; set; }
        public List<MedicalProblemDTO> MedicalProblems { get; set; }
        public List<PrescriptionDTO> Prescriptions { get; set; }
        public List<LabDTO> Labs { get; set; }
        public List<VaccineDTO> Vaccines { get; set; }
        public List<DocumentDTO> Documents { get; set; }
        public List<HistoryEntryDTO> History { get; set; }
    }
}
