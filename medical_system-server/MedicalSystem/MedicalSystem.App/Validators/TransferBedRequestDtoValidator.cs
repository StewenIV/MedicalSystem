using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    public class TransferBedRequestDtoValidator : AbstractValidator<TransferBedRequestDto>
    {
        public TransferBedRequestDtoValidator()
        {
            RuleFor(x => x.FromBedId)
                .NotEmpty()
                .WithMessage("Идентификатор исходной койки обязателен.");

            RuleFor(x => x.ToBedId)
                .NotEmpty()
                .WithMessage("Идентификатор целевой койки обязателен.")
                .NotEqual(x => x.FromBedId)
                .WithMessage("Нельзя перевести пациента на ту же самую койку.");

            RuleFor(x => x.PatientId)
                .NotEmpty()
                .WithMessage("Идентификатор пациента обязателен.");

            RuleFor(x => x.TransferDateTime)
                .NotEmpty()
                .WithMessage("Дата и время перевода обязательны.")
                .LessThanOrEqualTo(DateTime.UtcNow.AddHours(1))
                .WithMessage("Дата перевода не может быть в будущем более чем на 1 час.")
                .GreaterThan(new DateTime(1900, 1, 1))
                .WithMessage("Дата перевода указана некорректно.");

            RuleFor(x => x.Notes)
                .MaximumLength(1000)
                .WithMessage("Примечания не должны превышать 1000 символов.");
        }
    }
}
