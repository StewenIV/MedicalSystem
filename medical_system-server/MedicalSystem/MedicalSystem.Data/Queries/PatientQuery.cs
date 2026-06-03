using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Queries
{
    public class PatientQuery : IPatientQuery
    {
        private readonly MedicalSystemDbContext _context;

        public PatientQuery(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PatientLookupDto>> GetPatientsByStatusAsync(PatientStatus status, CancellationToken token)
        {
            return await _context.Patients
                .AsNoTracking()
                .Where(p => p.Status == status)
                .Select(p => new PatientLookupDto
                {
                    Id = p.Id,
                    FullName = $"{p.LastName} {p.FirstName} {p.MiddleName}",
                    RoomAndBed = _context.HospitalBeds
                                    .Include(b => b.Room)
                                    .Where(b => b.PatientId == p.Id)
                                    .Select(b => $"Палата {b.Room.RoomNumber} / {b.BedNumber}")
                                    .FirstOrDefault()
                })
                .ToListAsync(token);
        }

        public async Task<IEnumerable<PatientListDto>> GetAllPatientsAsync(CancellationToken token)
        {
            return await _context.Patients
                .AsNoTracking()
                .Include(p => p.Doctor)
                .Include(p => p.Department)
                .Include(p => p.MedicalProblems)
                .Select(p => new PatientListDto
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    MiddleName = p.MiddleName,
                    Age = (int)((DateTime.Now - p.DateOfBirth).TotalDays / 365.25),
                    DateOfBirth = p.DateOfBirth,
                    Gender = p.Gender == Gender.Male ? "Мужской" : "Женский",
                    Status = p.Status.ToString(),
                    StatusText = GetStatusText(p.Status),
                    MedcardNum = p.MedcardNum,
                    HistoryNum = p.HistoryNum,
                    DoctorName = p.Doctor != null ? p.Doctor.Name : null,
                    DepartmentName = p.Department != null ? p.Department.Name : null,
                    RoomNumber = _context.HospitalBeds
                        .Where(b => b.PatientId == p.Id)
                        .Select(b => b.Room.RoomNumber.ToString())
                        .FirstOrDefault(),
                    ActiveProblems = p.MedicalProblems
                        .Where(mp => mp.IsActive)
                        .Select(mp => mp.Name)
                        .ToArray()
                })
                .ToListAsync(token);
        }

        public async Task<PatientCardDto?> GetCardByIdAsync(Guid patientId, CancellationToken token)
        {
            var patient = await _context.Patients
                .AsNoTracking()
                .Include(p => p.Doctor)
                .Include(p => p.Department)
                .Include(p => p.Institution)
                .Include(p => p.Encounters).ThenInclude(e => e.Doctor)
                .Include(p => p.PatientMedications)
                .Include(p => p.PatientRelatives)
                .Include(p => p.Allergies)
                .Include(p => p.MedicalProblems)
                .Include(p => p.Operations)
                .Include(p => p.Prescriptions).ThenInclude(r => r.Doctor)
                .Include(p => p.LabResults).ThenInclude(l => l.Doctor)
                .Include(p => p.Vaccines)
                .Include(p => p.PatientDocuments)
                .Include(p => p.VitalSigns)
                .FirstOrDefaultAsync(p => p.Id == patientId, token);

            if (patient == null)
            {
                return null;
            }

            var bed = await _context.HospitalBeds
                .AsNoTracking()
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.PatientId == patientId, token);

            var latestVitals = patient.VitalSigns.OrderByDescending(v => v.RecordedAt).FirstOrDefault();

            var dto = new PatientCardDto
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                MiddleName = patient.MiddleName,
                Age = (int)((DateTime.Now - patient.DateOfBirth).TotalDays / 365.25),
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender == Gender.Male ? "Мужской" : "Женский",
                Status = patient.Status.ToString(),
                StatusText = GetStatusText(patient.Status),
                MedcardNum = patient.MedcardNum,
                HistoryNum = patient.HistoryNum,
                MaritalStatus = patient.MaritalStatus,
                Institution = patient.Institution?.Name,
                LastUpdated = patient.LastUpdated,
                DoctorName = patient.Doctor?.Name,
                DepartmentName = patient.Department?.Name,
                RoomNumber = bed?.Room?.RoomNumber.ToString(),
                BedNumber = bed?.BedNumber,

                Passport = new PassportInfoDto
                {
                    SeriesNumber = patient.Passport?.SeriesNumber,
                    IssuedBy = patient.Passport?.IssuedBy,
                    DateIssued = patient.Passport?.DateIssued
                },
                Contacts = new ContactsInfoDto
                {
                    Country = patient.Contacts?.Country,
                    Region = patient.Contacts?.Region,
                    City = patient.Contacts?.City,
                    Address = patient.Contacts?.Address,
                    Zip = patient.Contacts?.Zip,
                    PhoneMobile = patient.Contacts?.PhoneMobile,
                    PhoneHome = patient.Contacts?.PhoneHome,
                    Email = patient.Contacts?.Email
                },
                Work = new WorkInfoDto
                {
                    Profession = patient.Work?.Profession,
                    Organization = patient.Work?.Organization,
                    Address = patient.Work?.Address
                },
                Other = new OtherInfoDto
                {
                    Language = patient.Other?.Language,
                    Nationality = patient.Other?.Nationality,
                    DateOfDeath = patient.Other?.DateOfDeath,
                    CauseOfDeath = patient.Other?.CauseOfDeath
                },

                Vitals = latestVitals != null ? new VitalsDto
                {
                    Temp = latestVitals.Temperature.HasValue ? $"{latestVitals.Temperature} °C" : null,
                    Bp = latestVitals.BloodPressureSystolic.HasValue && latestVitals.BloodPressureDiastolic.HasValue
                        ? $"{latestVitals.BloodPressureSystolic}/{latestVitals.BloodPressureDiastolic}"
                        : null,
                    Hr = latestVitals.Pulse.HasValue ? $"{latestVitals.Pulse} уд/мин" : null,
                    Resp = latestVitals.RespiratoryRate.HasValue ? $"{latestVitals.RespiratoryRate} д/мин" : null,
                    Spo2 = latestVitals.SpO2.HasValue ? $"{latestVitals.SpO2}%" : null
                } : null,

                Relatives = patient.PatientRelatives.Select(r => new RelativeDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Relation = r.Relation,
                    Phone = r.Phone
                }).ToList(),

                Allergies = patient.Allergies.Select(a => new AllergyDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Reaction = a.Reaction,
                    Date = a.Date,
                    Comment = a.Comment
                }).ToList(),

                CurrentMeds = patient.PatientMedications.Select(pm => new MedicationDto
                {
                    Id = pm.Id,
                    Name = pm.Name,
                    Dose = pm.Dose,
                    Form = pm.Form,
                    Regimen = pm.Regimen
                }).ToList(),

                Operations = patient.Operations.Select(o => new OperationDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Date = o.Date,
                    Diagnosis = o.Diagnosis,
                    Description = o.Description,
                    Complications = o.Complications,
                    Implants = o.Implants,
                    Result = o.Result
                }).ToList(),

                MedicalProblems = patient.MedicalProblems.Select(mp => new MedicalProblemDto
                {
                    Id = mp.Id,
                    Name = mp.Name,
                    DiagnosisDate = mp.DiagnosisDate,
                    DiseaseStatus = mp.DiseaseStatus,
                    Severity = mp.Severity,
                    Description = mp.Description,
                    Complications = mp.Complications,
                    IsActive = mp.IsActive
                }).ToList(),

                Prescriptions = patient.Prescriptions.Select(pr => new PrescriptionDto
                {
                    Id = pr.Id,
                    Drug = pr.Drug,
                    Dose = pr.Dose,
                    Form = pr.Form,
                    Route = pr.Route,
                    Regimen = pr.Regimen,
                    DateStart = pr.DateStart,
                    DateEnd = pr.DateEnd,
                    DoctorName = pr.Doctor?.Name,
                    Comment = pr.Comment
                }).ToList(),

                Labs = patient.LabResults.Select(l => new LabDto
                {
                    Id = l.Id,
                    Date = l.Date,
                    Type = l.Type,
                    Reason = l.Reason,
                    DoctorName = l.Doctor?.Name,
                    StatusText = l.StatusText
                }).ToList(),

                Vaccines = patient.Vaccines.Select(v => new VaccineDto
                {
                    Id = v.Id,
                    Name = v.Name,
                    Disease = v.Disease,
                    Date = v.Date,
                    Validity = v.Validity,
                    Manufacturer = v.Manufacturer,
                    Series = v.Series
                }).ToList(),

                Documents = patient.PatientDocuments.Select(d => new DocumentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Date = d.Date,
                    FilePath = d.FilePath
                }).ToList(),

       
                History = patient.Encounters.Select(e => new HistoryEntryDto
                {
                    Id = e.Id,
                    DateTime = e.DateTime,
                    Type = e.Type,
                    DoctorName = e.Doctor?.Name,
                    Complaints = e.Complaints,
                    Objective = e.Objective,
                    Conclusion = e.Conclusion,
                    Recommendations = e.Recommendations
                })
                .Concat(patient.Operations.Select(op => new HistoryEntryDto
                {
                    Id = op.Id,
                    DateTime = op.Date ?? DateTime.MinValue,
                    Type = "Операция",
                    DoctorName = null,
                    Complaints = op.Diagnosis,
                    Objective = op.Description,
                    Conclusion = op.Name,
                    Recommendations = (string.IsNullOrEmpty(op.Complications) ? "" : "Осложнения: " + op.Complications + ". ") +
                                      (string.IsNullOrEmpty(op.Implants) ? "" : "Импланты: " + op.Implants + ". ") +
                                      (string.IsNullOrEmpty(op.Result) ? "" : "Результат: " + op.Result)
                }))
                .Concat(patient.Vaccines.Select(v => new HistoryEntryDto
                {
                    Id = v.Id,
                    DateTime = v.Date ?? DateTime.MinValue,
                    Type = "Вакцинация",
                    DoctorName = null,
                    Complaints = v.Disease,
                    Objective = "Вакцина: " + v.Name,
                    Conclusion = "Вакцинация от " + v.Disease,
                    Recommendations = "Производитель: " + v.Manufacturer + ", Серия: " + v.Series + ", Срок: " + v.Validity
                }))
                .Concat(patient.LabResults.Select(lab => new HistoryEntryDto
                {
                    Id = lab.Id,
                    DateTime = lab.Date ?? DateTime.MinValue,
                    Type = "Анализы",
                    DoctorName = lab.Doctor?.Name,
                    Complaints = lab.Reason,
                    Objective = "Статус: " + lab.StatusText,
                    Conclusion = lab.Type,
                    Recommendations = null
                }))
                .Concat(patient.Prescriptions.Select(pr => new HistoryEntryDto
                {
                    Id = pr.Id,
                    DateTime = pr.DateStart ?? DateTime.MinValue,
                    Type = "Назначение",
                    DoctorName = pr.Doctor?.Name,
                    Complaints = pr.Comment,
                    Objective = pr.Dose + " (" + pr.Regimen + ")",
                    Conclusion = "Назначено лекарство: " + pr.Drug,
                    Recommendations = "Путь: " + pr.Route + ", Форма: " + pr.Form + ", Период: " + 
                                      (pr.DateStart.HasValue ? pr.DateStart.Value.ToString("dd.MM.yyyy") : "") + " - " + 
                                      (pr.DateEnd.HasValue ? pr.DateEnd.Value.ToString("dd.MM.yyyy") : "")
                }))
                .OrderByDescending(h => h.DateTime)
                .ToList(),

                Encounters = patient.Encounters.Select(e => new EncounterDto
                {
                    Id = e.Id,
                    DateTime = e.DateTime,
                    Type = e.Type,
                    DoctorName = e.Doctor?.Name,
                    Conclusion = e.Conclusion
                }).ToList(),

                Medications = patient.PatientMedications.Select(pm => new PatientMedicationDto
                {
                    Id = pm.Id,
                    Name = pm.Name,
                    Dose = pm.Dose,
                    Regimen = pm.Regimen,
                    Status = pm.Status
                }).ToList()
            };

            return dto;
        }

        private static string GetStatusText(PatientStatus status)
        {
            return status switch
            {
                PatientStatus.Hospitalized => "Госпитализирован",
                PatientStatus.Outpatient => "Амбулаторный",
                PatientStatus.Discharged => "Выписан",
                _ => status.ToString()
            };
        }
    }
}
