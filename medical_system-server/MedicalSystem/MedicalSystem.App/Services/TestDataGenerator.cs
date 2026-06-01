using Bogus;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Models.Owned;
using MedicalSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MedicalSystem.App.Services
{
    public static class TestDataGenerator
    {
        private static string Truncate(string value, int maxLength) => value.Length <= maxLength ? value : value.Substring(0, maxLength);

        private static Faker<PatientContacts> GetPatientContactsGenerator() =>
            new Faker<PatientContacts>("ru")
                .RuleFor(c => c.PhoneMobile, f => Truncate(f.Phone.PhoneNumber(), 20))
                .RuleFor(c => c.Email, f => Truncate(f.Internet.Email(), 150))
                .RuleFor(c => c.Address, f => Truncate(f.Address.FullAddress(), 300));

        private static Faker<PatientPassport> GetPatientPassportGenerator() =>
            new Faker<PatientPassport>("ru")
                .RuleFor(p => p.SeriesNumber, f => Truncate(f.Random.Replace("## ## ######"), 20))
                .RuleFor(p => p.IssuedBy, f => Truncate(f.Address.City() + " ГОВД", 300))
                .RuleFor(p => p.DateIssued, f => f.Date.Past(10));

        private static Faker<PatientWork> GetPatientWorkGenerator() =>
            new Faker<PatientWork>("ru")
                .RuleFor(w => w.Profession, f => Truncate(f.Name.JobTitle(), 150))
                .RuleFor(w => w.Organization, f => Truncate(f.Company.CompanyName(), 200));

        private static Faker<PatientOther> GetPatientOtherGenerator() =>
            new Faker<PatientOther>("ru")
                .RuleFor(o => o.Language, f => "Русский")
                .RuleFor(o => o.Nationality, f => "Россиянин");

        public static List<Department> GenerateDepartments(int count) =>
            new Faker<Department>("ru").UseSeed(0)
                .RuleFor(d => d.Id, f => f.Random.Guid())
                .RuleFor(d => d.Name, f => Truncate(f.Commerce.Department(), 100))
                .Generate(count);

        public static List<Position> GeneratePositions(int count) =>
            new Faker<Position>("ru").UseSeed(0)
                .RuleFor(p => p.Id, f => f.Random.Guid())
                .RuleFor(p => p.Name, f => Truncate(f.Name.JobTitle(), 100))
                .Generate(count);

        public static List<Institution> GenerateInstitutions(int count) =>
            new Faker<Institution>("ru").UseSeed(0)
                .RuleFor(i => i.Id, f => f.Random.Guid())
                .RuleFor(i => i.Name, f => Truncate($"Больница №{f.Random.Number(1, 100)}", 200))
                .Generate(count);

        public static List<MedicalStaff> GenerateMedicalStaff(int count, List<Position> positions, List<Department> departments)
        {
            if (!positions.Any() || !departments.Any()) return new List<MedicalStaff>();
            return new Faker<MedicalStaff>("ru").UseSeed(0)
                .RuleFor(ms => ms.Id, f => f.Random.Guid())
                .RuleFor(ms => ms.Name, f => Truncate(f.Name.FullName(), 200))
                .RuleFor(ms => ms.PositionId, f => f.PickRandom(positions).Id)
                .RuleFor(ms => ms.DepartmentId, f => f.PickRandom(departments).Id)
                .Generate(count);
        }

        public static List<Patient> GeneratePatients(int count, List<MedicalStaff> staff, List<Department> departments, List<Institution> institutions)
        {
            if (!staff.Any() || !departments.Any() || !institutions.Any()) return new List<Patient>();
            return new Faker<Patient>("ru").UseSeed(0)
                .RuleFor(p => p.Id, f => f.Random.Guid())
                .RuleFor(p => p.Gender, f => f.PickRandom<Gender>())
                .RuleFor(p => p.FirstName, (f, p) => Truncate(f.Name.FirstName((Bogus.DataSets.Name.Gender)p.Gender), 100))
                .RuleFor(p => p.LastName, (f, p) => Truncate(f.Name.LastName((Bogus.DataSets.Name.Gender)p.Gender), 100))
                .RuleFor(p => p.MiddleName, (f, p) => Truncate(f.Name.FirstName((Bogus.DataSets.Name.Gender)p.Gender) + "ович", 100))
                .RuleFor(p => p.DateOfBirth, f => f.Date.Past(80, DateTime.Now.AddYears(-1)))
                .RuleFor(p => p.MedcardNum, f => f.Random.Replace("???-###-???"))
                .RuleFor(p => p.HistoryNum, f => f.Random.Bool(0.7f) ? f.Random.Replace("##-####/##") : null)
                .RuleFor(p => p.Status, f => f.PickRandom<PatientStatus>())
                .RuleFor(p => p.MaritalStatus, f => Truncate(f.PickRandom(new[] { "женат/замужем", "холост/не замужем", "в разводе" }), 50))
                .RuleFor(p => p.DoctorId, f => f.PickRandom(staff).Id)
                .RuleFor(p => p.DepartmentId, f => f.PickRandom(departments).Id)
                .RuleFor(p => p.InstitutionId, f => f.PickRandom(institutions).Id)
                .RuleFor(p => p.CreatedAt, f => f.Date.Past(2))
                .RuleFor(p => p.LastUpdated, (f, p) => f.Date.Between(p.CreatedAt, DateTime.Now))
                .RuleFor(p => p.Contacts, f => GetPatientContactsGenerator().Generate())
                .RuleFor(p => p.Passport, f => GetPatientPassportGenerator().Generate())
                .RuleFor(p => p.Work, f => GetPatientWorkGenerator().Generate())
                .RuleFor(p => p.Other, f => GetPatientOtherGenerator().Generate())
                .Generate(count);
        }

        public static List<Medicine> GenerateMedicines(int count, List<MedicalStaff> staff)
        {
            if (!staff.Any()) return new List<Medicine>();
            return new Faker<Medicine>("ru").UseSeed(0)
                .RuleFor(m => m.Id, f => f.Random.Guid())
                .RuleFor(m => m.Name, f => Truncate($"{f.Commerce.ProductName()} {f.UniqueIndex}", 200))
                .RuleFor(m => m.Description, f => Truncate(f.Lorem.Sentence(), 1000))
                .RuleFor(m => m.Category, f => f.PickRandom<MedicineCategory>())
                .RuleFor(m => m.Unit, f => f.PickRandom<MedicineUnit>())
                .RuleFor(m => m.CurrentBalance, f => f.Random.Decimal(10, 1000))
                .RuleFor(m => m.MinBalance, f => f.Random.Decimal(5, 50))
                .RuleFor(m => m.TotalReceived, f => f.Random.Decimal(1000, 5000))
                .RuleFor(m => m.TotalWrittenOff, (f, m) => f.Random.Decimal(100, m.TotalReceived))
                .RuleFor(m => m.LastReceiptDate, f => f.Date.Past(1))
                .RuleFor(m => m.LastWriteOffDate, (f, m) => f.Date.Between(m.LastReceiptDate.Value, DateTime.Now))
                .RuleFor(m => m.LastReceiptFrom, f => Truncate(f.Company.CompanyName(), 200))
                .RuleFor(m => m.LastOperation, f => f.PickRandom<OperationType>())
                .RuleFor(m => m.LastChangedById, f => f.PickRandom(staff).Id)
                .RuleFor(m => m.LastUpdated, f => f.Date.Past(1))
                .RuleFor(m => m.Status, f => f.PickRandom<MedicineStatus>())
                .RuleFor(m => m.IsArchived, f => f.Random.Bool(0.1f))
                .Generate(count);
        }

        public static List<PatientRelative> GeneratePatientRelatives(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<PatientRelative>();
            return new Faker<PatientRelative>("ru").UseSeed(0)
                .RuleFor(pr => pr.Id, f => f.Random.Guid())
                .RuleFor(pr => pr.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(pr => pr.Name, f => Truncate(f.Name.FullName(), 200))
                .RuleFor(pr => pr.Relation, f => Truncate(f.PickRandom(new[] { "Мать", "Отец", "Сын", "Дочь", "Брат", "Сестра" }), 100))
                .RuleFor(pr => pr.Phone, f => Truncate(f.Phone.PhoneNumber(), 20))
                .Generate(count);
        }

        public static List<Allergy> GenerateAllergies(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<Allergy>();
            return new Faker<Allergy>("ru").UseSeed(0)
                .RuleFor(a => a.Id, f => f.Random.Guid())
                .RuleFor(a => a.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(a => a.Name, f => Truncate(f.Lorem.Word(), 200))
                .RuleFor(a => a.Reaction, f => Truncate(f.Lorem.Sentence(), 300))
                .RuleFor(a => a.Comment, f => Truncate(f.Lorem.Paragraph(1), 500))
                .Generate(count);
        }

        public static List<MedicalProblem> GenerateMedicalProblems(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<MedicalProblem>();
            return new Faker<MedicalProblem>("ru").UseSeed(0)
                .RuleFor(mp => mp.Id, f => f.Random.Guid())
                .RuleFor(mp => mp.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(mp => mp.Name, f => Truncate(f.Lorem.Sentence(3), 300))
                .RuleFor(mp => mp.IsActive, f => f.Random.Bool())
                .RuleFor(mp => mp.Description, f => Truncate(f.Lorem.Paragraph(2), 1000))
                .Generate(count);
        }

        public static List<Encounter> GenerateEncounters(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any()) return new List<Encounter>();
            return new Faker<Encounter>("ru").UseSeed(0)
                .RuleFor(e => e.Id, f => f.Random.Guid())
                .RuleFor(e => e.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(e => e.DoctorId, f => f.PickRandom(staff).Id)
                .RuleFor(e => e.DateTime, f => f.Date.Past(3))
                .RuleFor(e => e.Complaints, f => Truncate(f.Lorem.Sentence(5), 1000))
                .RuleFor(e => e.Conclusion, f => Truncate(f.Lorem.Sentence(10), 1000))
                .Generate(count);
        }

        public static List<PatientMedication> GeneratePatientMedications(int count, List<Patient> patients, List<Medicine> medicines, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !medicines.Any() || !staff.Any()) return new List<PatientMedication>();
            return new Faker<PatientMedication>("ru").UseSeed(0)
                .RuleFor(pm => pm.Id, f => f.Random.Guid())
                .RuleFor(pm => pm.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(pm => pm.MedicineId, f => f.PickRandom(medicines).Id)
                .RuleFor(pm => pm.Name, (f, pm) => medicines.First(m => m.Id == pm.MedicineId).Name)
                .RuleFor(pm => pm.Dose, f => Truncate($"{f.Random.Int(1, 2)} таб.", 50))
                .RuleFor(pm => pm.Regimen, f => Truncate("2 раза в день", 200))
                .RuleFor(pm => pm.Status, f => f.PickRandom<MedicationStatus>())
                .RuleFor(pm => pm.DoctorId, f => f.PickRandom(staff).Id)
                .Generate(count);
        }

        public static List<LabResult> GenerateLabResults(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any()) return new List<LabResult>();
            return new Faker<LabResult>("ru").UseSeed(0)
                .RuleFor(lr => lr.Id, f => f.Random.Guid())
                .RuleFor(lr => lr.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(lr => lr.DoctorId, f => f.PickRandom(staff).Id)
                .RuleFor(lr => lr.Type, f => Truncate(f.PickRandom(new[] { "Общий анализ крови", "Биохимия", "Анализ мочи" }), 200))
                .RuleFor(lr => lr.StatusText, f => Truncate("Результаты в норме", 300))
                .Generate(count);
        }

        public static List<Operation> GenerateOperations(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<Operation>();
            return new Faker<Operation>("ru").UseSeed(0)
                .RuleFor(o => o.Id, f => f.Random.Guid())
                .RuleFor(o => o.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(o => o.Name, f => Truncate(f.Lorem.Sentence(2), 200))
                .RuleFor(o => o.Description, f => Truncate(f.Lorem.Paragraph(3), 1000))
                .Generate(count);
        }

        public static List<Vaccine> GenerateVaccines(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<Vaccine>();
            return new Faker<Vaccine>("ru").UseSeed(0)
                .RuleFor(v => v.Id, f => f.Random.Guid())
                .RuleFor(v => v.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(v => v.Name, f => Truncate(f.PickRandom(new[] { "Спутник V", "Pfizer", "Moderna" }), 200))
                .RuleFor(v => v.Series, f => Truncate(f.Random.Replace("##-##-##"), 100))
                .Generate(count);
        }

        public static List<PatientDocument> GeneratePatientDocuments(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<PatientDocument>();
            return new Faker<PatientDocument>("ru").UseSeed(0)
                .RuleFor(pd => pd.Id, f => f.Random.Guid())
                .RuleFor(pd => pd.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(pd => pd.Name, f => Truncate($"Скан согласия от {f.Date.Past(1).ToShortDateString()}", 300))
                .RuleFor(pd => pd.FilePath, (f, pd) => Truncate($"/docs/{pd.PatientId}/{pd.Id}.pdf", 500))
                .Generate(count);
        }

        public static List<VitalSign> GenerateVitalSigns(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<VitalSign>();
            return new Faker<VitalSign>("ru").UseSeed(0)
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

        public static List<Appointment> GenerateAppointments(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any()) return new List<Appointment>();
            return new Faker<Appointment>("ru").UseSeed(0)
                .RuleFor(a => a.Id, f => f.Random.Guid())
                .RuleFor(a => a.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(a => a.DoctorId, f => f.PickRandom(staff).Id)
                .RuleFor(a => a.Time, f => f.Date.Future())
                .RuleFor(a => a.Reason, f => Truncate(f.Lorem.Sentence(), 300))
                .RuleFor(a => a.Status, f => f.PickRandom<AppointmentStatus>())
                .RuleFor(a => a.Type, f => f.PickRandom<AppointmentType>())
                .Generate(count);
        }

        public static List<Room> GenerateRooms(int count, List<Department> departments)
        {
            if (!departments.Any()) return new List<Room>();

            var rooms = new List<Room>();
            var faker = new Faker("ru");
            var departmentId = faker.PickRandom(departments).Id;

            for (int floor = 1; floor <= 2; floor++)
            {
                for (int roomNum = 1; roomNum <= 8; roomNum++)
                {
                    rooms.Add(new Room
                    {
                        Id = Guid.NewGuid(),
                        Floor = floor,
                        RoomNumber = $"{floor}0{roomNum}",
                        Gender = faker.PickRandom<RoomGender>(),
                        DepartmentId = departmentId
                    });
                }
            }
            return rooms;
        }

        public static List<HospitalBed> GenerateHospitalBeds(int count, List<Room> rooms, List<Patient> patients)
        {
            if (!rooms.Any() || !patients.Any()) return new List<HospitalBed>();

            var beds = new List<HospitalBed>();
            var availablePatients = patients.ToList();
            var faker = new Faker("ru");

            var occupiedStatuses = new[] { BedStatus.Stable, BedStatus.Attention, BedStatus.Urgent };

            foreach (var room in rooms)
            {
                int bedsInRoom = faker.Random.Int(1, 4);
                for (int bedNum = 1; bedNum <= bedsInRoom; bedNum++)
                {
                    bool shouldBeOccupied = faker.Random.Bool(0.7f);
                    Patient patientToAdmit = null;

                    if (shouldBeOccupied)
                    {
                        if (room.Gender == RoomGender.Male)
                            patientToAdmit = availablePatients.FirstOrDefault(p => p.Gender == Gender.Male);
                        else // Female
                            patientToAdmit = availablePatients.FirstOrDefault(p => p.Gender == Gender.Female);
                    }

                    if (patientToAdmit != null)
                    {
                        availablePatients.Remove(patientToAdmit);
                        beds.Add(new HospitalBed
                        {
                            Id = Guid.NewGuid(),
                            RoomId = room.Id,
                            BedNumber = bedNum,
                            Status = faker.PickRandom(occupiedStatuses),
                            PatientId = patientToAdmit.Id,
                            BedNote = Truncate(faker.Lorem.Sentence(), 1000)
                        });
                    }
                    else
                    {
                        beds.Add(new HospitalBed
                        {
                            Id = Guid.NewGuid(),
                            RoomId = room.Id,
                            BedNumber = bedNum,
                            Status = BedStatus.Free,
                            PatientId = null,
                            BedNote = ""
                        });
                    }
                }
            }
            return beds;
        }

        public static List<Shift> GenerateShifts(int count, List<MedicalStaff> staff)
        {
            if (!staff.Any()) return new List<Shift>();
            return new Faker<Shift>("ru").UseSeed(0)
                .RuleFor(s => s.Id, f => f.Random.Guid())
                .RuleFor(s => s.StaffId, f => f.PickRandom(staff).Id)
                .RuleFor(s => s.Date, f => f.Date.Recent(10))
                .RuleFor(s => s.Type, f => f.PickRandom<ShiftType>())
                .RuleFor(s => s.Hours, f => f.PickRandom(new short[] { 8, 12, 24 }))
                .Generate(count);
        }

        public static List<Notification> GenerateNotifications(int count, List<MedicalStaff> staff, List<Patient> patients)
        {
            if (!staff.Any() || !patients.Any()) return new List<Notification>();
            return new Faker<Notification>("ru").UseSeed(0)
                .RuleFor(n => n.Id, f => f.Random.Guid())
                .RuleFor(n => n.RecipientId, f => f.PickRandom(staff).Id)
                .RuleFor(n => n.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(n => n.Type, f => f.PickRandom<NotificationType>())
                .RuleFor(n => n.Severity, f => f.PickRandom<SeverityType>())
                .RuleFor(n => n.Message, f => Truncate(f.Lorem.Sentence(), 500))
                .RuleFor(n => n.Details, f => Truncate(f.Lorem.Paragraph(), 1000))
                .RuleFor(n => n.CreatedAt, f => f.Date.Past(1))
                .RuleFor(n => n.IsRead, f => f.Random.Bool(0.3f))
                .Generate(count);
        }

        public static List<BedPrescription> GenerateBedPrescriptions(int count, List<Patient> patients, List<PatientMedication> patientMedications)
        {
            if (!patients.Any() || !patientMedications.Any()) return new List<BedPrescription>();
            return new Faker<BedPrescription>("ru").UseSeed(0)
                .RuleFor(bp => bp.Id, f => f.Random.Guid())
                .RuleFor(bp => bp.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(bp => bp.PatientMedicationId, f => f.PickRandom(patientMedications).Id)
                .RuleFor(bp => bp.Name, (f, bp) => patientMedications.First(pm => pm.Id == bp.PatientMedicationId).Name)
                .RuleFor(bp => bp.Dose, (f, bp) => patientMedications.First(pm => pm.Id == bp.PatientMedicationId).Dose)
                .RuleFor(bp => bp.Date, f => f.Date.Recent())
                .RuleFor(bp => bp.IsDone, f => f.Random.Bool())
                .RuleFor(bp => bp.DoneAt, (f, bp) => bp.IsDone ? f.Date.Recent() : null)
                .RuleFor(bp => bp.DoneBy, (f, bp) => bp.IsDone ? Truncate(f.Name.FullName(), 100) : null)
                .Generate(count);
        }

        public static List<BedActionLog> GenerateBedActionLogs(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any()) return new List<BedActionLog>();
            return new Faker<BedActionLog>("ru").UseSeed(0)
                .RuleFor(bal => bal.Id, f => f.Random.Guid())
                .RuleFor(bal => bal.PatientId, f => f.PickRandom(patients).Id)
                .RuleFor(bal => bal.PerformedById, f => f.PickRandom(staff).Id)
                .RuleFor(bal => bal.Action, f => Truncate(f.Lorem.Sentence(4), 300))
                .RuleFor(bal => bal.PerformedAt, f => f.Date.Recent(3))
                .Generate(count);
        }

        public static List<MedicineOperationLog> GenerateMedicineOperationLogs(int count, List<Medicine> medicines, List<MedicalStaff> staff, List<Patient> patients, List<PatientMedication> patientMedications)
        {
            if (!medicines.Any() || !staff.Any()) return new List<MedicineOperationLog>();
            return new Faker<MedicineOperationLog>("ru").UseSeed(0)
                .RuleFor(mol => mol.Id, f => f.Random.Guid())
                .RuleFor(mol => mol.MedicineId, f => f.PickRandom(medicines).Id)
                .RuleFor(mol => mol.PerformedAt, f => f.Date.Past(1))
                .RuleFor(mol => mol.Type, f => f.PickRandom<OperationType>())
                .RuleFor(mol => mol.Quantity, f => f.Random.Decimal(1, 50))
                .RuleFor(mol => mol.BalanceAfter, (f, mol) => medicines.First(m => m.Id == mol.MedicineId).CurrentBalance)
                .RuleFor(mol => mol.PerformedById, f => f.PickRandom(staff).Id)
                .RuleFor(mol => mol.PatientId, (f, mol) => mol.Type == OperationType.Writeoff ? f.PickRandom(patients).Id : null)
                .RuleFor(mol => mol.PrescriptionId, (f, mol) => mol.Type == OperationType.Writeoff ? f.PickRandom(patientMedications).Id : null)
                .Generate(count);
        }
    }
}