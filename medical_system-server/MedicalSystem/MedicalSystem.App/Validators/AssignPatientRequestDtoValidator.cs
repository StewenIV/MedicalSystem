using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    public class AssignPatientRequestDtoValidator : AbstractValidator<AssignPatientRequestDto>
    {
        public AssignPatientRequestDtoValidator()
        {
            RuleFor(x => x.BedId)
                .NotEmpty()
                .WithMessage("Идентификатор койки обязателен.");

            RuleFor(x => x.PatientId)
                .NotEmpty()
                .WithMessage("Идентификатор пациента обязателен.");

            RuleFor(x => x.AdmissionDateTime)
                .NotEmpty()
                .WithMessage("Дата и время госпитализации обязательны.")
                .LessThanOrEqualTo(DateTime.UtcNow.AddHours(1))
                .WithMessage("Дата госпитализации не может быть в будущем более чем на 1 час.")
                .GreaterThan(new DateTime(1900, 1, 1))
                .WithMessage("Дата госпитализации указана некорректно.");

            RuleFor(x => x.Notes)
                .MaximumLength(1000)
                .WithMessage("Примечания не должны превышать 1000 символов.");
        }
    }
}
