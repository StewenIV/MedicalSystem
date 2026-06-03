using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.App.Validators
{
    public class UpdateBedStatusRequestValidator : AbstractValidator<UpdateBedStatusRequest>
    {
        // Допустимые статусы соответствуют значениям enum BedStatus: Stable, Attention, Urgent, Free
        private static readonly string[] ValidStatuses =
            Enum.GetNames(typeof(BedStatus));

        public UpdateBedStatusRequestValidator()
        {
            RuleFor(x => x.Status)
                .NotNull()
                .NotEmpty()
                .WithMessage("Статус койки обязателен.")
                .Must(s => s != null && ValidStatuses.Contains(s, StringComparer.OrdinalIgnoreCase))
                .WithMessage($"Недопустимый статус койки. Допустимые значения: {string.Join(", ", ValidStatuses)}.");

            RuleFor(x => x.AttentionNote)
                .MaximumLength(500)
                .WithMessage("Заметка не должна превышать 500 символов.")
                .When(x => x.AttentionNote != null);
        }
    }
}

