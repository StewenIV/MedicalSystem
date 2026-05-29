namespace MedicalSystem.App.Contracts.Dtos
{
    /// <summary>
    /// Тренд одного показателя между двумя последними замерами.
    /// Direction: "up" | "down" | "stable".
    /// </summary>
    public class VitalSignTrendDto
    {
        public string FieldName  { get; set; } = string.Empty;
        public string Direction  { get; set; } = "stable";
    }
}
