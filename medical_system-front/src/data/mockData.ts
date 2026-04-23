export interface Patient {
  id: string
  firstName: string
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
  allergies: string[]
  diagnoses: string[]
  activeAppointments: Appointment[]
  vitalSigns: VitalSign[]
  prescriptions: Prescription[]
  documents: Document[]
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
  status: 'free' | 'stable' | 'attention' | 'urgent'
}

export interface PatientDetail {
  doctorNote: string
  prescriptions: { id: number; name: string; dose: string; time: string; done: boolean }[]
  meds: { name: string; qty: string }[]
  log: { who: string; action: string; time: string; amount: string }[]
}


// Mock patients
export const mockPatients: Patient[] = [
  {
    id: 'P001',
    firstName: 'Иван',
    lastName: 'Петров',
    middleName: 'Сергеевич',
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
    allergies: ['Пенициллин', 'Арахис'],
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
      },
      {
        id: 'VS002',
        date: '2026-01-12',
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 82,
        temperature: 36.7,
        pulse: 75,
        spo2: 99,
        respiratoryRate: 18
      }
    ],
    prescriptions: [
      {
        id: 'PR001',
        medication: 'Эналаприл',
        dosage: '10 мг',
        frequency: '1 раз в день',
        startDate: '2026-01-01',
        endDate: '2026-03-01',
        status: 'active'
      }
    ],
    documents: [
      {
        id: 'DOC001',
        title: 'Информированное согласие',
        type: 'Согласие',
        date: '2026-01-15',
        url: '#'
      }
    ]
  },
  {
    id: 'P002',
    firstName: 'Мария',
    lastName: 'Иванова',
    middleName: 'Александровна',
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
        medication: 'Сальбутамол',
        dosage: '100 мкг',
        frequency: 'По необходимости',
        startDate: '2025-12-01',
        endDate: '2026-06-01',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P003',
    firstName: 'Алексей',
    lastName: 'Смирнов',
    middleName: 'Дмитриевич',
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
    allergies: ['Йод'],
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
        medication: 'Метформин',
        dosage: '850 мг',
        frequency: '2 раза в день',
        startDate: '2025-11-01',
        endDate: '2026-05-01',
        status: 'active'
      }
    ],
    documents: []
  }
]

// Mock appointments for today
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
  '202': { gender: 'female' },
}

export const mockHospitalBeds: HospitalBed[] = [
  { id: 'B001', roomNumber: '101', bedNumber: 1, patientId: 'P001', patientName: 'Иван', patientLastName: 'Петров', patientMiddleName: 'Сергеевич', patientAge: 40, diagnosis: 'Гипертонический криз', status: 'stable' },
  { id: 'B002', roomNumber: '101', bedNumber: 2, patientId: 'P002', patientName: 'Мария', patientLastName: 'Иванова', patientMiddleName: 'Петровна', patientAge: 33, diagnosis: 'Обострение бронхиальной астмы', status: 'attention' },
  { id: 'B003', roomNumber: '102', bedNumber: 1, status: 'free' },
  { id: 'B004', roomNumber: '102', bedNumber: 2, patientId: 'P003', patientName: 'Алексей', patientLastName: 'Смирнов', patientMiddleName: 'Дмитриевич', patientAge: 47, diagnosis: 'Декомпенсация сахарного диабета', status: 'urgent' },
  { id: 'B005', roomNumber: '103', bedNumber: 1, status: 'free' },
  { id: 'B006', roomNumber: '103', bedNumber: 2, status: 'free' },
  { id: 'B201', roomNumber: '201', bedNumber: 1, patientId: 'P201', patientName: 'Сергей', patientLastName: 'Николаев', patientMiddleName: 'Алексеевич', patientAge: 52, diagnosis: 'Пневмония', status: 'stable' },
  { id: 'B202', roomNumber: '201', bedNumber: 2, status: 'free' },
  { id: 'B203', roomNumber: '202', bedNumber: 1, patientId: 'P202', patientName: 'Виктория', patientLastName: 'Кузнецова', patientMiddleName: 'Игоревна', patientAge: 61, diagnosis: 'Восстановление после ИВЛ', status: 'attention' },
  { id: 'B204', roomNumber: '202', bedNumber: 2, patientId: 'P203', patientName: 'Дмитрий', patientLastName: 'Козлов', patientMiddleName: '', patientAge: 29, diagnosis: 'Острый бронхит', status: 'stable' },
]

export const patientDetails: Record<string, PatientDetail> = {
  P001: {
    doctorNote: 'Контроль АД каждые 2 часа. При подъёме выше 180/110 — вызов дежурного врача.',
    prescriptions: [
      { id: 1, name: 'Эналаприл', dose: '10мг', time: '08:00', done: true },
      { id: 2, name: 'Амлодипин', dose: '5мг', time: '12:00', done: false },
      { id: 3, name: 'Каптоприл (экстренно)', dose: '25мг', time: '18:00', done: false },
    ],
    meds: [{ name: 'Эналаприл', qty: '14 табл.' }, { name: 'Амлодипин', qty: '28 табл.' }, { name: 'Каптоприл', qty: '10 табл.' }],
    log: [{ who: 'Медсестра Орлова К.', action: 'Выдан Эналаприл 10мг', time: '08:05', amount: '1 табл.' }],
  },
  P002: {
    doctorNote: 'Контроль сатурации каждый час. При SpO₂ < 92% — O₂ через маску, вызов врача.',
    prescriptions: [
      { id: 1, name: 'Сальбутамол (ингаляция)', dose: '2.5мг', time: '08:00', done: true },
      { id: 2, name: 'Преднизолон в/в', dose: '60мг', time: '10:00', done: true },
      { id: 3, name: 'Сальбутамол (ингаляция)', dose: '2.5мг', time: '14:00', done: false },
    ],
    meds: [{ name: 'Сальбутамол', qty: '3 амп.' }, { name: 'Преднизолон', qty: '5 амп.' }, { name: 'Беродуал', qty: '1 фл.' }],
    log: [{ who: 'Медсестра Орлова К.', action: 'Ингаляция Сальбутамол 2.5мг', time: '08:10', amount: '1 амп.' }],
  },
  P003: {
    doctorNote: 'Инсулинотерапия строго по графику! Контроль гликемии перед каждым введением.',
    prescriptions: [
      { id: 1, name: 'Инсулин Актрапид', dose: '8 ед', time: '07:30', done: true },
      { id: 2, name: 'NaCl 0.9% капельница', dose: '500мл', time: '09:00', done: false },
      { id: 3, name: 'Инсулин Актрапид', dose: '10 ед', time: '13:30', done: false },
    ],
    meds: [{ name: 'Инсулин Актрапид', qty: '2 фл.' }, { name: 'NaCl 0.9%', qty: '4 фл.' }, { name: 'KCl 4%', qty: '3 амп.' }],
    log: [{ who: 'Медсестра Петрова И.', action: 'Инсулин Актрапид 8 ед п/к', time: '07:35', amount: '8 ед.' }],
  },
  P201: {
    doctorNote: 'Антибиотикотерапия — строго по времени. Контроль температуры 2 раза в день.',
    prescriptions: [
      { id: 1, name: 'Цефтриаксон в/в', dose: '2г', time: '08:00', done: true },
      { id: 2, name: 'Амброксол', dose: '30мг', time: '10:00', done: false },
      { id: 3, name: 'Цефтриаксон в/в', dose: '2г', time: '20:00', done: false },
    ],
    meds: [{ name: 'Цефтриаксон', qty: '5 фл.' }, { name: 'Амброксол', qty: '10 табл.' }, { name: 'NaCl 0.9%', qty: '6 фл.' }],
    log: [{ who: 'Медсестра Сидорова В.', action: 'В/в Цефтриаксон 2г (капельница)', time: '08:15', amount: '1 фл.' }],
  },
  P202: {
    doctorNote: 'Пациент после ИВЛ. Бережная санация ротоглотки. Ранняя активизация под контролем.',
    prescriptions: [
      { id: 1, name: 'Гепарин (профилактика)', dose: '5000 ед', time: '09:00', done: false },
      { id: 2, name: 'Омепразол в/в', dose: '40мг', time: '09:00', done: false },
      { id: 3, name: 'Дыхательная гимнастика', dose: '15 мин', time: '11:00', done: false },
    ],
    meds: [{ name: 'Гепарин', qty: '4 амп.' }, { name: 'Омепразол', qty: '5 фл.' }, { name: 'NaCl 0.9%', qty: '3 фл.' }],
    log: [{ who: 'Медсестра Михайлова Т.', action: 'Санация ротоглотки', time: '07:50', amount: '—' }],
  },
  P203: {
    doctorNote: 'Стандартное наблюдение. Обильное питьё. При ухудшении — повторный осмотр.',
    prescriptions: [
      { id: 1, name: 'Амоксициллин', dose: '500мг', time: '08:00', done: true },
      { id: 2, name: 'Бромгексин', dose: '8мг', time: '08:00', done: true },
      { id: 3, name: 'Амоксициллин', dose: '500мг', time: '14:00', done: false },
    ],
    meds: [{ name: 'Амоксициллин', qty: '14 капс.' }, { name: 'Бромгексин', qty: '20 табл.' }],
    log: [{ who: 'Медсестра Орлова К.', action: 'Выдан Амоксициллин + Бромгексин', time: '08:20', amount: '2 табл.' }],
  },
}

// Mock treatments
export const mockTreatments: Treatment[] = [
  { id: 'T001', name: 'Измерение АД', time: '08:00', status: 'completed' },
  { id: 'T002', name: 'Инъекция инсулина', time: '08:30', status: 'completed' },
  { id: 'T003', name: 'Прием метформина', time: '09:00', status: 'pending' },
  { id: 'T004', name: 'Измерение глюкозы', time: '12:00', status: 'pending' },
  { id: 'T005', name: 'Инъекция инсулина', time: '13:00', status: 'pending' }
]

// Mock facilities
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

// Mock staff
export const mockStaff: Staff[] = [
  {
    id: 'S001',
    firstName: 'Анна',
    lastName: 'Кузнецова',
    position: 'Врач-терапевт',
    department: 'Терапевтическое отделение',
    login: 'a.kuznetsova',
    status: 'active'
  },
  {
    id: 'S002',
    firstName: 'Дмитрий',
    lastName: 'Волков',
    position: 'Врач-хирург',
    department: 'Хирургическое отделение',
    login: 'd.volkov',
    status: 'active'
  },
  {
    id: 'S003',
    firstName: 'Елена',
    lastName: 'Соколова',
    position: 'Медсестра',
    department: 'Терапевтическое отделение',
    login: 'e.sokolova',
    status: 'active'
  },
  {
    id: 'S004',
    firstName: 'Сергей',
    lastName: 'Морозов',
    position: 'Врач-педиатр',
    department: 'Педиатрическое отделение',
    login: 's.morozov',
    status: 'inactive'
  }
]

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id)
}

export function getPatientFullName(patient: Patient): string {
  return `${patient.lastName} ${patient.firstName} ${patient.middleName}`
}
