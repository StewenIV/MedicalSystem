using System;
using System.Text.Json.Serialization;

namespace MedicalSystem.Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RoomType
    {
        Ordinary = 0,
        Reanimation = 1,
        Isolator = 2
    }
}
