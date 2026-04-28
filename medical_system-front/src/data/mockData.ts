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
  },
  {
    id: 'P004',
    firstName: 'Екатерина',
    lastName: 'Орлова',
    middleName: 'Владимировна',
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
    allergies: ['Ибупрофен'],
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
        medication: 'Магне B6',
        dosage: '2 таб',
        frequency: '2 раза в день',
        startDate: '2026-01-10',
        endDate: '2026-02-10',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P005',
    firstName: 'Николай',
    lastName: 'Федоров',
    middleName: 'Андреевич',
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
        medication: 'Бисопролол',
        dosage: '5 мг',
        frequency: '1 раз в день',
        startDate: '2026-01-05',
        endDate: '2026-03-05',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P006',
    firstName: 'Светлана',
    lastName: 'Громова',
    middleName: 'Ильинична',
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
    allergies: ['Пыльца'],
    diagnoses: ['Тонзиллит'],
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
        medication: 'Мирамистин',
        dosage: '3 орошения',
        frequency: '3 раза в день',
        startDate: '2026-01-12',
        endDate: '2026-01-22',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P007',
    firstName: 'Павел',
    lastName: 'Лебедев',
    middleName: 'Олегович',
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
    allergies: ['Латекс'],
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
        medication: 'Мидокалм',
        dosage: '150 мг',
        frequency: '2 раза в день',
        startDate: '2026-01-15',
        endDate: '2026-02-15',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P008',
    firstName: 'Людмила',
    lastName: 'Волкова',
    middleName: 'Семеновна',
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
        medication: 'Канефрон',
        dosage: '2 драже',
        frequency: '3 раза в день',
        startDate: '2026-01-08',
        endDate: '2026-02-08',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P009',
    firstName: 'Артем',
    lastName: 'Белов',
    middleName: 'Максимович',
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
    allergies: ['Цитрусы'],
    diagnoses: ['Гастродуоденит'],
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
        medication: 'Омез',
        dosage: '20 мг',
        frequency: '1 раз в день',
        startDate: '2026-01-14',
        endDate: '2026-02-14',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P010',
    firstName: 'Наталья',
    lastName: 'Зайцева',
    middleName: 'Анатольевна',
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
    allergies: ['Мед'],
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
        medication: 'Сорбифер',
        dosage: '1 таб',
        frequency: '2 раза в день',
        startDate: '2026-01-11',
        endDate: '2026-03-11',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P011',
    firstName: 'Георгий',
    lastName: 'Тимофеев',
    middleName: 'Сергеевич',
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
    allergies: ['Новокаин'],
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
        medication: 'Беродуал',
        dosage: '20 капель',
        frequency: '2 раза в день',
        startDate: '2026-01-09',
        endDate: '2026-02-09',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P012',
    firstName: 'Анастасия',
    lastName: 'Макарова',
    middleName: 'Денисовна',
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
    diagnoses: ['Мигрень'],
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
        medication: 'Суматриптан',
        dosage: '50 мг',
        frequency: 'при приступе',
        startDate: '2026-01-16',
        endDate: '2026-04-16',
        status: 'active'
      }
    ],
    documents: []
  },
  {
    id: 'P013',
    firstName: 'Роман',
    lastName: 'Егоров',
    middleName: 'Валерьевич',
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
    allergies: ['Анальгин'],
    diagnoses: ['Синусит'],
    activeAppointments: [],
    vitalSigns: [
      {
        id: 'VS019',
        date: '2026-01-19',
        bloodPressureSystolic: 119,
        bloodPressureDiastolic: 77,
        temperature: 37,
        pulse: 75,
        spo2: 98,
        respiratoryRate: 16
      }
    ],
    prescriptions: [
      {
        id: 'PR013',
        medication: 'Синупрет',
        dosage: '2 таб',
        frequency: '3 раза в день',
        startDate: '2026-01-13',
        endDate: '2026-01-23',
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
  { id: 'B202_3', roomNumber: '202', bedNumber: 3, patientId: 'P012', patientName: 'Анастасия', patientLastName: 'Макарова', patientMiddleName: 'Денисовна', patientAge: 27, diagnosis: 'Мигрень', status: 'stable' },
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
  P004: {
    doctorNote: 'Регулярное наблюдение за АД.',
    prescriptions: [{ id: 1, name: 'Магне B6', dose: '2 таб', time: '09:00', done: true }],
    meds: [{ name: 'Магне B6', qty: '20 табл.' }],
    log: [{ who: 'Медсестра Иванова', action: 'Выдан Магне B6', time: '09:10', amount: '2 табл.' }],
  },
  P005: {
    doctorNote: 'Контроль пульса 3 раза в день.',
    prescriptions: [{ id: 1, name: 'Бисопролол', dose: '5 мг', time: '08:00', done: true }],
    meds: [{ name: 'Бисопролол', qty: '10 табл.' }],
    log: [{ who: 'Медсестра Петрова', action: 'Выдан Бисопролол', time: '08:05', amount: '1 табл.' }],
  },
  P006: {
    doctorNote: 'Полоскание горла каждые 4 часа.',
    prescriptions: [{ id: 1, name: 'Мирамистин', dose: '3 орошения', time: '10:00', done: false }],
    meds: [{ name: 'Мирамистин', qty: '1 фл.' }],
    log: [{ who: 'Медсестра Сидорова', action: 'Орошение горла', time: '10:15', amount: '—' }],
  },
  P007: {
    doctorNote: 'Ограничение физических нагрузок. ЛФК.',
    prescriptions: [{ id: 1, name: 'Мидокалм', dose: '150 мг', time: '12:00', done: false }],
    meds: [{ name: 'Мидокалм', qty: '15 табл.' }],
    log: [{ who: 'Медсестра Волкова', action: 'Выдан Мидокалм', time: '12:05', amount: '1 табл.' }],
  },
  P008: {
    doctorNote: 'Обильное питье. УЗИ почек завтра.',
    prescriptions: [{ id: 1, name: 'Канефрон', dose: '2 драже', time: '08:00', done: true }],
    meds: [{ name: 'Канефрон', qty: '40 драже' }],
    log: [{ who: 'Медсестра Иванова', action: 'Выдан Канефрон', time: '08:15', amount: '2 драже' }],
  },
  P009: {
    doctorNote: 'Диета стол №1. Контроль боли.',
    prescriptions: [{ id: 1, name: 'Омез', dose: '20 мг', time: '07:30', done: true }],
    meds: [{ name: 'Омез', qty: '14 капс.' }],
    log: [{ who: 'Медсестра Петрова', action: 'Выдан Омез', time: '07:35', amount: '1 капс.' }],
  },
  P010: {
    doctorNote: 'Контроль гемоглобина крови.',
    prescriptions: [{ id: 1, name: 'Сорбифер', dose: '1 таб', time: '09:00', done: false }],
    meds: [{ name: 'Сорбифер', qty: '30 табл.' }],
    log: [{ who: 'Медсестра Сидорова', action: 'Выдан Сорбифер', time: '09:10', amount: '1 табл.' }],
  },
  P011: {
    doctorNote: 'Сатурация каждые 4 часа. Ингаляции.',
    prescriptions: [{ id: 1, name: 'Беродуал', dose: '20 капель', time: '08:00', done: true }],
    meds: [{ name: 'Беродуал', qty: '1 фл.' }],
    log: [{ who: 'Медсестра Волкова', action: 'Ингаляция Беродуал', time: '08:20', amount: '20 капель' }],
  },
  P012: {
    doctorNote: 'Постельный режим при приступе.',
    prescriptions: [{ id: 1, name: 'Суматриптан', dose: '50 мг', time: 'по потребности', done: false }],
    meds: [{ name: 'Суматриптан', qty: '2 табл.' }],
    log: [{ who: 'Врач', action: 'Осмотр', time: '10:00', amount: '—' }],
  },
  P013: {
    doctorNote: 'Промывание носа. Рентген пазух.',
    prescriptions: [{ id: 1, name: 'Синупрет', dose: '2 таб', time: '08:00', done: true }],
    meds: [{ name: 'Синупрет', qty: '20 табл.' }],
    log: [{ who: 'Медсестра Иванова', action: 'Выдан Синупрет', time: '08:10', amount: '2 табл.' }],
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
