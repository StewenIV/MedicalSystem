using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    public class FreeBedRequestDtoValidator : AbstractValidator<FreeBedRequestDto>
    {
        // Допустимые причины освобождения койки
        private static readonly string[] ValidReasons =
        {
            "discharge",    // Выписка
            "transfer",     // Перевод
            "death",        // Смерть пациента
            "other"         // Иное
        };

        public FreeBedRequestDtoValidator()
        {
            RuleFor(x => x.Reason)
                .NotNull()
                .NotEmpty()
                .WithMessage("Причина освобождения койки обязательна.")
                .MaximumLength(200)
                .WithMessage("Причина не должна превышать 200 символов.");

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("Дата освобождения койки обязательна.")
                .LessThanOrEqualTo(DateTime.UtcNow.AddHours(1))
                .WithMessage("Дата освобождения не может быть в будущем более чем на 1 час.")
                .GreaterThan(new DateTime(1900, 1, 1))
                .WithMessage("Дата освобождения указана некорректно.");

            RuleFor(x => x.Notes)
                .MaximumLength(1000)
                .WithMessage("Примечания не должны превышать 1000 символов.");
        }
    }
}
