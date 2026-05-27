using MedicalSystem.App.Services;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace MedicalSystem.Data.DataGeneration
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(MedicalSystemDbContext context, ILogger logger)
        {
            try
            {
                if (await context.Patients.AnyAsync())
                {
                    logger.LogInformation("База данных уже содержит данные. Заполнение не требуется.");
                    return;
                }
                logger.LogInformation("База данных пуста. Начинается процесс заполнения тестовыми данными...");

                // --- Генерация ---
                var departments = TestDataGenerator.GenerateDepartments(10);
                var positions = TestDataGenerator.GeneratePositions(20);
                var institutions = TestDataGenerator.GenerateInstitutions(5);
                var medicalStaff = TestDataGenerator.GenerateMedicalStaff(50, positions, departments);
                var patients = TestDataGenerator.GeneratePatients(200, medicalStaff, departments, institutions);
                var medicines = TestDataGenerator.GenerateMedicines(100, medicalStaff);
                var rooms = TestDataGenerator.GenerateRooms(40, departments);
                var hospitalBeds = TestDataGenerator.GenerateHospitalBeds(120, rooms, patients);
                var appointments = TestDataGenerator.GenerateAppointments(500, patients, medicalStaff);
                var allergies = TestDataGenerator.GenerateAllergies(150, patients);
                var medicalProblems = TestDataGenerator.GenerateMedicalProblems(300, patients);
                var encounters = TestDataGenerator.GenerateEncounters(400, patients, medicalStaff);
                var patientMedications = TestDataGenerator.GeneratePatientMedications(600, patients, medicines, medicalStaff);
                var labResults = TestDataGenerator.GenerateLabResults(1000, patients, medicalStaff);
                var operations = TestDataGenerator.GenerateOperations(50, patients);
                var vaccines = TestDataGenerator.GenerateVaccines(300, patients);
                var patientDocuments = TestDataGenerator.GeneratePatientDocuments(400, patients);
                var vitalSigns = TestDataGenerator.GenerateVitalSigns(2000, patients);
                var shifts = TestDataGenerator.GenerateShifts(150, medicalStaff);
                var notifications = TestDataGenerator.GenerateNotifications(50, medicalStaff, patients);
                var patientRelatives = TestDataGenerator.GeneratePatientRelatives(250, patients);
                var bedPrescriptions = TestDataGenerator.GenerateBedPrescriptions(1000, patients, patientMedications);
                var bedActionLogs = TestDataGenerator.GenerateBedActionLogs(1500, patients, medicalStaff);
                var medicineOperationLogs = TestDataGenerator.GenerateMedicineOperationLogs(500, medicines, medicalStaff, patients, patientMedications);

                // --- Сохранение ---
                await context.Departments.AddRangeAsync(departments);
                await context.Positions.AddRangeAsync(positions);
                await context.Institutions.AddRangeAsync(institutions);
                await context.MedicalStaff.AddRangeAsync(medicalStaff);
                await context.Patients.AddRangeAsync(patients); // Включая Owned типы
                await context.Medicines.AddRangeAsync(medicines);
                await context.Rooms.AddRangeAsync(rooms);
                await context.HospitalBeds.AddRangeAsync(hospitalBeds);
                await context.Appointments.AddRangeAsync(appointments);
                await context.Allergies.AddRangeAsync(allergies);
                await context.MedicalProblems.AddRangeAsync(medicalProblems);
                await context.Encounters.AddRangeAsync(encounters);
                await context.PatientMedications.AddRangeAsync(patientMedications);
                await context.LabResults.AddRangeAsync(labResults);
                await context.Operations.AddRangeAsync(operations);
                await context.Vaccines.AddRangeAsync(vaccines);
                await context.PatientDocuments.AddRangeAsync(patientDocuments);
                await context.VitalSigns.AddRangeAsync(vitalSigns);
                await context.Shifts.AddRangeAsync(shifts);
                await context.Notifications.AddRangeAsync(notifications);
                await context.PatientRelatives.AddRangeAsync(patientRelatives);
                await context.BedPrescriptions.AddRangeAsync(bedPrescriptions);
                await context.BedActionLogs.AddRangeAsync(bedActionLogs);
                await context.MedicineOperationLogs.AddRangeAsync(medicineOperationLogs);

                await context.SaveChangesAsync();

                logger.LogInformation("Заполнение базы данных тестовыми данными успешно завершено.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Произошла ошибка во время заполнения базы данных.");
            }
        }
    }
}
