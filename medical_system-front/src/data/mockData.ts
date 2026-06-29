export interface PatientMedication {
  name: string
  dose?: string
  form?: string
  regimen?: string
  medicineId?: string
  route?: string
  comment?: string
  doctor?: string
  dateStart?: string
  dateEnd?: string
  status?: 'active' | 'completed' | 'cancelled'
}

export interface Patient {
  id: string
  firstName: string
  gender: 'Мужской' | 'Женский'
  lastName: string
  middleName: string
  dateOfBirth: string
 
  age: number
  allergies: any[]
  documents: any[]
  roomNumber?: string
  bedNumber?: number
  admissionDate?: string

  medcardNum: string
  historyNum?: string
  status: string

  statusText: string
  doctor: string
  department: string
  institution: string
  lastUpdated: string

  contacts: {
    phoneMobile?: string
    phoneHome?: string
    phone?: string
    email?: string
    address?: string
    zip?: string
    country?: string
    region?: string
    city?: string
  }
  passport: {
    seriesNumber?: string
    issuedBy?: string
    dateIssued?: string
  }
  maritalStatus: string
  other: {
    language?: string
    nationality?: string
    dateOfDeath?: string
    causeOfDeath?: string
  }
  relatives: {
    name?: string
    relation?: string
    phone?: string
  }[]
  work: {
    profession?: string
    organization?: string
    address?: string
  }
  activeProblems: string[]
  labs: {
    type?: string
    date?: string
    statusText?: string
    doctor?: string
    reason?: string
  }[]
  medications: PatientMedication[]
  currentMeds: PatientMedication[]
  operations: {
    name?: string
    date?: string
    diagnosis?: string
    description?: string
    complications?: string
    implants?: string
    result?: string
  }[]
  medicalProblems: {
    name?: string
    diagnosisDate?: string
    diseaseStatus?: string
    severity?: string
    description?: string
    complications?: string
  }[]
  history: {
    id?: string
    dateTime?: string
    type?: string
    doctor?: string
    doctorName?: string
    conclusion?: string
    complaints?: string
    objective?: string
    recommendations?: string
    formData?: string
  }[]
  vaccines: {
    name?: string
    disease?: string
    date?: string
    validity?: string
    manufacturer?: string
    series?: string
  }[]
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  time: string
  reason: string
  status: 'Ожидается' | 'На приеме' | 'Завершено' | 'Свободно'
  type: 'primary' | 'followup' | 'preventive'
}

export interface VitalSign {
  id: string
  date: string
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  temperature: number
  pulse: number
  spo2: number
  respiratoryRate: number
}

export interface HospitalBed {
  id: string
  roomNumber: string
  bedNumber: number
  patientId?: string
  patientName?: string
  patientLastName?: string
  patientMiddleName?: string
  patientAge?: number
  diagnosis?: string
  status: 'stable' | 'attention' | 'urgent' | 'free'
  doctorName?: string
  doctorRole?: string
  attentionNote?: string
  admissionDate?: string
  bedNote?: string
}

export interface Shift {
  day: number
  type: 'day' | 'night' | 'day-off'
  hours: number
}

export interface MonthSchedule {
  month: number  
  year: number
  shifts: Shift[]
}

export interface MedicalStaffMember {
  id: string
  name: string
  position: string
  department: string
  schedule: Shift[]              
  monthlySchedules?: MonthSchedule[]  
}

export type NotificationType = 'lab-result' | 'appointment-reminder'
export type SeverityType = 'critical' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  severity?: SeverityType
  patientName: string
  patientId: string
  dateOfBirth?: string
  doctor?: string
  message: string
  details?: string
  time: string
  read: boolean
}

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    firstName: 'Иван',
    lastName: 'Петров',
    middleName: 'Сергеевич',
    gender: 'Мужской',
    dateOfBirth: '1985-03-15',
    age: 40,
    allergies: [
      { name: 'Пенициллин', reaction: 'Сыпь', date: '2010-05-12', comment: '' },
      { name: 'Арахис', reaction: 'Отек Квинке', date: '1995-10-01', comment: '' }
    ],
    documents: [{ id: 'DOC001', name: 'Информированное согласие.pdf', date: '2026-01-15' }],
    medcardNum: 'МК-10293',
    historyNum: 'ИБ-2023-45',
    status: 'hospitalized',
    statusText: 'Госпитализирован',
    doctor: 'Смирнов А.А.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-05-05',
    contacts: {
      phoneMobile: '+7 (495) 123-45-67',
      phoneHome: '+7 (495) 123-45-00',
      phone: '+7 (495) 123-45-67',
      email: 'i.petrov@example.com',
      address: 'ул. Ленина, д. 10, кв. 5',
      zip: '101000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4509 123456',
      issuedBy: 'ОВД Тверского района г. Москвы',
      dateIssued: '2005-04-20'
    },
    maritalStatus: 'Женат',
    other: {
      language: 'Русский',
      nationality: 'Русский',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Петрова Мария Ивановна', relation: 'Супруга', phone: '+7 (495) 765-43-21' }
    ],
    work: {
      profession: 'Инженер',
      organization: 'ООО "ТехСтрой"',
      address: 'г. Москва, ул. Строителей, 15'
    },
    activeProblems: ['Внебольничная пневмония', 'Артериальная гипертензия II ст.'],
    labs: [
      {
        type: 'Общий анализ крови',
        date: '2026-05-01',
        statusText: 'Внимание: Лейкоцитоз',
        doctor: 'Смирнов А.А.',
        reason: 'Диагностика воспаления'
      },
      {
        type: 'Биохимия',
        date: '2026-05-02',
        statusText: 'Норма',
        doctor: 'Смирнов А.А.',
        reason: 'Контроль функции почек'
      }
    ],
    medications: [
      { name: 'Эналаприл', dose: '10 мг', form: 'таблетка', regimen: 'утром' },
      { name: 'Аторвастатин', dose: '5 мг', form: 'капсула', regimen: 'вечером' }
    ],
    currentMeds: [
      { name: 'Эналаприл', dose: '10 мг', form: 'таблетка', regimen: 'утром' },
      { name: 'Аторвастатин', dose: '5 мг', form: 'капсула', regimen: 'вечером' }
    ],
    operations: [
      {
        name: 'Аппендэктомия',
        date: '2005-06-15',
        diagnosis: 'Острый аппендицит',
        description: 'Лапароскопическая аппендэктомия под общей анестезией',
        complications: 'Нет',
        implants: 'Нет',
        result: 'Выздоровление'
      }
    ],
    medicalProblems: [
      {
        name: 'Артериальная гипертензия',
        diagnosisDate: '2018-03-10',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: 'Артериальная гипертензия II стадии, риск 3',
        complications: 'Гипертрофия левого желудочка'
      },
      {
        name: 'Хронический гастрит',
        diagnosisDate: '2015-11-20',
        diseaseStatus: 'Хроническое',
        severity: 'Легкая',
        description: 'Хронический поверхностный гастрит',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-05-01 10:00',
        type: 'Госпитализация',
        doctor: 'Смирнов А.А.',
        conclusion: 'Внебольничная правосторонняя пневмония',
        complaints: 'Кашель, температура 38.5, слабость',
        objective: 'Дыхание жесткое, хрипы справа',
        recommendations: 'Режим постельный, антибиотикотерапия'
      },
      {
        dateTime: '2026-05-03 09:30',
        type: 'Осмотр',
        doctor: 'Смирнов А.А.',
        conclusion: 'Положительная динамика',
        complaints: 'Кашель уменьшился, температура 37.2',
        objective: 'Хрипы уменьшились',
        recommendations: 'Продолжить лечение'
      }
    ],
    vaccines: [
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-10-15',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '123456'
      },
      {
        name: 'Спутник V',
        disease: 'COVID-19',
        date: '2024-08-10',
        validity: '1 год',
        manufacturer: 'ГенЕриум',
        series: '789012'
      }
    ]
  },

  {
    id: 'P002',
    firstName: 'Мария',
    lastName: 'Иванова',
    middleName: 'Александровна',
    gender: 'Женский',
    dateOfBirth: '1992-07-22',
    age: 33,
    allergies: [],
    documents: [],
    medcardNum: 'МК-20481',
    historyNum: 'ИБ-2024-12',
    status: 'outpatient',
    statusText: 'Амбулаторно',
    doctor: 'Орлова Е.В.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-04-28',
    contacts: {
      phoneMobile: '+7 (495) 234-56-78',
      phoneHome: '',
      phone: '+7 (495) 234-56-78',
      email: 'm.ivanova@example.com',
      address: 'ул. Пушкина, д. 25, кв. 12',
      zip: '102000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4512 654321',
      issuedBy: 'УМВД Центрального района г. Москвы',
      dateIssued: '2012-09-14'
    },
    maritalStatus: 'Не замужем',
    other: {
      language: 'Русский',
      nationality: 'Русская',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [{ name: 'Иванов Петр Сергеевич', relation: 'Отец', phone: '+7 (495) 876-54-32' }],
    work: {
      profession: 'Менеджер',
      organization: 'ООО "МедиаГрупп"',
      address: 'г. Москва, ул. Тверская, 12'
    },
    activeProblems: ['Бронхиальная астма, легкое персистирующее течение'],
    labs: [
      {
        type: 'Спирометрия',
        date: '2026-04-20',
        statusText: 'Внимание: ОФВ1 снижен',
        doctor: 'Орлова Е.В.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Сальбутамол', dose: '100 мкг', form: 'аэрозоль', regimen: 'по необходимости' }
    ],
    currentMeds: [
      { name: 'Сальбутамол', dose: '100 мкг', form: 'аэрозоль', regimen: 'по необходимости' }
    ],
    operations: [],
    medicalProblems: [
      {
        name: 'Бронхиальная астма',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-04-20 11:00',
        type: 'Плановый осмотр',
        doctor: 'Орлова Е.В.',
        conclusion: 'Астма под контролем, обострений нет',
        complaints: 'Редкие эпизоды одышки при физической нагрузке',
        objective: 'Дыхание везикулярное, хрипов нет',
        recommendations: 'Продолжить базисную терапию, контроль через 3 месяца'
      }
    ],
    vaccines: [
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-10-10',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '234567'
      }
    ]
  },

  {
    id: 'P003',
    firstName: 'Алексей',
    lastName: 'Смирнов',
    middleName: 'Дмитриевич',
    gender: 'Мужской',
    dateOfBirth: '1978-11-30',
    age: 47,
    allergies: [{ name: 'Йод', reaction: 'Контактный дерматит', date: '2008-03-05', comment: '' }],
    documents: [],
    medcardNum: 'МК-30572',
    historyNum: 'ИБ-2023-88',
    status: 'hospitalized',
    statusText: 'Госпитализирован',
    doctor: 'Козлова Н.И.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-05-04',
    contacts: {
      phoneMobile: '+7 (495) 345-67-89',
      phoneHome: '',
      phone: '+7 (495) 345-67-89',
      email: 'a.smirnov@example.com',
      address: 'пр. Мира, д. 45, кв. 78',
      zip: '103000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4503 789012',
      issuedBy: 'ОВД Мещанского района г. Москвы',
      dateIssued: '2003-06-11'
    },
    maritalStatus: 'Женат',
    other: {
      language: 'Русский',
      nationality: 'Русский',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Смирнова Ольга Викторовна', relation: 'Супруга', phone: '+7 (495) 987-65-43' }
    ],
    work: {
      profession: 'Бухгалтер',
      organization: 'АО "Финансгрупп"',
      address: 'г. Москва, Садовая-Самотечная, 5'
    },
    activeProblems: ['Декомпенсация сахарного диабета 2 типа', 'Ожирение 1 степени'],
    labs: [
      {
        type: 'Гликированный гемоглобин',
        date: '2026-04-30',
        statusText: 'Критично: HbA1c 9.2%',
        doctor: 'Козлова Н.И.',
        reason: 'Плановое обследование'
      },
      {
        type: 'Биохимия крови',
        date: '2026-05-01',
        statusText: 'Внимание: Глюкоза 8.4',
        doctor: 'Козлова Н.И.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Метформин', dose: '850 мг', form: 'таблетки', regimen: '2 раза в день' },
      { name: 'Инсулин Актрапид', dose: '8 ед', form: 'раствор', regimen: 'перед едой' }
    ],
    currentMeds: [
      { name: 'Метформин', dose: '850 мг', form: 'таблетки', regimen: '2 раза в день' },
      { name: 'Инсулин Актрапид', dose: '8 ед', form: 'раствор', regimen: 'перед едой' }
    ],
    operations: [
      {
        name: 'Холецистэктомия',
        date: '2015-01-01',
        diagnosis: '—',
        description: 'Подробности не указаны',
        complications: 'Нет',
        implants: 'Нет',
        result: 'Выздоровление'
      }
    ],
    medicalProblems: [
      {
        name: 'Сахарный диабет 2 типа',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Ожирение',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Артериальная гипертензия',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-04-30 09:00',
        type: 'Госпитализация',
        doctor: 'Козлова Н.И.',
        conclusion: 'Декомпенсация СД 2 типа',
        complaints: 'Жажда, частое мочеиспускание, слабость',
        objective: 'Гликемия 14.2 ммоль/л, АД 145/92',
        recommendations: 'Инсулинотерапия, коррекция диеты'
      }
    ],
    vaccines: [
      {
        name: 'Пневмо-23',
        disease: 'Пневмококковая инфекция',
        date: '2023-05-20',
        validity: '5 лет',
        manufacturer: 'Sanofi',
        series: '345678'
      }
    ]
  },

  {
    id: 'P004',
    firstName: 'Екатерина',
    lastName: 'Орлова',
    middleName: 'Владимировна',
    gender: 'Женский',
    dateOfBirth: '1988-04-11',
    age: 37,
    allergies: [{ name: 'Ибупрофен', reaction: 'Крапивница', date: '2019-07-22', comment: '' }],
    documents: [],
    medcardNum: 'МК-40663',
    historyNum: 'ИБ-2025-03',
    status: 'hospitalized',
    statusText: 'Госпитализирована',
    doctor: 'Лукина А.С.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-04-25',
    contacts: {
      phoneMobile: '+7 (495) 456-71-22',
      phoneHome: '',
      phone: '+7 (495) 456-71-22',
      email: 'e.orlova@example.com',
      address: 'ул. Лесная, д. 7, кв. 14',
      zip: '104000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4508 321654',
      issuedBy: 'УМВД Савеловского района г. Москвы',
      dateIssued: '2008-11-03'
    },
    maritalStatus: 'Замужем',
    other: {
      language: 'Русский',
      nationality: 'Русская',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [{ name: 'Орлов Владимир Павлович', relation: 'Муж', phone: '+7 (495) 456-71-23' }],
    work: {
      profession: 'Педагог',
      organization: 'ГБОУ Школа №1234',
      address: 'г. Москва, ул. Лесная, 3'
    },
    activeProblems: ['Вегетососудистая дистония, смешанный тип'],
    labs: [
      {
        type: 'Общий анализ крови',
        date: '2026-04-22',
        statusText: 'Норма',
        doctor: 'Лукина А.С.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [{ name: 'Магне B6', dose: '2 таб', form: 'таблетки', regimen: '2 раза в день' }],
    operations: [],
    medicalProblems: [
      {
        name: 'Вегетососудистая дистония',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    currentMeds: [{ name: 'Магне B6', dose: '2 таб', form: 'таблетки', regimen: '2 раза в день' }],

    history: [
      {
        dateTime: '2026-04-22 10:30',
        type: 'Плановый осмотр',
        doctor: 'Лукина А.С.',
        conclusion: 'ВСД смешанного типа, умеренно выраженная',
        complaints: 'Головокружение, сердцебиение при стрессе',
        objective: 'АД лабильное, ЧСС 71',
        recommendations: 'Прием магния, режим труда и отдыха'
      }
    ],
    vaccines: [
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-11-01',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '456789'
      }
    ]
  },

  {
    id: 'P005',
    firstName: 'Николай',
    lastName: 'Федоров',
    middleName: 'Андреевич',
    gender: 'Мужской',
    dateOfBirth: '1969-09-03',
    age: 56,
    allergies: [],
    documents: [],
    medcardNum: 'МК-50744',
    historyNum: 'ИБ-2022-71',
    status: 'hospitalized',
    statusText: 'Госпитализирован',
    doctor: 'Карпов В.Г.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-05-03',
    contacts: {
      phoneMobile: '+7 (495) 501-14-67',
      phoneHome: '',
      phone: '+7 (495) 501-14-67',
      email: 'n.fedorov@example.com',
      address: 'Профсоюзная ул., д. 18, кв. 42',
      zip: '105000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4500 112233',
      issuedBy: 'ОВД Академического района г. Москвы',
      dateIssued: '2000-02-28'
    },
    maritalStatus: 'Женат',
    other: {
      language: 'Русский',
      nationality: 'Русский',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Федорова Ирина Николаевна', relation: 'Супруга', phone: '+7 (495) 501-14-68' }
    ],
    work: {
      profession: 'Водитель',
      organization: 'ГУП "Мосгортранс"',
      address: 'г. Москва, Профсоюзная ул., 50'
    },
    activeProblems: ['ИБС: стабильная стенокардия II ФК', 'Артериальная гипертензия II ст.'],
    labs: [
      {
        type: 'Липидный профиль',
        date: '2026-04-29',
        statusText: 'Внимание: ХС ЛПНП 3.9',
        doctor: 'Карпов В.Г.',
        reason: 'Плановое обследование'
      },
      {
        type: 'ЭКГ',
        date: '2026-05-01',
        statusText: 'Внимание: Признаки гипертрофии ЛЖ',
        doctor: 'Карпов В.Г.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Бисопролол', dose: '5 мг', form: 'таблетки', regimen: '1 раз в день' },
      { name: 'Аспирин Кардио', dose: '100 мг', form: 'таблетки', regimen: 'вечером' }
    ],
    currentMeds: [
      { name: 'Бисопролол', dose: '5 мг', form: 'таблетки', regimen: '1 раз в день' },
      { name: 'Аспирин Кардио', dose: '100 мг', form: 'таблетки', regimen: 'вечером' }
    ],
    operations: [
      {
        name: 'АКШ',
        date: '2018-01-01',
        diagnosis: '—',
        description: 'Подробности не указаны',
        complications: 'Нет',
        implants: 'Нет',
        result: 'Выздоровление'
      }
    ],
    medicalProblems: [
      {
        name: 'ИБС',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Артериальная гипертензия',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Атеросклероз',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-05-01 08:00',
        type: 'Госпитализация',
        doctor: 'Карпов В.Г.',
        conclusion: 'Обострение ИБС, нестабильная стенокардия',
        complaints: 'Загрудинные боли при ходьбе, одышка',
        objective: 'АД 145/90, ЧСС 80, ЭКГ — признаки ишемии',
        recommendations: 'Постельный режим, нитраты, антикоагулянты'
      }
    ],
    vaccines: [
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-09-30',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '567890'
      }
    ]
  },

  {
    id: 'P006',
    firstName: 'Светлана',
    lastName: 'Громова',
    middleName: 'Ильинична',
    gender: 'Женский',
    dateOfBirth: '1995-02-27',
    age: 30,
    allergies: [
      { name: 'Пыльца березы', reaction: 'Ринит, конъюнктивит', date: '2015-04-10', comment: '' }
    ],
    documents: [],
    medcardNum: 'МК-60835',
    historyNum: 'ИБ-2026-02',
    status: 'hospitalized',
    statusText: 'Госпитализирована',
    doctor: 'Белова О.Р.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-05-01',
    contacts: {
      phoneMobile: '+7 (495) 613-90-10',
      phoneHome: '',
      phone: '+7 (495) 613-90-10',
      email: 's.gromova@example.com',
      address: 'ул. Садовая, д. 55, кв. 6',
      zip: '106000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4515 998877',
      issuedBy: 'УМВД Пресненского района г. Москвы',
      dateIssued: '2015-03-05'
    },
    maritalStatus: 'Не замужем',
    other: {
      language: 'Русский',
      nationality: 'Русская',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [{ name: 'Громова Инна Ивановна', relation: 'Мать', phone: '+7 (495) 613-90-11' }],
    work: {
      profession: 'Дизайнер',
      organization: 'ИП Громова С.И.',
      address: 'Дистанционно'
    },
    activeProblems: ['Обострение хронического тонзиллита'],
    labs: [
      {
        type: 'Мазок из зева',
        date: '2026-01-13',
        statusText: 'Внимание: Staphylococcus aureus',
        doctor: 'Белова О.Р.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Мирамистин', dose: '3 орошения', form: 'спрей', regimen: '3 раза в день' },
      { name: 'Амоксициллин', dose: '500 мг', form: 'таблетки', regimen: '3 раза в день' }
    ],
    currentMeds: [
      { name: 'Мирамистин', dose: '3 орошения', form: 'спрей', regimen: '3 раза в день' },
      { name: 'Амоксициллин', dose: '500 мг', form: 'таблетки', regimen: '3 раза в день' }
    ],
    operations: [],
    medicalProblems: [
      {
        name: 'Хронический тонзиллит',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Поллиноз',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-01-12 14:00',
        type: 'Первичный прием',
        doctor: 'Белова О.Р.',
        conclusion: 'Обострение хронического тонзиллита',
        complaints: 'Боль в горле, субфебрилитет 3 дня',
        objective: 'Миндалины увеличены, гиперемированы, налет',
        recommendations: 'Антибиотикотерапия, местное лечение'
      }
    ],
    vaccines: [
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-10-20',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '678901'
      }
    ]
  },

  {
    id: 'P007',
    firstName: 'Павел',
    lastName: 'Лебедев',
    middleName: 'Олегович',
    gender: 'Мужской',
    dateOfBirth: '1981-12-08',
    age: 44,
    allergies: [
      { name: 'Латекс', reaction: 'Контактный дерматит', date: '2011-06-18', comment: '' }
    ],
    documents: [],
    medcardNum: 'МК-70916',
    historyNum: 'ИБ-2025-19',
    status: 'hospitalized',
    statusText: 'Госпитализирован',
    doctor: 'Ершов М.П.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-04-30',
    contacts: {
      phoneMobile: '+7 (495) 720-88-01',
      phoneHome: '',
      phone: '+7 (495) 720-88-01',
      email: 'p.lebedev@example.com',
      address: 'Университетский пр., д. 9, кв. 31',
      zip: '107000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4501 445566',
      issuedBy: 'ОВД Гагаринского района г. Москвы',
      dateIssued: '2001-01-15'
    },
    maritalStatus: 'Разведен',
    other: {
      language: 'Русский',
      nationality: 'Русский',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Лебедева Марина Олеговна', relation: 'Сестра', phone: '+7 (495) 720-88-02' }
    ],
    work: {
      profession: 'Программист',
      organization: 'ООО "ИТ-Решения"',
      address: 'г. Москва, Ленинский пр., 28'
    },
    activeProblems: ['Поясничный остеохондроз с болевым синдромом', 'Протрузия L4-L5'],
    labs: [
      {
        type: 'МРТ поясничного отдела',
        date: '2026-04-18',
        statusText: 'Внимание: Протрузия L4-L5 до 4 мм',
        doctor: 'Ершов М.П.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Мидокалм', dose: '150 мг', form: 'таблетки', regimen: '2 раза в день' },
      { name: 'Диклофенак', dose: '75 мг', form: 'гель', regimen: '2 раза в день местно' }
    ],
    currentMeds: [
      { name: 'Мидокалм', dose: '150 мг', form: 'таблетки', regimen: '2 раза в день' },
      { name: 'Диклофенак', dose: '75 мг', form: 'гель', regimen: '2 раза в день местно' }
    ],
    operations: [],
    medicalProblems: [
      {
        name: 'Поясничный остеохондроз',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Протрузия дисков',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-04-17 16:00',
        type: 'Первичный прием',
        doctor: 'Ершов М.П.',
        conclusion: 'Поясничный остеохондроз, обострение',
        complaints: 'Боли в пояснице, иррадиация в левую ногу',
        objective: 'Болезненность L4-L5, ограничение сгибания',
        recommendations: 'Миорелаксанты, НПВС, ЛФК, МРТ'
      }
    ],
    vaccines: []
  },

  {
    id: 'P008',
    firstName: 'Людмила',
    lastName: 'Волкова',
    middleName: 'Семеновна',
    gender: 'Женский',
    dateOfBirth: '1974-06-19',
    age: 51,
    allergies: [],
    documents: [],
    medcardNum: 'МК-81027',
    historyNum: 'ИБ-2024-55',
    status: 'hospitalized',
    statusText: 'Госпитализирована',
    doctor: 'Носова Т.В.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-04-27',
    contacts: {
      phoneMobile: '+7 (495) 410-55-31',
      phoneHome: '',
      phone: '+7 (495) 410-55-31',
      email: 'l.volkova@example.com',
      address: 'Нагорная ул., д. 12, кв. 9',
      zip: '108000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4504 667788',
      issuedBy: 'ОВД Нагорного района г. Москвы',
      dateIssued: '2004-08-22'
    },
    maritalStatus: 'Вдова',
    other: {
      language: 'Русский',
      nationality: 'Русская',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Волков Илья Константинович', relation: 'Сын', phone: '+7 (495) 410-55-32' }
    ],
    work: {
      profession: 'Кассир',
      organization: 'АО "Магнит"',
      address: 'г. Москва, Нагорная ул., 1'
    },
    activeProblems: ['Обострение хронического пиелонефрита'],
    labs: [
      {
        type: 'Общий анализ мочи',
        date: '2026-04-25',
        statusText: 'Внимание: Лейкоцитурия',
        doctor: 'Носова Т.В.',
        reason: 'Плановое обследование'
      },
      {
        type: 'УЗИ почек',
        date: '2026-04-26',
        statusText: 'Внимание: Расширение ЧЛС справа',
        doctor: 'Носова Т.В.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Канефрон', dose: '2 драже', form: 'драже', regimen: '3 раза в день' },
      { name: 'Ципрофлоксацин', dose: '500 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    currentMeds: [
      { name: 'Канефрон', dose: '2 драже', form: 'драже', regimen: '3 раза в день' },
      { name: 'Ципрофлоксацин', dose: '500 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    operations: [],
    medicalProblems: [
      {
        name: 'Хронический пиелонефрит',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Мочекаменная болезнь в анамнезе',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-04-24 13:00',
        type: 'Госпитализация',
        doctor: 'Носова Т.В.',
        conclusion: 'Обострение хронического пиелонефрита',
        complaints: 'Боли в пояснице, лихорадка до 38.2, дизурия',
        objective: 'Симптом Пастернацкого положительный справа',
        recommendations: 'Антибиотикотерапия, обильное питье, УЗИ'
      }
    ],
    vaccines: [
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-10-05',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '789012'
      }
    ]
  },

  {
    id: 'P009',
    firstName: 'Артем',
    lastName: 'Белов',
    middleName: 'Максимович',
    gender: 'Мужской',
    dateOfBirth: '2000-10-14',
    age: 25,
    allergies: [{ name: 'Цитрусовые', reaction: 'Сыпь', date: '2010-01-20', comment: '' }],
    documents: [],
    medcardNum: 'МК-91138',
    historyNum: 'ИБ-2026-05',
    status: 'hospitalized',
    statusText: 'Госпитализирован',
    doctor: 'Зимина С.А.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-05-02',
    contacts: {
      phoneMobile: '+7 (495) 311-24-70',
      phoneHome: '',
      phone: '+7 (495) 311-24-70',
      email: 'a.belov@example.com',
      address: 'Мичуринский пр., д. 4, кв. 52',
      zip: '109000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4520 112358',
      issuedBy: 'УМВД Хамовнического района г. Москвы',
      dateIssued: '2020-10-20'
    },
    maritalStatus: 'Холост',
    other: {
      language: 'Русский',
      nationality: 'Русский',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Белова Татьяна Сергеевна', relation: 'Мать', phone: '+7 (495) 311-24-71' }
    ],
    work: {
      profession: 'Студент',
      organization: 'МГУ им. М.В. Ломоносова',
      address: 'г. Москва, Воробьевы горы, 1'
    },
    activeProblems: ['Обострение хронического гастродуоденита'],
    labs: [
      {
        type: 'ФГДС',
        date: '2026-01-15',
        statusText: 'Внимание: Гастродуоденит, эрозии луковицы',
        doctor: 'Зимина С.А.',
        reason: 'Плановое обследование'
      },
      {
        type: 'Хеликобактер (дыхательный тест)',
        date: '2026-01-15',
        statusText: 'Критично: H. pylori положительный',
        doctor: 'Зимина С.А.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Омез', dose: '20 мг', form: 'капсулы', regimen: '1 раз в день' },
      { name: 'Амоксициллин', dose: '1000 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    currentMeds: [
      { name: 'Омез', dose: '20 мг', form: 'капсулы', regimen: '1 раз в день' },
      { name: 'Амоксициллин', dose: '1000 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    operations: [],
    medicalProblems: [
      {
        name: 'Хронический гастродуоденит',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'H. pylori инфекция',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-01-14 10:00',
        type: 'Первичный прием',
        doctor: 'Зимина С.А.',
        conclusion: 'Гастродуоденит, обострение. H. pylori +',
        complaints: 'Боли в эпигастрии, тошнота после еды',
        objective: 'Болезненность в эпигастрии при пальпации',
        recommendations: 'ИПП, эрадикационная терапия, диета стол №1'
      }
    ],
    vaccines: [
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-11-10',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '890123'
      }
    ]
  },

  {
    id: 'P010',
    firstName: 'Наталья',
    lastName: 'Зайцева',
    middleName: 'Анатольевна',
    gender: 'Женский',
    dateOfBirth: '1983-08-05',
    age: 42,
    allergies: [{ name: 'Мед', reaction: 'Крапивница', date: '2017-08-14', comment: '' }],
    documents: [],
    medcardNum: 'МК-01249',
    historyNum: 'ИБ-2025-41',
    status: 'hospitalized',
    statusText: 'Госпитализирована',
    doctor: 'Гаврилова К.Е.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-04-29',
    contacts: {
      phoneMobile: '+7 (495) 212-67-98',
      phoneHome: '',
      phone: '+7 (495) 212-67-98',
      email: 'n.zaitseva@example.com',
      address: 'пер. Хлебный, д. 2, кв. 11',
      zip: '110000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4503 556677',
      issuedBy: 'ОВД Арбатского района г. Москвы',
      dateIssued: '2003-09-17'
    },
    maritalStatus: 'Замужем',
    other: {
      language: 'Русский',
      nationality: 'Русская',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Зайцев Анатолий Олегович', relation: 'Брат', phone: '+7 (495) 212-67-99' },
      { name: 'Зайцев Роман Дмитриевич', relation: 'Муж', phone: '+7 (495) 212-67-97' }
    ],
    work: {
      profession: 'Экономист',
      organization: 'ООО "АудитСервис"',
      address: 'г. Москва, Новый Арбат, 11'
    },
    activeProblems: ['Железодефицитная анемия средней степени тяжести'],
    labs: [
      {
        type: 'Общий анализ крови',
        date: '2026-04-28',
        statusText: 'Критично: Гемоглобин 78 г/л',
        doctor: 'Гаврилова К.Е.',
        reason: 'Плановое обследование'
      },
      {
        type: 'Ферритин сыворотки',
        date: '2026-04-28',
        statusText: 'Критично: 4 нг/мл',
        doctor: 'Гаврилова К.Е.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [{ name: 'Сорбифер', dose: '1 таб', form: 'таблетки', regimen: '2 раза в день' }],
    operations: [],
    medicalProblems: [
      {
        name: 'Железодефицитная анемия',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    currentMeds: [{ name: 'Сорбифер', dose: '1 таб', form: 'таблетки', regimen: '2 раза в день' }],

    history: [
      {
        dateTime: '2026-04-27 11:30',
        type: 'Госпитализация',
        doctor: 'Гаврилова К.Е.',
        conclusion: 'ЖДА средней степени тяжести',
        complaints: 'Слабость, головокружение, бледность кожи',
        objective: 'Кожа бледная, ЧСС 90, Hb 78 г/л',
        recommendations: 'Препараты железа, диета, повторный анализ крови через 4 недели'
      }
    ],
    vaccines: []
  },

  {
    id: 'P011',
    firstName: 'Георгий',
    lastName: 'Тимофеев',
    middleName: 'Сергеевич',
    gender: 'Мужской',
    dateOfBirth: '1958-01-24',
    age: 68,
    allergies: [
      {
        name: 'Новокаин',
        reaction: 'Анафилаксия',
        date: '1995-03-10',
        comment: 'Реакция при стоматологии'
      }
    ],
    documents: [],
    medcardNum: 'МК-11350',
    historyNum: 'ИБ-2021-99',
    status: 'hospitalized',
    statusText: 'Госпитализирован',
    doctor: 'Антонов Р.С.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-05-04',
    contacts: {
      phoneMobile: '+7 (495) 344-18-43',
      phoneHome: '',
      phone: '+7 (495) 344-18-43',
      email: 'g.timofeev@example.com',
      address: 'Ломоносовский пр., д. 33, кв. 88',
      zip: '111000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4498 334455',
      issuedBy: 'ОВД Раменского района г. Москвы',
      dateIssued: '1998-02-10'
    },
    maritalStatus: 'Вдовец',
    other: {
      language: 'Русский',
      nationality: 'Русский',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Тимофеева Алла Георгиевна', relation: 'Дочь', phone: '+7 (495) 344-18-44' }
    ],
    work: {
      profession: 'Пенсионер',
      organization: '',
      address: ''
    },
    activeProblems: ['ХОБЛ, стадия III (тяжелая)', 'Эмфизема легких'],
    labs: [
      {
        type: 'Спирометрия (ОФВ1)',
        date: '2026-04-10',
        statusText: 'Критично: ОФВ1 38% от нормы',
        doctor: 'Антонов Р.С.',
        reason: 'Плановое обследование'
      },
      {
        type: 'Газы крови',
        date: '2026-05-02',
        statusText: 'Внимание: Гипоксемия PaO2 62',
        doctor: 'Антонов Р.С.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Беродуал', dose: '20 капель', form: 'раствор', regimen: '2 раза в день' },
      { name: 'Тиотропий', dose: '18 мкг', form: 'капсулы д/инг.', regimen: '1 раз в день' }
    ],
    currentMeds: [
      { name: 'Беродуал', dose: '20 капель', form: 'раствор', regimen: '2 раза в день' },
      { name: 'Тиотропий', dose: '18 мкг', form: 'капсулы д/инг.', regimen: '1 раз в день' }
    ],
    operations: [
      {
        name: 'Резекция правого легкого',
        date: '2010-01-01',
        diagnosis: '—',
        description: 'Подробности не указаны',
        complications: 'Нет',
        implants: 'Нет',
        result: 'Выздоровление'
      }
    ],
    medicalProblems: [
      {
        name: 'ХОБЛ',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Эмфизема',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Легочная гипертензия',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-05-01 07:30',
        type: 'Госпитализация',
        doctor: 'Антонов Р.С.',
        conclusion: 'Обострение ХОБЛ III стадии',
        complaints: 'Усиление одышки, кашель с гнойной мокротой',
        objective: 'SpO2 92%, дыхание ослаблено с обеих сторон',
        recommendations: 'Бронходилататоры, стероиды, оксигенотерапия'
      }
    ],
    vaccines: [
      {
        name: 'Пневмо-23',
        disease: 'Пневмококковая инфекция',
        date: '2022-06-15',
        validity: '5 лет',
        manufacturer: 'Sanofi',
        series: '901234'
      },
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-10-01',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '012345'
      }
    ]
  },

  {
    id: 'P012',
    firstName: 'Анастасия',
    lastName: 'Макарова',
    middleName: 'Денисовна',
    gender: 'Женский',
    dateOfBirth: '1998-05-30',
    age: 27,
    allergies: [],
    documents: [],
    medcardNum: 'МК-21461',
    historyNum: 'ИБ-2025-28',
    status: 'hospitalized',
    statusText: 'Госпитализирована',
    doctor: 'Лебедева И.О.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-04-26',
    contacts: {
      phoneMobile: '+7 (495) 277-41-53',
      phoneHome: '',
      phone: '+7 (495) 277-41-53',
      email: 'a.makarova@example.com',
      address: 'Смоленский бульвар, д. 21, кв. 15',
      zip: '112000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4518 223344',
      issuedBy: 'УМВД Хамовнического района г. Москвы',
      dateIssued: '2018-06-01'
    },
    maritalStatus: 'Не замужем',
    other: {
      language: 'Русский',
      nationality: 'Русская',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [{ name: 'Макаров Денис Сергеевич', relation: 'Брат', phone: '+7 (495) 277-41-54' }],
    work: {
      profession: 'Журналист',
      organization: 'ООО "МедиаПресс"',
      address: 'г. Москва, Смоленская пл., 3'
    },
    activeProblems: ['Мигрень без ауры, частые приступы'],
    labs: [
      {
        type: 'МРТ головного мозга',
        date: '2026-04-19',
        statusText: 'Норма: Патологии не выявлено',
        doctor: 'Лебедева И.О.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Суматриптан', dose: '50 мг', form: 'таблетки', regimen: 'при приступе' },
      { name: 'Топирамат', dose: '25 мг', form: 'таблетки', regimen: '1 раз в день' }
    ],
    currentMeds: [
      { name: 'Суматриптан', dose: '50 мг', form: 'таблетки', regimen: 'при приступе' },
      { name: 'Топирамат', dose: '25 мг', form: 'таблетки', regimen: '1 раз в день' }
    ],
    operations: [],
    medicalProblems: [
      {
        name: 'Мигрень без ауры',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-04-18 15:00',
        type: 'Плановый осмотр',
        doctor: 'Лебедева И.О.',
        conclusion: 'Мигрень без ауры, учащение приступов',
        complaints: 'До 6 приступов в месяц, тошнота, фотофобия',
        objective: 'Неврологический статус без очаговой симптоматики',
        recommendations: 'Топирамат профилактически, МРТ, дневник головной боли'
      }
    ],
    vaccines: []
  },

  {
    id: 'P013',
    firstName: 'Роман',
    lastName: 'Егоров',
    middleName: 'Валерьевич',
    gender: 'Мужской',
    dateOfBirth: '1990-03-09',
    age: 35,
    allergies: [
      {
        name: 'Анальгин',
        reaction: 'Агранулоцитоз',
        date: '2020-11-05',
        comment: 'Зафиксировано в стационаре'
      }
    ],
    documents: [],
    medcardNum: 'МК-31572',
    historyNum: 'ИБ-2026-07',
    status: 'hospitalized',
    statusText: 'Госпитализирован',
    doctor: 'Воронова Д.А.',
    department: 'Пульмонология',
    institution: 'ГУ БЦГБ',
    lastUpdated: '2026-05-01',
    contacts: {
      phoneMobile: '+7 (495) 688-15-77',
      phoneHome: '',
      phone: '+7 (495) 688-15-77',
      email: 'r.egorov@example.com',
      address: 'ул. Тверская, д. 41, кв. 19',
      zip: '113000',
      country: 'Россия',
      region: 'Московская область',
      city: 'Москва'
    },
    passport: {
      seriesNumber: '4510 778899',
      issuedBy: 'УМВД Тверского района г. Москвы',
      dateIssued: '2010-04-22'
    },
    maritalStatus: 'Женат',
    other: {
      language: 'Русский',
      nationality: 'Русский',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Егорова Елена Романовна', relation: 'Супруга', phone: '+7 (495) 688-15-78' }
    ],
    work: {
      profession: 'Юрист',
      organization: 'ООО "ЮрКонсалт"',
      address: 'г. Москва, ул. Тверская, 22'
    },
    activeProblems: ['Острый гнойный гайморит двусторонний'],
    labs: [
      {
        type: 'Рентген придаточных пазух',
        date: '2026-01-14',
        statusText: 'Критично: Уровень жидкости в обеих гайморовых пазухах',
        doctor: 'Воронова Д.А.',
        reason: 'Плановое обследование'
      },
      {
        type: 'Общий анализ крови',
        date: '2026-01-14',
        statusText: 'Внимание: Лейкоцитоз 11.8',
        doctor: 'Воронова Д.А.',
        reason: 'Плановое обследование'
      }
    ],
    medications: [
      { name: 'Синупрет', dose: '2 таб', form: 'таблетки', regimen: '3 раза в день' },
      { name: 'Амоксиклав', dose: '875/125 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    currentMeds: [
      { name: 'Синупрет', dose: '2 таб', form: 'таблетки', regimen: '3 раза в день' },
      { name: 'Амоксиклав', dose: '875/125 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    operations: [],
    medicalProblems: [
      {
        name: 'Хронический синусит (в анамнезе)',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      },
      {
        name: 'Аллергический ринит',
        diagnosisDate: '',
        diseaseStatus: 'Хроническое',
        severity: 'Умеренная',
        description: '',
        complications: 'Нет'
      }
    ],
    history: [
      {
        dateTime: '2026-01-13 09:00',
        type: 'Первичный прием',
        doctor: 'Воронова Д.А.',
        conclusion: 'Острый гнойный гайморит двусторонний',
        complaints: 'Заложенность носа, гнойные выделения, головная боль 5 дней',
        objective: 'Болезненность при пальпации проекции гайморовых пазух',
        recommendations: 'Антибиотикотерапия, топические стероиды, рентген пазух'
      }
    ],
    vaccines: [
      {
        name: 'Гриппол Плюс',
        disease: 'Грипп',
        date: '2025-10-25',
        validity: '1 год',
        manufacturer: 'Фармстандарт',
        series: '123789'
      }
    ]
  }
]


export const mockTodayAppointments: Appointment[] = [
  {
    id: 'A001',
    patientId: 'P001',
    patientName: 'Петров Иван Сергеевич',
    time: '09:00',
    reason: 'Контрольный осмотр',
    status: 'Ожидается',
    type: 'followup'
  },
  {
    id: 'A002',
    patientId: 'P002',
    patientName: 'Иванова Мария Александровна',
    time: '09:30',
    reason: 'Консультация по результатам анализов',
    status: 'На приеме',
    type: 'followup'
  },
  {
    id: 'A003',
    patientId: '',
    patientName: '',
    time: '10:00',
    reason: '',
    status: 'Свободно',
    type: 'primary'
  },
  {
    id: 'A004',
    patientId: 'P003',
    patientName: 'Смирнов Алексей Дмитриевич',
    time: '10:30',
    reason: 'Первичный прием',
    status: 'Ожидается',
    type: 'primary'
  },
  {
    id: 'A005',
    patientId: '',
    patientName: '',
    time: '11:00',
    reason: '',
    status: 'Свободно',
    type: 'primary'
  },
  {
    id: 'A006',
    patientId: '',
    patientName: '',
    time: '11:30',
    reason: '',
    status: 'Свободно',
    type: 'primary'
  },
  {
    id: 'A007',
    patientId: '',
    patientName: '',
    time: '12:00',
    reason: '',
    status: 'Свободно',
    type: 'primary'
  },
  {
    id: 'A008',
    patientId: '',
    patientName: '',
    time: '12:30',
    reason: '',
    status: 'Свободно',
    type: 'primary'
  }
]

export const mockReferenceVitalSings: Record<string, VitalSign[]> = {
  Good: [
    {
      id: 'RV001',
      date: '2026-01-01',
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      temperature: 36.7,
      pulse: 70,
      spo2: 98,
      respiratoryRate: 16
    },
    {
      id: 'RV002',
      date: '2026-02-01',
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 75,
      temperature: 36.8,
      pulse: 75,
      spo2: 99,
      respiratoryRate: 18
    },
    {
      id: 'RV003',
      date: '2026-03-01',
      bloodPressureSystolic: 115,
      bloodPressureDiastolic: 85,
      temperature: 36.9,
      pulse: 72,
      spo2: 100,
      respiratoryRate: 14
    }
  ]
}

export const mockPathientVitalSigns: Record<string, VitalSign[]> = {
  P001: [
    {
      id: 'VS001',
      date: '2026-01-19',
      bloodPressureSystolic: 129,
      bloodPressureDiastolic: 65,
      temperature: 36.6,
      pulse: 78,
      spo2: 98,
      respiratoryRate: 16
    },
    {
      id: 'VS002',
      date: '2026-01-20',
      bloodPressureSystolic: 150,
      bloodPressureDiastolic: 59,
      temperature: 40.7,
      pulse: 72,
      spo2: 97,
      respiratoryRate: 18
    },
    {
      id: 'VS003',
      date: '2026-01-21',
      bloodPressureSystolic: 156,
      bloodPressureDiastolic: 22,
      temperature: 38.7,
      pulse: 20,
      spo2: 99,
      respiratoryRate: 12
    },
    {
      id: 'VS004',
      date: '2026-01-22',
      bloodPressureSystolic: 158,
      bloodPressureDiastolic: 78,
      temperature: 39.2,
      pulse: 80,
      spo2: 50,
      respiratoryRate: 30
    },
    {
      id: 'VS005',
      date: '2026-01-23',
      bloodPressureSystolic: 159,
      bloodPressureDiastolic: 79,
      temperature: 37.3,
      pulse: 150,
      spo2: 90,
      respiratoryRate: 25
    }
  ],
  P002: [
    {
      id: 'VS004',
      date: '2026-01-18',
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 75,
      temperature: 36.5,
      pulse: 72,
      spo2: 97,
      respiratoryRate: 14
    },
    {
      id: 'VS005',
      date: '2026-01-19',
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 74,
      temperature: 36.6,
      pulse: 70,
      spo2: 98,
      respiratoryRate: 15
    }
  ],
  P003: [
    {
      id: 'VS006',
      date: '2026-01-19',
      bloodPressureSystolic: 140,
      bloodPressureDiastolic: 90,
      temperature: 36.8,
      pulse: 82,
      spo2: 96,
      respiratoryRate: 20
    },
    {
      id: 'VS007',
      date: '2026-02-20',
      bloodPressureSystolic: 138,
      bloodPressureDiastolic: 88,
      temperature: 36.7,
      pulse: 80,
      spo2: 97,
      respiratoryRate: 18
    }
  ],
  P004: [
    {
      id: 'VS008',
      date: '2026-01-20',
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 80,
      temperature: 36.7,
      pulse: 76,
      spo2: 99,
      respiratoryRate: 16
    },
    {
      id: 'VS009',
      date: '2026-01-21',
      bloodPressureSystolic: 122,
      bloodPressureDiastolic: 78,
      temperature: 36.6,
      pulse: 74,
      spo2: 98,
      respiratoryRate: 15
    }
  ]
}

export const roomsConfig: Record<string, { gender: 'male' | 'female' | 'free' }> = {
  '101': { gender: 'male' },
  '102': { gender: 'female' },
  '103': { gender: 'male' },
  '201': { gender: 'male' },
  '202': { gender: 'female' }
}

export const mockHospitalBeds: HospitalBed[] = [
  {
    id: 'B101_1',
    roomNumber: '101',
    bedNumber: 1,
    patientId: 'P001',
    bedNote: 'Контроль АД каждые 2 часа. При подъеме выше 180/110 — вызов дежурного врача.',
    patientName: 'Иван',
    patientLastName: 'Петров',
    patientMiddleName: 'Сергеевич',
    patientAge: 40,
    diagnosis: 'Гипертонический криз',
    status: 'stable'
  },
  {
    id: 'B101_2',
    roomNumber: '101',
    bedNumber: 2,
    patientId: 'P003',
    bedNote: 'Инсулинотерапия строго по графику! Контроль гликемии перед каждым введением.',
    patientName: 'Алексей',
    patientLastName: 'Смирнов',
    patientMiddleName: 'Дмитриевич',
    patientAge: 47,
    diagnosis: 'Сахарный диабет 2 типа',
    status: 'urgent'
  },
  {
    id: 'B101_3',
    roomNumber: '101',
    bedNumber: 3,
    patientId: 'P005',
    bedNote: 'Контроль пульса 3 раза в день.',
    patientName: 'Николай',
    patientLastName: 'Федоров',
    patientMiddleName: 'Андреевич',
    patientAge: 56,
    diagnosis: 'Ишемическая болезнь сердца',
    status: 'attention'
  },
  {
    id: 'B102_1',
    roomNumber: '102',
    bedNumber: 1,
    patientId: 'P002',
    bedNote: 'Контроль сатурации каждый час. При SpO₂ < 92% — O₂ через маску, вызов врача.',
    patientName: 'Мария',
    patientLastName: 'Иванова',
    patientMiddleName: 'Александровна',
    patientAge: 33,
    diagnosis: 'Бронхиальная астма',
    status: 'attention'
  },
  {
    id: 'B102_2',
    roomNumber: '102',
    bedNumber: 2,
    patientId: 'P004',
    bedNote: 'Регулярное наблюдение за АД.',
    patientName: 'Екатерина',
    patientLastName: 'Орлова',
    patientMiddleName: 'Владимировна',
    patientAge: 37,
    diagnosis: 'Вегетососудистая дистония',
    status: 'stable'
  },
  {
    id: 'B102_3',
    roomNumber: '102',
    bedNumber: 3,
    patientId: 'P006',
    bedNote: 'Полоскание горла каждые 4 часа.',
    patientName: 'Светлана',
    patientLastName: 'Громова',
    patientMiddleName: 'Ильинична',
    patientAge: 30,
    diagnosis: 'Тонзиллит',
    status: 'stable'
  },
  {
    id: 'B103_1',
    roomNumber: '103',
    bedNumber: 1,
    patientId: 'P007',
    bedNote: 'Ограничение физических нагрузок. ЛФК.',
    patientName: 'Павел',
    patientLastName: 'Лебедев',
    patientMiddleName: 'Олегович',
    patientAge: 44,
    diagnosis: 'Поясничный остеохондроз',
    status: 'stable'
  },
  {
    id: 'B103_2',
    roomNumber: '103',
    bedNumber: 2,
    patientId: 'P009',
    bedNote: 'Диета стол №1. Контроль боли.',
    patientName: 'Артем',
    patientLastName: 'Белов',
    patientMiddleName: 'Максимович',
    patientAge: 25,
    diagnosis: 'Гастродуоденит',
    status: 'stable'
  },
  {
    id: 'B103_3',
    roomNumber: '103',
    bedNumber: 3,
    patientId: 'P011',
    bedNote: 'Сатурация каждые 4 часа. Ингаляции.',
    patientName: 'Георгий',
    patientLastName: 'Тимофеев',
    patientMiddleName: 'Сергеевич',
    patientAge: 68,
    diagnosis: 'ХОБЛ',
    status: 'attention'
  },
  {
    id: 'B201_1',
    roomNumber: '201',
    bedNumber: 1,
    patientId: 'P013',
    bedNote: 'Промывание носа. Рентген пазух.',
    patientName: 'Роман',
    patientLastName: 'Егоров',
    patientMiddleName: 'Валерьевич',
    patientAge: 35,
    diagnosis: 'Синусит',
    status: 'stable'
  },
  { id: 'B201_2', roomNumber: '201', bedNumber: 2, status: 'free' },
  {
    id: 'B202_1',
    roomNumber: '202',
    bedNumber: 1,
    patientId: 'P008',
    bedNote: 'Обильное питье. УЗИ почек завтра.',
    patientName: 'Людмила',
    patientLastName: 'Волкова',
    patientMiddleName: 'Семеновна',
    patientAge: 51,
    diagnosis: 'Хронический пиелонефрит',
    status: 'stable'
  },
  {
    id: 'B202_2',
    roomNumber: '202',
    bedNumber: 2,
    patientId: 'P010',
    bedNote: 'Контроль гемоглобина крови.',
    patientName: 'Наталья',
    patientLastName: 'Зайцева',
    patientMiddleName: 'Анатольевна',
    patientAge: 42,
    diagnosis: 'Железодефицитная анемия',
    status: 'stable'
  },
  {
    id: 'B202_3',
    roomNumber: '202',
    bedNumber: 3,
    patientId: 'P012',
    bedNote: 'Постельный режим при приступе.',
    patientName: 'Анастасия',
    patientLastName: 'Макарова',
    patientMiddleName: 'Денисовна',
    patientAge: 27,
    diagnosis: 'Мигрень',
    status: 'stable'
  }
]

export interface BedPrescription {
  id: number;
  name: string;
  dose: string;
  time: string;
  done: boolean;
}

export interface BedMedication {
  name: string;
  qty: string;
}

export interface BedAction {
  who: string;
  action: string;
  time: string;
  amount: string;
}

export interface PatientDetail {
  doctorNote: string;
  prescriptions: BedPrescription[];
  meds: BedMedication[];
  log: BedAction[];
}

export const patientDetails: Record<string, PatientDetail> = {
  P001: {
    doctorNote: 'Контроль АД каждые 2 часа. При подъеме выше 180/110 — вызов дежурного врача.',
    prescriptions: [
      { id: 1, name: 'Эналаприл', dose: '10мг', time: '08:00', done: true },
      { id: 2, name: 'Амлодипин', dose: '5мг', time: '12:00', done: false },
      { id: 3, name: 'Каптоприл (экстренно)', dose: '25мг', time: '18:00', done: false }
    ],
    meds: [
      { name: 'Эналаприл', qty: '14 табл.' },
      { name: 'Амлодипин', qty: '28 табл.' },
      { name: 'Каптоприл', qty: '10 табл.' }
    ],
    log: [
      {
        who: 'Медсестра Орлова К.',
        action: 'Выдан Эналаприл 10мг',
        time: '08:05',
        amount: '1 табл.'
      }
    ]
  },
  P002: {
    doctorNote: 'Контроль сатурации каждый час. При SpO₂ < 92% — O₂ через маску, вызов врача.',
    prescriptions: [
      { id: 1, name: 'Сальбутамол (ингаляция)', dose: '2.5мг', time: '08:00', done: true },
      { id: 2, name: 'Преднизолон в/в', dose: '60мг', time: '10:00', done: true },
      { id: 3, name: 'Сальбутамол (ингаляция)', dose: '2.5мг', time: '14:00', done: false }
    ],
    meds: [
      { name: 'Сальбутамол', qty: '3 амп.' },
      { name: 'Преднизолон', qty: '5 амп.' },
      { name: 'Беродуал', qty: '1 фл.' }
    ],
    log: [
      {
        who: 'Медсестра Орлова К.',
        action: 'Ингаляция Сальбутамол 2.5мг',
        time: '08:10',
        amount: '1 амп.'
      }
    ]
  },
  P003: {
    doctorNote: 'Инсулинотерапия строго по графику! Контроль гликемии перед каждым введением.',
    prescriptions: [
      { id: 1, name: 'Инсулин Актрапид', dose: '8 ед', time: '07:30', done: true },
      { id: 2, name: 'NaCl 0.9% капельница', dose: '500мл', time: '09:00', done: false },
      { id: 3, name: 'Инсулин Актрапид', dose: '10 ед', time: '13:30', done: false }
    ],
    meds: [
      { name: 'Инсулин Актрапид', qty: '2 фл.' },
      { name: 'NaCl 0.9%', qty: '4 фл.' },
      { name: 'KCl 4%', qty: '3 амп.' }
    ],
    log: [
      {
        who: 'Медсестра Петрова И.',
        action: 'Инсулин Актрапид 8 ед п/к',
        time: '07:35',
        amount: '8 ед.'
      }
    ]
  },
  P004: {
    doctorNote: 'Регулярное наблюдение за АД.',
    prescriptions: [{ id: 1, name: 'Магне B6', dose: '2 таб', time: '09:00', done: true }],
    meds: [{ name: 'Магне B6', qty: '20 табл.' }],
    log: [{ who: 'Медсестра Иванова', action: 'Выдан Магне B6', time: '09:10', amount: '2 табл.' }]
  },
  P005: {
    doctorNote: 'Контроль пульса 3 раза в день.',
    prescriptions: [{ id: 1, name: 'Бисопролол', dose: '5 мг', time: '08:00', done: true }],
    meds: [{ name: 'Бисопролол', qty: '10 табл.' }],
    log: [
      { who: 'Медсестра Петрова', action: 'Выдан Бисопролол', time: '08:05', amount: '1 табл.' }
    ]
  },
  P006: {
    doctorNote: 'Полоскание горла каждые 4 часа.',
    prescriptions: [{ id: 1, name: 'Мирамистин', dose: '3 орошения', time: '10:00', done: false }],
    meds: [{ name: 'Мирамистин', qty: '1 фл.' }],
    log: [{ who: 'Медсестра Сидорова', action: 'Орошение горла', time: '10:15', amount: '—' }]
  },
  P007: {
    doctorNote: 'Ограничение физических нагрузок. ЛФК.',
    prescriptions: [{ id: 1, name: 'Мидокалм', dose: '150 мг', time: '12:00', done: false }],
    meds: [{ name: 'Мидокалм', qty: '15 табл.' }],
    log: [{ who: 'Медсестра Волкова', action: 'Выдан Мидокалм', time: '12:05', amount: '1 табл.' }]
  },
  P008: {
    doctorNote: 'Обильное питье. УЗИ почек завтра.',
    prescriptions: [{ id: 1, name: 'Канефрон', dose: '2 драже', time: '08:00', done: true }],
    meds: [{ name: 'Канефрон', qty: '40 драже' }],
    log: [{ who: 'Медсестра Иванова', action: 'Выдан Канефрон', time: '08:15', amount: '2 драже' }]
  },
  P009: {
    doctorNote: 'Диета стол №1. Контроль боли.',
    prescriptions: [{ id: 1, name: 'Омез', dose: '20 мг', time: '07:30', done: true }],
    meds: [{ name: 'Омез', qty: '14 капс.' }],
    log: [{ who: 'Медсестра Петрова', action: 'Выдан Омез', time: '07:35', amount: '1 капс.' }]
  },
  P010: {
    doctorNote: 'Контроль гемоглобина крови.',
    prescriptions: [{ id: 1, name: 'Сорбифер', dose: '1 таб', time: '09:00', done: false }],
    meds: [{ name: 'Сорбифер', qty: '30 табл.' }],
    log: [{ who: 'Медсестра Сидорова', action: 'Выдан Сорбифер', time: '09:10', amount: '1 табл.' }]
  },
  P011: {
    doctorNote: 'Сатурация каждые 4 часа. Ингаляции.',
    prescriptions: [{ id: 1, name: 'Беродуал', dose: '20 капель', time: '08:00', done: true }],
    meds: [{ name: 'Беродуал', qty: '1 фл.' }],
    log: [
      { who: 'Медсестра Волкова', action: 'Ингаляция Беродуал', time: '08:20', amount: '20 капель' }
    ]
  },
  P012: {
    doctorNote: 'Постельный режим при приступе.',
    prescriptions: [
      { id: 1, name: 'Суматриптан', dose: '50 мг', time: 'по потребности', done: false }
    ],
    meds: [{ name: 'Суматриптан', qty: '2 табл.' }],
    log: [{ who: 'Врач', action: 'Осмотр', time: '10:00', amount: '—' }]
  },
  P013: {
    doctorNote: 'Промывание носа. Рентген пазух.',
    prescriptions: [{ id: 1, name: 'Синупрет', dose: '2 таб', time: '08:00', done: true }],
    meds: [{ name: 'Синупрет', qty: '20 табл.' }],
    log: [{ who: 'Медсестра Иванова', action: 'Выдан Синупрет', time: '08:10', amount: '2 табл.' }]
  }
}
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'lab-result',
    severity: 'critical',
    patientName: 'Петров Иван Сергеевич',
    patientId: 'P001',
    dateOfBirth: '15.03.1985',
    doctor: 'Кузнецова А.В.',
    message: 'Критические результаты анализа крови',
    details: 'Лейкоциты: 15.2 (норма 4-9)',
    time: '10 мин назад',
    read: false
  },
  {
    id: '2',
    type: 'appointment-reminder',
    patientName: 'Иванова Мария Александровна',
    patientId: 'P002',
    message: 'Прием начнется через 1 час',
    time: '14:00',
    read: false
  },
  {
    id: '3',
    type: 'lab-result',
    severity: 'warning',
    patientName: 'Смирнов Алексей Дмитриевич',
    patientId: 'P003',
    dateOfBirth: '22.07.1978',
    doctor: 'Кузнецова А.В.',
    message: 'Результаты биохимического анализа',
    details: 'Глюкоза: 6.8 ммоль/л (повышена)',
    time: '2 часа назад',
    read: false
  },
  {
    id: '4',
    type: 'appointment-reminder',
    patientName: 'Петров Иван Сергеевич',
    patientId: 'P001',
    message: 'Прием начнется через 1 час',
    time: '16:00',
    read: false
  }
]

export const mockMedicalStaffSchedule: MedicalStaffMember[] = [
  {
    id: 'STAFF001',
    name: 'Смирнов Александр Алексеевич',
    position: 'Врач',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day', hours: 8 },
      { day: 3, type: 'day-off', hours: 0 },
      { day: 4, type: 'day-off', hours: 0 },
      { day: 5, type: 'day', hours: 8 },
      { day: 6, type: 'day', hours: 8 },
      { day: 7, type: 'day', hours: 8 },
      { day: 8, type: 'day-off', hours: 0 },
      { day: 9, type: 'day-off', hours: 0 },
      { day: 10, type: 'night', hours: 12 },
      { day: 11, type: 'day', hours: 8 },
      { day: 12, type: 'day', hours: 8 },
      { day: 13, type: 'day', hours: 8 },
      { day: 14, type: 'day-off', hours: 0 },
      { day: 15, type: 'day-off', hours: 0 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day', hours: 8 },
      { day: 18, type: 'night', hours: 12 },
      { day: 19, type: 'day', hours: 8 },
      { day: 20, type: 'day-off', hours: 0 },
      { day: 21, type: 'day-off', hours: 0 },
      { day: 22, type: 'day', hours: 8 },
      { day: 23, type: 'day', hours: 8 },
      { day: 24, type: 'day', hours: 8 },
      { day: 25, type: 'night', hours: 12 },
      { day: 26, type: 'day-off', hours: 0 },
      { day: 27, type: 'day-off', hours: 0 },
      { day: 28, type: 'day', hours: 8 },
      { day: 29, type: 'day', hours: 8 },
      { day: 30, type: 'day', hours: 8 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF002',
    name: 'Орлова Елена Викторовна',
    position: 'Врач',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day-off', hours: 0 },
      { day: 3, type: 'day-off', hours: 0 },
      { day: 4, type: 'day', hours: 8 },
      { day: 5, type: 'day', hours: 8 },
      { day: 6, type: 'day', hours: 8 },
      { day: 7, type: 'day-off', hours: 0 },
      { day: 8, type: 'day-off', hours: 0 },
      { day: 9, type: 'day', hours: 8 },
      { day: 10, type: 'day', hours: 8 },
      { day: 11, type: 'night', hours: 12 },
      { day: 12, type: 'day-off', hours: 0 },
      { day: 13, type: 'day-off', hours: 0 },
      { day: 14, type: 'day', hours: 8 },
      { day: 15, type: 'day', hours: 8 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day-off', hours: 0 },
      { day: 18, type: 'day-off', hours: 0 },
      { day: 19, type: 'night', hours: 12 },
      { day: 20, type: 'day', hours: 8 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'day-off', hours: 0 },
      { day: 23, type: 'day-off', hours: 0 },
      { day: 24, type: 'day', hours: 8 },
      { day: 25, type: 'day', hours: 8 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'night', hours: 12 },
      { day: 28, type: 'day-off', hours: 0 },
      { day: 29, type: 'day-off', hours: 0 },
      { day: 30, type: 'day', hours: 8 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF003',
    name: 'Сокова Ирина Сергеевна',
    position: 'Старшая медсестра',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day', hours: 8 },
      { day: 3, type: 'day', hours: 8 },
      { day: 4, type: 'day-off', hours: 0 },
      { day: 5, type: 'day-off', hours: 0 },
      { day: 6, type: 'day', hours: 8 },
      { day: 7, type: 'day', hours: 8 },
      { day: 8, type: 'day', hours: 8 },
      { day: 9, type: 'day-off', hours: 0 },
      { day: 10, type: 'day-off', hours: 0 },
      { day: 11, type: 'day', hours: 8 },
      { day: 12, type: 'day', hours: 8 },
      { day: 13, type: 'day', hours: 8 },
      { day: 14, type: 'day-off', hours: 0 },
      { day: 15, type: 'day-off', hours: 0 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day', hours: 8 },
      { day: 18, type: 'day', hours: 8 },
      { day: 19, type: 'day-off', hours: 0 },
      { day: 20, type: 'day-off', hours: 0 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'day', hours: 8 },
      { day: 23, type: 'day', hours: 8 },
      { day: 24, type: 'day-off', hours: 0 },
      { day: 25, type: 'day-off', hours: 0 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'day', hours: 8 },
      { day: 28, type: 'day', hours: 8 },
      { day: 29, type: 'day-off', hours: 0 },
      { day: 30, type: 'day-off', hours: 0 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF004',
    name: 'Федорова Наталья Павловна',
    position: 'Постовая медсестра',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'night', hours: 24 },
      { day: 2, type: 'day', hours: 8 },
      { day: 3, type: 'day', hours: 8 },
      { day: 4, type: 'day-off', hours: 0 },
      { day: 5, type: 'day-off', hours: 0 },
      { day: 6, type: 'night', hours: 24 },
      { day: 7, type: 'day', hours: 8 },
      { day: 8, type: 'day', hours: 8 },
      { day: 9, type: 'day-off', hours: 0 },
      { day: 10, type: 'day-off', hours: 0 },
      { day: 11, type: 'night', hours: 24 },
      { day: 12, type: 'day', hours: 8 },
      { day: 13, type: 'day', hours: 8 },
      { day: 14, type: 'day-off', hours: 0 },
      { day: 15, type: 'day-off', hours: 0 },
      { day: 16, type: 'night', hours: 24 },
      { day: 17, type: 'day', hours: 8 },
      { day: 18, type: 'day', hours: 8 },
      { day: 19, type: 'day-off', hours: 0 },
      { day: 20, type: 'day-off', hours: 0 },
      { day: 21, type: 'night', hours: 24 },
      { day: 22, type: 'day', hours: 8 },
      { day: 23, type: 'day', hours: 8 },
      { day: 24, type: 'day-off', hours: 0 },
      { day: 25, type: 'day-off', hours: 0 },
      { day: 26, type: 'night', hours: 24 },
      { day: 27, type: 'day', hours: 8 },
      { day: 28, type: 'day', hours: 8 },
      { day: 29, type: 'day-off', hours: 0 },
      { day: 30, type: 'day-off', hours: 0 },
      { day: 31, type: 'night', hours: 24 }
    ]
  },
  {
    id: 'STAFF005',
    name: 'Козлова Ольга Ивановна',
    position: 'Процедурная медсестра',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day', hours: 8 },
      { day: 3, type: 'day-off', hours: 0 },
      { day: 4, type: 'day-off', hours: 0 },
      { day: 5, type: 'day', hours: 8 },
      { day: 6, type: 'day', hours: 8 },
      { day: 7, type: 'day', hours: 8 },
      { day: 8, type: 'day-off', hours: 0 },
      { day: 9, type: 'day-off', hours: 0 },
      { day: 10, type: 'day', hours: 8 },
      { day: 11, type: 'day', hours: 8 },
      { day: 12, type: 'day', hours: 8 },
      { day: 13, type: 'day-off', hours: 0 },
      { day: 14, type: 'day-off', hours: 0 },
      { day: 15, type: 'day', hours: 8 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day', hours: 8 },
      { day: 18, type: 'day-off', hours: 0 },
      { day: 19, type: 'day-off', hours: 0 },
      { day: 20, type: 'day', hours: 8 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'day', hours: 8 },
      { day: 23, type: 'day-off', hours: 0 },
      { day: 24, type: 'day-off', hours: 0 },
      { day: 25, type: 'day', hours: 8 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'day', hours: 8 },
      { day: 28, type: 'day-off', hours: 0 },
      { day: 29, type: 'day-off', hours: 0 },
      { day: 30, type: 'day', hours: 8 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF006',
    name: 'Петрова Юлия Геннадьевна',
    position: 'Постовая медсестра',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day', hours: 8 },
      { day: 3, type: 'day', hours: 8 },
      { day: 4, type: 'night', hours: 24 },
      { day: 5, type: 'day-off', hours: 0 },
      { day: 6, type: 'day-off', hours: 0 },
      { day: 7, type: 'day', hours: 8 },
      { day: 8, type: 'day', hours: 8 },
      { day: 9, type: 'day', hours: 8 },
      { day: 10, type: 'night', hours: 24 },
      { day: 11, type: 'day-off', hours: 0 },
      { day: 12, type: 'day-off', hours: 0 },
      { day: 13, type: 'day', hours: 8 },
      { day: 14, type: 'day', hours: 8 },
      { day: 15, type: 'day', hours: 8 },
      { day: 16, type: 'night', hours: 24 },
      { day: 17, type: 'day-off', hours: 0 },
      { day: 18, type: 'day-off', hours: 0 },
      { day: 19, type: 'day', hours: 8 },
      { day: 20, type: 'day', hours: 8 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'night', hours: 24 },
      { day: 23, type: 'day-off', hours: 0 },
      { day: 24, type: 'day-off', hours: 0 },
      { day: 25, type: 'day', hours: 8 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'day', hours: 8 },
      { day: 28, type: 'night', hours: 24 },
      { day: 29, type: 'day-off', hours: 0 },
      { day: 30, type: 'day-off', hours: 0 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF007',
    name: 'Никонова Виктория Ивановна',
    position: 'Сестра-хозяйка',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day', hours: 8 },
      { day: 3, type: 'day', hours: 8 },
      { day: 4, type: 'day-off', hours: 0 },
      { day: 5, type: 'day-off', hours: 0 },
      { day: 6, type: 'day', hours: 8 },
      { day: 7, type: 'day', hours: 8 },
      { day: 8, type: 'day', hours: 8 },
      { day: 9, type: 'day-off', hours: 0 },
      { day: 10, type: 'day-off', hours: 0 },
      { day: 11, type: 'day', hours: 8 },
      { day: 12, type: 'day', hours: 8 },
      { day: 13, type: 'day', hours: 8 },
      { day: 14, type: 'day-off', hours: 0 },
      { day: 15, type: 'day-off', hours: 0 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day', hours: 8 },
      { day: 18, type: 'day', hours: 8 },
      { day: 19, type: 'day-off', hours: 0 },
      { day: 20, type: 'day-off', hours: 0 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'day', hours: 8 },
      { day: 23, type: 'day', hours: 8 },
      { day: 24, type: 'day-off', hours: 0 },
      { day: 25, type: 'day-off', hours: 0 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'day', hours: 8 },
      { day: 28, type: 'day', hours: 8 },
      { day: 29, type: 'day-off', hours: 0 },
      { day: 30, type: 'day-off', hours: 0 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF008',
    name: 'Воронова Наталья Сергеевна',
    position: 'Санитарка',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'night', hours: 24 },
      { day: 2, type: 'day-off', hours: 0 },
      { day: 3, type: 'day-off', hours: 0 },
      { day: 4, type: 'night', hours: 24 },
      { day: 5, type: 'day', hours: 8 },
      { day: 6, type: 'day', hours: 8 },
      { day: 7, type: 'day-off', hours: 0 },
      { day: 8, type: 'day-off', hours: 0 },
      { day: 9, type: 'night', hours: 24 },
      { day: 10, type: 'day', hours: 8 },
      { day: 11, type: 'day', hours: 8 },
      { day: 12, type: 'day-off', hours: 0 },
      { day: 13, type: 'day-off', hours: 0 },
      { day: 14, type: 'night', hours: 24 },
      { day: 15, type: 'day', hours: 8 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day-off', hours: 0 },
      { day: 18, type: 'day-off', hours: 0 },
      { day: 19, type: 'night', hours: 24 },
      { day: 20, type: 'day', hours: 8 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'day-off', hours: 0 },
      { day: 23, type: 'day-off', hours: 0 },
      { day: 24, type: 'night', hours: 24 },
      { day: 25, type: 'day', hours: 8 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'day-off', hours: 0 },
      { day: 28, type: 'day-off', hours: 0 },
      { day: 29, type: 'night', hours: 24 },
      { day: 30, type: 'day', hours: 8 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF009',
    name: 'Кузнецова Анна Сергеевна',
    position: 'Процедурная медсестра',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day-off', hours: 0 },
      { day: 3, type: 'day-off', hours: 0 },
      { day: 4, type: 'day', hours: 8 },
      { day: 5, type: 'day', hours: 8 },
      { day: 6, type: 'day', hours: 8 },
      { day: 7, type: 'day-off', hours: 0 },
      { day: 8, type: 'day-off', hours: 0 },
      { day: 9, type: 'day', hours: 8 },
      { day: 10, type: 'day', hours: 8 },
      { day: 11, type: 'day', hours: 8 },
      { day: 12, type: 'day-off', hours: 0 },
      { day: 13, type: 'day-off', hours: 0 },
      { day: 14, type: 'day', hours: 8 },
      { day: 15, type: 'day', hours: 8 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day-off', hours: 0 },
      { day: 18, type: 'day-off', hours: 0 },
      { day: 19, type: 'day', hours: 8 },
      { day: 20, type: 'day', hours: 8 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'day-off', hours: 0 },
      { day: 23, type: 'day-off', hours: 0 },
      { day: 24, type: 'day', hours: 8 },
      { day: 25, type: 'day', hours: 8 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'day-off', hours: 0 },
      { day: 28, type: 'day-off', hours: 0 },
      { day: 29, type: 'day', hours: 8 },
      { day: 30, type: 'day', hours: 8 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF010',
    name: 'Морозова Екатерина Александровна',
    position: 'Заведующий отделением',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day', hours: 8 },
      { day: 3, type: 'day', hours: 8 },
      { day: 4, type: 'day', hours: 8 },
      { day: 5, type: 'day-off', hours: 0 },
      { day: 6, type: 'day-off', hours: 0 },
      { day: 7, type: 'day', hours: 8 },
      { day: 8, type: 'day', hours: 8 },
      { day: 9, type: 'day', hours: 8 },
      { day: 10, type: 'day', hours: 8 },
      { day: 11, type: 'day-off', hours: 0 },
      { day: 12, type: 'day-off', hours: 0 },
      { day: 13, type: 'day', hours: 8 },
      { day: 14, type: 'day', hours: 8 },
      { day: 15, type: 'day', hours: 8 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day-off', hours: 0 },
      { day: 18, type: 'day-off', hours: 0 },
      { day: 19, type: 'day', hours: 8 },
      { day: 20, type: 'day', hours: 8 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'day', hours: 8 },
      { day: 23, type: 'day-off', hours: 0 },
      { day: 24, type: 'day-off', hours: 0 },
      { day: 25, type: 'day', hours: 8 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'day', hours: 8 },
      { day: 28, type: 'day', hours: 8 },
      { day: 29, type: 'day-off', hours: 0 },
      { day: 30, type: 'day-off', hours: 0 },
      { day: 31, type: 'day', hours: 8 }
    ]
  },
  {
    id: 'STAFF011',
    name: 'Макарова Анастасия Сергеевна',
    position: 'Буфетчица',
    department: 'Пульмонология',
    schedule: [
      { day: 1, type: 'day', hours: 8 },
      { day: 2, type: 'day', hours: 8 },
      { day: 3, type: 'day', hours: 8 },
      { day: 4, type: 'day', hours: 8 },
      { day: 5, type: 'day-off', hours: 0 },
      { day: 6, type: 'day-off', hours: 0 },
      { day: 7, type: 'day', hours: 8 },
      { day: 8, type: 'day', hours: 8 },
      { day: 9, type: 'day', hours: 8 },
      { day: 10, type: 'day', hours: 8 },
      { day: 11, type: 'day-off', hours: 0 },
      { day: 12, type: 'day-off', hours: 0 },
      { day: 13, type: 'day', hours: 8 },
      { day: 14, type: 'day', hours: 8 },
      { day: 15, type: 'day', hours: 8 },
      { day: 16, type: 'day', hours: 8 },
      { day: 17, type: 'day-off', hours: 0 },
      { day: 18, type: 'day-off', hours: 0 },
      { day: 19, type: 'day', hours: 8 },
      { day: 20, type: 'day', hours: 8 },
      { day: 21, type: 'day', hours: 8 },
      { day: 22, type: 'day', hours: 8 },
      { day: 23, type: 'day-off', hours: 0 },
      { day: 24, type: 'day-off', hours: 0 },
      { day: 25, type: 'day', hours: 8 },
      { day: 26, type: 'day', hours: 8 },
      { day: 27, type: 'day', hours: 8 },
      { day: 28, type: 'day', hours: 8 },
      { day: 29, type: 'day-off', hours: 0 },
      { day: 30, type: 'day-off', hours: 0 },
      { day: 31, type: 'day', hours: 8 }
    ]
  }
]


function genShifts(pattern: Array<'day' | 'night' | 'day-off'>, daysInMonth: number): Shift[] {
  return Array.from({ length: daysInMonth }, (_, i) => {
    const t = pattern[i % pattern.length]
    return { day: i + 1, type: t, hours: t === 'day' ? 8 : t === 'night' ? 12 : 0 }
  })
}

export const monthlyScheduleData: Record<string, MonthSchedule[]> = {
  STAFF001: [
    { month: 3, year: 2026, shifts: genShifts(['day','day','day-off','day-off','day','day','day','day-off','day-off','night'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day','day','day-off','day-off','night','day','day'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day-off','day-off','day','day','day','night','day-off'], 30) },
  ],
  STAFF002: [
    { month: 3, year: 2026, shifts: genShifts(['day','day-off','day-off','day','day','day','day-off','day-off','night','day'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day-off','day-off','day','day','day','day-off','night'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day','day-off','night','day','day-off','day','day','day-off'], 30) },
  ],
  STAFF003: [
    { month: 3, year: 2026, shifts: genShifts(['day','day','day','day','day-off','day-off','day'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day','day','day','day-off','day-off'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day','day','day-off','day-off','day','day','day'], 30) },
  ],
  STAFF004: [
    { month: 3, year: 2026, shifts: genShifts(['night','day-off','day-off','day','day','night','day-off','day-off'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['night','day-off','day-off','day','day','day','night','day-off'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day','night','day-off','day-off','day','night'], 30) },
  ],
  STAFF005: [
    { month: 3, year: 2026, shifts: genShifts(['day','day','day','day-off','day-off','day','day'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day-off','day-off','day','day','day','day'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day-off','day-off','day','day','day','day'], 30) },
  ],
  STAFF006: [
    { month: 3, year: 2026, shifts: genShifts(['day','day-off','day','day','day-off','day','day'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['night','day-off','day','day','day-off','day'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day','day-off','day','night','day-off','day'], 30) },
  ],
  STAFF007: [
    { month: 3, year: 2026, shifts: genShifts(['day','day','day-off','day-off','day','night','day'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day','day-off','night','day-off','day','day'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day-off','day','night','day','day-off','day'], 30) },
  ],
  STAFF008: [
    { month: 3, year: 2026, shifts: genShifts(['day','day','day','day-off','day-off','day'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day','day-off','day-off','day','day'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day','day-off','day-off','day','day','day'], 30) },
  ],
  STAFF009: [
    { month: 3, year: 2026, shifts: genShifts(['day','day-off','day-off','day','day','day'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day-off','day-off','day','day','day'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day','day-off','day-off','day','day','day'], 30) },
  ],
  STAFF010: [
    { month: 3, year: 2026, shifts: genShifts(['day','day','day','day','day-off','day-off'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day','day','day','day-off','day-off'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day','day','day','day','day-off','day-off'], 30) },
  ],
  STAFF011: [
    { month: 3, year: 2026, shifts: genShifts(['day','day','day','day','day-off','day-off'], 30) },
    { month: 4, year: 2026, shifts: genShifts(['day','day','day','day','day-off','day-off'], 31) },
    { month: 5, year: 2026, shifts: genShifts(['day','day','day','day','day-off','day-off'], 30) },
  ],
}

export function getStaffScheduleForMonth(staffId: string, month: number, year: number): Shift[] | null {
  const staffSchedules = monthlyScheduleData[staffId]
  if (!staffSchedules) return null
  const found = staffSchedules.find(s => s.month === month && s.year === year)
  return found ? found.shifts : null
}

export type MedicineCategory = 'Антибиотики' | 'Анальгетики' | 'Гормоны' | 'Кардио' | 'Антисептики' | 'Прочее'
export type MedicineUnit = 'мл' | 'мг' | 'таблетки' | 'капсулы' | 'ампулы' | 'флаконы' | 'ед.'
export type MedicineStatus = 'norm' | 'low' | 'empty'
export type OperationType = 'receipt' | 'writeoff' | 'adjustment'
export type WriteOffReason = 'patient' | 'iv' | 'im' | 'drip' | 'adjustment' | 'other'

export interface MedicineOperationLog {
  id: string
  date: string
  type: OperationType
  quantity: number
  balanceAfter: number
  performedBy: string
  performedById: string
  comment: string
  patientId?: string
  patientName?: string
  prescriptionId?: string
  supplier?: string
  reason?: WriteOffReason
}

export interface Medicine {
  id: string
  name: string
  description: string
  category: MedicineCategory
  unit: MedicineUnit
  currentBalance: number
  minBalance: number
  totalReceived: number
  totalWrittenOff: number
  lastReceiptDate: string | null
  lastWriteOffDate: string | null
  lastReceiptFrom: string | null
  lastOperation: OperationType | null
  lastChangedBy: string | null
  lastUpdated: string | null
  status: MedicineStatus
  isArchived: boolean
  operationLog: MedicineOperationLog[]
}

export const mockMedicines: Medicine[] = [
  {
    id: 'MED-001', name: 'Амоксициллин 500 мг',
    description: 'Антибиотик широкого спектра действия. Применяется при инфекциях дыхательных путей, мочевыводящих путей, кожи и мягких тканей.',
    category: 'Антибиотики', unit: 'таблетки', currentBalance: 48, minBalance: 20,
    totalReceived: 200, totalWrittenOff: 152, lastReceiptDate: '2026-05-15', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'ООО «МедФарм»', lastOperation: 'writeoff', lastChangedBy: 'Иванова И.И.',
    lastUpdated: '2026-05-22T09:15:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-001-1', date: '2026-05-01T08:00:00', type: 'receipt', quantity: 100, balanceAfter: 100, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановое пополнение', supplier: 'ООО «МедФарм»' },
      { id: 'LOG-001-2', date: '2026-05-05T10:30:00', type: 'writeoff', quantity: 30, balanceAfter: 70, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Назначение пациентам', reason: 'patient', patientId: 'P001', patientName: 'Петров Иван Сергеевич' },
      { id: 'LOG-001-3', date: '2026-05-10T14:00:00', type: 'writeoff', quantity: 22, balanceAfter: 48, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Пероральный прием', reason: 'patient', patientId: 'P003', patientName: 'Смирнов Алексей Дмитриевич' },
      { id: 'LOG-001-4', date: '2026-05-15T09:00:00', type: 'receipt', quantity: 100, balanceAfter: 148, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановая поставка', supplier: 'ООО «МедФарм»' },
      { id: 'LOG-001-5', date: '2026-05-22T09:15:00', type: 'writeoff', quantity: 100, balanceAfter: 48, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Курс лечения', reason: 'patient' },
    ]
  },
  {
    id: 'MED-002', name: 'Натрия хлорид 0.9% 500 мл',
    description: 'Изотонический солевой раствор для в/в инфузий. Используется как растворитель и для поддержания водно-электролитного баланса.',
    category: 'Прочее', unit: 'флаконы', currentBalance: 6, minBalance: 10,
    totalReceived: 60, totalWrittenOff: 54, lastReceiptDate: '2026-05-10', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'АО «СолюшнФарм»', lastOperation: 'writeoff', lastChangedBy: 'Сидорова Е.П.',
    lastUpdated: '2026-05-22T11:40:00', status: 'low', isArchived: false,
    operationLog: [
      { id: 'LOG-002-1', date: '2026-05-01T07:30:00', type: 'receipt', quantity: 30, balanceAfter: 30, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Первичная поставка', supplier: 'АО «СолюшнФарм»' },
      { id: 'LOG-002-2', date: '2026-05-05T11:00:00', type: 'writeoff', quantity: 12, balanceAfter: 18, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Инфузионная терапия', reason: 'drip' },
      { id: 'LOG-002-3', date: '2026-05-10T08:00:00', type: 'receipt', quantity: 30, balanceAfter: 48, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Пополнение запаса', supplier: 'АО «СолюшнФарм»' },
      { id: 'LOG-002-4', date: '2026-05-15T16:00:00', type: 'writeoff', quantity: 22, balanceAfter: 26, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Капельницы', reason: 'drip' },
      { id: 'LOG-002-5', date: '2026-05-20T10:00:00', type: 'writeoff', quantity: 10, balanceAfter: 16, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Промывание катетера', reason: 'iv' },
      { id: 'LOG-002-6', date: '2026-05-22T11:40:00', type: 'writeoff', quantity: 10, balanceAfter: 6, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Инфузия пациенту', reason: 'drip', patientId: 'P002', patientName: 'Иванова Мария Александровна' },
    ]
  },
  {
    id: 'MED-003', name: 'Морфин 10 мг/мл',
    description: 'Наркотический анальгетик. Применяется для купирования сильных болевых синдромов. Строгий учет, хранение под замком.',
    category: 'Анальгетики', unit: 'ампулы', currentBalance: 0, minBalance: 5,
    totalReceived: 20, totalWrittenOff: 20, lastReceiptDate: '2026-04-20', lastWriteOffDate: '2026-05-21',
    lastReceiptFrom: 'ГУП «Фармация»', lastOperation: 'writeoff', lastChangedBy: 'Козлова Н.И.',
    lastUpdated: '2026-05-21T20:00:00', status: 'empty', isArchived: false,
    operationLog: [
      { id: 'LOG-003-1', date: '2026-04-20T09:00:00', type: 'receipt', quantity: 10, balanceAfter: 10, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Получено со склада', supplier: 'ГУП «Фармация»' },
      { id: 'LOG-003-2', date: '2026-05-01T22:00:00', type: 'writeoff', quantity: 2, balanceAfter: 8, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Обезболивание', reason: 'im' },
      { id: 'LOG-003-3', date: '2026-05-10T08:00:00', type: 'receipt', quantity: 10, balanceAfter: 18, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановая поставка', supplier: 'ГУП «Фармация»' },
      { id: 'LOG-003-4', date: '2026-05-15T01:00:00', type: 'writeoff', quantity: 8, balanceAfter: 10, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Послеоперационное обезболивание', reason: 'im' },
      { id: 'LOG-003-5', date: '2026-05-21T20:00:00', type: 'writeoff', quantity: 10, balanceAfter: 0, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Курс завершен', reason: 'patient' },
    ]
  },
  {
    id: 'MED-004', name: 'Гепарин 5000 ЕД/мл',
    description: 'Антикоагулянт прямого действия. Применяется для профилактики и лечения тромбозов и тромбоэмболий.',
    category: 'Кардио', unit: 'ампулы', currentBalance: 35, minBalance: 15,
    totalReceived: 100, totalWrittenOff: 65, lastReceiptDate: '2026-05-18', lastWriteOffDate: '2026-05-20',
    lastReceiptFrom: 'ЗАО «КардиоФарм»', lastOperation: 'receipt', lastChangedBy: 'Иванова И.И.',
    lastUpdated: '2026-05-18T10:00:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-004-1', date: '2026-05-01T08:30:00', type: 'receipt', quantity: 50, balanceAfter: 50, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановое пополнение', supplier: 'ЗАО «КардиоФарм»' },
      { id: 'LOG-004-2', date: '2026-05-08T11:00:00', type: 'writeoff', quantity: 30, balanceAfter: 20, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Антикоагулянтная терапия', reason: 'iv' },
      { id: 'LOG-004-3', date: '2026-05-12T09:00:00', type: 'writeoff', quantity: 20, balanceAfter: 0, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Промывание катетеров', reason: 'iv' },
      { id: 'LOG-004-4', date: '2026-05-18T10:00:00', type: 'receipt', quantity: 50, balanceAfter: 50, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Экстренный заказ', supplier: 'ЗАО «КардиоФарм»' },
      { id: 'LOG-004-5', date: '2026-05-20T14:00:00', type: 'writeoff', quantity: 15, balanceAfter: 35, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Текущая терапия', reason: 'iv' },
    ]
  },
  {
    id: 'MED-005', name: 'Дексаметазон 4 мг/мл',
    description: 'Глюкокортикостероид. Применяется при воспалительных, аллергических заболеваниях, отеках мозга.',
    category: 'Гормоны', unit: 'ампулы', currentBalance: 12, minBalance: 8,
    totalReceived: 80, totalWrittenOff: 68, lastReceiptDate: '2026-05-12', lastWriteOffDate: '2026-05-21',
    lastReceiptFrom: 'ООО «ФармМедПлюс»', lastOperation: 'writeoff', lastChangedBy: 'Сидорова Е.П.',
    lastUpdated: '2026-05-21T15:30:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-005-1', date: '2026-05-01T09:00:00', type: 'receipt', quantity: 40, balanceAfter: 40, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановая поставка', supplier: 'ООО «ФармМедПлюс»' },
      { id: 'LOG-005-2', date: '2026-05-07T12:00:00', type: 'writeoff', quantity: 18, balanceAfter: 22, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Противовоспалительная терапия', reason: 'im' },
      { id: 'LOG-005-3', date: '2026-05-12T10:00:00', type: 'receipt', quantity: 40, balanceAfter: 62, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Пополнение', supplier: 'ООО «ФармМедПлюс»' },
      { id: 'LOG-005-4', date: '2026-05-17T09:00:00', type: 'writeoff', quantity: 25, balanceAfter: 37, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Лечение отека', reason: 'iv' },
      { id: 'LOG-005-5', date: '2026-05-21T15:30:00', type: 'writeoff', quantity: 25, balanceAfter: 12, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Назначение пациенту', reason: 'patient', patientId: 'P001', patientName: 'Петров Иван Сергеевич' },
    ]
  },
  {
    id: 'MED-006', name: 'Хлоргексидин 0.05%',
    description: 'Антисептический раствор для обработки ран, слизистых оболочек и операционного поля.',
    category: 'Антисептики', unit: 'мл', currentBalance: 2500, minBalance: 500,
    totalReceived: 10000, totalWrittenOff: 7500, lastReceiptDate: '2026-05-20', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'ООО «АнтисептикПро»', lastOperation: 'writeoff', lastChangedBy: 'Сидорова Е.П.',
    lastUpdated: '2026-05-22T08:00:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-006-1', date: '2026-05-01T07:00:00', type: 'receipt', quantity: 5000, balanceAfter: 5000, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Ежемесячная поставка', supplier: 'ООО «АнтисептикПро»' },
      { id: 'LOG-006-2', date: '2026-05-10T09:00:00', type: 'writeoff', quantity: 2000, balanceAfter: 3000, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Перевязки и обработка', reason: 'other' },
      { id: 'LOG-006-3', date: '2026-05-15T11:00:00', type: 'writeoff', quantity: 1500, balanceAfter: 1500, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Операционная', reason: 'other' },
      { id: 'LOG-006-4', date: '2026-05-20T08:00:00', type: 'receipt', quantity: 5000, balanceAfter: 6500, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановое пополнение', supplier: 'ООО «АнтисептикПро»' },
      { id: 'LOG-006-5', date: '2026-05-22T08:00:00', type: 'writeoff', quantity: 4000, balanceAfter: 2500, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Текущий расход', reason: 'other' },
    ]
  },
  {
    id: 'MED-007', name: 'Парацетамол 500 мг',
    description: 'Жаропонижающее и анальгезирующее средство. Широко применяется при болях и повышенной температуре.',
    category: 'Анальгетики', unit: 'таблетки', currentBalance: 4, minBalance: 30,
    totalReceived: 300, totalWrittenOff: 296, lastReceiptDate: '2026-05-01', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'ООО «МедФарм»', lastOperation: 'writeoff', lastChangedBy: 'Иванова И.И.',
    lastUpdated: '2026-05-22T12:00:00', status: 'low', isArchived: false,
    operationLog: [
      { id: 'LOG-007-1', date: '2026-05-01T08:00:00', type: 'receipt', quantity: 300, balanceAfter: 300, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Месячный запас', supplier: 'ООО «МедФарм»' },
      { id: 'LOG-007-2', date: '2026-05-08T10:00:00', type: 'writeoff', quantity: 60, balanceAfter: 240, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Раздача пациентам', reason: 'patient' },
      { id: 'LOG-007-3', date: '2026-05-14T11:00:00', type: 'writeoff', quantity: 80, balanceAfter: 160, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановый расход', reason: 'patient' },
      { id: 'LOG-007-4', date: '2026-05-20T09:00:00', type: 'writeoff', quantity: 90, balanceAfter: 70, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Назначение', reason: 'patient' },
      { id: 'LOG-007-5', date: '2026-05-22T12:00:00', type: 'writeoff', quantity: 66, balanceAfter: 4, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Высокая температура у пациентов', reason: 'patient' },
    ]
  },
  {
    id: 'MED-008', name: 'Инсулин Хумулин Р',
    description: 'Инсулин короткого действия. Применяется при сахарном диабете 1 и 2 типа для снижения гипергликемии.',
    category: 'Гормоны', unit: 'ед.', currentBalance: 1500, minBalance: 500,
    totalReceived: 5000, totalWrittenOff: 3500, lastReceiptDate: '2026-05-16', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'ООО «ДиаФарм»', lastOperation: 'writeoff', lastChangedBy: 'Козлова Н.И.',
    lastUpdated: '2026-05-22T07:30:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-008-1', date: '2026-05-01T07:00:00', type: 'receipt', quantity: 2000, balanceAfter: 2000, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановая поставка', supplier: 'ООО «ДиаФарм»' },
      { id: 'LOG-008-2', date: '2026-05-08T08:00:00', type: 'writeoff', quantity: 800, balanceAfter: 1200, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Инсулинотерапия', reason: 'patient', patientId: 'P003', patientName: 'Смирнов Алексей Дмитриевич' },
      { id: 'LOG-008-3', date: '2026-05-14T07:30:00', type: 'writeoff', quantity: 700, balanceAfter: 500, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Регулярные инъекции', reason: 'im' },
      { id: 'LOG-008-4', date: '2026-05-16T09:00:00', type: 'receipt', quantity: 2000, balanceAfter: 2500, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Экстренное пополнение', supplier: 'ООО «ДиаФарм»' },
      { id: 'LOG-008-5', date: '2026-05-22T07:30:00', type: 'writeoff', quantity: 1000, balanceAfter: 1500, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Ежедневный расход', reason: 'patient' },
    ]
  },
  {
    id: 'MED-009', name: 'Цефтриаксон 1 г',
    description: 'Цефалоспориновый антибиотик III поколения. Применяется при тяжелых инфекциях.',
    category: 'Антибиотики', unit: 'флаконы', currentBalance: 0, minBalance: 10,
    totalReceived: 50, totalWrittenOff: 50, lastReceiptDate: '2026-05-05', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'АО «АнтибиоМед»', lastOperation: 'writeoff', lastChangedBy: 'Сидорова Е.П.',
    lastUpdated: '2026-05-22T16:00:00', status: 'empty', isArchived: false,
    operationLog: [
      { id: 'LOG-009-1', date: '2026-05-01T09:00:00', type: 'receipt', quantity: 25, balanceAfter: 25, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Поставка', supplier: 'АО «АнтибиоМед»' },
      { id: 'LOG-009-2', date: '2026-05-05T10:00:00', type: 'receipt', quantity: 25, balanceAfter: 50, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Дополнительный заказ', supplier: 'АО «АнтибиоМед»' },
      { id: 'LOG-009-3', date: '2026-05-10T14:00:00', type: 'writeoff', quantity: 20, balanceAfter: 30, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Антибактериальная терапия', reason: 'iv' },
      { id: 'LOG-009-4', date: '2026-05-16T09:00:00', type: 'writeoff', quantity: 20, balanceAfter: 10, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Пневмония', reason: 'patient', patientId: 'P001', patientName: 'Петров Иван Сергеевич' },
      { id: 'LOG-009-5', date: '2026-05-22T16:00:00', type: 'writeoff', quantity: 10, balanceAfter: 0, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Использован весь запас', reason: 'patient' },
    ]
  },
  {
    id: 'MED-010', name: 'Метопролол 50 мг',
    description: 'Кардиоселективный бета-адреноблокатор. Применяется при артериальной гипертензии, ИБС, тахикардии.',
    category: 'Кардио', unit: 'таблетки', currentBalance: 90, minBalance: 20,
    totalReceived: 200, totalWrittenOff: 110, lastReceiptDate: '2026-05-10', lastWriteOffDate: '2026-05-20',
    lastReceiptFrom: 'ЗАО «КардиоФарм»', lastOperation: 'writeoff', lastChangedBy: 'Сидорова Е.П.',
    lastUpdated: '2026-05-20T09:00:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-010-1', date: '2026-05-01T08:00:00', type: 'receipt', quantity: 100, balanceAfter: 100, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановая поставка', supplier: 'ЗАО «КардиоФарм»' },
      { id: 'LOG-010-2', date: '2026-05-08T10:00:00', type: 'writeoff', quantity: 40, balanceAfter: 60, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Гипотензивная терапия', reason: 'patient' },
      { id: 'LOG-010-3', date: '2026-05-10T09:00:00', type: 'receipt', quantity: 100, balanceAfter: 160, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Пополнение', supplier: 'ЗАО «КардиоФарм»' },
      { id: 'LOG-010-4', date: '2026-05-15T14:00:00', type: 'writeoff', quantity: 50, balanceAfter: 110, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Плановый расход', reason: 'patient' },
      { id: 'LOG-010-5', date: '2026-05-20T09:00:00', type: 'writeoff', quantity: 20, balanceAfter: 90, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Назначение', reason: 'patient', patientId: 'P001', patientName: 'Петров Иван Сергеевич' },
    ]
  },
  {
    id: 'MED-011', name: 'Фуросемид 40 мг',
    description: 'Петлевой диуретик. Применяется при отеках сердечного и почечного происхождения, артериальной гипертензии.',
    category: 'Кардио', unit: 'таблетки', currentBalance: 18, minBalance: 15,
    totalReceived: 100, totalWrittenOff: 82, lastReceiptDate: '2026-05-12', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'ЗАО «КардиоФарм»', lastOperation: 'writeoff', lastChangedBy: 'Козлова Н.И.',
    lastUpdated: '2026-05-22T10:00:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-011-1', date: '2026-05-01T08:00:00', type: 'receipt', quantity: 50, balanceAfter: 50, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановая поставка', supplier: 'ЗАО «КардиоФарм»' },
      { id: 'LOG-011-2', date: '2026-05-08T09:00:00', type: 'writeoff', quantity: 24, balanceAfter: 26, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Терапия отеков', reason: 'patient' },
      { id: 'LOG-011-3', date: '2026-05-12T08:00:00', type: 'receipt', quantity: 50, balanceAfter: 76, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Пополнение', supplier: 'ЗАО «КардиоФарм»' },
      { id: 'LOG-011-4', date: '2026-05-18T11:00:00', type: 'writeoff', quantity: 38, balanceAfter: 38, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Регулярный прием', reason: 'patient' },
      { id: 'LOG-011-5', date: '2026-05-22T10:00:00', type: 'writeoff', quantity: 20, balanceAfter: 18, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Назначение пациентам', reason: 'patient' },
    ]
  },
  {
    id: 'MED-012', name: 'Кетамин 500 мг/10 мл',
    description: 'Анестетик общего действия для краткосрочного наркоза и премедикации. Требует строгого учета.',
    category: 'Анальгетики', unit: 'ампулы', currentBalance: 8, minBalance: 5,
    totalReceived: 30, totalWrittenOff: 22, lastReceiptDate: '2026-05-10', lastWriteOffDate: '2026-05-19',
    lastReceiptFrom: 'ГУП «Фармация»', lastOperation: 'writeoff', lastChangedBy: 'Козлова Н.И.',
    lastUpdated: '2026-05-19T13:00:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-012-1', date: '2026-05-01T09:00:00', type: 'receipt', quantity: 15, balanceAfter: 15, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Получено со склада больницы', supplier: 'ГУП «Фармация»' },
      { id: 'LOG-012-2', date: '2026-05-07T11:00:00', type: 'writeoff', quantity: 5, balanceAfter: 10, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Анестезия при манипуляциях', reason: 'iv' },
      { id: 'LOG-012-3', date: '2026-05-10T09:00:00', type: 'receipt', quantity: 15, balanceAfter: 25, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановое пополнение', supplier: 'ГУП «Фармация»' },
      { id: 'LOG-012-4', date: '2026-05-14T14:00:00', type: 'writeoff', quantity: 7, balanceAfter: 18, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Перевязки под наркозом', reason: 'iv' },
      { id: 'LOG-012-5', date: '2026-05-19T13:00:00', type: 'writeoff', quantity: 10, balanceAfter: 8, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Плановые процедуры', reason: 'iv' },
    ]
  },
  {
    id: 'MED-013', name: 'Глюкоза 5% 400 мл',
    description: 'Раствор для инфузий. Источник углеводного питания, применяется при гипогликемии и для разведения лекарств.',
    category: 'Прочее', unit: 'флаконы', currentBalance: 22, minBalance: 10,
    totalReceived: 80, totalWrittenOff: 58, lastReceiptDate: '2026-05-18', lastWriteOffDate: '2026-05-21',
    lastReceiptFrom: 'АО «СолюшнФарм»', lastOperation: 'receipt', lastChangedBy: 'Иванова И.И.',
    lastUpdated: '2026-05-18T11:00:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-013-1', date: '2026-05-01T07:30:00', type: 'receipt', quantity: 40, balanceAfter: 40, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Ежемесячная поставка', supplier: 'АО «СолюшнФарм»' },
      { id: 'LOG-013-2', date: '2026-05-09T10:00:00', type: 'writeoff', quantity: 18, balanceAfter: 22, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Инфузионная терапия', reason: 'drip' },
      { id: 'LOG-013-3', date: '2026-05-14T09:00:00', type: 'writeoff', quantity: 20, balanceAfter: 2, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Капельницы', reason: 'drip' },
      { id: 'LOG-013-4', date: '2026-05-18T11:00:00', type: 'receipt', quantity: 40, balanceAfter: 42, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Пополнение', supplier: 'АО «СолюшнФарм»' },
      { id: 'LOG-013-5', date: '2026-05-21T14:00:00', type: 'writeoff', quantity: 20, balanceAfter: 22, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Регулярный расход', reason: 'drip' },
    ]
  },
  {
    id: 'MED-014', name: 'Но-шпа 40 мг',
    description: 'Спазмолитик. Применяется при спазмах гладкой мускулатуры органов брюшной полости, желчевыводящих путей.',
    category: 'Анальгетики', unit: 'таблетки', currentBalance: 120, minBalance: 30,
    totalReceived: 400, totalWrittenOff: 280, lastReceiptDate: '2026-05-14', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'ООО «МедФарм»', lastOperation: 'writeoff', lastChangedBy: 'Иванова И.И.',
    lastUpdated: '2026-05-22T13:00:00', status: 'norm', isArchived: false,
    operationLog: [
      { id: 'LOG-014-1', date: '2026-05-01T08:00:00', type: 'receipt', quantity: 200, balanceAfter: 200, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановое пополнение', supplier: 'ООО «МедФарм»' },
      { id: 'LOG-014-2', date: '2026-05-08T11:00:00', type: 'writeoff', quantity: 60, balanceAfter: 140, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Расход за неделю', reason: 'patient' },
      { id: 'LOG-014-3', date: '2026-05-14T08:00:00', type: 'receipt', quantity: 200, balanceAfter: 340, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Повторная поставка', supplier: 'ООО «МедФарм»' },
      { id: 'LOG-014-4', date: '2026-05-18T10:00:00', type: 'writeoff', quantity: 150, balanceAfter: 190, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Плановый расход', reason: 'patient' },
      { id: 'LOG-014-5', date: '2026-05-22T13:00:00', type: 'writeoff', quantity: 70, balanceAfter: 120, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Назначение', reason: 'patient' },
    ]
  },
  {
    id: 'MED-015', name: 'Сальбутамол 100 мкг/доза',
    description: 'Бронходилататор короткого действия. Применяется для купирования приступов бронхиальной астмы.',
    category: 'Прочее', unit: 'флаконы', currentBalance: 3, minBalance: 5,
    totalReceived: 30, totalWrittenOff: 27, lastReceiptDate: '2026-05-08', lastWriteOffDate: '2026-05-22',
    lastReceiptFrom: 'ООО «ФармМедПлюс»', lastOperation: 'writeoff', lastChangedBy: 'Сидорова Е.П.',
    lastUpdated: '2026-05-22T15:00:00', status: 'low', isArchived: false,
    operationLog: [
      { id: 'LOG-015-1', date: '2026-05-01T09:00:00', type: 'receipt', quantity: 15, balanceAfter: 15, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Плановая поставка', supplier: 'ООО «ФармМедПлюс»' },
      { id: 'LOG-015-2', date: '2026-05-05T12:00:00', type: 'writeoff', quantity: 5, balanceAfter: 10, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Купирование приступов', reason: 'patient', patientId: 'P002', patientName: 'Иванова Мария Александровна' },
      { id: 'LOG-015-3', date: '2026-05-08T10:00:00', type: 'receipt', quantity: 15, balanceAfter: 25, performedBy: 'Иванова И.И.', performedById: 'STAFF-01', comment: 'Срочный заказ', supplier: 'ООО «ФармМедПлюс»' },
      { id: 'LOG-015-4', date: '2026-05-14T16:00:00', type: 'writeoff', quantity: 12, balanceAfter: 13, performedBy: 'Козлова Н.И.', performedById: 'STAFF-03', comment: 'Ингаляционная терапия', reason: 'patient' },
      { id: 'LOG-015-5', date: '2026-05-20T11:00:00', type: 'writeoff', quantity: 7, balanceAfter: 6, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Астма', reason: 'patient' },
      { id: 'LOG-015-6', date: '2026-05-22T15:00:00', type: 'writeoff', quantity: 3, balanceAfter: 3, performedBy: 'Сидорова Е.П.', performedById: 'STAFF-02', comment: 'Экстренное применение', reason: 'patient', patientId: 'P002', patientName: 'Иванова Мария Александровна' },
    ]
  },
]

export function getMedicineById(id: string): Medicine | undefined {
  return mockMedicines.find((m) => m.id === id)
}

export function computeMedicineStatus(currentBalance: number, minBalance: number): MedicineStatus {
  if (currentBalance === 0) return 'empty'
  if (currentBalance <= minBalance) return 'low'
  return 'norm'
}


export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id)
}

export function getPatientFullName(patient: Patient): string {
  return `${patient.lastName} ${patient.firstName} ${patient.middleName}`
}

export function getPatientLatestVitals(patientId: string): VitalSign | null {
  const signs = mockPathientVitalSigns[patientId]
  if (!signs || signs.length === 0) return null
  return [...signs].sort((a, b) => b.date.localeCompare(a.date))[0]
}

export function formatVitalsForForm(patientId: string): {
  temp: string; bp: string; hr: string; spo2: string; resp: string
} {
  const v = getPatientLatestVitals(patientId)
  if (!v) return { temp: '', bp: '', hr: '', spo2: '', resp: '' }
  return {
    temp: String(v.temperature),
    bp: `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}`,
    hr: String(v.pulse),
    spo2: String(v.spo2),
    resp: String(v.respiratoryRate),
  }
}

