using FluentValidation;
using MedicalSystem.App.Contracts.Dtos;
using PhoneNumbers;

namespace MedicalSystem.App.Validators
{
    public class UpdatePatientGeneralInfoDtoValidator : AbstractValidator<UpdatePatientGeneralInfoDto>
    {
        public UpdatePatientGeneralInfoDtoValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("Имя обязательно").MaximumLength(100);
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Фамилия обязательна").MaximumLength(100);
            RuleFor(x => x.MiddleName).MaximumLength(100);
            RuleFor(x => x.DateOfBirth).NotEmpty().WithMessage("Дата рождения обязательна");
            RuleFor(x => x.Gender).IsInEnum().WithMessage("Некорректный пол");
            RuleFor(x => x.MaritalStatus).MaximumLength(50);
        }
    }

    public class UpdatePatientPassportDtoValidator : AbstractValidator<UpdatePatientPassportDto>
    {
        public UpdatePatientPassportDtoValidator()
        {
            RuleFor(x => x.SeriesNumber).MaximumLength(50);
            RuleFor(x => x.IssuedBy).MaximumLength(200);
        }
    }

    public class UpdatePatientOtherDtoValidator : AbstractValidator<UpdatePatientOtherDto>
    {
        public UpdatePatientOtherDtoValidator()
        {
            RuleFor(x => x.Language).MaximumLength(50);
            RuleFor(x => x.Nationality).MaximumLength(50);
            RuleFor(x => x.CauseOfDeath).MaximumLength(200);
        }
    }

    public class UpdatePatientWorkDtoValidator : AbstractValidator<UpdatePatientWorkDto>
    {
        public UpdatePatientWorkDtoValidator()
        {
            RuleFor(x => x.Profession).MaximumLength(100);
            RuleFor(x => x.Organization).MaximumLength(200);
            RuleFor(x => x.Address).MaximumLength(500);
        }
    }

    public class UpdatePatientRelativeDtoValidator : AbstractValidator<UpdatePatientRelativeDto>
    {
        public UpdatePatientRelativeDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Имя обязательно").MaximumLength(200);
            RuleFor(x => x.Relation).MaximumLength(100);
            RuleFor(x => x.Phone)
                .Must(phone =>
                {
                    if (string.IsNullOrWhiteSpace(phone)) return true;
                    var util = PhoneNumberUtil.GetInstance();
                    try { return util.IsValidNumber(util.Parse(phone, null)); }
                    catch { return false; }
                })
                .WithMessage("Введите корректный международный номер телефона");
        }
    }

    public class UpdatePatientContactsDtoValidator : AbstractValidator<UpdatePatientContactsDto>
    {
        public UpdatePatientContactsDtoValidator()
        {
            RuleFor(x => x.PhoneMobile)
                .Must(phone =>
                {
                    if (string.IsNullOrWhiteSpace(phone))
                        return true;

                    var util = PhoneNumberUtil.GetInstance();

                    try
                    {
                        var parsed = util.Parse(phone, null);
                        return util.IsValidNumber(parsed);
                    }
                    catch
                    {
                        return false;
                    }
                })
                .WithMessage("Введите корректный международный номер телефона");
            
            RuleFor(x => x.Email)
                .EmailAddress()
                .WithMessage("Введите корректный адрес электронной почты")
                .MaximumLength(200)
                .WithMessage("Email не должен превышать 200 символов")
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.Address)
                .MaximumLength(500)
                .WithMessage("Адрес не должен превышать 500 символов")
                .When(x => !string.IsNullOrWhiteSpace(x.Address));

            RuleFor(x => x.City)
                .MaximumLength(100)
                .WithMessage("Название города не должно превышать 100 символов")
                .When(x => !string.IsNullOrWhiteSpace(x.City));

            RuleFor(x => x.Country)
                .MaximumLength(100)
                .When(x => !string.IsNullOrWhiteSpace(x.Country));

            RuleFor(x => x.Region)
                .MaximumLength(100)
                .When(x => !string.IsNullOrWhiteSpace(x.Region));

            RuleFor(x => x.Zip)
                .MaximumLength(20)
                .When(x => !string.IsNullOrWhiteSpace(x.Zip));

            RuleFor(x => x.PhoneHome)
                .Must(phone =>
                {
                    if (string.IsNullOrWhiteSpace(phone)) return true;
                    var util = PhoneNumberUtil.GetInstance();
                    try { return util.IsValidNumber(util.Parse(phone, null)); }
                    catch { return false; }
                })
                .WithMessage("Введите корректный международный номер телефона")
                .When(x => !string.IsNullOrWhiteSpace(x.PhoneHome));
        }
    }

    public class UpdateTrustedPersonDtoValidator : AbstractValidator<UpdateTrustedPersonDto>
    {
        public UpdateTrustedPersonDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Имя доверенного лица обязательно")
                .MinimumLength(2).WithMessage("Имя должно содержать не менее 2 символов")
                .MaximumLength(200).WithMessage("Имя не должно превышать 200 символов");

            RuleFor(x => x.Phone)
                .Must(phone =>
                {
                    if (string.IsNullOrWhiteSpace(phone))
                        return true;

                    var util = PhoneNumberUtil.GetInstance();

                    try
                    {
                        var parsed = util.Parse(phone, null);
                        return util.IsValidNumber(parsed);
                    }
                    catch
                    {
                        return false;
                    }
                })
                .WithMessage("Введите корректный международный номер телефона");

            RuleFor(x => x.Relation)
                .MaximumLength(100)
                .WithMessage("Степень родства не должна превышать 100 символов")
                .When(x => !string.IsNullOrWhiteSpace(x.Relation));
        }
    }

    public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordDtoValidator()
        {
            RuleFor(x => x.OldPassword)
                .NotEmpty().WithMessage("Введите текущий пароль");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("Введите новый пароль")
                .MinimumLength(8).WithMessage("Пароль должен содержать не менее 8 символов")
                .Matches("[A-Z]").WithMessage("Пароль должен содержать хотя бы одну заглавную букву")
                .Matches("[0-9]").WithMessage("Пароль должен содержать хотя бы одну цифру");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Подтвердите новый пароль")
                .Equal(x => x.NewPassword).WithMessage("Пароли не совпадают");
        }
    }
}
