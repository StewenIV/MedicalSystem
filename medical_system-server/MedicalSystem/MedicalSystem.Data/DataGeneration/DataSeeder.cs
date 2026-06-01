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

namespace MedicalSystem.Data.DataGeneration
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(MedicalSystemDbContext context, ILogger logger)
        {
            try
            {
                logger.LogInformation("Проверка и заполнение базы данных...");

                // 1. Справочники
                var departments = await GetOrCreateAsync(context, context.Departments, () => TestDataGenerator.GenerateDepartments(10));
                var positions = await GetOrCreateAsync(context, context.Positions, () => TestDataGenerator.GeneratePositions(20));
                var institutions = await GetOrCreateAsync(context, context.Institutions, () => TestDataGenerator.GenerateInstitutions(5));

                // 2. Основные сущности
                var medicalStaff = await GetOrCreateAsync(context, context.MedicalStaff, () => TestDataGenerator.GenerateMedicalStaff(50, departments: departments, positions: positions));
                var patients = await GetOrCreateAsync(context, context.Patients, () => TestDataGenerator.GeneratePatients(200, medicalStaff, departments, institutions));
                var medicines = await GetOrCreateAsync(context, context.Medicines, () => TestDataGenerator.GenerateMedicines(100, medicalStaff));
                var rooms = await GetOrCreateAsync(context, context.Rooms, () => TestDataGenerator.GenerateRooms(16, departments));
                
                // 3. Зависимые сущности
                var hospitalBeds = await GetOrCreateAsync(context, context.HospitalBeds, () => TestDataGenerator.GenerateHospitalBeds(0, rooms, patients));

                // 4. Установка статуса палат после генерации коек
                if (rooms.Any() && hospitalBeds.Any())
                {
                    foreach (var room in rooms)
                    {
                        room.Status = hospitalBeds.Any(b => b.RoomId == room.Id && b.Status != BedStatus.Free) 
                            ? RoomStatus.Occupied 
                            : RoomStatus.Free;
                    }
                }

                var appointments = await GetOrCreateAsync(context, context.Appointments, () => TestDataGenerator.GenerateAppointments(500, patients, medicalStaff));
                var allergies = await GetOrCreateAsync(context, context.Allergies, () => TestDataGenerator.GenerateAllergies(150, patients));
                var medicalProblems = await GetOrCreateAsync(context, context.MedicalProblems, () => TestDataGenerator.GenerateMedicalProblems(300, patients));
                var encounters = await GetOrCreateAsync(context, context.Encounters, () => TestDataGenerator.GenerateEncounters(400, patients, medicalStaff));
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

                // Сохраняем все изменения
                await context.SaveChangesAsync();

                logger.LogInformation("Проверка и заполнение базы данных завершены.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Произошла ошибка во время заполнения базы данных.");
            }
        }

        // Вспомогательный метод: если в БД уже есть данные, возвращает их. 
        // Иначе - генерирует новые, добавляет в контекст и возвращает сгенерированные.
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
    }
}