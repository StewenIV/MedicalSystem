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

// Справочник палат
export const roomsConfig: Record<string, { gender: 'male' | 'female' | 'free' }> = {
  '101': { gender: 'male' },
  '102': { gender: 'female' },
  '103': { gender: 'male' },
  '201': { gender: 'male' },
  '202': { gender: 'female' }
}

// Mock hospital beds
export const mockHospitalBeds: HospitalBed[] = [
  {
    id: 'B001',
    roomNumber: '101',
    bedNumber: 1,
    patientId: 'P001',
    patientName: 'Иван',
    patientLastName: 'Петров',
    patientMiddleName: 'Сергеевич',
    patientAge: 40,
    diagnosis: 'Гипертонический криз',
    status: 'stable',
    doctorName: 'Д-р Петров П.',
    doctorRole: 'doctor',
    admissionDate: '12.05.2024',
    prescriptions: [
      { id: 'rx1', name: 'В/в антибиотик', time: '08:00', done: true },
      { id: 'rx2', name: 'Ингаляция', time: '10:00', done: false }
    ],
    medications: [
      { id: 'm1', name: 'Цефтриаксон', quantity: 8, unit: 'фл.' },
      { id: 'm2', name: 'Сальбутамол', quantity: 2, unit: 'фл.', low: true }
    ],
    actionLog: [
      {
        id: 'l1',
        performer: 'Медсестра Петрова О.',
        action: 'Ввела антибиотик',
        medication: 'Цефтриаксон 1г',
        quantity: '1 фл.',
        time: '08:14'
      }
    ]
  },
  {
    id: 'B002',
    roomNumber: '101',
    bedNumber: 2,
    patientId: 'P002',
    patientName: 'Мария',
    patientLastName: 'Иванова',
    patientMiddleName: 'Петровна',
    patientAge: 33,
    diagnosis: 'Обострение бронхиальной астмы',
    status: 'attention',
    doctorName: 'Д-р Сидоров М.',
    doctorRole: 'doctor',
    attentionNote:
      'Требуется частый контроль сатурации. Готовить к возможной ингаляции каждые 2 часа',
    admissionDate: '15.05.2024',
    prescriptions: [
      { id: 'rx3', name: 'Ингаляция', time: '08:00', done: true },
      { id: 'rx4', name: 'Измерение АД', time: '12:00', done: false }
    ],
    medications: [{ id: 'm3', name: 'Сальбутамол', quantity: 3, unit: 'фл.' }]
  },
  {
    id: 'B003',
    roomNumber: '102',
    bedNumber: 1,
    status: 'free'
  },
  {
    id: 'B004',
    roomNumber: '102',
    bedNumber: 2,
    patientId: 'P003',
    patientName: 'Алексей',
    patientLastName: 'Смирнов',
    patientMiddleName: 'Дмитриевич',
    patientAge: 47,
    diagnosis: 'Декомпенсация сахарного диабета',
    status: 'urgent',
    doctorName: 'Д-р Кузнецов В.',
    doctorRole: 'chief-doctor',
    attentionNote:
      'СРОЧНО: уровень глюкозы критически высокий. Требуется немедленный врачебный осмотр',
    admissionDate: '10.05.2024',
    prescriptions: [
      { id: 'rx5', name: 'Инъекция инсулина', time: '06:00', done: true },
      { id: 'rx6', name: 'Капельница NaCl', time: '08:00', done: false }
    ],
    medications: [
      { id: 'm4', name: 'Инсулин', quantity: 5, unit: 'ед.' },
      { id: 'm5', name: 'NaCl 400мл', quantity: 12, unit: 'шт.' }
    ]
  },
  {
    id: 'B005',
    roomNumber: '103',
    bedNumber: 1,
    status: 'free'
  },
  {
    id: 'B006',
    roomNumber: '103',
    bedNumber: 2,
    status: 'free'
  },
  {
    id: 'B201',
    roomNumber: '201',
    bedNumber: 1,
    patientId: 'P201',
    patientName: 'Сергей',
    patientLastName: 'Николаев',
    patientMiddleName: 'Алексеевич',
    patientAge: 52,
    diagnosis: 'Пневмония',
    status: 'stable',
    doctorName: 'Д-р Орлов Ю.',
    doctorRole: 'doctor',
    admissionDate: '08.05.2024',
    prescriptions: [
      { id: 'rx7', name: 'В/в антибиотик', time: '08:00', done: true },
      { id: 'rx8', name: 'Физиолечение', time: '15:00', done: false }
    ],
    medications: [{ id: 'm6', name: 'Цефтриаксон', quantity: 10, unit: 'фл.' }]
  },
  {
    id: 'B202',
    roomNumber: '201',
    bedNumber: 2,
    status: 'free'
  },
  {
    id: 'B203',
    roomNumber: '202',
    bedNumber: 1,
    patientId: 'P202',
    patientName: 'Виктория',
    patientLastName: 'Кузнецова',
    patientMiddleName: 'Игоревна',
    patientAge: 61,
    diagnosis: 'Восстановление после ИВЛ',
    status: 'attention',
    doctorName: 'Д-р Ершова С.',
    doctorRole: 'chief-doctor',
    attentionNote:
      'После интубации - тщательный мониторинг дыхания. Подготовка к снятию с кислорода',
    admissionDate: '01.05.2024',
    prescriptions: [
      { id: 'rx9', name: 'Мониторинг O2', time: '04:00', done: true },
      { id: 'rx10', name: 'Мониторинг O2', time: '08:00', done: true }
    ]
  },
  {
    id: 'B204',
    roomNumber: '202',
    bedNumber: 2,
    patientId: 'P203',
    patientName: 'Дмитрий',
    patientLastName: 'Козлов',
    patientMiddleName: 'Сергеевич',
    patientAge: 29,
    diagnosis: 'Острый бронхит',
    status: 'stable',
    doctorName: 'Д-р Морозов А.',
    doctorRole: 'doctor',
    admissionDate: '18.05.2024',
    prescriptions: [{ id: 'rx11', name: 'Ингаляция', time: '09:00', done: true }]
  }
]

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
