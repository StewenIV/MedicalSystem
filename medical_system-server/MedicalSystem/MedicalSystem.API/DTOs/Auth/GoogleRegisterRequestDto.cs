using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.API.DTOs.Auth
{
    public class GoogleRegisterRequestDto
    {
        [Required(ErrorMessage = "Токен доступа Google обязателен")]
        public string AccessToken { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пол обязателен")]
        public string Gender { get; set; } = string.Empty; 

        [Required(ErrorMessage = "Дата рождения обязательна")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Телефон обязателен")]
        public string Phone { get; set; } = string.Empty;
    }
}
