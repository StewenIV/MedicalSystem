import {
  PrimaryFormState,
  DailyRoundFormState,
  LabTestCheck,
  RoundPrescription,
} from './types'
import { Patient, formatVitalsForForm } from 'data/mockData'


const now = () => new Date()

const todayISO = () => {
  const d = now()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const timeISO = () => {
  const d = now()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}


export const DEFAULT_LAB_TESTS: LabTestCheck[] = [
  { id: 'oac', name: 'ОАК', category: 'lab', checked: false },
  { id: 'oam', name: 'ОАМ', category: 'lab', checked: false },
  { id: 'biochem', name: 'Биохимия крови', category: 'lab', checked: false },
  { id: 'coag', name: 'Коагулограмма', category: 'lab', checked: false },
  { id: 'sputum', name: 'Мокрота', category: 'lab', checked: false },
  { id: 'ecg', name: 'ЭКГ', category: 'instrumental', checked: false },
  { id: 'fg', name: 'ФГ ОГК', category: 'instrumental', checked: false },
  { id: 'ct', name: 'КТ ОГК', category: 'instrumental', checked: false },
  { id: 'mri', name: 'МРТ', category: 'instrumental', checked: false },
  { id: 'echo', name: 'ЭхоКГ', category: 'instrumental', checked: false },
  { id: 'broncho', name: 'Бронхоскопия', category: 'instrumental', checked: false },
]

const parseBP = (bp: string) => {
  const parts = (bp ?? '').split('/')
  return { sys: parts[0] ?? '', dia: parts[1] ?? '' }
}


export const getInitialPrimaryState = (
  patientId: string,
  patient?: Patient
): PrimaryFormState => {
  const vitals = formatVitalsForForm(patientId)
  const bp = parseBP(vitals.bp)
  const meds = patient?.medications ?? patient?.currentMeds ?? []
  return {
    inspectionDate: todayISO(),
    inspectionTime: timeISO(),
    doctor: patient?.doctor ?? 'Лечащий врач',
    department: patient?.department ?? '',
    institution: patient?.institution ?? 'ГУ БЦГБ',
    inspectionType: 'primary',
    status: 'draft',

    complaints: [],
    complaintParams: {},
    complaintsNote: '',

    illnessStartDate: '',
    illnessCauses: [],
    preTreatment: [],
    preTreatmentDetails: '',
    preTreatmentEffect: null,
    hospitalizationReason: '',
    hospitalizationDate: todayISO(),

    tbStatus: null,
    tbContact: null,
    hivStatus: null,
    hepatitisStatus: null,
    stdStatus: null,

    allergyStatus: 'none',
    allergies: [],

    operationsStatus: 'none',
    operations: [],

    comorbidities: patient?.medicalProblems?.map((mp, i) => ({
      id: `mp-${i}`,
      diagnosis: mp.name ?? '',
      activity: mp.diseaseStatus ?? 'Активное',
    })) ?? [],

    badHabitsStatus: 'none',
    smoking: false,
    smokingYears: '',
    alcohol: false,
    alcoholDetails: '',

    generalCondition: null,
    consciousness: null,
    constitution: null,
    nutrition: null,

    skinColor: null,
    skinTemp: null,
    skinMoisture: null,
    mucousState: null,
    cyanosis: false,
    acrocyanosis: false,
    edemaPresent: false,
    edemaLocation: '',
    lymphNodes: null,

    breathingNose: null,
    rr: vitals.resp,
    spo2: vitals.spo2,
    chestForm: null,
    chestSymmetry: null,
    percussionSound: null,
    breathingType: null,
    ralesType: null,
    ralesLocation: '',
    respiratoryComment: '',

    hr: vitals.hr,
    pulse: '',
    bpRightSys: bp.sys,
    bpRightDia: bp.dia,
    bpLeftSys: '',
    bpLeftDia: '',
    heartRhythm: null,
    heartTones: null,
    heartMurmurs: null,
    cardiovascularComment: '',

    tongueState: null,
    abdomenState: null,
    abdomenPain: null,
    liverState: null,
    liverSize: '',
    spleenState: null,
    peritoneum: null,
    gktComment: '',

    kidneyPercussion: null,
    urination: null,
    stool: null,
    urologyComment: '',

    primaryDiagnosis: patient?.activeProblems?.[0] ?? '',
    complicationsDiagnosis: '',
    concomitantDiagnosis: '',

    prescriptions: meds.map((m, i) => ({
      id: `med-${i}`,
      drug: m.name ?? '',
      dose: m.dose ?? '',
      unit: 'мг',
      route: m.route ?? 'перорально',
      frequency: m.regimen ?? '',
      form: m.form ?? '',
      regimen: m.regimen ?? '',
      comment: m.comment ?? '',
      action: 'keep' as const,
    })) ?? [],

    labTests: DEFAULT_LAB_TESTS.map(t => ({ ...t })),

    generatedText: '',
  }
}


export const getInitialDailyState = (
  patientId: string,
  patient?: Patient
): DailyRoundFormState => {
  const vitals = formatVitalsForForm(patientId)
  const bp = parseBP(vitals.bp)
  const meds = patient?.medications ?? patient?.currentMeds ?? []
  return {
    inspectionDate: todayISO(),
    inspectionTime: timeISO(),
    doctor: patient?.doctor ?? 'Лечащий врач',
    status: 'draft',

    temperature: vitals.temp,
    hr: vitals.hr,
    bpSys: bp.sys,
    bpDia: bp.dia,
    rr: vitals.resp,
    spo2: vitals.spo2,

    complaints: [],
    complaintParams: {},
    complaintsNote: '',

    generalCondition: null,
    skinColor: null,
    skinTemp: null,
    skinMoisture: null,
    chestForm: null,
    chestSymmetry: null,
    breathingType: null,
    ralesType: null,
    respiratoryNote: '',
    heartRhythm: null,
    heartTones: null,
    heartNote: '',
    tongueState: null,
    abdomenState: null,
    abdomenNote: '',
    stool: null,
    urination: null,

    dynamics: null,
    dynamicsComment: '',

    treatmentDecision: 'keep',
    prescriptions: meds.map((m, i) => ({
      id: `med-${i}`,
      drug: m.name ?? '',
      dose: m.dose ?? '',
      unit: 'мг',
      route: m.route ?? 'перорально',
      frequency: m.regimen ?? '',
      form: m.form ?? '',
      regimen: m.regimen ?? '',
      comment: m.comment ?? '',
      action: 'keep' as const,
    })) ?? [],

    controlStudies: '',
    nextInspection: '',

    generatedText: '',
  }
}


export const MOCK_PROCEDURES = [
  { id: 'p1', date: '25.05.2026 08:00', name: 'Внутривенная инфузия', status: 'done' as const },
  { id: 'p2', date: '25.05.2026 12:00', name: 'Ингаляция', status: 'done' as const },
  { id: 'p3', date: '25.05.2026 18:00', name: 'Инъекция в/м', status: 'pending' as const },
]
