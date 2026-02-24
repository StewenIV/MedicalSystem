
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
  status: 'waiting' | 'in-progress' | 'completed' | 'free'
  type: 'primary' | 'followup' | 'preventive'
}

export interface VitalSign {
  id: string
  date: string
  bloodPressure: string
  temperature: number
  pulse: number
  spo2: number
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
  patientAge?: number
  diagnosis?: string
  status: 'stable' | 'attention' | 'urgent' | 'free'
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
        bloodPressure: '135/85',
        temperature: 36.6,
        pulse: 78,
        spo2: 98
      },
      {
        id: 'VS002',
        date: '2026-01-12',
        bloodPressure: '130/82',
        temperature: 36.7,
        pulse: 75,
        spo2: 99
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
        bloodPressure: '120/75',
        temperature: 36.5,
        pulse: 72,
        spo2: 97
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
        bloodPressure: '140/90',
        temperature: 36.8,
        pulse: 82,
        spo2: 96
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
    status: 'completed',
    type: 'followup'
  },
  {
    id: 'A002',
    patientId: 'P002',
    patientName: 'Иванова Мария Александровна',
    time: '09:30',
    reason: 'Консультация по результатам анализов',
    status: 'in-progress',
    type: 'followup'
  },
  {
    id: 'A003',
    patientId: '',
    patientName: '',
    time: '10:00',
    reason: '',
    status: 'free',
    type: 'primary'
  },
  {
    id: 'A004',
    patientId: 'P003',
    patientName: 'Смирнов Алексей Дмитриевич',
    time: '10:30',
    reason: 'Первичный прием',
    status: 'waiting',
    type: 'primary'
  },
  {
    id: 'A005',
    patientId: '',
    patientName: '',
    time: '11:00',
    reason: '',
    status: 'free',
    type: 'primary'
  },
  {
    id: 'A006',
    patientId: '',
    patientName: '',
    time: '11:30',
    reason: '',
    status: 'free',
    type: 'primary'
  },
  {
    id: 'A007',
    patientId: '',
    patientName: '',
    time: '12:00',
    reason: '',
    status: 'free',
    type: 'primary'
  },
  {
    id: 'A008',
    patientId: '',
    patientName: '',
    time: '12:30',
    reason: '',
    status: 'free',
    type: 'primary'
  }
]

// Mock hospital beds
export const mockHospitalBeds: HospitalBed[] = [
  {
    id: 'B001',
    roomNumber: '101',
    bedNumber: 1,
    patientId: 'P001',
    patientName: 'И. Петров',
    patientAge: 40,
    diagnosis: 'Гипертонический криз',
    status: 'stable'
  },
  {
    id: 'B002',
    roomNumber: '101',
    bedNumber: 2,
    patientId: 'P002',
    patientName: 'М. Иванова',
    patientAge: 33,
    diagnosis: 'Обострение бронхиальной астмы',
    status: 'attention'
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
    patientName: 'А. Смирнов',
    patientAge: 47,
    diagnosis: 'Декомпенсация сахарного диабета',
    status: 'urgent'
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
