namespace MedicalSystem.API.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? PatientId { get; set; }
    }
}
