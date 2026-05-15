export interface Patient {
  id: string
  firstName: string
  gender: 'Мужской' | 'Женский'
  lastName: string
  middleName: string
  dateOfBirth: string
  age: number
  phone: string
  email: string
  address: string
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
  allergies: any[]
  diagnoses: string[]
  activeAppointments: Appointment[]
  vitalSigns: VitalSign[]
  prescriptions: any[]
  documents: any[]

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
  vitals: {
    temp?: string
    bp?: string
    hr?: string
    spo2?: string
    resp?: string
    bmi?: string
    weight?: string
    height?: string
    bloodSugar?: string
  }
  labs: {
    type?: string
    date?: string
    statusText?: string
    doctor?: string
    reason?: string
  }[]
  currentMeds: {
    name?: string
    dose?: string
    form?: string
    regimen?: string
  }[]
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
    dateTime?: string
    type?: string
    doctor?: string
    conclusion?: string
    complaints?: string
    objective?: string
    recommendations?: string
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

export interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  status: 'active' | 'completed'
}

export interface Document {
  id: string
  title: string
  type: string
  date: string
  url: string
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
  prescriptions?: BedPrescription[]
  medications?: BedMedication[]
  actionLog?: BedAction[]
}

export interface BedPrescription {
  id: string
  name: string
  time: string
  done: boolean
}

export interface BedMedication {
  id: string
  name: string
  quantity: number
  unit: string
  low?: boolean
}

export interface BedAction {
  id: string
  performer: string
  action: string
  medication: string
  quantity: string
  time: string
}

export interface Treatment {
  id: string
  name: string
  time: string
  status: 'pending' | 'completed'
}

export interface Facility {
  id: string
  name: string
  type: string
  city: string
  departments: Department[]
}

export interface Department {
  id: string
  name: string
  facilityId: string
}

export interface Staff {
  id: string
  firstName: string
  lastName: string
  position: string
  department: string
  login: string
  status: 'active' | 'inactive'
}

export interface PatientDetail {
  doctorNote: string
  prescriptions: { id: number; name: string; dose: string; time: string; done: boolean }[]
  meds: { name: string; qty: string }[]
  log: { who: string; action: string; time: string; amount: string }[]
}

export interface Shift {
  day: number
  type: 'day' | 'night' | 'day-off'
  hours: number
}

export interface MedicalStaffMember {
  id: string
  name: string
  position: string
  department: string
  schedule: Shift[]
}

export interface Notification {
  id: string
  type: string
  severity?: string
  patientName?: string
  patientId?: string
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
    phone: '+7 (495) 123-45-67',
    email: 'i.petrov@example.com',
    address: 'г. Москва, ул. Ленина, д. 10, кв. 5',
    emergencyContact: {
      name: 'Петрова Мария Ивановна',
      phone: '+7 (495) 765-43-21',
      relation: 'Супруга'
    },
    allergies: [
      { name: 'Пенициллин', reaction: 'Сыпь', date: '2010-05-12', comment: '' },
      { name: 'Арахис', reaction: 'Отек Квинке', date: '1995-10-01', comment: '' }
    ],
    diagnoses: ['Гипертоническая болезнь I стадии', 'Хронический гастрит'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS001',
        date: '2026-01-19',
        bloodPressureSystolic: 135,
        bloodPressureDiastolic: 85,
        temperature: 36.6,
        pulse: 78,
        spo2: 98,
        respiratoryRate: 16
      }
    ],
    prescriptions: [
      {
        id: 'PR001',
        drug: 'Эналаприл',
        dose: '10 мг',
        form: 'таблетки',
        route: 'перорально',
        regimen: '1 раз в день',
        comment: 'Утром после еды',
        doctor: 'Смирнов А.А.',
        dateStart: '2026-01-01',
        dateEnd: '2026-03-01',
        status: 'active'
      }
    ],
    documents: [
      { id: 'DOC001', name: 'Информированное согласие.pdf', date: '2026-01-15' }
    ],
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
    relatives: [{ name: 'Петрова Мария Ивановна', relation: 'Супруга', phone: '+7 (495) 765-43-21' }],
    work: {
      profession: 'Инженер',
      organization: 'ООО "ТехСтрой"',
      address: 'г. Москва, ул. Строителей, 15'
    },
    activeProblems: ['Внебольничная пневмония', 'Артериальная гипертензия II ст.'],
    vitals: {
      temp: '37.2 °C',
      bp: '135/85',
      hr: '78 уд/мин',
      spo2: '98%',
      resp: '16 д/мин',
      bmi: '25.4'
    },
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
        severity: 'Лёгкая',
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
    phone: '+7 (495) 234-56-78',
    email: 'm.ivanova@example.com',
    address: 'г. Москва, ул. Пушкина, д. 25, кв. 12',
    emergencyContact: {
      name: 'Иванов Петр Сергеевич',
      phone: '+7 (495) 876-54-32',
      relation: 'Отец'
    },
    allergies: [],
    diagnoses: ['Бронхиальная астма легкой степени'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS003',
        date: '2026-01-18',
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 75,
        temperature: 36.5,
        pulse: 72,
        spo2: 97,
        respiratoryRate: 14
      }
    ],
    prescriptions: [
      {
        id: 'PR002',
        drug: 'Сальбутамол',
        dose: '100 мкг',
        form: 'аэрозоль',
        route: 'ингаляционно',
        regimen: 'По необходимости',
        comment: '',
        doctor: 'Орлова Е.В.',
        dateStart: '2025-12-01',
        dateEnd: '2026-06-01',
        status: 'active'
      }
    ],
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
    relatives: [
      { name: 'Иванов Петр Сергеевич', relation: 'Отец', phone: '+7 (495) 876-54-32' }
    ],
    work: {
      profession: 'Менеджер',
      organization: 'ООО "МедиаГрупп"',
      address: 'г. Москва, ул. Тверская, 12'
    },
    activeProblems: ['Бронхиальная астма, лёгкое персистирующее течение'],
    vitals: {
      temp: '36.5 °C',
      bp: '120/75',
      hr: '72 уд/мин',
      spo2: '97%',
      resp: '14 д/мин',
      bmi: '21.8'
    },
    labs: [
      {
        type: 'Спирометрия',
        date: '2026-04-20',
        statusText: 'Внимание: ОФВ1 снижен',
        doctor: 'Орлова Е.В.',
      reason: 'Плановое обследование'
      }
    ],
    currentMeds: [
      { name: 'Сальбутамол', dose: '100 мкг', form: 'аэрозоль', regimen: 'по необходимости' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Бронхиальная астма', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
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

  // ─── P003 ───────────────────────────────────────────────────────────────────
  {
    id: 'P003',
    firstName: 'Алексей',
    lastName: 'Смирнов',
    middleName: 'Дмитриевич',
    gender: 'Мужской',
    dateOfBirth: '1978-11-30',
    age: 47,
    phone: '+7 (495) 345-67-89',
    email: 'a.smirnov@example.com',
    address: 'г. Москва, пр. Мира, д. 45, кв. 78',
    emergencyContact: {
      name: 'Смирнова Ольга Викторовна',
      phone: '+7 (495) 987-65-43',
      relation: 'Супруга'
    },
    allergies: [{ name: 'Йод', reaction: 'Контактный дерматит', date: '2008-03-05', comment: '' }],
    diagnoses: ['Сахарный диабет 2 типа', 'Ожирение 1 степени'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS004',
        date: '2026-01-19',
        bloodPressureSystolic: 140,
        bloodPressureDiastolic: 90,
        temperature: 36.8,
        pulse: 82,
        spo2: 96,
        respiratoryRate: 20
      }
    ],
    prescriptions: [
      {
        id: 'PR003',
        drug: 'Метформин',
        dose: '850 мг',
        form: 'таблетки',
        route: 'перорально',
        regimen: '2 раза в день',
        comment: 'Во время еды',
        doctor: 'Козлова Н.И.',
        dateStart: '2025-11-01',
        dateEnd: '2026-05-01',
        status: 'active'
      }
    ],
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
      address: 'г. Москва, Садовая-Самотёчная, 5'
    },
    activeProblems: ['Декомпенсация сахарного диабета 2 типа', 'Ожирение 1 степени'],
    vitals: {
      temp: '36.8 °C',
      bp: '140/90',
      hr: '82 уд/мин',
      spo2: '96%',
      resp: '20 д/мин',
      bmi: '31.2'
    },
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
    currentMeds: [
      { name: 'Метформин', dose: '850 мг', form: 'таблетки', regimen: '2 раза в день' },
      { name: 'Инсулин Актрапид', dose: '8 ед', form: 'раствор', regimen: 'перед едой' }
    ],
    operations: [{ name: 'Холецистэктомия', date: '2015-01-01', diagnosis: '—', description: 'Подробности не указаны', complications: 'Нет', implants: 'Нет', result: 'Выздоровление' }],
    medicalProblems: [{ name: 'Сахарный диабет 2 типа', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Ожирение', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Артериальная гипертензия', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
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

  // ─── P004 ───────────────────────────────────────────────────────────────────
  {
    id: 'P004',
    firstName: 'Екатерина',
    lastName: 'Орлова',
    middleName: 'Владимировна',
    gender: 'Женский',
    dateOfBirth: '1988-04-11',
    age: 37,
    phone: '+7 (495) 456-71-22',
    email: 'e.orlova@example.com',
    address: 'г. Москва, ул. Лесная, д. 7, кв. 14',
    emergencyContact: {
      name: 'Орлов Владимир Павлович',
      phone: '+7 (495) 456-71-23',
      relation: 'Муж'
    },
    allergies: [{ name: 'Ибупрофен', reaction: 'Крапивница', date: '2019-07-22', comment: '' }],
    diagnoses: ['Вегетососудистая дистония'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS010',
        date: '2026-01-18',
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 76,
        temperature: 36.4,
        pulse: 71,
        spo2: 99,
        respiratoryRate: 15
      }
    ],
    prescriptions: [
      {
        id: 'PR004',
        drug: 'Магне B6',
        dose: '2 таб',
        form: 'таблетки',
        route: 'перорально',
        regimen: '2 раза в день',
        comment: '',
        doctor: 'Лукина А.С.',
        dateStart: '2026-01-10',
        dateEnd: '2026-02-10',
        status: 'active'
      }
    ],
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
      issuedBy: 'УМВД Савёловского района г. Москвы',
      dateIssued: '2008-11-03'
    },
    maritalStatus: 'Замужем',
    other: {
      language: 'Русский',
      nationality: 'Русская',
      dateOfDeath: '',
      causeOfDeath: ''
    },
    relatives: [
      { name: 'Орлов Владимир Павлович', relation: 'Муж', phone: '+7 (495) 456-71-23' }
    ],
    work: {
      profession: 'Педагог',
      organization: 'ГБОУ Школа №1234',
      address: 'г. Москва, ул. Лесная, 3'
    },
    activeProblems: ['Вегетососудистая дистония, смешанный тип'],
    vitals: {
      temp: '36.4 °C',
      bp: '118/76',
      hr: '71 уд/мин',
      spo2: '99%',
      resp: '15 д/мин',
      bmi: '22.1'
    },
    labs: [
      {
        type: 'Общий анализ крови',
        date: '2026-04-22',
        statusText: 'Норма',
        doctor: 'Лукина А.С.',
      reason: 'Плановое обследование'
      }
    ],
    currentMeds: [
      { name: 'Магне B6', dose: '2 таб', form: 'таблетки', regimen: '2 раза в день' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Вегетососудистая дистония', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
    history: [
      {
        dateTime: '2026-04-22 10:30',
        type: 'Плановый осмотр',
        doctor: 'Лукина А.С.',
        conclusion: 'ВСД смешанного типа, умеренно выраженная',
        complaints: 'Головокружение, сердцебиение при стрессе',
        objective: 'АД лабильное, ЧСС 71',
        recommendations: 'Приём магния, режим труда и отдыха'
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

  // ─── P005 ───────────────────────────────────────────────────────────────────
  {
    id: 'P005',
    firstName: 'Николай',
    lastName: 'Федоров',
    middleName: 'Андреевич',
    gender: 'Мужской',
    dateOfBirth: '1969-09-03',
    age: 56,
    phone: '+7 (495) 501-14-67',
    email: 'n.fedorov@example.com',
    address: 'г. Москва, Профсоюзная ул., д. 18, кв. 42',
    emergencyContact: {
      name: 'Федорова Ирина Николаевна',
      phone: '+7 (495) 501-14-68',
      relation: 'Супруга'
    },
    allergies: [],
    diagnoses: ['Ишемическая болезнь сердца'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS011',
        date: '2026-01-17',
        bloodPressureSystolic: 142,
        bloodPressureDiastolic: 88,
        temperature: 36.7,
        pulse: 79,
        spo2: 97,
        respiratoryRate: 17
      }
    ],
    prescriptions: [
      {
        id: 'PR005',
        drug: 'Бисопролол',
        dose: '5 мг',
        form: 'таблетки',
        route: 'перорально',
        regimen: '1 раз в день',
        comment: 'Утром',
        doctor: 'Карпов В.Г.',
        dateStart: '2026-01-05',
        dateEnd: '2026-03-05',
        status: 'active'
      }
    ],
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
    vitals: {
      temp: '36.7 °C',
      bp: '142/88',
      hr: '79 уд/мин',
      spo2: '97%',
      resp: '17 д/мин',
      bmi: '27.9'
    },
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
    currentMeds: [
      { name: 'Бисопролол', dose: '5 мг', form: 'таблетки', regimen: '1 раз в день' },
      { name: 'Аспирин Кардио', dose: '100 мг', form: 'таблетки', regimen: 'вечером' }
    ],
    operations: [{ name: 'АКШ', date: '2018-01-01', diagnosis: '—', description: 'Подробности не указаны', complications: 'Нет', implants: 'Нет', result: 'Выздоровление' }],
    medicalProblems: [{ name: 'ИБС', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Артериальная гипертензия', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Атеросклероз', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
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

  // ─── P006 ───────────────────────────────────────────────────────────────────
  {
    id: 'P006',
    firstName: 'Светлана',
    lastName: 'Громова',
    middleName: 'Ильинична',
    gender: 'Женский',
    dateOfBirth: '1995-02-27',
    age: 30,
    phone: '+7 (495) 613-90-10',
    email: 's.gromova@example.com',
    address: 'г. Москва, ул. Садовая, д. 55, кв. 6',
    emergencyContact: {
      name: 'Громова Инна Ивановна',
      phone: '+7 (495) 613-90-11',
      relation: 'Мать'
    },
    allergies: [{ name: 'Пыльца берёзы', reaction: 'Ринит, конъюнктивит', date: '2015-04-10', comment: '' }],
    diagnoses: ['Хронический тонзиллит'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS012',
        date: '2026-01-16',
        bloodPressureSystolic: 116,
        bloodPressureDiastolic: 72,
        temperature: 37.1,
        pulse: 76,
        spo2: 98,
        respiratoryRate: 16
      }
    ],
    prescriptions: [
      {
        id: 'PR006',
        drug: 'Мирамистин',
        dose: '3 орошения',
        form: 'спрей',
        route: 'местно',
        regimen: '3 раза в день',
        comment: '',
        doctor: 'Белова О.Р.',
        dateStart: '2026-01-12',
        dateEnd: '2026-01-22',
        status: 'active'
      }
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
    relatives: [
      { name: 'Громова Инна Ивановна', relation: 'Мать', phone: '+7 (495) 613-90-11' }
    ],
    work: {
      profession: 'Дизайнер',
      organization: 'ИП Громова С.И.',
      address: 'Дистанционно'
    },
    activeProblems: ['Обострение хронического тонзиллита'],
    vitals: {
      temp: '37.1 °C',
      bp: '116/72',
      hr: '76 уд/мин',
      spo2: '98%',
      resp: '16 д/мин',
      bmi: '20.3'
    },
    labs: [
      {
        type: 'Мазок из зева',
        date: '2026-01-13',
        statusText: 'Внимание: Staphylococcus aureus',
        doctor: 'Белова О.Р.',
      reason: 'Плановое обследование'
      }
    ],
    currentMeds: [
      { name: 'Мирамистин', dose: '3 орошения', form: 'спрей', regimen: '3 раза в день' },
      { name: 'Амоксициллин', dose: '500 мг', form: 'таблетки', regimen: '3 раза в день' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Хронический тонзиллит', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Поллиноз', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
    history: [
      {
        dateTime: '2026-01-12 14:00',
        type: 'Первичный приём',
        doctor: 'Белова О.Р.',
        conclusion: 'Обострение хронического тонзиллита',
        complaints: 'Боль в горле, субфебрилитет 3 дня',
        objective: 'Миндалины увеличены, гиперемированы, налёт',
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

  // ─── P007 ───────────────────────────────────────────────────────────────────
  {
    id: 'P007',
    firstName: 'Павел',
    lastName: 'Лебедев',
    middleName: 'Олегович',
    gender: 'Мужской',
    dateOfBirth: '1981-12-08',
    age: 44,
    phone: '+7 (495) 720-88-01',
    email: 'p.lebedev@example.com',
    address: 'г. Москва, Университетский пр., д. 9, кв. 31',
    emergencyContact: {
      name: 'Лебедева Марина Олеговна',
      phone: '+7 (495) 720-88-02',
      relation: 'Сестра'
    },
    allergies: [{ name: 'Латекс', reaction: 'Контактный дерматит', date: '2011-06-18', comment: '' }],
    diagnoses: ['Поясничный остеохондроз'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS013',
        date: '2026-01-20',
        bloodPressureSystolic: 124,
        bloodPressureDiastolic: 80,
        temperature: 36.6,
        pulse: 73,
        spo2: 98,
        respiratoryRate: 15
      }
    ],
    prescriptions: [
      {
        id: 'PR007',
        drug: 'Мидокалм',
        dose: '150 мг',
        form: 'таблетки',
        route: 'перорально',
        regimen: '2 раза в день',
        comment: '',
        doctor: 'Ершов М.П.',
        dateStart: '2026-01-15',
        dateEnd: '2026-02-15',
        status: 'active'
      }
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
    maritalStatus: 'Разведён',
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
    vitals: {
      temp: '36.6 °C',
      bp: '124/80',
      hr: '73 уд/мин',
      spo2: '98%',
      resp: '15 д/мин',
      bmi: '24.7'
    },
    labs: [
      {
        type: 'МРТ поясничного отдела',
        date: '2026-04-18',
        statusText: 'Внимание: Протрузия L4-L5 до 4 мм',
        doctor: 'Ершов М.П.',
      reason: 'Плановое обследование'
      }
    ],
    currentMeds: [
      { name: 'Мидокалм', dose: '150 мг', form: 'таблетки', regimen: '2 раза в день' },
      { name: 'Диклофенак', dose: '75 мг', form: 'гель', regimen: '2 раза в день местно' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Поясничный остеохондроз', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Протрузия дисков', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
    history: [
      {
        dateTime: '2026-04-17 16:00',
        type: 'Первичный приём',
        doctor: 'Ершов М.П.',
        conclusion: 'Поясничный остеохондроз, обострение',
        complaints: 'Боли в пояснице, иррадиация в левую ногу',
        objective: 'Болезненность L4-L5, ограничение сгибания',
        recommendations: 'Миорелаксанты, НПВС, ЛФК, МРТ'
      }
    ],
    vaccines: []
  },

  // ─── P008 ───────────────────────────────────────────────────────────────────
  {
    id: 'P008',
    firstName: 'Людмила',
    lastName: 'Волкова',
    middleName: 'Семеновна',
    gender: 'Женский',
    dateOfBirth: '1974-06-19',
    age: 51,
    phone: '+7 (495) 410-55-31',
    email: 'l.volkova@example.com',
    address: 'г. Москва, Нагорная ул., д. 12, кв. 9',
    emergencyContact: {
      name: 'Волков Илья Константинович',
      phone: '+7 (495) 410-55-32',
      relation: 'Сын'
    },
    allergies: [],
    diagnoses: ['Хронический пиелонефрит'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS014',
        date: '2026-01-18',
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 84,
        temperature: 36.9,
        pulse: 77,
        spo2: 97,
        respiratoryRate: 17
      }
    ],
    prescriptions: [
      {
        id: 'PR008',
        drug: 'Канефрон',
        dose: '2 драже',
        form: 'драже',
        route: 'перорально',
        regimen: '3 раза в день',
        comment: 'Во время еды',
        doctor: 'Носова Т.В.',
        dateStart: '2026-01-08',
        dateEnd: '2026-02-08',
        status: 'active'
      }
    ],
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
    vitals: {
      temp: '36.9 °C',
      bp: '130/84',
      hr: '77 уд/мин',
      spo2: '97%',
      resp: '17 д/мин',
      bmi: '26.5'
    },
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
    currentMeds: [
      { name: 'Канефрон', dose: '2 драже', form: 'драже', regimen: '3 раза в день' },
      { name: 'Ципрофлоксацин', dose: '500 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Хронический пиелонефрит', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Мочекаменная болезнь в анамнезе', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
    history: [
      {
        dateTime: '2026-04-24 13:00',
        type: 'Госпитализация',
        doctor: 'Носова Т.В.',
        conclusion: 'Обострение хронического пиелонефрита',
        complaints: 'Боли в пояснице, лихорадка до 38.2, дизурия',
        objective: 'Симптом Пастернацкого положительный справа',
        recommendations: 'Антибиотикотерапия, обильное питьё, УЗИ'
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

  // ─── P009 ───────────────────────────────────────────────────────────────────
  {
    id: 'P009',
    firstName: 'Артем',
    lastName: 'Белов',
    middleName: 'Максимович',
    gender: 'Мужской',
    dateOfBirth: '2000-10-14',
    age: 25,
    phone: '+7 (495) 311-24-70',
    email: 'a.belov@example.com',
    address: 'г. Москва, Мичуринский пр., д. 4, кв. 52',
    emergencyContact: {
      name: 'Белова Татьяна Сергеевна',
      phone: '+7 (495) 311-24-71',
      relation: 'Мать'
    },
    allergies: [{ name: 'Цитрусовые', reaction: 'Сыпь', date: '2010-01-20', comment: '' }],
    diagnoses: ['Хронический гастродуоденит'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS015',
        date: '2026-01-19',
        bloodPressureSystolic: 114,
        bloodPressureDiastolic: 70,
        temperature: 36.5,
        pulse: 68,
        spo2: 99,
        respiratoryRate: 14
      }
    ],
    prescriptions: [
      {
        id: 'PR009',
        drug: 'Омез',
        dose: '20 мг',
        form: 'капсулы',
        route: 'перорально',
        regimen: '1 раз в день',
        comment: 'Натощак',
        doctor: 'Зимина С.А.',
        dateStart: '2026-01-14',
        dateEnd: '2026-02-14',
        status: 'active'
      }
    ],
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
      address: 'г. Москва, Воробьёвы горы, 1'
    },
    activeProblems: ['Обострение хронического гастродуоденита'],
    vitals: {
      temp: '36.5 °C',
      bp: '114/70',
      hr: '68 уд/мин',
      spo2: '99%',
      resp: '14 д/мин',
      bmi: '21.0'
    },
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
    currentMeds: [
      { name: 'Омез', dose: '20 мг', form: 'капсулы', regimen: '1 раз в день' },
      { name: 'Амоксициллин', dose: '1000 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Хронический гастродуоденит', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'H. pylori инфекция', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
    history: [
      {
        dateTime: '2026-01-14 10:00',
        type: 'Первичный приём',
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

  // ─── P010 ───────────────────────────────────────────────────────────────────
  {
    id: 'P010',
    firstName: 'Наталья',
    lastName: 'Зайцева',
    middleName: 'Анатольевна',
    gender: 'Женский',
    dateOfBirth: '1983-08-05',
    age: 42,
    phone: '+7 (495) 212-67-98',
    email: 'n.zaitseva@example.com',
    address: 'г. Москва, пер. Хлебный, д. 2, кв. 11',
    emergencyContact: {
      name: 'Зайцев Анатолий Олегович',
      phone: '+7 (495) 212-67-99',
      relation: 'Брат'
    },
    allergies: [{ name: 'Мёд', reaction: 'Крапивница', date: '2017-08-14', comment: '' }],
    diagnoses: ['Железодефицитная анемия'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS016',
        date: '2026-01-15',
        bloodPressureSystolic: 110,
        bloodPressureDiastolic: 68,
        temperature: 36.4,
        pulse: 74,
        spo2: 99,
        respiratoryRate: 15
      }
    ],
    prescriptions: [
      {
        id: 'PR010',
        drug: 'Сорбифер',
        dose: '1 таб',
        form: 'таблетки',
        route: 'перорально',
        regimen: '2 раза в день',
        comment: 'До еды',
        doctor: 'Гаврилова К.Е.',
        dateStart: '2026-01-11',
        dateEnd: '2026-03-11',
        status: 'active'
      }
    ],
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
    vitals: {
      temp: '36.4 °C',
      bp: '110/68',
      hr: '74 уд/мин',
      spo2: '99%',
      resp: '15 д/мин',
      bmi: '19.8'
    },
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
    currentMeds: [
      { name: 'Сорбифер', dose: '1 таб', form: 'таблетки', regimen: '2 раза в день' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Железодефицитная анемия', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
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

  // ─── P011 ───────────────────────────────────────────────────────────────────
  {
    id: 'P011',
    firstName: 'Георгий',
    lastName: 'Тимофеев',
    middleName: 'Сергеевич',
    gender: 'Мужской',
    dateOfBirth: '1958-01-24',
    age: 68,
    phone: '+7 (495) 344-18-43',
    email: 'g.timofeev@example.com',
    address: 'г. Москва, Ломоносовский пр., д. 33, кв. 88',
    emergencyContact: {
      name: 'Тимофеева Алла Георгиевна',
      phone: '+7 (495) 344-18-44',
      relation: 'Дочь'
    },
    allergies: [{ name: 'Новокаин', reaction: 'Анафилаксия', date: '1995-03-10', comment: 'Реакция при стоматологии' }],
    diagnoses: ['ХОБЛ'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS017',
        date: '2026-01-17',
        bloodPressureSystolic: 136,
        bloodPressureDiastolic: 82,
        temperature: 36.8,
        pulse: 80,
        spo2: 95,
        respiratoryRate: 19
      }
    ],
    prescriptions: [
      {
        id: 'PR011',
        drug: 'Беродуал',
        dose: '20 капель',
        form: 'раствор',
        route: 'ингаляционно',
        regimen: '2 раза в день',
        comment: 'Через небулайзер',
        doctor: 'Антонов Р.С.',
        dateStart: '2026-01-09',
        dateEnd: '2026-02-09',
        status: 'active'
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
    activeProblems: ['ХОБЛ, стадия III (тяжёлая)', 'Эмфизема лёгких'],
    vitals: {
      temp: '36.8 °C',
      bp: '136/82',
      hr: '80 уд/мин',
      spo2: '95%',
      resp: '19 д/мин',
      bmi: '23.1'
    },
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
    currentMeds: [
      { name: 'Беродуал', dose: '20 капель', form: 'раствор', regimen: '2 раза в день' },
      { name: 'Тиотропий', dose: '18 мкг', form: 'капсулы д/инг.', regimen: '1 раз в день' }
    ],
    operations: [{ name: 'Резекция правого лёгкого', date: '2010-01-01', diagnosis: '—', description: 'Подробности не указаны', complications: 'Нет', implants: 'Нет', result: 'Выздоровление' }],
    medicalProblems: [{ name: 'ХОБЛ', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Эмфизема', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Лёгочная гипертензия', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
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

  // ─── P012 ───────────────────────────────────────────────────────────────────
  {
    id: 'P012',
    firstName: 'Анастасия',
    lastName: 'Макарова',
    middleName: 'Денисовна',
    gender: 'Женский',
    dateOfBirth: '1998-05-30',
    age: 27,
    phone: '+7 (495) 277-41-53',
    email: 'a.makarova@example.com',
    address: 'г. Москва, Смоленский бульвар, д. 21, кв. 15',
    emergencyContact: {
      name: 'Макаров Денис Сергеевич',
      phone: '+7 (495) 277-41-54',
      relation: 'Брат'
    },
    allergies: [],
    diagnoses: ['Мигрень без ауры'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS018',
        date: '2026-01-20',
        bloodPressureSystolic: 112,
        bloodPressureDiastolic: 74,
        temperature: 36.6,
        pulse: 70,
        spo2: 99,
        respiratoryRate: 14
      }
    ],
    prescriptions: [
      {
        id: 'PR012',
        drug: 'Суматриптан',
        dose: '50 мг',
        form: 'таблетки',
        route: 'перорально',
        regimen: 'при приступе',
        comment: 'Не более 2 таб в сутки',
        doctor: 'Лебедева И.О.',
        dateStart: '2026-01-16',
        dateEnd: '2026-04-16',
        status: 'active'
      }
    ],
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
    relatives: [
      { name: 'Макаров Денис Сергеевич', relation: 'Брат', phone: '+7 (495) 277-41-54' }
    ],
    work: {
      profession: 'Журналист',
      organization: 'ООО "МедиаПресс"',
      address: 'г. Москва, Смоленская пл., 3'
    },
    activeProblems: ['Мигрень без ауры, частые приступы'],
    vitals: {
      temp: '36.6 °C',
      bp: '112/74',
      hr: '70 уд/мин',
      spo2: '99%',
      resp: '14 д/мин',
      bmi: '20.9'
    },
    labs: [
      {
        type: 'МРТ головного мозга',
        date: '2026-04-19',
        statusText: 'Норма: Патологии не выявлено',
        doctor: 'Лебедева И.О.',
      reason: 'Плановое обследование'
      }
    ],
    currentMeds: [
      { name: 'Суматриптан', dose: '50 мг', form: 'таблетки', regimen: 'при приступе' },
      { name: 'Топирамат', dose: '25 мг', form: 'таблетки', regimen: '1 раз в день' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Мигрень без ауры', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
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

  // ─── P013 ───────────────────────────────────────────────────────────────────
  {
    id: 'P013',
    firstName: 'Роман',
    lastName: 'Егоров',
    middleName: 'Валерьевич',
    gender: 'Мужской',
    dateOfBirth: '1990-03-09',
    age: 35,
    phone: '+7 (495) 688-15-77',
    email: 'r.egorov@example.com',
    address: 'г. Москва, ул. Тверская, д. 41, кв. 19',
    emergencyContact: {
      name: 'Егорова Елена Романовна',
      phone: '+7 (495) 688-15-78',
      relation: 'Супруга'
    },
    allergies: [{ name: 'Анальгин', reaction: 'Агранулоцитоз', date: '2020-11-05', comment: 'Зафиксировано в стационаре' }],
    diagnoses: ['Острый гнойный синусит'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS019',
        date: '2026-01-19',
        bloodPressureSystolic: 119,
        bloodPressureDiastolic: 77,
        temperature: 37.0,
        pulse: 75,
        spo2: 98,
        respiratoryRate: 16
      }
    ],
    prescriptions: [
      {
        id: 'PR013',
        drug: 'Синупрет',
        dose: '2 таб',
        form: 'таблетки',
        route: 'перорально',
        regimen: '3 раза в день',
        comment: '',
        doctor: 'Воронова Д.А.',
        dateStart: '2026-01-13',
        dateEnd: '2026-01-23',
        status: 'active'
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
    vitals: {
      temp: '37.0 °C',
      bp: '119/77',
      hr: '75 уд/мин',
      spo2: '98%',
      resp: '16 д/мин',
      bmi: '23.6'
    },
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
    currentMeds: [
      { name: 'Синупрет', dose: '2 таб', form: 'таблетки', regimen: '3 раза в день' },
      { name: 'Амоксиклав', dose: '875/125 мг', form: 'таблетки', regimen: '2 раза в день' }
    ],
    operations: [],
    medicalProblems: [{ name: 'Хронический синусит (в анамнезе)', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }, { name: 'Аллергический ринит', diagnosisDate: '', diseaseStatus: 'Хроническое', severity: 'Умеренная', description: '', complications: 'Нет' }],
    history: [
      {
        dateTime: '2026-01-13 09:00',
        type: 'Первичный приём',
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

// ─── Appointments ────────────────────────────────────────────────────────────

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
  // Мужская палата 101
  { id: 'B101_1', roomNumber: '101', bedNumber: 1, patientId: 'P001', patientName: 'Иван', patientLastName: 'Петров', patientMiddleName: 'Сергеевич', patientAge: 40, diagnosis: 'Гипертонический криз', status: 'stable' },
  { id: 'B101_2', roomNumber: '101', bedNumber: 2, patientId: 'P003', patientName: 'Алексей', patientLastName: 'Смирнов', patientMiddleName: 'Дмитриевич', patientAge: 47, diagnosis: 'Сахарный диабет 2 типа', status: 'urgent' },
  { id: 'B101_3', roomNumber: '101', bedNumber: 3, patientId: 'P005', patientName: 'Николай', patientLastName: 'Федоров', patientMiddleName: 'Андреевич', patientAge: 56, diagnosis: 'Ишемическая болезнь сердца', status: 'attention' },
  // Женская палата 102
  { id: 'B102_1', roomNumber: '102', bedNumber: 1, patientId: 'P002', patientName: 'Мария', patientLastName: 'Иванова', patientMiddleName: 'Александровна', patientAge: 33, diagnosis: 'Бронхиальная астма', status: 'attention' },
  { id: 'B102_2', roomNumber: '102', bedNumber: 2, patientId: 'P004', patientName: 'Екатерина', patientLastName: 'Орлова', patientMiddleName: 'Владимировна', patientAge: 37, diagnosis: 'Вегетососудистая дистония', status: 'stable' },
  { id: 'B102_3', roomNumber: '102', bedNumber: 3, patientId: 'P006', patientName: 'Светлана', patientLastName: 'Громова', patientMiddleName: 'Ильинична', patientAge: 30, diagnosis: 'Тонзиллит', status: 'stable' },
  // Мужская палата 103
  { id: 'B103_1', roomNumber: '103', bedNumber: 1, patientId: 'P007', patientName: 'Павел', patientLastName: 'Лебедев', patientMiddleName: 'Олегович', patientAge: 44, diagnosis: 'Поясничный остеохондроз', status: 'stable' },
  { id: 'B103_2', roomNumber: '103', bedNumber: 2, patientId: 'P009', patientName: 'Артем', patientLastName: 'Белов', patientMiddleName: 'Максимович', patientAge: 25, diagnosis: 'Гастродуоденит', status: 'stable' },
  { id: 'B103_3', roomNumber: '103', bedNumber: 3, patientId: 'P011', patientName: 'Георгий', patientLastName: 'Тимофеев', patientMiddleName: 'Сергеевич', patientAge: 68, diagnosis: 'ХОБЛ', status: 'attention' },
  // Мужская палата 201
  { id: 'B201_1', roomNumber: '201', bedNumber: 1, patientId: 'P013', patientName: 'Роман', patientLastName: 'Егоров', patientMiddleName: 'Валерьевич', patientAge: 35, diagnosis: 'Синусит', status: 'stable' },
  { id: 'B201_2', roomNumber: '201', bedNumber: 2, status: 'free' },
  // Женская палата 202
  { id: 'B202_1', roomNumber: '202', bedNumber: 1, patientId: 'P008', patientName: 'Людмила', patientLastName: 'Волкова', patientMiddleName: 'Семеновна', patientAge: 51, diagnosis: 'Хронический пиелонефрит', status: 'stable' },
  { id: 'B202_2', roomNumber: '202', bedNumber: 2, patientId: 'P010', patientName: 'Наталья', patientLastName: 'Зайцева', patientMiddleName: 'Анатольевна', patientAge: 42, diagnosis: 'Железодефицитная анемия', status: 'stable' },
  { id: 'B202_3', roomNumber: '202', bedNumber: 3, patientId: 'P012', patientName: 'Анастасия', patientLastName: 'Макарова', patientMiddleName: 'Денисовна', patientAge: 27, diagnosis: 'Мигрень', status: 'stable' }
]

export const patientDetails: Record<string, PatientDetail> = {
  P001: {
    doctorNote: 'Контроль АД каждые 2 часа. При подъёме выше 180/110 — вызов дежурного врача.',
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
    log: [{ who: 'Медсестра Орлова К.', action: 'Выдан Эналаприл 10мг', time: '08:05', amount: '1 табл.' }]
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
    log: [{ who: 'Медсестра Орлова К.', action: 'Ингаляция Сальбутамол 2.5мг', time: '08:10', amount: '1 амп.' }]
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
    log: [{ who: 'Медсестра Петрова И.', action: 'Инсулин Актрапид 8 ед п/к', time: '07:35', amount: '8 ед.' }]
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
    log: [{ who: 'Медсестра Петрова', action: 'Выдан Бисопролол', time: '08:05', amount: '1 табл.' }]
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
    log: [{ who: 'Медсестра Волкова', action: 'Ингаляция Беродуал', time: '08:20', amount: '20 капель' }]
  },
  P012: {
    doctorNote: 'Постельный режим при приступе.',
    prescriptions: [{ id: 1, name: 'Суматриптан', dose: '50 мг', time: 'по потребности', done: false }],
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

export const mockTreatments: Treatment[] = [
  { id: 'T001', name: 'Измерение АД', time: '08:00', status: 'completed' },
  { id: 'T002', name: 'Инъекция инсулина', time: '08:30', status: 'completed' },
  { id: 'T003', name: 'Прием метформина', time: '09:00', status: 'pending' },
  { id: 'T004', name: 'Измерение глюкозы', time: '12:00', status: 'pending' },
  { id: 'T005', name: 'Инъекция инсулина', time: '13:00', status: 'pending' }
]

export const mockFacilities: Facility[] = [
  {
    id: 'F001',
    name: 'Городская поликлиника №1',
    type: 'Поликлиника',
    city: 'Москва',
    departments: [
      { id: 'D001', name: 'Терапевтическое отделение', facilityId: 'F001' },
      { id: 'D002', name: 'Хирургическое отделение', facilityId: 'F001' },
      { id: 'D003', name: 'Педиатрическое отделение', facilityId: 'F001' }
    ]
  },
  {
    id: 'F002',
    name: 'Центральная городская больница',
    type: 'Больница',
    city: 'Москва',
    departments: [
      { id: 'D004', name: 'Кардиологическое отделение', facilityId: 'F002' },
      { id: 'D005', name: 'Неврологическое отделение', facilityId: 'F002' }
    ]
  }
]

export const mockStaff: Staff[] = [
  { id: 'S001', firstName: 'Анна', lastName: 'Кузнецова', position: 'Врач-терапевт', department: 'Пульмонология', login: 'a.kuznetsova', status: 'active' },
  { id: 'S002', firstName: 'Дмитрий', lastName: 'Волков', position: 'Врач-хирург', department: 'Пульмонология', login: 'd.volkov', status: 'active' },
  { id: 'S003', firstName: 'Елена', lastName: 'Соколова', position: 'Медсестра', department: 'Пульмонология', login: 'e.sokolova', status: 'active' },
  { id: 'S004', firstName: 'Сергей', lastName: 'Морозов', position: 'Врач-педиатр', department: 'Пульмонология', login: 's.morozov', status: 'inactive' }
]

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
    message: 'Приём начнётся через 1 час',
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
    message: 'Приём начнётся через 1 час',
    time: '16:00',
    read: false
  }
]

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id)
}

export function getPatientFullName(patient: Patient): string {
  return `${patient.lastName} ${patient.firstName} ${patient.middleName}`
}