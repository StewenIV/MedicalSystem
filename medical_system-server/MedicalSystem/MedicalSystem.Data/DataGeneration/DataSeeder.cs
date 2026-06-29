using MedicalSystem.App.Services;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using BC = BCrypt.Net.BCrypt;

namespace MedicalSystem.Data.DataGeneration
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(MedicalSystemDbContext context, ILogger logger)
        {
            try
            {
                logger.LogInformation("Проверка и заполнение базы данных...");

                
                
                
                var institutions = await GetOrCreateAsync(context, context.Institutions,
                    () => TestDataGenerator.GenerateInstitutions());

                
                
                
                var medicalStaff = await GetOrCreateAsync(context, context.MedicalStaff,
                    () => TestDataGenerator.GenerateMedicalStaff(50));

                
                
                
                var patients = await GetOrCreateAsync(context, context.Patients,
                    () => TestDataGenerator.GeneratePatients(200, medicalStaff, institutions));

                
                
                
                var medicines = await GetOrCreateAsync(context, context.Medicines,
                    () => TestDataGenerator.GenerateMedicines(100, medicalStaff));

                var rooms = await GetOrCreateAsync(context, context.Rooms,
                    () => TestDataGenerator.GenerateRooms(16));

                var hospitalBeds = await GetOrCreateAsync(context, context.HospitalBeds,
                    () => TestDataGenerator.GenerateHospitalBeds(0, rooms, patients));

                var appointments = await GetOrCreateAsync(context, context.Appointments,
                    () => TestDataGenerator.GenerateAppointments(500, patients, medicalStaff));

                var allergies = await GetOrCreateAsync(context, context.Allergies,
                    () => TestDataGenerator.GenerateAllergies(150, patients));

                var medicalProblems = await GetOrCreateAsync(context, context.MedicalProblems,
                    () => TestDataGenerator.GenerateMedicalProblems(300, patients));

                var encounters = await GetOrCreateAsync(context, context.Encounters,
                    () => TestDataGenerator.GenerateEncounters(400, patients, medicalStaff));

                var patientMedications = await GetOrCreateAsync(context, context.PatientMedications,
                    () => TestDataGenerator.GeneratePatientMedications(600, patients, medicines, medicalStaff));

                var operations = await GetOrCreateAsync(context, context.Operations,
                    () => TestDataGenerator.GenerateOperations(50, patients));

                var vaccines = await GetOrCreateAsync(context, context.Vaccines,
                    () => TestDataGenerator.GenerateVaccines(300, patients));

                var patientDocuments = await GetOrCreateAsync(context, context.PatientDocuments,
                    () => TestDataGenerator.GeneratePatientDocuments(400, patients));

                var vitalSigns = await GetOrCreateAsync(context, context.VitalSigns,
                    () => TestDataGenerator.GenerateVitalSigns(2000, patients));

                var shifts = await GetOrCreateAsync(context, context.Shifts,
                    () => TestDataGenerator.GenerateShifts(0, medicalStaff)); 

                var notifications = await GetOrCreateAsync(context, context.Notifications,
                    () => TestDataGenerator.GenerateNotifications(50, medicalStaff, patients));

                var patientRelatives = await GetOrCreateAsync(context, context.PatientRelatives,
                    () => TestDataGenerator.GeneratePatientRelatives(0, patients)); 

                var bedPrescriptions = await GetOrCreateAsync(context, context.BedPrescriptions,
                    () => TestDataGenerator.GenerateBedPrescriptions(1000, patients, patientMedications));

                var bedActionLogs = await GetOrCreateAsync(context, context.BedActionLogs,
                    () => TestDataGenerator.GenerateBedActionLogs(1500, patients, medicalStaff));

                var medicineOperationLogs = await GetOrCreateAsync(context, context.MedicineOperationLogs,
                    () => TestDataGenerator.GenerateMedicineOperationLogs(500, medicines, medicalStaff, patients, patientMedications));

                var bedOccupancyHistories = await GetOrCreateAsync(context, context.BedOccupancyHistories,
                    () => TestDataGenerator.GenerateBedOccupancyHistories(hospitalBeds, patients));

                await context.SaveChangesAsync();

                await SeedUsersAsync(context, logger, medicalStaff);

                await DistributeBedsAndMedicinesAsync(context, logger);

                logger.LogInformation("Проверка и заполнение базы данных завершены.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Произошла ошибка во время заполнения базы данных.");
            }
        }
        
        private static async Task<List<T>> GetOrCreateAsync<T>(MedicalSystemDbContext context, DbSet<T> dbSet, Func<List<T>> generateFunc) where T : class
        {
            var existingData = await dbSet.ToListAsync();
            if (existingData.Any())
            {
                return existingData;
            }

            var newData = generateFunc();
            if (newData.Any())
            {
                await dbSet.AddRangeAsync(newData);
            }
            return newData;
        }

        private static async Task SeedUsersAsync(MedicalSystemDbContext context, ILogger logger, List<MedicalStaff> staffList)
        {
            var patients = await context.Patients.OrderBy(p => p.LastName).ThenBy(p => p.FirstName).ThenBy(p => p.Id).ToListAsync();
            var existingUsers = await context.Users.ToListAsync();
            var usersById = existingUsers.ToDictionary(u => u.Id);
            var usersByLogin = existingUsers.ToDictionary(u => u.Login, StringComparer.OrdinalIgnoreCase);

            int pCount = 1;
            string hashedPwd = BC.HashPassword("Password123!");
            foreach (var patient in patients)
            {
                if (!usersById.TryGetValue(patient.Id, out var existingUser))
                {
                    string login = $"patient{pCount}";
                    while (usersByLogin.ContainsKey(login))
                    {
                        pCount++;
                        login = $"patient{pCount}";
                    }

                    var newUser = new User
                    {
                        Id = patient.Id,
                        Login = login,
                        PasswordHash = hashedPwd,
                        Role = "Patient",
                        DisplayName = $"{patient.LastName} {patient.FirstName} {patient.MiddleName}".Trim(),
                        PatientId = patient.Id,
                        CreatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(newUser);
                    usersById[newUser.Id] = newUser;
                    usersByLogin[newUser.Login] = newUser;
                    pCount++;
                }
                else
                {
                    bool changed = false;
                    if (existingUser.Role != "Patient") { existingUser.Role = "Patient"; changed = true; }
                    var expectedName = $"{patient.LastName} {patient.FirstName} {patient.MiddleName}".Trim();
                    if (existingUser.DisplayName != expectedName) { existingUser.DisplayName = expectedName; changed = true; }
                    if (existingUser.PatientId != patient.Id) { existingUser.PatientId = patient.Id; changed = true; }
                    if (changed)
                    {
                        context.Users.Update(existingUser);
                    }
                }
            }
            await context.SaveChangesAsync();
            logger.LogInformation("Создано/актуализировано {Count} аккаунтов пациентов", patients.Count);

            int doctorCount = 1;
            int nurseCount = 1;
            int headNurseCount = 1;
            int chiefCount = 1;
            int labCount = 1;

            foreach (var staff in staffList)
            {
                var positionName = staff.Position?.ToLower() ?? "";

                string role = "Doctor";
                string loginPrefix = "doctor";
                int currentCount = 1;

                if (positionName.Contains("главный врач"))
                {
                    role = "ChiefDoctor";
                    loginPrefix = "chief";
                    currentCount = chiefCount++;
                }
                else if (positionName.Contains("заведующий") || positionName.Contains("старшая"))
                {
                    role = "HeadNurse";
                    loginPrefix = "head_nurse";
                    currentCount = headNurseCount++;
                }
                else if (positionName.Contains("медсестра") || positionName.Contains("медицинская сестра"))
                {
                    role = "Nurse";
                    loginPrefix = "nurse";
                    currentCount = nurseCount++;
                }
                else if (positionName.Contains("лаборант") || positionName.Contains("лаборатор"))
                {
                    role = "LaboratoryEmployee";
                    loginPrefix = "lab";
                    currentCount = labCount++;
                }
                else
                {
                    role = "Doctor";
                    loginPrefix = "doctor";
                    currentCount = doctorCount++;
                }

                string login = $"{loginPrefix}{currentCount}";

                var existsByStaff = await context.Users.AnyAsync(x => x.MedicalStaffId == staff.Id);
                if (!existsByStaff)
                {
                    var existsByLogin = await context.Users.AnyAsync(x => x.Login == login);
                    
                    if (!existsByLogin)
                    {
                        context.Users.Add(new User
                        {
                            Id = Guid.NewGuid(),
                            Login = login,
                            PasswordHash = BC.HashPassword("Password123!"),
                            Role = role,
                            DisplayName = staff.Name,
                            MedicalStaffId = staff.Id,
                            CreatedAt = DateTime.UtcNow
                        });
                        logger.LogInformation("Создан пользователь: {Login} [{Role}] -> {StaffName}", login, role, staff.Name);
                    }
                    else
                    {
                        var existingUser = await context.Users.FirstAsync(x => x.Login == login);
                        if (existingUser.MedicalStaffId == null)
                        {
                            existingUser.MedicalStaffId = staff.Id;
                            existingUser.DisplayName = staff.Name;
                        }
                    }
                }
            }

            await context.SaveChangesAsync();

            var usersWithStaff = await context.Users.Include(u => u.MedicalStaff).ToListAsync();
            var staffRoles = new[] { "Doctor", "ChiefDoctor", "HeadNurse", "Nurse", "LaboratoryEmployee" };

            foreach (var user in usersWithStaff)
            {
                if (staffRoles.Contains(user.Role))
                {
                    if (user.MedicalStaff == null)
                    {
                        var position = user.Role switch
                        {
                            "Doctor" => "Врач",
                            "ChiefDoctor" => "Главный врач",
                            "HeadNurse" => "Старшая медицинская сестра",
                            "Nurse" => "Медицинская сестра",
                            "LaboratoryEmployee" => "Лаборант",
                            _ => "Сотрудник"
                        };

                        var staff = new MedicalStaff
                        {
                            Id = Guid.NewGuid(),
                            Name = user.DisplayName ?? user.Login,
                            Position = position
                        };
                        context.MedicalStaff.Add(staff);
                        user.MedicalStaff = staff;
                        user.MedicalStaffId = staff.Id;
                    }
                    else
                    {
                        user.MedicalStaff.Position = user.Role switch
                        {
                            "Doctor" => "Врач",
                            "ChiefDoctor" => "Главный врач",
                            "HeadNurse" => "Старшая медицинская сестра",
                            "Nurse" => "Медицинская сестра",
                            "LaboratoryEmployee" => "Лаборант",
                            _ => user.Role
                        };
                    }
                }
            }
            await context.SaveChangesAsync();
        }

        public static async Task DistributeBedsAndMedicinesAsync(MedicalSystemDbContext context, ILogger logger)
        {
            
            bool hasOccupiedBeds = await context.HospitalBeds.AnyAsync(b => b.PatientId != null);
            bool hasMedications = await context.PatientMedications.AnyAsync();
            bool hasBedPrescriptions = await context.BedPrescriptions.AnyAsync();

            if (hasOccupiedBeds || hasMedications || hasBedPrescriptions)
            {
                logger.LogInformation("Данные стационара (пациенты на койках, назначения) уже присутствуют в БД. Пропуск генерации.");
                return;
            }

            logger.LogInformation("Начало перераспределения пациентов по койкам и списания медикаментов...");

            var rnd = new Random(42);

            
            var patients = await context.Patients.ToListAsync();
            var beds = await context.HospitalBeds.Include(b => b.Room).ToListAsync();
            var medicines = await context.Medicines.ToListAsync();
            var staff = await context.MedicalStaff.ToListAsync();

            if (!patients.Any() || !beds.Any() || !medicines.Any() || !staff.Any())
            {
                logger.LogWarning("Недостаточно данных в базе для распределения коек и медикаментов.");
                return;
            }

            
            foreach (var p in patients)
            {
                p.Status = PatientStatus.Discharged;
            }

            foreach (var bed in beds)
            {
                bed.PatientId = null;
                bed.Status = BedStatus.Free;
                bed.AdmissionDate = null;
                bed.BedNote = null;
            }

            
            var malePatients = patients.Where(p => p.Gender == Gender.Male).ToList();
            var femalePatients = patients.Where(p => p.Gender == Gender.Female).ToList();

            int maleIdx = 0;
            int femaleIdx = 0;

            var occupiedBeds = new List<HospitalBed>();
            var hospitalizedPatients = new List<Patient>();

            var nurseInstructions = new[]
            {
                "Контроль температуры тела каждые 4 часа.",
                "Следить за показателями АД и пульса утром и вечером.",
                "Проведение ингаляций утром.",
                "Постельный режим, дыхательная гимнастика.",
                "Контроль диуреза, ограничение соли.",
                "Оценка насыщения крови кислородом (SpO2) 3 раза в день.",
                "Обильное теплое питье, контроль ЧДД."
            };

            foreach (var bed in beds)
            {
                
                if (rnd.Next(0, 100) < 50)
                {
                    Patient patientToAdmit = null;

                    if (bed.Room.Gender == RoomGender.Male && maleIdx < malePatients.Count)
                    {
                        patientToAdmit = malePatients[maleIdx++];
                    }
                    else if (bed.Room.Gender == RoomGender.Female && femaleIdx < femalePatients.Count)
                    {
                        patientToAdmit = femalePatients[femaleIdx++];
                    }

                    if (patientToAdmit != null)
                    {
                        patientToAdmit.Status = PatientStatus.Hospitalized;
                        hospitalizedPatients.Add(patientToAdmit);

                        
                        int randStatusVal = rnd.Next(100);
                        BedStatus status = BedStatus.Stable;
                        if (randStatusVal >= 80 && randStatusVal < 95)
                            status = BedStatus.Attention;
                        else if (randStatusVal >= 95)
                            status = BedStatus.Urgent;

                        bed.PatientId = patientToAdmit.Id;
                        bed.Status = status;
                        bed.AdmissionDate = DateTime.Now.AddDays(-rnd.Next(1, 15));
                        bed.BedNote = nurseInstructions[rnd.Next(nurseInstructions.Length)];

                        occupiedBeds.Add(bed);
                    }
                }
            }

            logger.LogInformation("Распределено {Count} пациентов по койкам.", hospitalizedPatients.Count);

            
            context.BedPrescriptions.RemoveRange(context.BedPrescriptions);
            context.MedicineOperationLogs.RemoveRange(context.MedicineOperationLogs);
            await context.SaveChangesAsync();

            context.PatientMedications.RemoveRange(context.PatientMedications);
            context.Set<Prescription>().RemoveRange(context.Set<Prescription>());
            await context.SaveChangesAsync();

            
            foreach (var med in medicines)
            {
                med.CurrentBalance = 150m;
                med.MinBalance = 15m;
                med.Status = MedicineStatus.Norm;
            }

            
            if (medicines.Count >= 2)
            {
                medicines[0].CurrentBalance = 4m;
                medicines[0].MinBalance = 10m;
                medicines[0].Status = MedicineStatus.Low;

                medicines[1].CurrentBalance = 0m;
                medicines[1].MinBalance = 5m;
                medicines[1].Status = MedicineStatus.Empty;
            }

            var doctors = staff.Where(s => s.Position != null &&
                (s.Position.Contains("Врач") || s.Position.Contains("врач"))).ToList();
            if (!doctors.Any()) doctors = staff;

            var nurses = staff.Where(s => s.Position != null &&
                (s.Position.Contains("сестра") || s.Position.Contains("Сестра"))).ToList();
            if (!nurses.Any()) nurses = staff;

            var regimenOptions = new[] {
                "1 раз в день утром", "2 раза в день (утром и вечером)",
                "3 раза в день после еды", "1 раз в 12 часов"
            };

            var scheduledTimes = new[] {
                new TimeSpan(8, 0, 0),
                new TimeSpan(14, 0, 0),
                new TimeSpan(20, 0, 0)
            };

            var writeoffReasons = new[] {
                WriteOffReason.Patient, WriteOffReason.Iv, WriteOffReason.Im, WriteOffReason.Drip
            };

            foreach (var patient in hospitalizedPatients)
            {
                int prescCount = rnd.Next(2, 4);
                var assignedMedicines = new HashSet<Guid>();
                for (int j = 0; j < prescCount; j++)
                {
                    Medicine medicine;
                    int attempts = 0;
                    do
                    {
                        medicine = medicines[rnd.Next(medicines.Count)];
                        attempts++;
                    } while (assignedMedicines.Contains(medicine.Id) && attempts < 10);

                    assignedMedicines.Add(medicine.Id);

                    var doctor = doctors[rnd.Next(doctors.Count)];

                    string doseStr = medicine.Unit switch
                    {
                        MedicineUnit.Tablet => "1 таб.",
                        MedicineUnit.Capsule => "1 капс.",
                        MedicineUnit.Vial => "1 фл.",
                        MedicineUnit.Ml => "10 мл",
                        _ => "1 шт."
                    };

                    var pm = new PatientMedication
                    {
                        Id = Guid.NewGuid(),
                        PatientId = patient.Id,
                        MedicineId = medicine.Id,
                        Name = medicine.Name,
                        Dose = doseStr,
                        Form = medicine.Unit.ToString(),
                        Regimen = regimenOptions[rnd.Next(regimenOptions.Length)],
                        Status = MedicationStatus.Active,
                        DoctorId = doctor.Id,
                        DateStart = DateTime.Now.AddDays(-rnd.Next(1, 5)),
                        DateEnd = DateTime.Now.AddDays(rnd.Next(2, 10))
                    };

                    context.PatientMedications.Add(pm);

                    var pr = new Prescription
                    {
                        Id = pm.Id,
                        PatientId = patient.Id,
                        MedicineId = medicine.Id,
                        Drug = medicine.Name,
                        Dose = doseStr,
                        Form = medicine.Unit.ToString(),
                        Route = "Внутрь",
                        Regimen = pm.Regimen,
                        DateStart = pm.DateStart,
                        DateEnd = pm.DateEnd,
                        DoctorId = doctor.Id,
                        Comment = "Автоматическое назначение при госпитализации."
                    };
                    context.Set<Prescription>().Add(pr);

                    var timesToSchedule = GetTimesForRegimen(pm.Regimen);
                    foreach (var schedTime in timesToSchedule)
                    {
                        bool isDone = schedTime < DateTime.Now.TimeOfDay;

                        var nurse = nurses[rnd.Next(nurses.Count)];

                        var bp = new BedPrescription
                        {
                            Id = Guid.NewGuid(),
                            PatientId = patient.Id,
                            PatientMedication = pm,
                            Name = pm.Name,
                            Dose = pm.Dose,
                            ScheduledTime = schedTime,
                            Date = DateTime.Now.Date,
                            IsDone = isDone,
                            DoneAt = isDone ? DateTime.Now.Date.Add(schedTime).AddMinutes(rnd.Next(-10, 20)) : (DateTime?)null,
                            DoneBy = isDone ? $"{nurse.Position} {nurse.Name}" : null
                        };

                        context.BedPrescriptions.Add(bp);

                        if (isDone)
                        {
                            decimal quantityToWriteOff = 1m;
                            
                            var log = new MedicineOperationLog
                            {
                                Id = Guid.NewGuid(),
                                MedicineId = medicine.Id,
                                PerformedAt = bp.DoneAt ?? DateTime.Now,
                                Type = OperationType.Writeoff,
                                Quantity = quantityToWriteOff,
                                BalanceAfter = medicine.CurrentBalance - quantityToWriteOff,
                                PerformedById = nurse.Id,
                                Comment = "Списано автоматически при выполнении назначения в листе обхода.",
                                Reason = writeoffReasons[rnd.Next(writeoffReasons.Length)],
                                PatientId = patient.Id,
                                Prescription = pm
                            };

                            medicine.CurrentBalance -= quantityToWriteOff;
                            if (medicine.CurrentBalance < 0)
                                medicine.CurrentBalance = 0;

                            
                            medicine.Status = medicine.CurrentBalance == 0
                                ? MedicineStatus.Empty
                                : (medicine.CurrentBalance < medicine.MinBalance ? MedicineStatus.Low : MedicineStatus.Norm);

                            
                            medicine.LastChangedById = nurse.Id;
                            medicine.LastUpdated = bp.DoneAt ?? DateTime.UtcNow;
                            medicine.LastOperation = OperationType.Writeoff;

                            context.MedicineOperationLogs.Add(log);
                        }
                    }
                }
            }

            
            if (medicines.Any())
            {
                for (int i = 0; i < 15; i++)
                {
                    var medicine = medicines[rnd.Next(medicines.Count)];
                    var staffMember = staff[rnd.Next(staff.Count)];

                    var log = new MedicineOperationLog
                    {
                        Id = Guid.NewGuid(),
                        MedicineId = medicine.Id,
                        PerformedAt = DateTime.Now.AddDays(-rnd.Next(1, 10)),
                        Type = OperationType.Receipt,
                        Quantity = rnd.Next(10, 100),
                        BalanceAfter = medicine.CurrentBalance + 50m,
                        PerformedById = staffMember.Id,
                        Comment = "Плановое поступление на склад.",
                        Supplier = "ООО ФармСнаб"
                    };
                    context.MedicineOperationLogs.Add(log);
                }
            }

            await context.SaveChangesAsync();
            logger.LogInformation("Распределение коек и списание медикаментов успешно выполнены.");
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