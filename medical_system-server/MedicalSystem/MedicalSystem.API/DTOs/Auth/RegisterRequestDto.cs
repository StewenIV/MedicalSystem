namespace MedicalSystem.API.DTOs.Auth
{
    public class RegisterRequestDto
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public Guid? MedicalStaffId { get; set; }
    }
}
