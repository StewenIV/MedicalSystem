using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Validators
{
    public class UpdateBedNoteRequestDtoValidator : AbstractValidator<UpdateBedNoteRequestDto>
    {
        public UpdateBedNoteRequestDtoValidator()
        {
            RuleFor(x => x.Note)
                .NotNull()
                .NotEmpty()
                .WithMessage("Текст заметки обязателен.")
                .MaximumLength(1000)
                .WithMessage("Заметка не должна превышать 1000 символов.");
        }
    }
}
