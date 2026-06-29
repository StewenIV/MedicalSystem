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
                if (patient.DoctorId == null)
                {
                    patient.DoctorId = doctorId;
                    await UpdateAsync(patient, token);
                }
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

                
                var existingMeds = await _context.PatientMedications
                    .Where(m => m.PatientId == patientId)
                    .ToListAsync(token);

                var incomingMeds = dto.CurrentMeds ?? new List<MedicalSystem.App.Contracts.Dtos.MedicationDto>();

                
                var incomingIds = incomingMeds.Select(m => m.Id).Where(id => id != Guid.Empty).ToHashSet();
                var existingHomeMeds = existingMeds.Where(m => m.Status != MedicalSystem.Domain.Enums.MedicationStatus.Active).ToList();
                var medsToDelete = existingHomeMeds.Where(m => !incomingIds.Contains(m.Id)).ToList();
                
                if (medsToDelete.Any())
                {
                    var deleteIds = medsToDelete.Select(m => m.Id).ToList();
                    
                    
                    await _context.BedPrescriptions
                        .Where(bp => bp.PatientMedicationId != null && deleteIds.Contains(bp.PatientMedicationId.Value))
                        .ExecuteUpdateAsync(s => s.SetProperty(bp => bp.PatientMedicationId, (Guid?)null), token);
                        
                    
                    await _context.MedicineOperationLogs
                        .Where(l => l.PrescriptionId != null && deleteIds.Contains(l.PrescriptionId.Value))
                        .ExecuteUpdateAsync(s => s.SetProperty(l => l.PrescriptionId, (Guid?)null), token);

                    _context.PatientMedications.RemoveRange(medsToDelete);
                }

                
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

                var medicines = await _context.Medicines.ToListAsync(token);
                var savedPrescriptions = await _context.Set<Prescription>()
                    .Where(p => p.PatientId == patientId)
                    .ToListAsync(token);

                var activeHospitalMeds = await _context.PatientMedications
                    .Where(pm => pm.PatientId == patientId && pm.Status == MedicalSystem.Domain.Enums.MedicationStatus.Active)
                    .ToListAsync(token);

                var prescriptionDrugs = savedPrescriptions.Select(p => p.Drug.ToLower()).ToHashSet();
                var pmToDelete = activeHospitalMeds.Where(pm => !prescriptionDrugs.Contains(pm.Name.ToLower())).ToList();
                if (pmToDelete.Any())
                {
                    var deleteIds = pmToDelete.Select(pm => pm.Id).ToList();
                    await _context.BedPrescriptions
                        .Where(bp => bp.PatientMedicationId != null && deleteIds.Contains(bp.PatientMedicationId.Value))
                        .ExecuteDeleteAsync(token);
                    _context.PatientMedications.RemoveRange(pmToDelete);
                }

                var today = DateTime.UtcNow.Date;

                foreach (var pr in savedPrescriptions)
                {
                    var matchedMed = medicines.FirstOrDefault(m => 
                        m.Name.Equals(pr.Drug, StringComparison.OrdinalIgnoreCase) ||
                        m.Name.ToLower().Contains(pr.Drug.ToLower()) ||
                        pr.Drug.ToLower().Contains(m.Name.ToLower())
                    );

                    var pm = activeHospitalMeds.FirstOrDefault(p => p.Name.Equals(pr.Drug, StringComparison.OrdinalIgnoreCase));
                    bool isNewPm = false;
                    if (pm == null)
                    {
                        pm = new PatientMedication
                        {
                            Id = Guid.NewGuid(),
                            PatientId = patientId,
                            Name = pr.Drug,
                            Status = MedicalSystem.Domain.Enums.MedicationStatus.Active
                        };
                        isNewPm = true;
                    }

                    pm.MedicineId = matchedMed?.Id;
                    pm.Dose = pr.Dose;
                    pm.Form = pr.Form;
                    pm.Regimen = pr.Regimen;
                    pm.DoctorId = pr.DoctorId ?? patient.DoctorId;
                    pm.DateStart = pr.DateStart;
                    pm.DateEnd = pr.DateEnd;

                    if (isNewPm)
                    {
                        _context.PatientMedications.Add(pm);
                    }
                    else
                    {
                        _context.PatientMedications.Update(pm);
                    }

                    var timesToSchedule = GetTimesForRegimen(pr.Regimen);

                    var existingBps = await _context.BedPrescriptions
                        .Where(bp => bp.PatientId == patientId && bp.Name == pr.Drug && bp.Date == today)
                        .ToListAsync(token);

                    foreach (var time in timesToSchedule)
                    {
                        if (!existingBps.Any(bp => bp.ScheduledTime == time))
                        {
                            var bp = new BedPrescription
                            {
                                Id = Guid.NewGuid(),
                                PatientId = patientId,
                                PatientMedication = pm,
                                Name = pr.Drug,
                                Dose = pr.Dose,
                                ScheduledTime = time,
                                Date = today,
                                IsDone = false
                            };
                            _context.BedPrescriptions.Add(bp);
                        }
                    }
                }

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
            
            var existingPatient = await _context.Patients
                .FirstOrDefaultAsync(p => 
                    p.FirstName.ToLower() == dto.FirstName.ToLower() &&
                    p.LastName.ToLower() == dto.LastName.ToLower() &&
                    (p.MiddleName ?? "").ToLower() == (dto.MiddleName ?? "").ToLower() &&
                    p.DateOfBirth.Date == dto.DateOfBirth.Date, token);

            if (existingPatient != null)
            {
                throw new InvalidOperationException("Пациент с такими ФИО и датой рождения уже зарегистрирован в системе.");
            }

            
            string medcard = dto.MedcardNum;
            if (string.IsNullOrWhiteSpace(medcard))
            {
                var rnd = new Random();
                do
                {
                    medcard = rnd.Next(10000000, 99999999).ToString();
                } while (await _context.Patients.AnyAsync(p => p.MedcardNum == medcard, token) || 
                         await _context.Users.AnyAsync(u => u.Login == medcard, token));
            }
            else
            {
                if (await _context.Patients.AnyAsync(p => p.MedcardNum == medcard, token) || 
                    await _context.Users.AnyAsync(u => u.Login == medcard, token))
                {
                    throw new InvalidOperationException($"Номер медкарты '{medcard}' уже используется в системе.");
                }
            }

            var patient = new Patient
            {
                Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                MiddleName = dto.MiddleName,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender == "Мужской" ? Domain.Enums.Gender.Male : Domain.Enums.Gender.Female,
                MedcardNum = medcard,
                HistoryNum = dto.HistoryNum,
                Status = Domain.Enums.PatientStatus.Outpatient,
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            var user = new User
            {
                Id = patient.Id,
                Login = patient.MedcardNum,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Role = "Patient",
                DisplayName = $"{patient.LastName} {patient.FirstName} {patient.MiddleName}".Trim(),
                PatientId = patient.Id,
                CreatedAt = DateTime.UtcNow
            };

            using var transaction = await _context.Database.BeginTransactionAsync(token);
            try
            {
                await _context.Patients.AddAsync(patient, token);
                await _context.Users.AddAsync(user, token);
                await _context.SaveChangesAsync(token);
                await transaction.CommitAsync(token);
            }
            catch
            {
                await transaction.RollbackAsync(token);
                throw;
            }

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

        private static List<TimeSpan> GetTimesForRegimen(string? regimen)
        {
            var times = new List<TimeSpan>();
            var text = (regimen ?? "").ToLower();

            if (string.IsNullOrWhiteSpace(text))
            {
                times.Add(new TimeSpan(7, 0, 0));
                return times;
            }

            if (text.Contains("4 раза") || text.Contains("4 раз"))
            {
                times.Add(new TimeSpan(7, 0, 0));
                times.Add(new TimeSpan(12, 0, 0));
                times.Add(new TimeSpan(17, 0, 0));
                times.Add(new TimeSpan(21, 0, 0));
            }
            else if (text.Contains("3 раза") || text.Contains("3 раз") || text.Contains("три раз"))
            {
                times.Add(new TimeSpan(7, 0, 0));
                times.Add(new TimeSpan(14, 0, 0));
                times.Add(new TimeSpan(20, 0, 0));
            }
            else if (text.Contains("2 раза") || text.Contains("2 раз") || text.Contains("два раз") || text.Contains("12 час"))
            {
                times.Add(new TimeSpan(7, 0, 0));
                times.Add(new TimeSpan(20, 0, 0));
            }
            else if (text.Contains("утром") || text.Contains("натощак") || text.Contains("1 раз"))
            {
                times.Add(new TimeSpan(7, 0, 0));
            }
            else if (text.Contains("вечером") || text.Contains("перед сном"))
            {
                times.Add(new TimeSpan(20, 0, 0));
            }
            else if (text.Contains("после еды") || text.Contains("после обеда"))
            {
                times.Add(new TimeSpan(14, 0, 0));
            }
            else
            {
                times.Add(new TimeSpan(7, 0, 0));
            }

            return times;
        }
    }
}
