using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    public class CreateRoomDtoValidator : AbstractValidator<CreateRoomDto>
    {
        public CreateRoomDtoValidator()
        {
            // RoomNumber: макс 10 символов — соответствует HasMaxLength(10) в RoomConfiguration
            // Номер может быть вида "ထထထ": первая цифра — этаж, остальные — порядковый номер палаты
            RuleFor(x => x.Number)
                .NotNull()
                .NotEmpty()
                .WithMessage("Номер палаты обязателен.")
                .MaximumLength(10)
                .WithMessage("Номер палаты не должен превышать 10 символов.")
                .Matches(@"^[A-Za-zА-Яа-яееÖÄÜöäü0-9\-/\s]+$")
                .WithMessage("Номер палаты содержит недопустимые символы.");

            // Этаж: в БД нет ограничения, но практическое здание больницы имеет не больше 50 этажей
            RuleFor(x => x.Floor)
                .GreaterThan(0)
                .WithMessage("Этаж должен быть больше 0.")
                .LessThanOrEqualTo(50)
                .WithMessage("Этаж не должен превышать 50.");

            RuleFor(x => x.Type)
                .IsInEnum()
                .WithMessage("Указан недопустимый тип палаты.");

            RuleFor(x => x.Gender)
                .IsInEnum()
                .WithMessage("Указан недопустимый тип гендерного назначения палаты.");

            RuleFor(x => x.Priority)
                .IsInEnum()
                .WithMessage("Указан недопустимый приоритет палаты.");

            RuleFor(x => x.Beds)
                .NotNull()
                .WithMessage("Список коек не может быть null.");
        }
    }
}
