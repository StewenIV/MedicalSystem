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
        private static string Truncate(string value, int maxLength) => value == null ? null : (value.Length <= maxLength ? value : value.Substring(0, maxLength));

        // ──────────────────────────────────────────────────────
        //  ФИО — ручные пулы для корректных русскоязычных имён
        // ──────────────────────────────────────────────────────
        private static readonly string[] MaleFirstNames = {
            "Александр", "Дмитрий", "Сергей", "Андрей", "Николай",
            "Владимир", "Михаил", "Иван", "Алексей", "Игорь",
            "Евгений", "Павел", "Виктор", "Роман", "Артём",
            "Кирилл", "Максим", "Денис", "Антон", "Руслан",
            "Олег", "Юрий", "Константин", "Фёдор", "Григорий",
            "Василий", "Борис", "Пётр", "Геннадий", "Анатолий"
        };

        private static readonly string[] FemaleFirstNames = {
            "Мария", "Елена", "Ольга", "Светлана", "Наталья",
            "Татьяна", "Ирина", "Анна", "Екатерина", "Людмила",
            "Юлия", "Галина", "Надежда", "Нина", "Валентина",
            "Алина", "Ксения", "Дарья", "Вера", "Лариса",
            "Марина", "Тамара", "Зинаида", "Любовь", "Виктория",
            "Алла", "Регина", "Оксана", "Ангелина", "Жанна"
        };

        private static readonly string[] MaleLastNames = {
            "Иванов", "Петров", "Сидоров", "Кузнецов", "Попов",
            "Новиков", "Морозов", "Соколов", "Смирнов", "Лебедев",
            "Федоров", "Захаров", "Тимофеев", "Дмитриев", "Романов",
            "Воронов", "Андреев", "Степанов", "Григорьев", "Борисов",
            "Ковалёв", "Медведев", "Громов", "Быков", "Семёнов",
            "Зайцев", "Орлов", "Макаров", "Фролов", "Белов"
        };

        private static readonly string[] FemaleLastNames = {
            "Иванова", "Петрова", "Сидорова", "Кузнецова", "Попова",
            "Новикова", "Морозова", "Соколова", "Смирнова", "Лебедева",
            "Федорова", "Захарова", "Тимофеева", "Дмитриева", "Романова",
            "Воронова", "Андреева", "Степанова", "Григорьева", "Борисова",
            "Ковалёва", "Медведева", "Громова", "Быкова", "Семёнова",
            "Зайцева", "Орлова", "Макарова", "Фролова", "Белова"
        };

        private static readonly string[] MalePatronymics = {
            "Александрович", "Дмитриевич", "Сергеевич", "Андреевич",
            "Николаевич", "Владимирович", "Михайлович", "Иванович",
            "Алексеевич", "Игоревич", "Евгеньевич", "Павлович",
            "Викторович", "Романович", "Юрьевич", "Константинович",
            "Фёдорович", "Григорьевич", "Васильевич", "Борисович",
            "Петрович", "Геннадьевич", "Анатольевич", "Олегович"
        };

        private static readonly string[] FemalePatronymics = {
            "Александровна", "Дмитриевна", "Сергеевна", "Андреевна",
            "Николаевна", "Владимировна", "Михайловна", "Ивановна",
            "Алексеевна", "Игоревна", "Евгеньевна", "Павловна",
            "Викторовна", "Романовна", "Юрьевна", "Константиновна",
            "Фёдоровна", "Григорьевна", "Васильевна", "Борисовна",
            "Петровна", "Геннадьевна", "Анатольевна", "Олеговна"
        };

        // ──────────────────────────────────────────────────────
        //  Населённые пункты ПМР с кодами городов
        // ──────────────────────────────────────────────────────
        private static readonly (string City, string Code)[] CitiesWithCodes = {
            ("Тирасполь", "533"),
            ("Бендеры", "552"),
            ("Рыбница", "555"),
            ("Дубоссары", "215"),
            ("Григориополь", "210"),
            ("Слободзея", "557"),
            ("Каменка", "216"),
            ("Днестровск", "219")
        };

        private static readonly string[] Villages = {
            "Первомайск", "Красное", "Маяк", "Новотираспольский",
            "Карманово", "Глиное", "Колосово", "Солнечный"
        };

        private static readonly string[] Streets = {
            "ул. Ленина", "ул. Мира", "пр. Суворова", "ул. Дзержинского",
            "ул. Котовского", "ул. Гагарина", "ул. Красноармейская",
            "ул. Советская", "ул. Октябрьская", "ул. Пушкина",
            "ул. Некрасова", "пр. Молодёжный", "ул. Кирова",
            "ул. Комсомольская", "ул. Первомайская", "ул. Садовая",
            "ул. Школьная", "ул. Победы", "ул. Рабочая", "пр. Свободы"
        };

        // ──────────────────────────────────────────────────────
        //  Организации ПМР
        // ──────────────────────────────────────────────────────
        private static readonly string[] Organizations = {
            "ООО «ТирЭнерго»",
            "ЗАО «Рыбницкий металлургический завод»",
            "ООО «СтройИмпекс»",
            "ГУП «Водоканал»",
            "МУП «Тираспольский хлебокомбинат»",
            "ООО «АгроПМР»",
            "ЗАО «Молдавский металлургический завод»",
            "ГУП «Электромаш»",
            "ООО «ПромТехСервис»",
            "ОАО «Тираспольский завод металлолитографии»",
            "ГУП «Тираспольтрансгаз»",
            "ООО «МедТехника»",
            "МБОУ «Школа №2»",
            "МУП «Городской транспорт»",
            "ИП Молдован В.Н.",
            "ООО «ФармМед»",
            "ЗАО «АгроПромбанк»",
            "ГУП «Тираспольский молочный завод»",
            "ООО «СтройМаш»",
            "МУП «Жилищно-коммунальное хозяйство»",
            "ОАО «Тираспольский трикотаж»",
            "ГУП «Единое агентство занятости»",
            "ООО «ТехноПром»",
            "ЗАО «Бендерский шёлковый комбинат»",
            "ГУП «Рыбницкий цементный комбинат»"
        };

        private static readonly string[] Professions = {
            "Инженер", "Бухгалтер", "Экономист", "Водитель",
            "Учитель", "Технолог", "Механик", "Слесарь",
            "Электрик", "Сварщик", "Оператор", "Кладовщик",
            "Менеджер", "Секретарь", "Юрист", "Торговый представитель",
            "Агроном", "Ветеринар", "Врач", "Медицинская сестра",
            "Строитель", "Плотник", "Швея", "Повар",
            "Воспитатель", "Тренер", "Библиотекарь", "Архивариус",
            "Администратор", "Кассир", "Охранник", "Программист"
        };

        // ──────────────────────────────────────────────────────
        //  Национальности ПМР
        // ──────────────────────────────────────────────────────
        private static readonly string[] NationalitiesMale = {
            "русский", "молдаванин", "украинец", "болгарин",
            "гагауз", "белорус", "еврей", "армянин",
            "немец", "поляк"
        };

        private static readonly string[] NationalitiesFemale = {
            "русская", "молдаванка", "украинка", "болгарка",
            "гагаузка", "белоруска", "еврейка", "армянка",
            "немка", "полька"
        };

        // ──────────────────────────────────────────────────────
        //  Медицинские шаблоны для указаний врача медсестре
        // ──────────────────────────────────────────────────────
        private static readonly string[] NurseInstructions = {
            "Контроль температуры тела каждые 4 часа. Результаты заносить в температурный лист.",
            "Контроль артериального давления утром и вечером. При АД выше 160/100 — сообщить врачу.",
            "Следить за диурезом пациента. Суточный диурез фиксировать в листе наблюдения.",
            "Обеспечить соблюдение постельного режима. Без разрешения врача вставать не разрешается.",
            "Контроль уровня глюкозы перед приёмом пищи и через 2 часа после еды.",
            "Выполнять перевязку согласно назначению врача, соблюдая правила асептики.",
            "Контролировать приём лекарственных препаратов строго по листу назначений.",
            "Наблюдать за состоянием пациента после инфузионной терапии. При появлении реакции — вызов врача.",
            "Своевременно выполнять назначения листа назначений. Отметки о выполнении обязательны.",
            "Контроль ЧДД и SpO2 каждые 2 часа. При SpO2 ниже 94% — немедленно сообщить врачу.",
            "Обеспечить оксигенотерапию по показаниям. Скорость потока кислорода — по назначению.",
            "Информировать врача при появлении или усилении одышки, болей в грудной клетке.",
            "Проводить дыхательную гимнастику утром и вечером согласно методике.",
            "Следить за проходимостью дыхательных путей. При необходимости — постуральный дренаж.",
            "Контроль ЧСС и ритма. При ЧСС менее 50 или более 100 уд/мин — доложить дежурному врачу.",
            "Обеспечить психологический покой пациента. Ограничить физическую нагрузку.",
            "Контроль водного баланса. Ограничение потребления жидкости до 1,5 л/сутки.",
            "Выполнить инъекции согласно листу назначений. Места инъекций чередовать.",
            "Следить за состоянием периферических вен. При флебите — сообщить врачу.",
            "Обеспечить соблюдение диеты стол №10. При отказе от пищи — информировать врача."
        };

        // ──────────────────────────────────────────────────────
        //  Вспомогательные методы
        // ──────────────────────────────────────────────────────

        private static string GetMaleName(Random rnd) => MaleFirstNames[rnd.Next(MaleFirstNames.Length)];
        private static string GetFemaleName(Random rnd) => FemaleFirstNames[rnd.Next(FemaleFirstNames.Length)];
        private static string GetMaleLastName(Random rnd) => MaleLastNames[rnd.Next(MaleLastNames.Length)];
        private static string GetFemaleLastName(Random rnd) => FemaleLastNames[rnd.Next(FemaleLastNames.Length)];
        private static string GetMalePatronymic(Random rnd) => MalePatronymics[rnd.Next(MalePatronymics.Length)];
        private static string GetFemalePatronymic(Random rnd) => FemalePatronymics[rnd.Next(FemalePatronymics.Length)];

        private static string GenerateMobilePhone(Random rnd)
        {
            // Молдавские/ПМР мобильные: +373 6X XXX XXX или +373 7X XXX XXX
            int prefix = rnd.Next(0, 2) == 0 ? 6 : 7;
            int d1 = rnd.Next(0, 10);
            int d2 = rnd.Next(100, 1000);
            int d3 = rnd.Next(100, 1000);
            return $"+373 {prefix}{d1} {d2} {d3}";
        }

        private static string GenerateHomePhone(string cityCode, Random rnd)
        {
            if (string.IsNullOrEmpty(cityCode)) return null;
            int number = rnd.Next(20000, 99999);
            return $"0{cityCode}-{number}";
        }

        private static string GenerateAddress(string city, Random rnd)
        {
            string street = Streets[rnd.Next(Streets.Length)];
            int house = rnd.Next(1, 120);
            bool hasApt = rnd.Next(0, 3) != 0; // ~67% квартира
            if (hasApt)
            {
                int apt = rnd.Next(1, 150);
                return $"{city}, {street}, д. {house}, кв. {apt}";
            }
            return $"{city}, {street}, д. {house}";
        }

        /// <summary>Правильное склонение числительных для лекарств</summary>
        private static string FormatDose(decimal amount, MedicineUnit unit)
        {
            switch (unit)
            {
                case MedicineUnit.Tablet:
                {
                    int qty = (int)Math.Round(amount);
                    if (qty < 1) qty = 1;
                    return $"{qty} {PluralizeTablet(qty)}";
                }
                case MedicineUnit.Capsule:
                {
                    int qty = (int)Math.Round(amount);
                    if (qty < 1) qty = 1;
                    return $"{qty} {PluralizeCapsule(qty)}";
                }
                case MedicineUnit.Vial:
                {
                    int qty = (int)Math.Round(amount);
                    if (qty < 1) qty = 1;
                    return $"{qty} {PluralizeVial(qty)}";
                }
                case MedicineUnit.Ampule:
                {
                    int qty = (int)Math.Round(amount);
                    if (qty < 1) qty = 1;
                    return $"{qty} {PluralizeAmpule(qty)}";
                }
                case MedicineUnit.Ml:
                {
                    decimal qty = Math.Round(amount, 1);
                    return $"{qty} мл";
                }
                case MedicineUnit.Unit:
                {
                    int qty = (int)Math.Round(amount);
                    if (qty < 1) qty = 1;
                    return $"{qty} ЕД";
                }
                default:
                {
                    decimal qty = Math.Round(amount, 1);
                    return $"{qty} ед.";
                }
            }
        }

        private static string PluralizeTablet(int n)
        {
            int mod10 = n % 10, mod100 = n % 100;
            if (mod10 == 1 && mod100 != 11) return "таблетка";
            if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "таблетки";
            return "таблеток";
        }

        private static string PluralizeCapsule(int n)
        {
            int mod10 = n % 10, mod100 = n % 100;
            if (mod10 == 1 && mod100 != 11) return "капсула";
            if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "капсулы";
            return "капсул";
        }

        private static string PluralizeVial(int n)
        {
            int mod10 = n % 10, mod100 = n % 100;
            if (mod10 == 1 && mod100 != 11) return "флакон";
            if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "флакона";
            return "флаконов";
        }

        private static string PluralizeAmpule(int n)
        {
            int mod10 = n % 10, mod100 = n % 100;
            if (mod10 == 1 && mod100 != 11) return "ампула";
            if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "ампулы";
            return "ампул";
        }

        // ──────────────────────────────────────────────────────
        //  Генерация учреждений — только ГУ БЦГБ
        // ──────────────────────────────────────────────────────
        public static List<Institution> GenerateInstitutions()
        {
            return new List<Institution>
            {
                new Institution
                {
                    Id = Guid.NewGuid(),
                    Name = "ГУ БЦГБ"
                }
            };
        }

        // Перегрузка для обратной совместимости (DataSeeder вызывает с параметром)
        public static List<Institution> GenerateInstitutions(int count) => GenerateInstitutions();

        // ──────────────────────────────────────────────────────
        //  Генерация персонала
        // ──────────────────────────────────────────────────────
        public static List<MedicalStaff> GenerateMedicalStaff(int count)
        {
            var medicalPositions = new[] {
                "Врач", "Врач", "Врач", "Врач",
                "Медицинская сестра", "Медицинская сестра", "Медицинская сестра",
                "Старшая медицинская сестра", "Главный врач", "Лаборант"
            };

            var rnd = new Random(0);
            var result = new List<MedicalStaff>(count);

            for (int i = 0; i < count; i++)
            {
                var position = medicalPositions[rnd.Next(medicalPositions.Length)];

                // Врачи — преимущественно мужчины, медсёстры — преимущественно женщины
                bool isFemale = position.Contains("сестра") || (rnd.Next(0, 4) == 0);

                string name;
                if (isFemale)
                    name = $"{GetFemaleLastName(rnd)} {GetFemaleName(rnd)} {GetFemalePatronymic(rnd)}";
                else
                    name = $"{GetMaleLastName(rnd)} {GetMaleName(rnd)} {GetMalePatronymic(rnd)}";

                result.Add(new MedicalStaff
                {
                    Id = Guid.NewGuid(),
                    Name = Truncate(name, 200),
                    Position = position
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Генерация пациентов
        // ──────────────────────────────────────────────────────
        public static List<Patient> GeneratePatients(int count, List<MedicalStaff> staff, List<Institution> institutions)
        {
            if (!staff.Any() || !institutions.Any()) return new List<Patient>();

            var rnd = new Random(0);
            var result = new List<Patient>(count);
            var institution = institutions[0]; // Всегда одно учреждение

            for (int i = 0; i < count; i++)
            {
                var gender = rnd.Next(0, 2) == 0 ? Gender.Male : Gender.Female;

                string firstName, lastName, middleName;
                string nationality;

                if (gender == Gender.Male)
                {
                    firstName = GetMaleName(rnd);
                    lastName = GetMaleLastName(rnd);
                    middleName = GetMalePatronymic(rnd);
                    nationality = NationalitiesMale[rnd.Next(NationalitiesMale.Length)];
                }
                else
                {
                    firstName = GetFemaleName(rnd);
                    lastName = GetFemaleLastName(rnd);
                    middleName = GetFemalePatronymic(rnd);
                    nationality = NationalitiesFemale[rnd.Next(NationalitiesFemale.Length)];
                }

                // Адрес
                bool isCity = rnd.Next(0, 3) != 0; // 67% города, 33% посёлки
                string cityName;
                string cityCode;
                if (isCity)
                {
                    var cityEntry = CitiesWithCodes[rnd.Next(CitiesWithCodes.Length)];
                    cityName = cityEntry.City;
                    cityCode = cityEntry.Code;
                }
                else
                {
                    cityName = Villages[rnd.Next(Villages.Length)];
                    cityCode = null;
                }

                string address = GenerateAddress(cityName, rnd);
                string mobilePhone = GenerateMobilePhone(rnd);
                string homePhone = cityCode != null && rnd.Next(0, 2) == 0
                    ? GenerateHomePhone(cityCode, rnd)
                    : null;

                // Место работы
                string organization = Organizations[rnd.Next(Organizations.Length)];
                string profession = Professions[rnd.Next(Professions.Length)];
                string workAddress = GenerateAddress(cityName, rnd);

                // Паспорт
                int passportNumber = rnd.Next(1000000, 9999999);
                string passportSeries = $"I-ПР №{passportNumber:D7}";
                var issuedDate = DateTime.Now.AddYears(-rnd.Next(1, 15)).AddDays(-rnd.Next(0, 365));

                var createdAt = DateTime.Now.AddDays(-rnd.Next(30, 1000));
                var lastUpdated = createdAt.AddDays(rnd.Next(0, (int)(DateTime.Now - createdAt).TotalDays));

                var patient = new Patient
                {
                    Id = Guid.NewGuid(),
                    Gender = gender,
                    FirstName = Truncate(firstName, 100),
                    LastName = Truncate(lastName, 100),
                    MiddleName = Truncate(middleName, 100),
                    DateOfBirth = DateTime.Now.AddYears(-rnd.Next(18, 85)).AddDays(-rnd.Next(0, 365)),
                    MedcardNum = $"{rnd.Next(10000000, 99999999):D8}",
                    HistoryNum = rnd.Next(0, 10) < 7 ? $"{rnd.Next(10, 99):D2}-{rnd.Next(1000, 9999):D4}/{rnd.Next(10, 99):D2}" : null,
                    Status = (PatientStatus)rnd.Next(0, Enum.GetValues(typeof(PatientStatus)).Length),
                    MaritalStatus = rnd.Next(0, 3) switch
                    {
                        0 => gender == Gender.Male ? "женат" : "замужем",
                        1 => gender == Gender.Male ? "холост" : "не замужем",
                        _ => "в разводе"
                    },
                    DoctorId = staff[rnd.Next(staff.Count)].Id,
                    InstitutionId = institution.Id,
                    CreatedAt = createdAt,
                    LastUpdated = lastUpdated,
                    Contacts = new PatientContacts
                    {
                        Country = "Приднестровская Молдавская Республика",
                        City = cityName,
                        Address = Truncate(address, 300),
                        PhoneMobile = Truncate(mobilePhone, 20),
                        PhoneHome = homePhone != null ? Truncate(homePhone, 20) : null,
                        Email = Truncate($"{TranslitName(firstName).ToLower()}.{TranslitName(lastName).ToLower()}{rnd.Next(1, 99)}@mail.ru", 150)
                    },
                    Passport = new PatientPassport
                    {
                        SeriesNumber = Truncate(passportSeries, 20),
                        IssuedBy = Truncate($"МВД ПМР, г. {(isCity ? cityName : "Тирасполь")}", 300),
                        DateIssued = issuedDate
                    },
                    Work = new PatientWork
                    {
                        Profession = Truncate(profession, 150),
                        Organization = Truncate(organization, 200),
                        Address = Truncate(workAddress, 300)
                    },
                    Other = new PatientOther
                    {
                        Language = "Русский",
                        Nationality = Truncate(nationality, 100)
                    }
                };

                result.Add(patient);
            }

            return result;
        }

        /// <summary>Простая транслитерация имени для email</summary>
        private static string TranslitName(string name)
        {
            if (string.IsNullOrEmpty(name)) return "user";
            var map = new Dictionary<char, string>
            {
                {'а',"a"},{'б',"b"},{'в',"v"},{'г',"g"},{'д',"d"},{'е',"e"},{'ё',"yo"},
                {'ж',"zh"},{'з',"z"},{'и',"i"},{'й',"y"},{'к',"k"},{'л',"l"},{'м',"m"},
                {'н',"n"},{'о',"o"},{'п',"p"},{'р',"r"},{'с',"s"},{'т',"t"},{'у',"u"},
                {'ф',"f"},{'х',"kh"},{'ц',"ts"},{'ч',"ch"},{'ш',"sh"},{'щ',"sch"},
                {'ъ',""},{'ы',"y"},{'ь',""},{'э',"e"},{'ю',"yu"},{'я',"ya"}
            };
            var sb = new System.Text.StringBuilder();
            foreach (var c in name.ToLower())
            {
                if (map.TryGetValue(c, out var t)) sb.Append(t);
                else if (char.IsLetterOrDigit(c)) sb.Append(c);
            }
            return sb.Length > 0 ? sb.ToString() : "user";
        }

        // ──────────────────────────────────────────────────────
        //  Лекарства
        // ──────────────────────────────────────────────────────
        public static List<Medicine> GenerateMedicines(int count, List<MedicalStaff> staff)
        {
            if (!staff.Any()) return new List<Medicine>();

            var realMedicines = new[]
            {
                new { Name = "Амоксициллин", Category = MedicineCategory.Antibiotics, Unit = MedicineUnit.Tablet, Strengths = new[] { "250 мг", "500 мг", "1000 мг" } },
                new { Name = "Цефтриаксон", Category = MedicineCategory.Antibiotics, Unit = MedicineUnit.Vial, Strengths = new[] { "1 г", "2 г" } },
                new { Name = "Азитромицин", Category = MedicineCategory.Antibiotics, Unit = MedicineUnit.Tablet, Strengths = new[] { "250 мг", "500 мг" } },
                new { Name = "Амоксиклав", Category = MedicineCategory.Antibiotics, Unit = MedicineUnit.Tablet, Strengths = new[] { "375 мг", "625 мг", "1000 мг" } },
                new { Name = "Левофлоксацин", Category = MedicineCategory.Antibiotics, Unit = MedicineUnit.Tablet, Strengths = new[] { "250 мг", "500 мг" } },
                new { Name = "Ибупрофен", Category = MedicineCategory.Analgesics, Unit = MedicineUnit.Tablet, Strengths = new[] { "200 мг", "400 мг", "600 мг" } },
                new { Name = "Парацетамол", Category = MedicineCategory.Analgesics, Unit = MedicineUnit.Tablet, Strengths = new[] { "325 мг", "500 мг" } },
                new { Name = "Анальгин", Category = MedicineCategory.Analgesics, Unit = MedicineUnit.Tablet, Strengths = new[] { "500 мг" } },
                new { Name = "Кеторолак", Category = MedicineCategory.Analgesics, Unit = MedicineUnit.Tablet, Strengths = new[] { "10 мг" } },
                new { Name = "Диклофенак", Category = MedicineCategory.Analgesics, Unit = MedicineUnit.Ampule, Strengths = new[] { "25 мг/мл 3 мл" } },
                new { Name = "Нимесулид", Category = MedicineCategory.Analgesics, Unit = MedicineUnit.Tablet, Strengths = new[] { "100 мг" } },
                new { Name = "Дексаметазон", Category = MedicineCategory.Hormones, Unit = MedicineUnit.Ampule, Strengths = new[] { "4 мг/мл 1 мл" } },
                new { Name = "Преднизолон", Category = MedicineCategory.Hormones, Unit = MedicineUnit.Tablet, Strengths = new[] { "5 мг" } },
                new { Name = "Метилпреднизолон", Category = MedicineCategory.Hormones, Unit = MedicineUnit.Tablet, Strengths = new[] { "4 мг", "16 мг" } },
                new { Name = "L-Тироксин", Category = MedicineCategory.Hormones, Unit = MedicineUnit.Tablet, Strengths = new[] { "50 мкг", "100 мкг" } },
                new { Name = "Каптоприл", Category = MedicineCategory.Cardio, Unit = MedicineUnit.Tablet, Strengths = new[] { "25 мг", "50 мг" } },
                new { Name = "Аторвастатин", Category = MedicineCategory.Cardio, Unit = MedicineUnit.Tablet, Strengths = new[] { "10 мг", "20 мг", "40 мг" } },
                new { Name = "Лозартан", Category = MedicineCategory.Cardio, Unit = MedicineUnit.Tablet, Strengths = new[] { "25 мг", "50 мг", "100 мг" } },
                new { Name = "Бисопролол", Category = MedicineCategory.Cardio, Unit = MedicineUnit.Tablet, Strengths = new[] { "2.5 мг", "5 мг", "10 мг" } },
                new { Name = "Спиронолактон", Category = MedicineCategory.Cardio, Unit = MedicineUnit.Tablet, Strengths = new[] { "25 мг", "100 мг" } },
                new { Name = "Амлодипин", Category = MedicineCategory.Cardio, Unit = MedicineUnit.Tablet, Strengths = new[] { "5 мг", "10 мг" } },
                new { Name = "Лизиноприл", Category = MedicineCategory.Cardio, Unit = MedicineUnit.Tablet, Strengths = new[] { "5 мг", "10 мг", "20 мг" } },
                new { Name = "Хлоргексидин 0.05%", Category = MedicineCategory.Antiseptics, Unit = MedicineUnit.Ml, Strengths = new[] { "100 мл" } },
                new { Name = "Мирамистин 0.01%", Category = MedicineCategory.Antiseptics, Unit = MedicineUnit.Ml, Strengths = new[] { "150 мл" } },
                new { Name = "Перекись водорода 3%", Category = MedicineCategory.Antiseptics, Unit = MedicineUnit.Ml, Strengths = new[] { "100 мл" } },
                new { Name = "Натрия хлорид 0.9%", Category = MedicineCategory.Other, Unit = MedicineUnit.Vial, Strengths = new[] { "200 мл", "400 мл" } },
                new { Name = "Глюкоза 5%", Category = MedicineCategory.Other, Unit = MedicineUnit.Vial, Strengths = new[] { "200 мл", "400 мл" } },
                new { Name = "Инсулин короткий", Category = MedicineCategory.Other, Unit = MedicineUnit.Unit, Strengths = new[] { "100 ЕД/мл 3 мл" } },
                new { Name = "Магния сульфат 25%", Category = MedicineCategory.Other, Unit = MedicineUnit.Ampule, Strengths = new[] { "5 мл", "10 мл" } }
            };

            var nonLabStaff = staff.Where(s => s.Position != null && !s.Position.Contains("лаборант") && !s.Position.Contains("Лаборант")).ToList();
            var allowedStaff = nonLabStaff.Any() ? nonLabStaff : staff;

            var random = new Random(0);
            var medicines = new List<Medicine>();
            var generatedNames = new HashSet<string>();

            for (int i = 0; i < count; i++)
            {
                var template = realMedicines[random.Next(realMedicines.Length)];
                var strength = template.Strengths[random.Next(template.Strengths.Length)];
                var name = $"{template.Name} {strength}";
                var attempt = 1;
                while (generatedNames.Contains(name))
                {
                    name = $"{template.Name} {strength} (серия {i + attempt + 100})";
                    attempt++;
                }
                generatedNames.Add(name);

                var minBalance = random.Next(10, 50);
                decimal currentBalance;
                var roll = random.Next(0, 100);
                if (roll < 20)
                    currentBalance = 0;
                else if (roll < 50)
                    currentBalance = random.Next(1, minBalance + 1);
                else
                    currentBalance = random.Next(minBalance + 1, minBalance + 300);

                var totalReceived = currentBalance + random.Next(200, 1000);
                var totalWrittenOff = totalReceived - currentBalance;
                var lastReceiptDate = DateTime.Now.AddDays(-random.Next(1, 30));
                var lastWriteOffDate = lastReceiptDate.AddDays(random.Next(0, 10));
                var status = currentBalance == 0 ? MedicineStatus.Empty : (currentBalance <= minBalance ? MedicineStatus.Low : MedicineStatus.Norm);

                medicines.Add(new Medicine
                {
                    Id = Guid.NewGuid(),
                    Name = name,
                    Description = $"Описание для препарата {template.Name}.",
                    Category = template.Category,
                    Unit = template.Unit,
                    CurrentBalance = currentBalance,
                    MinBalance = minBalance,
                    TotalReceived = totalReceived,
                    TotalWrittenOff = totalWrittenOff,
                    LastReceiptDate = lastReceiptDate,
                    LastWriteOffDate = lastWriteOffDate,
                    LastReceiptFrom = "ООО «ФармДистрибьюшн»",
                    LastOperation = random.Next(0, 2) == 0 ? OperationType.Receipt : OperationType.Writeoff,
                    LastChangedById = allowedStaff[random.Next(allowedStaff.Count)].Id,
                    LastUpdated = DateTime.Now.AddHours(-random.Next(1, 24)),
                    Status = status,
                    IsArchived = false
                });
            }

            return medicines;
        }

        // ──────────────────────────────────────────────────────
        //  Родственники — вероятностная генерация (≤3 на пациента)
        // ──────────────────────────────────────────────────────
        public static List<PatientRelative> GeneratePatientRelatives(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<PatientRelative>();

            var rnd = new Random(0);
            var result = new List<PatientRelative>();

            var maleRelations = new[] { "супруга", "мать", "дочь", "сестра" };
            var femaleRelations = new[] { "супруг", "отец", "сын", "брат" };
            var neutralRelations = new[] { "другое" };

            foreach (var patient in patients)
            {
                // 60% вероятность наличия родственников
                if (rnd.Next(0, 10) < 6)
                {
                    int relCount = rnd.Next(1, 4); // 1-3 родственника
                    for (int i = 0; i < relCount; i++)
                    {
                        // Определяем пол родственника случайно
                        bool relIsFemale = rnd.Next(0, 2) == 0;
                        string relation;

                        if (relIsFemale)
                            relation = maleRelations[rnd.Next(maleRelations.Length)]; // родственница-женщина
                        else
                            relation = femaleRelations[rnd.Next(femaleRelations.Length)]; // родственник-мужчина

                        string relName;
                        if (relIsFemale)
                        {
                            // Берём фамилию пациента (женский вариант) или новую
                            string lastName = rnd.Next(0, 2) == 0
                                ? (patient.Gender == Gender.Female ? patient.LastName : GetFemaleLastName(rnd))
                                : GetFemaleLastName(rnd);
                            relName = $"{lastName} {GetFemaleName(rnd)} {GetFemalePatronymic(rnd)}";
                        }
                        else
                        {
                            string lastName = rnd.Next(0, 2) == 0
                                ? (patient.Gender == Gender.Male ? patient.LastName : GetMaleLastName(rnd))
                                : GetMaleLastName(rnd);
                            relName = $"{lastName} {GetMaleName(rnd)} {GetMalePatronymic(rnd)}";
                        }

                        string relPhone = GenerateMobilePhone(rnd);

                        result.Add(new PatientRelative
                        {
                            Id = Guid.NewGuid(),
                            PatientId = patient.Id,
                            Name = Truncate(relName, 200),
                            Relation = Truncate(relation, 100),
                            Phone = Truncate(relPhone, 20)
                        });
                    }
                }
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Аллергии (с реальными аллергенами)
        // ──────────────────────────────────────────────────────
        public static List<Allergy> GenerateAllergies(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<Allergy>();

            var allergens = new[] {
                "Пенициллин", "Аспирин", "Ибупрофен", "Сульфаниламиды",
                "Новокаин", "Лидокаин", "Пыльца растений", "Домашняя пыль",
                "Шерсть животных", "Цитрусовые", "Мёд", "Морепродукты",
                "Орехи", "Молочный белок", "Латекс", "Йод", "Хлор"
            };

            var reactions = new[] {
                "Крапивница, зуд кожных покровов",
                "Отёк Квинке",
                "Анафилактический шок (в анамнезе)",
                "Бронхоспазм, одышка",
                "Кожная сыпь, покраснение",
                "Ринит, слезотечение",
                "Тошнота, рвота",
                "Контактный дерматит"
            };

            var rnd = new Random(0);
            var result = new List<Allergy>();
            var faker = new Faker("ru");

            for (int i = 0; i < count; i++)
            {
                var patient = patients[rnd.Next(patients.Count)];
                var allergen = allergens[rnd.Next(allergens.Length)];
                var reaction = reactions[rnd.Next(reactions.Length)];

                result.Add(new Allergy
                {
                    Id = Guid.NewGuid(),
                    PatientId = patient.Id,
                    Name = Truncate(allergen, 200),
                    Reaction = Truncate(reaction, 300),
                    Comment = rnd.Next(0, 3) == 0 ? Truncate($"Реакция выявлена в {rnd.Next(2005, 2024)} году.", 500) : null
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Медицинские проблемы (диагнозы)
        // ──────────────────────────────────────────────────────
        public static List<MedicalProblem> GenerateMedicalProblems(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<MedicalProblem>();

            var diagnoses = new[] {
                "Внебольничная пневмония, правосторонняя",
                "Артериальная гипертензия II степени",
                "Хроническая обструктивная болезнь лёгких, средней тяжести",
                "Острый бронхит",
                "Бронхиальная астма, персистирующее течение",
                "Сахарный диабет 2 типа",
                "Ишемическая болезнь сердца",
                "Хроническая сердечная недостаточность",
                "Острый фарингит",
                "ОРВИ",
                "Остеохондроз поясничного отдела",
                "Язвенная болезнь желудка",
                "Хронический гастрит",
                "Плеврит экссудативный",
                "Туберкулёз лёгких (в анамнезе)",
                "Бронхоэктатическая болезнь"
            };

            var descriptions = new[] {
                "Жалобы на кашель, одышку при нагрузке, субфебрильную температуру.",
                "Периодические подъёмы АД до 160/100 мм рт. ст. Принимает гипотензивную терапию.",
                "Кашель с мокротой, свистящее дыхание. Обострения 2-3 раза в год.",
                "Острое начало заболевания, субфебрилитет, продуктивный кашель.",
                "Приступообразный кашель, одышка. Триггеры: физическая нагрузка, холодный воздух.",
                "Сахарный диабет диагностирован 5 лет назад. Гликемия натощак — 8,2 ммоль/л.",
                "Боли за грудиной при нагрузке. ЭКГ — признаки ишемии миокарда.",
                "Отёки нижних конечностей, одышка при минимальной нагрузке.",
                "Першение и боль в горле, осиплость голоса.",
                "Катаральные явления, лихорадка до 38,2°C, общая слабость.",
                "Боли в поясничном отделе позвоночника, иррадиация в левую ногу.",
                "Боли в эпигастральной области натощак, изжога.",
                "Тяжесть в эпигастрии после еды, тошнота."
            };

            var rnd = new Random(0);
            var result = new List<MedicalProblem>();

            for (int i = 0; i < count; i++)
            {
                var patient = patients[rnd.Next(patients.Count)];
                var diagnosis = diagnoses[rnd.Next(diagnoses.Length)];
                var description = descriptions[rnd.Next(descriptions.Length)];

                result.Add(new MedicalProblem
                {
                    Id = Guid.NewGuid(),
                    PatientId = patient.Id,
                    Name = Truncate(diagnosis, 300),
                    IsActive = rnd.Next(0, 3) != 0, // 67% активные
                    Description = Truncate(description, 1000)
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Осмотры (ЭМК)
        // ──────────────────────────────────────────────────────
        public static List<Encounter> GenerateEncounters(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any()) return new List<Encounter>();

            // Только врачи (не лаборанты и не медсёстры)
            var doctors = staff.Where(s => s.Position != null &&
                (s.Position.Contains("Врач") || s.Position.Contains("врач"))).ToList();
            if (!doctors.Any()) doctors = staff;

            var types = new[] { "Осмотр", "Консультация", "Процедура", "Анализы", "Выписка" };
            var list = new List<Encounter>();
            var rnd = new Random(0);

            var complaintsList = new[] {
                "кашель с трудноотделяемой мокротой и одышку при физической нагрузке",
                "боли в грудной клетке при дыхании и повышение температуры до 38,5°C",
                "слабость, потливость по ночам, снижение аппетита",
                "одышку в покое и при минимальной нагрузке",
                "кашель с прожилками крови, субфебрилитет",
                "свистящее дыхание, ощущение нехватки воздуха",
                "повышение артериального давления, головную боль",
                "боли в поясничном отделе, иррадиирующие в ногу",
                "частые простудные заболевания, длительный кашель"
            };

            var objectiveList = new[] {
                "удовлетворительное", "средней степени тяжести"
            };

            var conclusionList = new[] {
                "Внебольничная пневмония, правосторонняя, средней тяжести",
                "Артериальная гипертензия II степени, риск 3",
                "ХОБЛ, средней степени тяжести, фаза обострения",
                "Острый бронхит, среднетяжёлое течение",
                "Бронхиальная астма, неконтролируемое течение",
                "ОРВИ, лёгкое течение",
                "Плеврит экссудативный, правосторонний",
                "ИБС, стенокардия напряжения II ФК"
            };

            var recommendationsList = new[] {
                "Режим полупостельный. Обильное тёплое питьё до 2 л/сутки. Антибактериальная терапия по схеме.",
                "Контроль АД дважды в сутки. Диета с ограничением поваренной соли. Продолжить гипотензивную терапию.",
                "Постельный режим. Оксигенотерапия. Бронхолитики по расписанию.",
                "Режим амбулаторный. НПВП курсом 5 дней. Повторный осмотр через 7 дней.",
                "Госпитализация в пульмонологическое отделение. Рентген ОГК в динамике через 10 дней.",
                "Ингаляционная терапия. Физиотерапия. Лечебная дыхательная гимнастика."
            };

            foreach (var patient in patients)
            {
                var numEncounters = rnd.Next(1, 4);
                for (int i = 0; i < numEncounters; i++)
                {
                    var doctor = doctors[rnd.Next(doctors.Count)];
                    var date = DateTime.Now.AddDays(-rnd.Next(1, 1000));
                    var type = types[rnd.Next(types.Length)];
                    var complaints = "Жалобы на " + complaintsList[rnd.Next(complaintsList.Length)];
                    var objective = "Состояние " + objectiveList[rnd.Next(objectiveList.Length)] +
                        ". Кожные покровы обычной окраски. Дыхание жёсткое, хрипы " +
                        (rnd.Next(0, 2) == 0 ? "не выслушиваются" : "сухие рассеянные") +
                        $". ЧДД {rnd.Next(16, 24)} в мин. ЧСС {rnd.Next(68, 96)} уд/мин. АД {rnd.Next(110, 145)}/{rnd.Next(70, 95)} мм рт. ст.";
                    var conclusion = conclusionList[rnd.Next(conclusionList.Length)];
                    var recommendations = recommendationsList[rnd.Next(recommendationsList.Length)];

                    list.Add(new Encounter
                    {
                        Id = Guid.NewGuid(),
                        PatientId = patient.Id,
                        DoctorId = doctor.Id,
                        DateTime = date,
                        Type = type,
                        Complaints = Truncate(complaints, 1000),
                        Objective = Truncate(objective, 1000),
                        Conclusion = Truncate(conclusion, 1000),
                        Recommendations = Truncate(recommendations, 1000)
                    });
                }
            }

            return list;
        }

        // ──────────────────────────────────────────────────────
        //  Назначения пациентам (вероятностная генерация)
        // ──────────────────────────────────────────────────────
        public static List<PatientMedication> GeneratePatientMedications(int count, List<Patient> patients, List<Medicine> medicines, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !medicines.Any() || !staff.Any()) return new List<PatientMedication>();

            var doctors = staff.Where(s => s.Position != null &&
                (s.Position.Contains("Врач") || s.Position.Contains("врач"))).ToList();
            if (!doctors.Any()) doctors = staff;

            // Используем только лекарства с ненулевым остатком
            var availableMedicines = medicines.Where(m => m.CurrentBalance > 0).ToList();
            if (!availableMedicines.Any()) availableMedicines = medicines.ToList();

            var rnd = new Random(0);
            var result = new List<PatientMedication>();

            var regimenOptions = new[] {
                "1 раз в день утром", "2 раза в день (утром и вечером)",
                "3 раза в день после еды", "4 раза в день каждые 6 часов",
                "по необходимости, не более 3 раз в день",
                "1 раз в 8 часов", "1 раз в 12 часов"
            };

            var statuses = Enum.GetValues(typeof(MedicationStatus)).Cast<MedicationStatus>().ToArray();

            // Не всегда у пациента есть назначения (50% вероятность)
            foreach (var patient in patients)
            {
                if (rnd.Next(0, 2) == 0) continue; // Пропускаем пациентов без назначений

                int prescCount = rnd.Next(1, 5); // 1-4 назначения на пациента
                for (int j = 0; j < prescCount && result.Count < count; j++)
                {
                    var medicine = availableMedicines[rnd.Next(availableMedicines.Count)];
                    var doctor = doctors[rnd.Next(doctors.Count)];

                    // Генерируем дозу в зависимости от типа лекарства
                    decimal amount = medicine.Unit switch
                    {
                        MedicineUnit.Tablet => rnd.Next(1, 4),
                        MedicineUnit.Capsule => rnd.Next(1, 3),
                        MedicineUnit.Vial => rnd.Next(1, 3),
                        MedicineUnit.Ampule => rnd.Next(1, 3),
                        MedicineUnit.Ml => rnd.Next(1, 6) * 50m,
                        MedicineUnit.Unit => rnd.Next(4, 16) * 2m,
                        _ => rnd.Next(1, 3)
                    };

                    string doseStr = FormatDose(amount, medicine.Unit);

                    result.Add(new PatientMedication
                    {
                        Id = Guid.NewGuid(),
                        PatientId = patient.Id,
                        MedicineId = medicine.Id,
                        Name = Truncate(medicine.Name, 200),
                        Dose = Truncate(doseStr, 50),
                        Regimen = Truncate(regimenOptions[rnd.Next(regimenOptions.Length)], 200),
                        Status = statuses[rnd.Next(statuses.Length)],
                        DoctorId = doctor.Id
                    });
                }
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Лабораторные результаты
        // ──────────────────────────────────────────────────────
        public static List<LabResult> GenerateLabResults(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any()) return new List<LabResult>();

            var testTypes = new[] { "Общий анализ крови", "Биохимический анализ крови", "Общий анализ мочи", "Коагулограмма", "Мокрота (бакпосев)" };
            var statuses = new[] { "Результаты в норме", "Лёгкие отклонения", "Требует внимания врача", "Критические значения — срочно!" };

            var rnd = new Random(0);
            var result = new List<LabResult>();

            for (int i = 0; i < count; i++)
            {
                result.Add(new LabResult
                {
                    Id = Guid.NewGuid(),
                    PatientId = patients[rnd.Next(patients.Count)].Id,
                    DoctorId = staff[rnd.Next(staff.Count)].Id,
                    Type = Truncate(testTypes[rnd.Next(testTypes.Length)], 200),
                    StatusText = Truncate(statuses[rnd.Next(statuses.Length)], 300)
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Операции
        // ──────────────────────────────────────────────────────
        public static List<Operation> GenerateOperations(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<Operation>();

            var operationNames = new[] {
                "Бронхоскопия диагностическая",
                "Плевральная пункция",
                "Дренирование плевральной полости",
                "Биопсия лимфоузла",
                "Фибробронхоскопия с БАЛ",
                "Торакоцентез",
                "Интубация трахеи",
                "Катетеризация подключичной вены"
            };

            var descriptions = new[] {
                "Операция выполнена под местной анестезией. Без осложнений.",
                "Вмешательство плановое. Наркоз — внутривенный. Течение без особенностей.",
                "Процедура проведена в условиях операционного блока. Кровопотеря минимальная.",
                "Эндоскопическое вмешательство. Биопсийный материал направлен в гистологию."
            };

            var rnd = new Random(0);
            var result = new List<Operation>();

            for (int i = 0; i < count; i++)
            {
                result.Add(new Operation
                {
                    Id = Guid.NewGuid(),
                    PatientId = patients[rnd.Next(patients.Count)].Id,
                    Name = Truncate(operationNames[rnd.Next(operationNames.Length)], 200),
                    Description = Truncate(descriptions[rnd.Next(descriptions.Length)], 1000)
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Вакцинации
        // ──────────────────────────────────────────────────────
        public static List<Vaccine> GenerateVaccines(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<Vaccine>();

            var vaccineNames = new[] {
                "Спутник V (Гам-КОВИД-Вак)",
                "Гриппол плюс",
                "Вакцина против пневмококка",
                "АКДС (Инфанрикс)",
                "Вакцина против гепатита B",
                "Манту (туберкулин)"
            };

            var rnd = new Random(0);
            var result = new List<Vaccine>();

            for (int i = 0; i < count; i++)
            {
                result.Add(new Vaccine
                {
                    Id = Guid.NewGuid(),
                    PatientId = patients[rnd.Next(patients.Count)].Id,
                    Name = Truncate(vaccineNames[rnd.Next(vaccineNames.Length)], 200),
                    Series = Truncate($"{rnd.Next(10, 99):D2}-{rnd.Next(10, 99):D2}-{rnd.Next(10, 99):D2}", 100)
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Документы пациентов
        // ──────────────────────────────────────────────────────
        public static List<PatientDocument> GeneratePatientDocuments(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<PatientDocument>();

            var docTypes = new[] {
                "Скан согласия на медицинское вмешательство",
                "Скан направления из поликлиники",
                "Скан выписного эпикриза",
                "Скан рентгенограммы ОГК",
                "Скан результатов спирометрии",
                "Скан ЭКГ"
            };

            var rnd = new Random(0);
            var result = new List<PatientDocument>();

            for (int i = 0; i < count; i++)
            {
                var patient = patients[rnd.Next(patients.Count)];
                var docId = Guid.NewGuid();
                var docType = docTypes[rnd.Next(docTypes.Length)];
                var date = DateTime.Now.AddDays(-rnd.Next(1, 365)).ToShortDateString();

                result.Add(new PatientDocument
                {
                    Id = docId,
                    PatientId = patient.Id,
                    Name = Truncate($"{docType} от {date}", 300),
                    FilePath = Truncate($"/docs/{patient.Id}/{docId}.pdf", 500)
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Жизненные показатели
        // ──────────────────────────────────────────────────────
        public static List<VitalSign> GenerateVitalSigns(int count, List<Patient> patients)
        {
            if (!patients.Any()) return new List<VitalSign>();

            var rnd = new Random(0);
            var result = new List<VitalSign>();

            for (int i = 0; i < count; i++)
            {
                result.Add(new VitalSign
                {
                    Id = Guid.NewGuid(),
                    PatientId = patients[rnd.Next(patients.Count)].Id,
                    RecordedAt = DateTime.Now.AddDays(-rnd.Next(0, 30)).AddHours(-rnd.Next(0, 24)),
                    BloodPressureSystolic = (short)rnd.Next(105, 155),
                    BloodPressureDiastolic = (short)rnd.Next(65, 100),
                    Temperature = Math.Round((decimal)(36.1 + rnd.NextDouble() * 2.5), 1),
                    Pulse = (short)rnd.Next(58, 102),
                    SpO2 = (short)rnd.Next(92, 100),
                    RespiratoryRate = (short)rnd.Next(14, 25)
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Приёмы (appointments)
        // ──────────────────────────────────────────────────────
        public static List<Appointment> GenerateAppointments(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any()) return new List<Appointment>();

            var doctors = staff.Where(s => s.Position != null &&
                (s.Position.Contains("Врач") || s.Position.Contains("врач"))).ToList();
            if (!doctors.Any()) doctors = staff;

            var reasons = new[] {
                "Плановый осмотр пульмонолога",
                "Контрольный осмотр после лечения",
                "Консультация по результатам анализов",
                "Первичный приём",
                "Повторный приём по хроническому заболеванию",
                "Оформление листка нетрудоспособности"
            };

            var rnd = new Random(0);
            var result = new List<Appointment>();
            var statuses = Enum.GetValues(typeof(AppointmentStatus)).Cast<AppointmentStatus>().ToArray();
            var types = Enum.GetValues(typeof(AppointmentType)).Cast<AppointmentType>().ToArray();

            for (int i = 0; i < count; i++)
            {
                result.Add(new Appointment
                {
                    Id = Guid.NewGuid(),
                    PatientId = patients[rnd.Next(patients.Count)].Id,
                    DoctorId = doctors[rnd.Next(doctors.Count)].Id,
                    Time = DateTime.Now.AddDays(rnd.Next(-30, 60)).Date.AddHours(rnd.Next(8, 18)).AddMinutes(rnd.Next(0, 4) * 15),
                    Reason = Truncate(reasons[rnd.Next(reasons.Length)], 300),
                    Status = statuses[rnd.Next(statuses.Length)],
                    Type = types[rnd.Next(types.Length)]
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Палаты и койки
        // ──────────────────────────────────────────────────────
        public static List<Room> GenerateRooms(int count)
        {
            var rooms = new List<Room>();
            var rnd = new Random(0);
            var roomGenders = Enum.GetValues(typeof(RoomGender)).Cast<RoomGender>().ToArray();
            var roomTypes = Enum.GetValues(typeof(RoomType)).Cast<RoomType>().ToArray();
            var roomPriorities = Enum.GetValues(typeof(RoomPriority)).Cast<RoomPriority>().ToArray();

            for (int i = 0; i < count; i++)
            {
                int floor = (i / 8) + 1;
                int roomNum = (i % 8) + 1;
                rooms.Add(new Room
                {
                    Id = Guid.NewGuid(),
                    Floor = floor,
                    RoomNumber = $"{floor}0{roomNum}",
                    Gender = roomGenders[rnd.Next(roomGenders.Length)],
                    Type = roomTypes[rnd.Next(roomTypes.Length)],
                    Priority = roomPriorities[rnd.Next(roomPriorities.Length)]
                });
            }
            return rooms;
        }

        public static List<HospitalBed> GenerateHospitalBeds(int count, List<Room> rooms, List<Patient> patients)
        {
            if (!rooms.Any() || !patients.Any()) return new List<HospitalBed>();

            var beds = new List<HospitalBed>();
            var availablePatients = patients.ToList();
            var rnd = new Random(0);
            var occupiedStatuses = new[] { BedStatus.Stable, BedStatus.Attention, BedStatus.Urgent };

            foreach (var room in rooms)
            {
                int bedsInRoom = rnd.Next(2, 5);
                for (int bedNum = 1; bedNum <= bedsInRoom; bedNum++)
                {
                    bool shouldBeOccupied = rnd.Next(0, 10) < 7; // 70%
                    Patient patientToAdmit = null;

                    if (shouldBeOccupied && availablePatients.Any())
                    {
                        if (room.Gender == RoomGender.Male)
                            patientToAdmit = availablePatients.FirstOrDefault(p => p.Gender == Gender.Male);
                        else
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
                            Status = occupiedStatuses[rnd.Next(occupiedStatuses.Length)],
                            PatientId = patientToAdmit.Id,
                            AdmissionDate = DateTime.Now.AddDays(-rnd.Next(1, 20)),
                            BedNote = Truncate(NurseInstructions[rnd.Next(NurseInstructions.Length)], 1000)
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
                            BedNote = "",
                            AdmissionDate = null
                        });
                    }
                }
            }
            return beds;
        }

        // ──────────────────────────────────────────────────────
        //  Графики работы — 5 месяцев
        // ──────────────────────────────────────────────────────
        public static List<Shift> GenerateShifts(int count, List<MedicalStaff> staff)
        {
            if (!staff.Any()) return new List<Shift>();

            var rnd = new Random(0);
            var result = new List<Shift>();

            // Определяем диапазон: -2 месяца до +2 месяца (включая текущий)
            var now = DateTime.Now;
            var startMonth = new DateTime(now.Year, now.Month, 1).AddMonths(-2);
            var endMonth = new DateTime(now.Year, now.Month, 1).AddMonths(3); // следующий после +2

            foreach (var staffMember in staff)
            {
                bool isNurse = staffMember.Position != null &&
                    (staffMember.Position.Contains("сестра") || staffMember.Position.Contains("Лаборант"));
                bool isDoctor = staffMember.Position != null &&
                    (staffMember.Position.Contains("Врач") || staffMember.Position.Contains("врач") ||
                     staffMember.Position.Contains("Главный"));

                var currentMonth = startMonth;
                while (currentMonth < endMonth)
                {
                    int daysInMonth = DateTime.DaysInMonth(currentMonth.Year, currentMonth.Month);
                    for (int day = 1; day <= daysInMonth; day++)
                    {
                        var date = new DateTime(currentMonth.Year, currentMonth.Month, day);
                        if (date > now.AddDays(62)) break; // Не генерируем слишком далеко в будущее

                        DayOfWeek dow = date.DayOfWeek;
                        bool isWeekend = dow == DayOfWeek.Saturday || dow == DayOfWeek.Sunday;

                        ShiftType? shiftType = null;
                        short hours = 0;

                        if (isNurse)
                        {
                            // Медсёстры: сменный график (12ч), выходные чередуются
                            // Упрощённо: дни чередуются рабочий/выходной
                            int dayIndex = (int)(date - startMonth).TotalDays;
                            int staffIndex = staff.IndexOf(staffMember);
                            bool isWorkDay = ((dayIndex + staffIndex) % 2) == 0;

                            if (isWorkDay)
                            {
                                // 30% ночная смена
                                shiftType = rnd.Next(0, 10) < 3 ? ShiftType.Night : ShiftType.Day;
                                hours = shiftType == ShiftType.Night ? (short)12 : (short)12;
                            }
                            else
                            {
                                shiftType = ShiftType.DayOff;
                                hours = 0;
                            }
                        }
                        else if (isDoctor)
                        {
                            // Врачи: пятидневка (пн-пт), выходные — суббота, воскресенье
                            if (!isWeekend)
                            {
                                // 10% дежурство (ночная)
                                shiftType = rnd.Next(0, 10) < 1 ? ShiftType.Night : ShiftType.Day;
                                hours = shiftType == ShiftType.Night ? (short)24 : (short)8;
                            }
                            else
                            {
                                // Иногда дежурства в выходные (15%)
                                if (rnd.Next(0, 100) < 15)
                                {
                                    shiftType = ShiftType.Night;
                                    hours = 24;
                                }
                                else
                                {
                                    shiftType = ShiftType.DayOff;
                                    hours = 0;
                                }
                            }
                        }
                        else
                        {
                            // Прочий персонал: стандартная пятидневка
                            shiftType = isWeekend ? ShiftType.DayOff : ShiftType.Day;
                            hours = isWeekend ? (short)0 : (short)8;
                        }

                        if (shiftType.HasValue)
                        {
                            result.Add(new Shift
                            {
                                Id = Guid.NewGuid(),
                                StaffId = staffMember.Id,
                                Date = date,
                                Type = shiftType.Value,
                                Hours = hours
                            });
                        }
                    }

                    currentMonth = currentMonth.AddMonths(1);
                }
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Уведомления
        // ──────────────────────────────────────────────────────
        public static List<Notification> GenerateNotifications(int count, List<MedicalStaff> staff, List<Patient> patients)
        {
            if (!staff.Any() || !patients.Any()) return new List<Notification>();

            var messages = new[] {
                "Плановый контроль жизненных показателей пациента",
                "Истекает срок лекарственного назначения",
                "Требуется повторный осмотр пациента",
                "Критическое значение лабораторного показателя",
                "Пациент переведён в другое отделение",
                "Результаты анализов готовы к просмотру",
                "Напоминание: плановая процедура сегодня",
                "Препарат заканчивается на складе"
            };

            var details = new[] {
                "Требуется незамедлительное вмешательство дежурного врача.",
                "Пожалуйста, ознакомьтесь с информацией и примите меры.",
                "Данные направлены из лаборатории. Пожалуйста, проверьте.",
                "Необходимо скорректировать план лечения."
            };

            var rnd = new Random(0);
            var result = new List<Notification>();
            var notifTypes = Enum.GetValues(typeof(NotificationType)).Cast<NotificationType>().ToArray();
            var severityTypes = Enum.GetValues(typeof(SeverityType)).Cast<SeverityType>().ToArray();

            for (int i = 0; i < count; i++)
            {
                result.Add(new Notification
                {
                    Id = Guid.NewGuid(),
                    RecipientId = staff[rnd.Next(staff.Count)].Id,
                    PatientId = patients[rnd.Next(patients.Count)].Id,
                    Type = notifTypes[rnd.Next(notifTypes.Length)],
                    Severity = severityTypes[rnd.Next(severityTypes.Length)],
                    Message = Truncate(messages[rnd.Next(messages.Length)], 500),
                    Details = Truncate(details[rnd.Next(details.Length)], 1000),
                    CreatedAt = DateTime.Now.AddDays(-rnd.Next(0, 30)),
                    IsRead = rnd.Next(0, 3) == 0
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Лист назначений (BedPrescriptions) — вероятностная генерация
        // ──────────────────────────────────────────────────────
        public static List<BedPrescription> GenerateBedPrescriptions(int count, List<Patient> patients, List<PatientMedication> patientMedications)
        {
            if (!patients.Any() || !patientMedications.Any()) return new List<BedPrescription>();

            var rnd = new Random(0);
            var result = new List<BedPrescription>();

            // Группируем назначения по пациентам
            var medsByPatient = patientMedications.GroupBy(pm => pm.PatientId)
                .ToDictionary(g => g.Key, g => g.ToList());

            // Стандартные времена приёма лекарств
            var scheduledTimes = new[] {
                new TimeSpan(8, 0, 0),
                new TimeSpan(12, 0, 0),
                new TimeSpan(16, 0, 0),
                new TimeSpan(20, 0, 0),
                new TimeSpan(22, 0, 0)
            };

            // Генерируем только для пациентов с назначениями, не более count всего
            foreach (var patient in patients)
            {
                if (result.Count >= count) break;

                if (!medsByPatient.TryGetValue(patient.Id, out var patMeds)) continue;

                // 50% вероятность, что у пациента есть лист назначений
                if (rnd.Next(0, 2) == 0) continue;

                foreach (var med in patMeds)
                {
                    if (result.Count >= count) break;

                    // Для каждого назначения — 1-3 записи в листе (на разное время)
                    int entries = rnd.Next(1, 4);
                    var usedTimes = new HashSet<int>();

                    for (int i = 0; i < entries; i++)
                    {
                        int timeIdx;
                        int attempts = 0;
                        do { timeIdx = rnd.Next(scheduledTimes.Length); attempts++; }
                        while (usedTimes.Contains(timeIdx) && attempts < 10);
                        usedTimes.Add(timeIdx);

                        bool isDone = rnd.Next(0, 2) == 0;

                        result.Add(new BedPrescription
                        {
                            Id = Guid.NewGuid(),
                            PatientId = patient.Id,
                            PatientMedicationId = med.Id,
                            Name = Truncate(med.Name, 200),
                            Dose = Truncate(med.Dose, 50),
                            ScheduledTime = scheduledTimes[timeIdx],
                            Date = DateTime.Now.Date,
                            IsDone = isDone,
                            DoneAt = isDone ? DateTime.Now.AddHours(-rnd.Next(0, 8)) : (DateTime?)null,
                            DoneBy = isDone ? null : null // Заполняется при выполнении медсестрой
                        });
                    }
                }
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Журнал действий по коткам
        // ──────────────────────────────────────────────────────
        public static List<BedActionLog> GenerateBedActionLogs(int count, List<Patient> patients, List<MedicalStaff> staff)
        {
            if (!patients.Any() || !staff.Any()) return new List<BedActionLog>();

            var nurses = staff.Where(s => s.Position != null &&
                (s.Position.Contains("сестра") || s.Position.Contains("Сестра"))).ToList();
            if (!nurses.Any()) nurses = staff;

            var actions = new[] {
                "Выполнено назначение: измерение температуры тела",
                "Выполнено назначение: измерение АД и ЧСС",
                "Введена инъекция согласно листу назначений",
                "Проведена инфузионная терапия (капельница)",
                "Выполнена перевязка раны",
                "Выдача таблетированных препаратов согласно расписанию",
                "Осмотр пациента, жалоб не предъявляет",
                "Пациент переведён в другое положение (профилактика пролежней)",
                "Измерен уровень SpO2",
                "Проведена ингаляционная терапия"
            };

            var rnd = new Random(0);
            var result = new List<BedActionLog>();

            for (int i = 0; i < count; i++)
            {
                var nurse = nurses[rnd.Next(nurses.Count)];
                result.Add(new BedActionLog
                {
                    Id = Guid.NewGuid(),
                    PatientId = patients[rnd.Next(patients.Count)].Id,
                    PerformedById = nurse.Id,
                    Action = Truncate(actions[rnd.Next(actions.Length)], 300),
                    PerformedAt = DateTime.Now.AddDays(-rnd.Next(0, 5)).AddHours(-rnd.Next(0, 24))
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  Журнал операций с медикаментами
        // ──────────────────────────────────────────────────────
        public static List<MedicineOperationLog> GenerateMedicineOperationLogs(int count, List<Medicine> medicines, List<MedicalStaff> staff, List<Patient> patients, List<PatientMedication> patientMedications)
        {
            if (!medicines.Any() || !staff.Any()) return new List<MedicineOperationLog>();

            var nonLabStaff = staff.Where(s => s.Position != null && !s.Position.Contains("лаборант") && !s.Position.Contains("Лаборант")).ToList();
            var allowedStaff = nonLabStaff.Any() ? nonLabStaff : staff;

            var rnd = new Random(0);
            var result = new List<MedicineOperationLog>();

            for (int i = 0; i < count; i++)
            {
                var medicine = medicines[rnd.Next(medicines.Count)];
                var opType = rnd.Next(0, 2) == 0 ? OperationType.Receipt : OperationType.Writeoff;

                result.Add(new MedicineOperationLog
                {
                    Id = Guid.NewGuid(),
                    MedicineId = medicine.Id,
                    PerformedAt = DateTime.Now.AddDays(-rnd.Next(0, 365)),
                    Type = opType,
                    Quantity = rnd.Next(1, 50),
                    BalanceAfter = (decimal)Math.Round((double)medicine.CurrentBalance),
                    PerformedById = allowedStaff[rnd.Next(allowedStaff.Count)].Id,
                    PatientId = opType == OperationType.Writeoff ? patients[rnd.Next(patients.Count)].Id : (Guid?)null,
                    PrescriptionId = opType == OperationType.Writeoff && patientMedications.Any()
                        ? patientMedications[rnd.Next(patientMedications.Count)].Id : (Guid?)null
                });
            }

            return result;
        }

        // ──────────────────────────────────────────────────────
        //  История занятости коек
        // ──────────────────────────────────────────────────────
        public static List<BedOccupancyHistory> GenerateBedOccupancyHistories(List<HospitalBed> beds, List<Patient> patients)
        {
            var histories = new List<BedOccupancyHistory>();
            var rnd = new Random(0);

            var activePatientIds = beds.Where(b => b.PatientId.HasValue).Select(b => b.PatientId.Value).ToHashSet();
            var dischargedPatients = patients.Where(p => !activePatientIds.Contains(p.Id)).ToList();

            // Активные записи
            foreach (var bed in beds.Where(b => b.Status != BedStatus.Free && b.PatientId.HasValue))
            {
                histories.Add(new BedOccupancyHistory
                {
                    Id = Guid.NewGuid(),
                    BedId = bed.Id,
                    PatientId = bed.PatientId.Value,
                    AdmittedAt = bed.AdmissionDate ?? DateTime.UtcNow,
                    DischargedAt = null
                });
            }

            // Исторические записи
            foreach (var bed in beds)
            {
                int pastRecords = rnd.Next(1, 3);
                for (int i = 0; i < pastRecords; i++)
                {
                    if (!dischargedPatients.Any()) break;

                    var p = dischargedPatients[rnd.Next(dischargedPatients.Count)];
                    dischargedPatients.Remove(p);

                    bool dischargedToday = rnd.Next(0, 10) < 3;
                    DateTime dischargeDate, admissionDate;

                    if (dischargedToday)
                    {
                        dischargeDate = DateTime.UtcNow.Date.AddHours(rnd.Next(8, 18));
                        admissionDate = dischargeDate.AddDays(-rnd.Next(3, 14));
                    }
                    else
                    {
                        dischargeDate = DateTime.UtcNow.Date.AddDays(-rnd.Next(1, 10));
                        admissionDate = dischargeDate.AddDays(-rnd.Next(3, 14));
                    }

                    histories.Add(new BedOccupancyHistory
                    {
                        Id = Guid.NewGuid(),
                        BedId = bed.Id,
                        PatientId = p.Id,
                        AdmittedAt = admissionDate,
                        DischargedAt = dischargeDate
                    });
                }
            }

            return histories;
        }
    }
}