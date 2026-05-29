namespace MedicalSystem.App.Contracts.Dtos
{
    public class VitalSignWarningDto
    {
        public string  FieldName  { get; set; } = string.Empty;
        public string? Value      { get; set; }
        public string  Direction  { get; set; } = string.Empty;
    }
}
