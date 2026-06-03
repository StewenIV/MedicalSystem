using System.Text.Json.Serialization;

namespace MedicalSystem.Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum BedStatus
    {
        Stable,
        Attention,
        Urgent,
        Free
    }
}
