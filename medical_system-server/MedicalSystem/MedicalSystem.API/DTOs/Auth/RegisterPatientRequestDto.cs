using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.API.DTOs.Auth
{
    public class RegisterPatientRequestDto
    {
        [Required(ErrorMessage = "Фамилия обязательна")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Имя обязательно")]
        public string FirstName { get; set; } = string.Empty;

        public string? MiddleName { get; set; }

        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Некорректный email")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Дата рождения обязательна")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Телефон обязателен")]
        public string Phone { get; set; } = string.Empty;
    }
}
