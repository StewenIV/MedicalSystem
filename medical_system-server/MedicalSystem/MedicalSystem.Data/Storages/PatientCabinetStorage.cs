using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Domain.Models;
using Microsoft.EntityFrameworkCore;
using BC = BCrypt.Net.BCrypt;

namespace MedicalSystem.Data.Storages
{
    public class PatientCabinetStorage : IPatientCabinetStorage
    {
        private readonly MedicalSystemDbContext _context;

        public PatientCabinetStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task UpdateGeneralInfoAsync(Guid patientId, UpdatePatientGeneralInfoDto dto, CancellationToken token)
        {
            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient == null) throw new InvalidOperationException("Пациент не найден.");

            patient.FirstName = dto.FirstName;
            patient.LastName = dto.LastName;
            patient.MiddleName = dto.MiddleName;
            if (dto.DateOfBirth != default) patient.DateOfBirth = dto.DateOfBirth.ToUniversalTime();
            patient.Gender = dto.Gender;
            patient.MaritalStatus = dto.MaritalStatus;
            
            patient.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync(token);
        }

        public async Task UpdatePassportAsync(Guid patientId, UpdatePatientPassportDto dto, CancellationToken token)
        {
            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient == null) throw new InvalidOperationException("Пациент не найден.");

            patient.Passport.SeriesNumber = dto.SeriesNumber;
            patient.Passport.IssuedBy = dto.IssuedBy;
            patient.Passport.DateIssued = dto.DateIssued?.ToUniversalTime();

            patient.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync(token);
        }

        public async Task UpdateOtherAsync(Guid patientId, UpdatePatientOtherDto dto, CancellationToken token)
        {
            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient == null) throw new InvalidOperationException("Пациент не найден.");

            patient.Other.Language = dto.Language;
            patient.Other.Nationality = dto.Nationality;
            patient.Other.DateOfDeath = dto.DateOfDeath?.ToUniversalTime();
            patient.Other.CauseOfDeath = dto.CauseOfDeath;

            patient.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync(token);
        }

        public async Task UpdateWorkAsync(Guid patientId, UpdatePatientWorkDto dto, CancellationToken token)
        {
            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient == null) throw new InvalidOperationException("Пациент не найден.");

            patient.Work.Profession = dto.Profession;
            patient.Work.Organization = dto.Organization;
            patient.Work.Address = dto.Address;

            patient.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync(token);
        }

        public async Task UpdateContactsAsync(Guid patientId, UpdatePatientContactsDto dto, CancellationToken token)
        {
            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient == null)
                throw new InvalidOperationException("Пациент не найден.");

            if (dto.PhoneMobile != null) patient.Contacts.PhoneMobile = dto.PhoneMobile;
            if (dto.PhoneHome != null) patient.Contacts.PhoneHome = dto.PhoneHome;
            if (dto.Email != null) patient.Contacts.Email = dto.Email;
            if (dto.Address != null) patient.Contacts.Address = dto.Address;
            if (dto.City != null) patient.Contacts.City = dto.City;
            if (dto.Region != null) patient.Contacts.Region = dto.Region;
            if (dto.Zip != null) patient.Contacts.Zip = dto.Zip;
            if (dto.Country != null) patient.Contacts.Country = dto.Country;

            patient.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync(token);
        }

        public async Task AddRelativeAsync(Guid patientId, UpdatePatientRelativeDto dto, CancellationToken token)
        {
            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient == null) throw new InvalidOperationException("Пациент не найден.");

            _context.PatientRelatives.Add(new PatientRelative
            {
                Id = Guid.NewGuid(),
                PatientId = patientId,
                Name = dto.Name,
                Relation = dto.Relation,
                Phone = dto.Phone
            });

            patient.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync(token);
        }

        public async Task UpdateRelativeAsync(Guid patientId, Guid relativeId, UpdatePatientRelativeDto dto, CancellationToken token)
        {
            var relative = await _context.PatientRelatives
                .Where(r => r.PatientId == patientId && r.Id == relativeId)
                .FirstOrDefaultAsync(token);

            if (relative == null) throw new InvalidOperationException("Родственник не найден.");

            relative.Name = dto.Name;
            relative.Relation = dto.Relation;
            relative.Phone = dto.Phone;

            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient != null) patient.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync(token);
        }

        public async Task DeleteRelativeAsync(Guid patientId, Guid relativeId, CancellationToken token)
        {
            var relative = await _context.PatientRelatives
                .Where(r => r.PatientId == patientId && r.Id == relativeId)
                .FirstOrDefaultAsync(token);

            if (relative == null) throw new InvalidOperationException("Родственник не найден.");

            _context.PatientRelatives.Remove(relative);

            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient != null) patient.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync(token);
        }

        public async Task UpdateTrustedPersonAsync(Guid patientId, UpdateTrustedPersonDto dto, CancellationToken token)
        {
            var existing = await _context.PatientRelatives
                .Where(r => r.PatientId == patientId)
                .FirstOrDefaultAsync(token);

            if (existing != null)
            {
                existing.Name = dto.Name;
                existing.Relation = dto.Relation;
                existing.Phone = dto.Phone;
            }
            else
            {
                _context.PatientRelatives.Add(new PatientRelative
                {
                    Id = Guid.NewGuid(),
                    PatientId = patientId,
                    Name = dto.Name,
                    Relation = dto.Relation,
                    Phone = dto.Phone
                });
            }

            await _context.SaveChangesAsync(token);
        }

        public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto, CancellationToken token)
        {
            var user = await _context.Users.FindAsync(new object[] { userId }, token);
            if (user == null)
                throw new InvalidOperationException("Пользователь не найден.");

            if (!BC.Verify(dto.OldPassword, user.PasswordHash))
                throw new InvalidOperationException("Неверный текущий пароль.");

            user.PasswordHash = BC.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync(token);
        }

        public async Task<IReadOnlyCollection<PatientDocument>> GetDocumentsAsync(Guid patientId, CancellationToken token)
        {
            return await _context.PatientDocuments
                .Where(d => d.PatientId == patientId)
                .OrderByDescending(d => d.Date)
                .ToListAsync(token);
        }

        public async Task<IReadOnlyCollection<LabResult>> GetExamsAsync(Guid patientId, CancellationToken token)
        {
            return await _context.LabResults
                .Include(l => l.Doctor)
                .Where(l => l.PatientId == patientId)
                .OrderByDescending(l => l.Date)
                .ToListAsync(token);
        }
    }
}
