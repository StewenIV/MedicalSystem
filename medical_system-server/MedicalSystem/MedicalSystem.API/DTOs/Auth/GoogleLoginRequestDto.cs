using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.API.DTOs.Auth
{
    public class GoogleLoginRequestDto
    {
        [Required(ErrorMessage = "Токен доступа Google обязателен")]
        public string AccessToken { get; set; } = string.Empty;
    }
}
