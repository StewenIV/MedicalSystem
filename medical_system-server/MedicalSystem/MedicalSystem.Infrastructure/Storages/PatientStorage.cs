using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Models.Owned;
using MedicalSystem.Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Infrastructure.Storages
{
    public class PatientStorage : IPatientStorage
    {
        private readonly MedicalSystemDbContext _context;

        public PatientStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Patient entity, CancellationToken token)
        {
            await _context.Patients.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<Patient?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.Patients.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<Patient>> GetAllAsync(CancellationToken token)
        {
            return await _context.Patients.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var patient = await GetAsync(id, token);
            if (patient != null)
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(Patient entity, CancellationToken token)
        {
            _context.Patients.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task AssignDoctorAsync(Guid patientId, Guid doctorId, CancellationToken token)
        {
            var patient = await GetAsync(patientId, token);
            if (patient != null)
            {
                patient.DoctorId = doctorId;
                await UpdateAsync(patient, token);
            }
        }

        public async Task DischargeAsync(Guid patientId, CancellationToken token)
        {
            var patient = await GetAsync(patientId, token);
            if (patient != null)
            {
                patient.Status = Domain.Enums.PatientStatus.Discharged;
                await UpdateAsync(patient, token);
            }
        }

        public async Task TransferAsync(Guid patientId, Guid departmentId, CancellationToken token)
        {
            var patient = await GetAsync(patientId, token);
            if (patient != null)
            {
                patient.DepartmentId = departmentId;
                await UpdateAsync(patient, token);
            }
        }


        public void Add(Patient entity) => throw new NotImplementedException();
        public Patient? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<Patient> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(Patient entity) => throw new NotImplementedException();
        public void AssignDoctor(Guid patientId, Guid doctorId) => throw new NotImplementedException();
        public void Discharge(Guid patientId) => throw new NotImplementedException();
        public void Transfer(Guid patientId, Guid departmentId) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.Patients.AnyAsync(p => p.Id == id, token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();

        public async Task UpdatePatientCardAsync(Guid patientId, MedicalSystem.App.Contracts.Dtos.PatientCardDto dto, CancellationToken token)
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == patientId, token);

            if (patient == null) return;

            patient.FirstName = dto.FirstName;
            patient.LastName = dto.LastName;
            patient.MiddleName = dto.MiddleName;
            patient.DateOfBirth = dto.DateOfBirth;
            patient.Gender = dto.Gender == "Мужской" ? Domain.Enums.Gender.Male : Domain.Enums.Gender.Female;

            if (Enum.TryParse<Domain.Enums.PatientStatus>(dto.Status, true, out var status))
                patient.Status = status;

            patient.MedcardNum = dto.MedcardNum;
            patient.HistoryNum = dto.HistoryNum;
            patient.MaritalStatus = dto.MaritalStatus;
            patient.LastUpdated = DateTime.UtcNow;

            if (dto.Passport != null)
            {
                patient.Passport ??= new PatientPassport();
                patient.Passport.SeriesNumber = dto.Passport.SeriesNumber;
                patient.Passport.IssuedBy = dto.Passport.IssuedBy;
                patient.Passport.DateIssued = dto.Passport.DateIssued;
            }
            if (dto.Contacts != null)
            {
                patient.Contacts ??= new PatientContacts();
                patient.Contacts.Country = dto.Contacts.Country;
                patient.Contacts.Region = dto.Contacts.Region;
                patient.Contacts.City = dto.Contacts.City;
                patient.Contacts.Address = dto.Contacts.Address;
                patient.Contacts.Zip = dto.Contacts.Zip;
                patient.Contacts.PhoneMobile = dto.Contacts.PhoneMobile;
                patient.Contacts.PhoneHome = dto.Contacts.PhoneHome;
                patient.Contacts.Email = dto.Contacts.Email;
            }
            if (dto.Work != null)
            {
                patient.Work ??= new PatientWork();
                patient.Work.Profession = dto.Work.Profession;
                patient.Work.Organization = dto.Work.Organization;
                patient.Work.Address = dto.Work.Address;
            }
            if (dto.Other != null)
            {
                patient.Other ??= new PatientOther();
                patient.Other.Language = dto.Other.Language;
                patient.Other.Nationality = dto.Other.Nationality;
                patient.Other.DateOfDeath = dto.Other.DateOfDeath;
                patient.Other.CauseOfDeath = dto.Other.CauseOfDeath;
            }

            using var transaction = await _context.Database.BeginTransactionAsync(token);
            try
            {

                await _context.SaveChangesAsync(token);

                await _context.PatientRelatives.Where(r => r.PatientId == patientId).ExecuteDeleteAsync(token);
                if (dto.Relatives != null)
                    foreach (var d in dto.Relatives)
                        _context.PatientRelatives.Add(new PatientRelative { Id = d.Id == Guid.Empty ? Guid.NewGuid() : d.Id, PatientId = patientId, Name = d.Name, Relation = d.Relation, Phone = d.Phone });

                await _context.Allergies.Where(a => a.PatientId == patientId).ExecuteDeleteAsync(token);
                if (dto.Allergies != null)
                    foreach (var d in dto.Allergies)
                        _context.Allergies.Add(new Allergy { Id = d.Id == Guid.Empty ? Guid.NewGuid() : d.Id, PatientId = patientId, Name = d.Name, Reaction = d.Reaction, Date = d.Date, Comment = d.Comment });

                // For PatientMedications, do a differential update instead of ExecuteDeleteAsync to avoid violating foreign key constraints for active prescriptions.
                var existingMeds = await _context.PatientMedications
                    .Where(m => m.PatientId == patientId)
                    .ToListAsync(token);

                var incomingMeds = dto.CurrentMeds ?? new List<MedicalSystem.App.Contracts.Dtos.MedicationDto>();

                // 1. Identify items to delete
                var incomingIds = incomingMeds.Select(m => m.Id).Where(id => id != Guid.Empty).ToHashSet();
                var medsToDelete = existingMeds.Where(m => !incomingIds.Contains(m.Id)).ToList();
                
                if (medsToDelete.Any())
                {
                    var deleteIds = medsToDelete.Select(m => m.Id).ToList();
                    
                    // Null out the references in BedPrescriptions
                    await _context.BedPrescriptions
                        .Where(bp => bp.PatientMedicationId != null && deleteIds.Contains(bp.PatientMedicationId.Value))
                        .ExecuteUpdateAsync(s => s.SetProperty(bp => bp.PatientMedicationId, (Guid?)null), token);
                        
                    // Null out the references in MedicineOperationLogs
                    await _context.MedicineOperationLogs
                        .Where(l => l.PrescriptionId != null && deleteIds.Contains(l.PrescriptionId.Value))
                        .ExecuteUpdateAsync(s => s.SetProperty(l => l.PrescriptionId, (Guid?)null), token);

                    _context.PatientMedications.RemoveRange(medsToDelete);
                }

                // 2. Add or Update
                foreach (var d in incomingMeds)
                {
                    if (d.Id != Guid.Empty)
                    {
                        var existing = existingMeds.FirstOrDefault(m => m.Id == d.Id);
                        if (existing != null)
                        {
                            existing.Name = d.Name;
                            existing.Dose = d.Dose;
                            existing.Form = d.Form;
                            existing.Regimen = d.Regimen;
                            _context.PatientMedications.Update(existing);
                        }
                        else
                        {
                            _context.PatientMedications.Add(new PatientMedication
                            {
                                Id = d.Id,
                                PatientId = patientId,
                                Name = d.Name,
                                Dose = d.Dose,
                                Form = d.Form,
                                Regimen = d.Regimen
                            });
                        }
                    }
                    else
                    {
                        _context.PatientMedications.Add(new PatientMedication
                        {
                            Id = Guid.NewGuid(),
                            PatientId = patientId,
                            Name = d.Name,
                            Dose = d.Dose,
                            Form = d.Form,
                            Regimen = d.Regimen
                        });
                    }
                }

                await _context.Operations.Where(o => o.PatientId == patientId).ExecuteDeleteAsync(token);
                if (dto.Operations != null)
                    foreach (var d in dto.Operations)
                        _context.Operations.Add(new Operation { Id = d.Id == Guid.Empty ? Guid.NewGuid() : d.Id, PatientId = patientId, Name = d.Name, Date = d.Date, Diagnosis = d.Diagnosis, Description = d.Description, Complications = d.Complications, Implants = d.Implants, Result = d.Result });
                await _context.MedicalProblems.Where(p => p.PatientId == patientId).ExecuteDeleteAsync(token);
                if (dto.MedicalProblems != null)
                    foreach (var d in dto.MedicalProblems)
                        _context.MedicalProblems.Add(new MedicalProblem { Id = d.Id == Guid.Empty ? Guid.NewGuid() : d.Id, PatientId = patientId, Name = d.Name, DiagnosisDate = d.DiagnosisDate, DiseaseStatus = d.DiseaseStatus, Severity = d.Severity, Description = d.Description, Complications = d.Complications, IsActive = d.IsActive });

                await _context.Set<Prescription>().Where(p => p.PatientId == patientId).ExecuteDeleteAsync(token);
                if (dto.Prescriptions != null)
                    foreach (var d in dto.Prescriptions)
                        _context.Set<Prescription>().Add(new Prescription { Id = d.Id == Guid.Empty ? Guid.NewGuid() : d.Id, PatientId = patientId, Drug = d.Drug, Dose = d.Dose ?? "", Form = d.Form ?? "", Route = d.Route ?? "", Regimen = d.Regimen ?? "", DateStart = d.DateStart ?? DateTime.UtcNow, DateEnd = d.DateEnd, Comment = d.Comment ?? "" });
                await _context.LabResults.Where(l => l.PatientId == patientId).ExecuteDeleteAsync(token);
                if (dto.Labs != null)
                    foreach (var d in dto.Labs)
                        _context.LabResults.Add(new LabResult { Id = d.Id == Guid.Empty ? Guid.NewGuid() : d.Id, PatientId = patientId, Date = d.Date ?? DateTime.UtcNow, Type = d.Type, Reason = d.Reason, StatusText = d.StatusText });

                await _context.Vaccines.Where(v => v.PatientId == patientId).ExecuteDeleteAsync(token);
                if (dto.Vaccines != null)
                    foreach (var d in dto.Vaccines)
                        _context.Vaccines.Add(new Vaccine { Id = d.Id == Guid.Empty ? Guid.NewGuid() : d.Id, PatientId = patientId, Name = d.Name, Disease = d.Disease, Date = d.Date, Validity = d.Validity, Manufacturer = d.Manufacturer, Series = d.Series });
                await _context.PatientDocuments.Where(d => d.PatientId == patientId).ExecuteDeleteAsync(token);
                if (dto.Documents != null)
                    foreach (var d in dto.Documents)
                        _context.PatientDocuments.Add(new PatientDocument { Id = d.Id == Guid.Empty ? Guid.NewGuid() : d.Id, PatientId = patientId, Name = d.Name, Date = d.Date, FilePath = d.FilePath });

                await _context.SaveChangesAsync(token);
                await transaction.CommitAsync(token);
            }
            catch
            {
                await transaction.RollbackAsync(token);
                throw;
            }
        }


        public async Task<Patient> AddPatientAsync(MedicalSystem.App.Contracts.Dtos.PatientCardDto dto, CancellationToken token)
        {
            var patient = new Patient
            {
                Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                MiddleName = dto.MiddleName,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender == "Мужской" ? Domain.Enums.Gender.Male : Domain.Enums.Gender.Female,
                MedcardNum = string.IsNullOrWhiteSpace(dto.MedcardNum) ? new Random().Next(10000000, 99999999).ToString() : dto.MedcardNum,
                HistoryNum = dto.HistoryNum,
                Status = Domain.Enums.PatientStatus.Outpatient,
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Patients.AddAsync(patient, token);
            await _context.SaveChangesAsync(token);
            return patient;
        }

        public async Task DeletePatientAsync(Guid patientId, CancellationToken token)
        {
            var patient = await _context.Patients.FindAsync(new object[] { patientId }, token);
            if (patient != null)
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync(token);
            }
        }
    }
}
