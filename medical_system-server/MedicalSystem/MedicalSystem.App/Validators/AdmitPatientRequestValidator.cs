using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    public class AdmitPatientRequestValidator : AbstractValidator<AdmitPatientRequest>
    {
        public AdmitPatientRequestValidator()
        {
            RuleFor(x => x.PatientId)
                .NotEmpty()
                .WithMessage("Идентификатор пациента обязателен.");

            RuleFor(x => x.DoctorId)
                .NotEmpty()
                .WithMessage("Идентификатор лечащего врача обязателен.");

            RuleFor(x => x.Diagnosis)
                .NotNull()
                .NotEmpty()
                .WithMessage("Диагноз при поступлении обязателен.")
                .MaximumLength(500)
                .WithMessage("Диагноз не должен превышать 500 символов.");

            RuleFor(x => x.AdmissionDate)
                .NotEmpty()
                .WithMessage("Дата поступления обязательна.")
                .LessThanOrEqualTo(DateTime.UtcNow.AddHours(1))
                .WithMessage("Дата поступления не может быть в будущем более чем на 1 час.")
                .GreaterThan(new DateTime(1900, 1, 1))
                .WithMessage("Дата поступления указана некорректно.");
        }
    }
}
