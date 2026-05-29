namespace MedicalSystem.App.Contracts.Dtos
{
    /// <summary>
    /// Предупреждение по одному показателю последнего замера.
    /// Direction: "high" — выше нормы, "low" — ниже нормы.
    /// </summary>
    public class VitalSignWarningDto
    {
        public string  FieldName  { get; set; } = string.Empty;
        public string? Value      { get; set; }
        public string  Direction  { get; set; } = string.Empty;
    }
}
