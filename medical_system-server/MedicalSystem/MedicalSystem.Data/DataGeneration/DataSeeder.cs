using MedicalSystem.App.Services;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using MedicalSystem.Domain.Models;
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
                
                await context.Database.ExecuteSqlRawAsync(
                    "UPDATE \"Patients\" SET \"Gender\" = 'Мужской' WHERE \"Gender\" = 'Male'; " +
                    "UPDATE \"Patients\" SET \"Gender\" = 'Женский' WHERE \"Gender\" = 'Female';");
                    
                var institutions = await GetOrCreateAsync(context, context.Institutions, () => TestDataGenerator.GenerateInstitutions(5));
                
                var medicalStaff = await GetOrCreateAsync(context, context.MedicalStaff, () => TestDataGenerator.GenerateMedicalStaff(50));
                var patients = await GetOrCreateAsync(context, context.Patients, () => TestDataGenerator.GeneratePatients(200, medicalStaff, institutions));

                var hasEmpty = await context.Medicines.AnyAsync(m => m.CurrentBalance == 0);
                if (await context.Medicines.AnyAsync(m => m.Name.Contains("Кошелек") || m.Name.Contains("Большой")) || !hasEmpty)
                {
                    logger.LogInformation("Обнаружены старые или однородные данные медикаментов. Очистка таблиц перед повторным заполнением...");
                    context.BedPrescriptions.RemoveRange(context.BedPrescriptions);
                    context.PatientMedications.RemoveRange(context.PatientMedications);
                    context.MedicineOperationLogs.RemoveRange(context.MedicineOperationLogs);
                    context.Medicines.RemoveRange(context.Medicines);
                    await context.SaveChangesAsync();
                }

                var medicines = await GetOrCreateAsync(context, context.Medicines, () => TestDataGenerator.GenerateMedicines(100, medicalStaff));
                var rooms = await GetOrCreateAsync(context, context.Rooms, () => TestDataGenerator.GenerateRooms(16));
                
                var hospitalBeds = await GetOrCreateAsync(context, context.HospitalBeds, () => TestDataGenerator.GenerateHospitalBeds(0, rooms, patients));
                var appointments = await GetOrCreateAsync(context, context.Appointments, () => TestDataGenerator.GenerateAppointments(500, patients, medicalStaff));
                var allergies = await GetOrCreateAsync(context, context.Allergies, () => TestDataGenerator.GenerateAllergies(150, patients));
                var medicalProblems = await GetOrCreateAsync(context, context.MedicalProblems, () => TestDataGenerator.GenerateMedicalProblems(300, patients));
                var encounters = await GetOrCreateAsync(context, context.Encounters, () => TestDataGenerator.GenerateEncounters(400, patients, medicalStaff));
                
                var missingDetails = encounters.Where(e => string.IsNullOrWhiteSpace(e.Type) || string.IsNullOrWhiteSpace(e.Objective) || string.IsNullOrWhiteSpace(e.Recommendations)).ToList();
                if (missingDetails.Any())
                {
                    var types = new[] { "Осмотр", "Консультация", "Процедура", "Операция", "Анализы", "Выписка" };
                    var faker = new Bogus.Faker("ru");
                    foreach (var enc in missingDetails)
                    {
                        if (string.IsNullOrWhiteSpace(enc.Type)) enc.Type = faker.PickRandom(types);
                        if (string.IsNullOrWhiteSpace(enc.Complaints)) enc.Complaints = "Жалобы на " + faker.PickRandom("слабость и головную боль", "кашель и насморк", "боли в суставах", "дискомфорт в грудной клетке", "повышенную температуру");
                        if (string.IsNullOrWhiteSpace(enc.Objective)) enc.Objective = "Состояние " + faker.PickRandom("удовлетворительное", "средней степени тяжести") + ". Кожные покровы чистые. Дыхание везикулярное.";
                        if (string.IsNullOrWhiteSpace(enc.Conclusion)) enc.Conclusion = faker.PickRandom("Острый бронхит", "Артериальная гипертензия", "ОРВИ", "Остеохондроз", "ИБС");
                        if (string.IsNullOrWhiteSpace(enc.Recommendations)) enc.Recommendations = faker.PickRandom("Режим амбулаторный, прием витаминов.", "Контроль АД, диета с ограничением соли.", "Постельный режим, обильное теплое питье.", "Наблюдение терапевта по месту жительства.");
                    }
                    context.UpdateRange(missingDetails);
                }

                 var patientsWithNoEncounters = patients.Where(p => !context.Encounters.Any(e => e.PatientId == p.Id)).ToList();
                if (patientsWithNoEncounters.Any())
                {
                    var types = new[] { "Осмотр", "Консультация", "Процедура", "Операция", "Анализы", "Выписка" };
                    var random = new Random(0);
                    var complaintsList = new[] { "слабость и головную боль", "кашель и насморк", "боли в суставах", "дискомфорт в грудной клетке", "повышенную температуру" };
                    var objectiveList = new[] { "удовлетворительное", "средней степени тяжести" };
                    var conclusionList = new[] { "Острый бронхит", "Артериальная гипертензия", "ОРВИ", "Остеохондроз", "ИБС" };
                    var recommendationsList = new[] { "Режим амбулаторный, прием витаминов.", "Контроль АД, диета с ограничением соли.", "Постельный режим, обильное теплое питье.", "Наблюдение терапевта по месту жительства." };

                    var newEncounters = new List<Encounter>();
                    foreach (var patient in patientsWithNoEncounters)
                    {
                        var numEncounters = random.Next(1, 3);
                        for (int i = 0; i < numEncounters; i++)
                        {
                            var doctor = medicalStaff[random.Next(medicalStaff.Count)];
                            var date = DateTime.Now.AddDays(-random.Next(1, 1000));
                            var type = types[random.Next(types.Length)];
                            var complaints = "Жалобы на " + complaintsList[random.Next(complaintsList.Length)];
                            var objective = "Состояние " + objectiveList[random.Next(objectiveList.Length)] + ". Кожные покровы чистые. Дыхание везикулярное.";
                            var conclusion = conclusionList[random.Next(conclusionList.Length)];
                            var recommendations = recommendationsList[random.Next(recommendationsList.Length)];

                            newEncounters.Add(new Encounter
                            {
                                Id = Guid.NewGuid(),
                                PatientId = patient.Id,
                                DoctorId = doctor.Id,
                                DateTime = date,
                                Type = type,
                                Complaints = complaints,
                                Objective = objective,
                                Conclusion = conclusion,
                                Recommendations = recommendations
                            });
                        }
                    }
                    await context.Encounters.AddRangeAsync(newEncounters);
                    await context.SaveChangesAsync();
                }

                var patientMedications = await GetOrCreateAsync(context, context.PatientMedications, () => TestDataGenerator.GeneratePatientMedications(600, patients, medicines, medicalStaff));
                var labResults = await GetOrCreateAsync(context, context.LabResults, () => TestDataGenerator.GenerateLabResults(1000, patients, medicalStaff));
                var operations = await GetOrCreateAsync(context, context.Operations, () => TestDataGenerator.GenerateOperations(50, patients));
                var vaccines = await GetOrCreateAsync(context, context.Vaccines, () => TestDataGenerator.GenerateVaccines(300, patients));
                var patientDocuments = await GetOrCreateAsync(context, context.PatientDocuments, () => TestDataGenerator.GeneratePatientDocuments(400, patients));
                var vitalSigns = await GetOrCreateAsync(context, context.VitalSigns, () => TestDataGenerator.GenerateVitalSigns(2000, patients));
                var shifts = await GetOrCreateAsync(context, context.Shifts, () => TestDataGenerator.GenerateShifts(150, medicalStaff));
                var notifications = await GetOrCreateAsync(context, context.Notifications, () => TestDataGenerator.GenerateNotifications(50, medicalStaff, patients));
                var patientRelatives = await GetOrCreateAsync(context, context.PatientRelatives, () => TestDataGenerator.GeneratePatientRelatives(250, patients));
                
                var bedPrescriptions = await GetOrCreateAsync(context, context.BedPrescriptions, () => TestDataGenerator.GenerateBedPrescriptions(1000, patients, patientMedications));
                var bedActionLogs = await GetOrCreateAsync(context, context.BedActionLogs, () => TestDataGenerator.GenerateBedActionLogs(1500, patients, medicalStaff));
                var medicineOperationLogs = await GetOrCreateAsync(context, context.MedicineOperationLogs, () => TestDataGenerator.GenerateMedicineOperationLogs(500, medicines, medicalStaff, patients, patientMedications));
                
                var bedOccupancyHistories = await GetOrCreateAsync(context, context.BedOccupancyHistories, () => TestDataGenerator.GenerateBedOccupancyHistories(hospitalBeds, patients));
                
                await context.SaveChangesAsync();

                await SeedUsersAsync(context, logger, medicalStaff);

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
                string login = $"patient{pCount}";

                if (!usersById.TryGetValue(patient.Id, out var existingUser))
                {
                    if (usersByLogin.TryGetValue(login, out var userWithLogin))
                    {
                        context.Users.Remove(userWithLogin);
                        usersById.Remove(userWithLogin.Id);
                        usersByLogin.Remove(login);
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
                }
                else
                {
                    existingUser.Login = login;
                    existingUser.Role = "Patient";
                    existingUser.DisplayName = $"{patient.LastName} {patient.FirstName} {patient.MiddleName}".Trim();
                    existingUser.PasswordHash = hashedPwd;
                    existingUser.PatientId = patient.Id;
                    context.Users.Update(existingUser);
                }
                pCount++;
            }
            await context.SaveChangesAsync();
            logger.LogInformation("Создано/актуализировано {Count} аккаунтов пациентов с паролями patient1..patientN", patients.Count);

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
                            logger.LogInformation("Привязан существующий логин {Login} к сотруднику {StaffName}", login, staff.Name);
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
    }
}