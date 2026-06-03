using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    /// <summary>
    /// Валидатор для запроса на добавление показателей жизнедеятельности пациента.
    /// Диапазоны значений соответствуют клинически допустимым пределам.
    /// </summary>
    public class CreateVitalSignRequestValidator : AbstractValidator<CreateVitalSignRequest>
    {
        public CreateVitalSignRequestValidator()
        {
            // Хотя бы один показатель должен быть заполнен
            RuleFor(x => x)
                .Must(x => x.Temperature.HasValue
                           || x.BloodPressureSystolic.HasValue
                           || x.BloodPressureDiastolic.HasValue
                           || x.Pulse.HasValue
                           || x.SpO2.HasValue
                           || x.RespiratoryRate.HasValue)
                .WithMessage("Необходимо указать хотя бы один показатель жизнедеятельности.");

            // Температура тела: 34–42 °C
            RuleFor(x => x.Temperature)
                .InclusiveBetween(34m, 42m)
                .WithMessage("Температура тела должна быть в диапазоне от 34 до 42 °C.")
                .When(x => x.Temperature.HasValue);

            // Систолическое давление: 70–250 мм рт. ст.
            RuleFor(x => x.BloodPressureSystolic)
                .InclusiveBetween((short)70, (short)250)
                .WithMessage("Систолическое давление должно быть в диапазоне от 70 до 250 мм рт. ст.")
                .When(x => x.BloodPressureSystolic.HasValue);

            // Диастолическое давление: 40–150 мм рт. ст.
            RuleFor(x => x.BloodPressureDiastolic)
                .InclusiveBetween((short)40, (short)150)
                .WithMessage("Диастолическое давление должно быть в диапазоне от 40 до 150 мм рт. ст.")
                .When(x => x.BloodPressureDiastolic.HasValue);

            // Диастолическое давление не должно быть выше систолического
            RuleFor(x => x.BloodPressureDiastolic)
                .Must((req, diastolic) => !req.BloodPressureSystolic.HasValue || diastolic < req.BloodPressureSystolic)
                .WithMessage("Диастолическое давление не может быть больше или равно систолическому.")
                .When(x => x.BloodPressureSystolic.HasValue && x.BloodPressureDiastolic.HasValue);

            // Пульс: 40–200 уд/мин
            RuleFor(x => x.Pulse)
                .InclusiveBetween((short)40, (short)200)
                .WithMessage("Пульс должен быть в диапазоне от 40 до 200 уд/мин.")
                .When(x => x.Pulse.HasValue);

            // Сатурация кислорода: 80–100%
            RuleFor(x => x.SpO2)
                .InclusiveBetween((short)80, (short)100)
                .WithMessage("Сатурация кислорода (SpO₂) должна быть в диапазоне от 80 до 100%.")
                .When(x => x.SpO2.HasValue);

            // Частота дыхания: 10–30 вдохов/мин
            RuleFor(x => x.RespiratoryRate)
                .InclusiveBetween((short)10, (short)30)
                .WithMessage("Частота дыхания должна быть в диапазоне от 10 до 30 вдохов/мин.")
                .When(x => x.RespiratoryRate.HasValue);
        }
    }
}
