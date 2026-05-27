using Bogus;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MedicalSystem.App.Services
{
    public static class TestDataGenerator
    {
        // --- Независимые справочники ---

        public static List<Department> GenerateDepartments(int count)
        {
            return new Faker<Department>("ru")
                .RuleFor(d => d.Id, f => f.Random.Guid())
                .RuleFor(d => d.Name, f => f.Commerce.Department().Substring(0, Math.Min(f.Commerce.Department().Length, 100)))
                .Generate(count);
        }

        public static List<Position> GeneratePositions(int count)
        {
            return new Faker<Position>("ru")
                .RuleFor(p => p.Id, f => f.Random.Guid())
                .RuleFor(p => p.Name, f => f.Name.JobTitle().Substring(0, Math.Min(f.Name.JobTitle().Length, 100)))
                .Generate(count);
        }

        public static List<Institution> GenerateInstitutions(int count)
        {
            return new Faker<Institution>("ru")
                .RuleFor(i => i.Id, f => f.Random.Guid())
                .RuleFor(i => i.Name, f => $"Больница №{f.Random.Number(1, 100)}".Substring(0, Math.Min(20, 200)))
                .Generate(count);
        }

        // --- Зависимые сущности ---

        public static List<MedicalStaff> GenerateMedicalStaff(int count, List<Position> positions, List<Department> departments)
        {
            if (!positions.Any() || !departments.Any())
                return new List<MedicalStaff>();

            return new Faker<MedicalStaff>("ru")
                .RuleFor(ms => ms.Id, f => f.Random.Guid())
                .RuleFor(ms => ms.Name, f => f.Name.FullName().Substring(0, Math.Min(f.Name.FullName().Length, 200)))
                .RuleFor(ms => ms.PositionId, f => f.PickRandom(positions).Id)
                .RuleFor(ms => ms.DepartmentId, f => f.PickRandom(departments).Id)
                .Generate(count);
        }

        public static List<Patient> GeneratePatients(int count, List<MedicalStaff> staff, List<Department> departments, List<Institution> institutions)
        {
            if (!staff.Any() || !departments.Any() || !institutions.Any())
                return new List<Patient>();

            return new Faker<Patient>("ru")
                .RuleFor(p => p.Id, f => f.Random.Guid())
                .RuleFor(p => p.Gender, f => f.PickRandom<Gender>())
                .RuleFor(p => p.FirstName, (f, p) => f.Name.FirstName((Bogus.DataSets.Name.Gender)p.Gender).Substring(0, Math.Min(f.Name.FirstName().Length, 100)))
                .RuleFor(p => p.LastName, (f, p) => f.Name.LastName((Bogus.DataSets.Name.Gender)p.Gender).Substring(0, Math.Min(f.Name.LastName().Length, 100)))
                .RuleFor(p => p.DateOfBirth, f => f.Date.Past(50, DateTime.Now.AddYears(-18)))
                .RuleFor(p => p.MedcardNum, f => f.Random.Replace("???-###-???").Substring(0, Math.Min(11, 50)))
                .RuleFor(p => p.Status, f => f.PickRandom<PatientStatus>())
                .RuleFor(p => p.DoctorId, f => f.PickRandom(staff).Id)
                .RuleFor(p => p.DepartmentId, f => f.PickRandom(departments).Id)
                .RuleFor(p => p.InstitutionId, f => f.PickRandom(institutions).Id)
                .RuleFor(p => p.CreatedAt, f => f.Date.Past(2))
                .RuleFor(p => p.LastUpdated, (f, p) => f.Date.Between(p.CreatedAt, DateTime.Now))
                .Generate(count);
        }

        public static List<Appointment> GenerateAppointments(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any())
                return new List<Appointment>();

            return new Faker<Appointment>("ru")
                .RuleFor(a => a.Id, f => f.Random.Guid())
                .RuleFor(a => a.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(a => a.DoctorId, f => f.PickRandom(staff).Id)
                .RuleFor(a => a.Time, f => f.Date.Future())
                .RuleFor(a => a.Reason, f => f.Lorem.Sentence().Substring(0, Math.Min(f.Lorem.Sentence().Length, 300)))
                .RuleFor(a => a.Status, f => f.PickRandom<AppointmentStatus>())
                .RuleFor(a => a.Type, f => f.PickRandom<AppointmentType>())
                .Generate(count);
        }

        public static List<Medicine> GenerateMedicines(int count, List<MedicalStaff> staff)
        {
             if (!staff.Any())
                return new List<Medicine>();

            return new Faker<Medicine>("ru")
                .RuleFor(m => m.Id, f => f.Random.Guid())
                .RuleFor(m => m.Name, f => f.Commerce.ProductName().Substring(0, Math.Min(f.Commerce.ProductName().Length, 200)))
                .RuleFor(m => m.Category, f => f.PickRandom<MedicineCategory>())
                .RuleFor(m => m.Unit, f => f.PickRandom<MedicineUnit>())
                .RuleFor(m => m.CurrentBalance, f => f.Random.Decimal(10, 1000))
                .RuleFor(m => m.MinBalance, 50)
                .RuleFor(m => m.Status, f => f.PickRandom<MedicineStatus>())
                .RuleFor(m => m.LastChangedById, f => f.PickRandom(staff).Id)
                .RuleFor(m => m.IsArchived, f => f.Random.Bool(0.1f))
                .Generate(count);
        }

        public static List<Allergy> GenerateAllergies(int count, List<Patient> patients)
        {
            if (!patients.Any())
                return new List<Allergy>();

            return new Faker<Allergy>("ru")
                .RuleFor(a => a.Id, f => f.Random.Guid())
                .RuleFor(a => a.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(a => a.Name, f => f.Lorem.Word())
                .RuleFor(a => a.Reaction, f => f.Lorem.Sentence())
                .Generate(count);
        }

        public static List<VitalSign> GenerateVitalSigns(int count, List<Patient> patients)
        {
            if (!patients.Any())
                return new List<VitalSign>();

            return new Faker<VitalSign>("ru")
                .RuleFor(vs => vs.Id, f => f.Random.Guid())
                .RuleFor(vs => vs.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(vs => vs.RecordedAt, f => f.Date.Recent(30))
                .RuleFor(vs => vs.BloodPressureSystolic, f => f.Random.Short(110, 140))
                .RuleFor(vs => vs.BloodPressureDiastolic, f => f.Random.Short(70, 90))
                .RuleFor(vs => vs.Temperature, f => f.Random.Decimal(36.5m, 38.5m))
                .RuleFor(vs => vs.Pulse, f => f.Random.Short(60, 100))
                .RuleFor(vs => vs.SpO2, f => f.Random.Short(95, 100))
                .RuleFor(vs => vs.RespiratoryRate, f => f.Random.Short(16, 22))
                .Generate(count);
        }
    }
}
