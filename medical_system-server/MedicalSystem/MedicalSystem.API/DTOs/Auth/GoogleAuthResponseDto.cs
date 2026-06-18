namespace MedicalSystem.API.DTOs.Auth
{
    public class GoogleAuthResponseDto
    {
        public bool IsNewUser { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public string? Token { get; set; }
        public string? Role { get; set; }
        public string? UserId { get; set; }
        public string? Login { get; set; }
        public string? DisplayName { get; set; }
        public string? PatientId { get; set; }
    }
}
