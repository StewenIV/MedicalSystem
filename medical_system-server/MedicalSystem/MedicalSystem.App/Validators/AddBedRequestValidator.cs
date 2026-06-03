using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    public class AddBedRequestDtoValidator : AbstractValidator<AddBedRequestDto>
    {
        public AddBedRequestDtoValidator()
        {
            RuleFor(x => x.RoomId)
                .NotEmpty()
                .WithMessage("Идентификатор палаты обязателен.");

            // Номер койки — порядковый номер в рамках палаты, нижняя граница — 1
            RuleFor(x => x.BedNumber)
                .GreaterThan(0)
                .WithMessage("Номер койки должен быть больше 0.");

            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Указан недопустимый статус койки.");
        }
    }
}
