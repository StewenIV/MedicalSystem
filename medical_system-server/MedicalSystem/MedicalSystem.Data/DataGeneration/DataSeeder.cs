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
                    
                var departments = await GetOrCreateAsync(context, context.Departments, () => TestDataGenerator.GenerateDepartments(10));
                var positions = await GetOrCreateAsync(context, context.Positions, () => TestDataGenerator.GeneratePositions(20));
                var institutions = await GetOrCreateAsync(context, context.Institutions, () => TestDataGenerator.GenerateInstitutions(5));
                
                var medicalStaff = await GetOrCreateAsync(context, context.MedicalStaff, () => TestDataGenerator.GenerateMedicalStaff(50, departments: departments, positions: positions));
                var patients = await GetOrCreateAsync(context, context.Patients, () => TestDataGenerator.GeneratePatients(200, medicalStaff, departments, institutions));
                var medicines = await GetOrCreateAsync(context, context.Medicines, () => TestDataGenerator.GenerateMedicines(100, medicalStaff));
                var rooms = await GetOrCreateAsync(context, context.Rooms, () => TestDataGenerator.GenerateRooms(16, departments));
                
                var hospitalBeds = await GetOrCreateAsync(context, context.HospitalBeds, () => TestDataGenerator.GenerateHospitalBeds(0, rooms, patients));
                var appointments = await GetOrCreateAsync(context, context.Appointments, () => TestDataGenerator.GenerateAppointments(500, patients, medicalStaff));
                var allergies = await GetOrCreateAsync(context, context.Allergies, () => TestDataGenerator.GenerateAllergies(150, patients));
                var medicalProblems = await GetOrCreateAsync(context, context.MedicalProblems, () => TestDataGenerator.GenerateMedicalProblems(300, patients));
                var encounters = await GetOrCreateAsync(context, context.Encounters, () => TestDataGenerator.GenerateEncounters(400, patients, medicalStaff));
                
                // Backfill existing encounters with Russian clinical details if missing
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

                // Ensure EVERY patient has at least one encounter
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

                await SeedUsersAsync(context, logger);

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

        private static async Task SeedUsersAsync(MedicalSystemDbContext context, ILogger logger)
        {
            var testUsers = new[]
            {
                new { Login = "doctor1",    Password = "Password123!", Role = "Doctor",            DisplayName = "Иванов Иван Иванович" },
                new { Login = "nurse1",     Password = "Password123!", Role = "Nurse",             DisplayName = "Петрова Анна Сергеевна" },
                new { Login = "head_nurse1",Password = "Password123!", Role = "HeadNurse",         DisplayName = "Смирнова Ольга Николаевна" },
                new { Login = "chief1",     Password = "Password123!", Role = "ChiefDoctor",       DisplayName = "Козлов Дмитрий Александрович" },
                new { Login = "lab1",       Password = "Password123!", Role = "LaboratoryEmployee",DisplayName = "Лабораторный сотрудник" },
                new { Login = "patient1",   Password = "Password123!", Role = "Patient",           DisplayName = "Пациент Тестовый" },
            };

            foreach (var u in testUsers)
            {
                var exists = await context.Users.AnyAsync(x => x.Login == u.Login);
                if (!exists)
                {
                    context.Users.Add(new User
                    {
                        Id = Guid.NewGuid(),
                        Login = u.Login,
                        PasswordHash = BC.HashPassword(u.Password),
                        Role = u.Role,
                        DisplayName = u.DisplayName,
                        CreatedAt = DateTime.UtcNow
                    });
                    logger.LogInformation("Создан тестовый пользователь: {Login} [{Role}]", u.Login, u.Role);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}