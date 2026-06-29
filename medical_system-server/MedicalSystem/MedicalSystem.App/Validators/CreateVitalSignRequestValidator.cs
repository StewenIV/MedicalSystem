using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    
    
    
    
    public class CreateVitalSignRequestValidator : AbstractValidator<CreateVitalSignRequest>
    {
        public CreateVitalSignRequestValidator()
        {
            
            RuleFor(x => x)
                .Must(x => x.Temperature.HasValue
                           || x.BloodPressureSystolic.HasValue
                           || x.BloodPressureDiastolic.HasValue
                           || x.Pulse.HasValue
                           || x.SpO2.HasValue
                           || x.RespiratoryRate.HasValue)
                .WithMessage("Необходимо указать хотя бы один показатель жизнедеятельности.");

            
            RuleFor(x => x.Temperature)
                .InclusiveBetween(34m, 42m)
                .WithMessage("Температура тела должна быть в диапазоне от 34 до 42 °C.")
                .When(x => x.Temperature.HasValue);

            
            RuleFor(x => x.BloodPressureSystolic)
                .InclusiveBetween((short)70, (short)250)
                .WithMessage("Систолическое давление должно быть в диапазоне от 70 до 250 мм рт. ст.")
                .When(x => x.BloodPressureSystolic.HasValue);

            
            RuleFor(x => x.BloodPressureDiastolic)
                .InclusiveBetween((short)40, (short)150)
                .WithMessage("Диастолическое давление должно быть в диапазоне от 40 до 150 мм рт. ст.")
                .When(x => x.BloodPressureDiastolic.HasValue);

            
            RuleFor(x => x.BloodPressureDiastolic)
                .Must((req, diastolic) => !req.BloodPressureSystolic.HasValue || diastolic < req.BloodPressureSystolic)
                .WithMessage("Диастолическое давление не может быть больше или равно систолическому.")
                .When(x => x.BloodPressureSystolic.HasValue && x.BloodPressureDiastolic.HasValue);

            
            RuleFor(x => x.Pulse)
                .InclusiveBetween((short)40, (short)200)
                .WithMessage("Пульс должен быть в диапазоне от 40 до 200 уд/мин.")
                .When(x => x.Pulse.HasValue);

            
            RuleFor(x => x.SpO2)
                .InclusiveBetween((short)80, (short)100)
                .WithMessage("Сатурация кислорода (SpO₂) должна быть в диапазоне от 80 до 100%.")
                .When(x => x.SpO2.HasValue);

            
            RuleFor(x => x.RespiratoryRate)
                .InclusiveBetween((short)10, (short)30)
                .WithMessage("Частота дыхания должна быть в диапазоне от 10 до 30 вдохов/мин.")
                .When(x => x.RespiratoryRate.HasValue);
        }
    }
}
