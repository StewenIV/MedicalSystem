import {
  PrimaryFormState,
  DailyRoundFormState,
  LabTestCheck,
  RoundPrescription,
} from './types'
import { Patient, formatVitalsForForm } from 'data/mockData'

// ─── Текущие дата/время (ISO формат для input type=date/time) ─────

const now = () => new Date()

/** ISO дата для input type="date": YYYY-MM-DD */
const todayISO = () => {
  const d = now()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Время для input type="time": HH:MM */
const timeISO = () => {
  const d = now()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ─── Стандартные чекбоксы анализов ───────────────────────────────

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

/** Разбить строку "120/80" на { sys, dia } */
const parseBP = (bp: string) => {
  const parts = (bp ?? '').split('/')
  return { sys: parts[0] ?? '', dia: parts[1] ?? '' }
}

// ─── Начальное состояние ПЕРВИЧНОГО осмотра ───────────────────────

export const getInitialPrimaryState = (
  patientId: string,
  patient?: Patient
): PrimaryFormState => {
  // Используем formatVitalsForForm вместо устаревшего patient.vitals
  const vitals = formatVitalsForForm(patientId)
  const bp = parseBP(vitals.bp)
  // Источник данных: medications (единый список) с fallback на currentMeds
  const meds = patient?.medications ?? patient?.currentMeds ?? []
  return {
    // Мета
    inspectionDate: todayISO(),
    inspectionTime: timeISO(),
    doctor: patient?.doctor ?? 'Лечащий врач',
    department: patient?.department ?? '',
    institution: patient?.institution ?? 'ГУ БЦГБ',
    inspectionType: 'primary',
    status: 'draft',

    // Жалобы
    complaints: [],
    complaintParams: {},
    complaintsNote: '',

    // Anamnesis morbi
    illnessStartDate: '',
    illnessCauses: [],
    preTreatment: [],
    preTreatmentDetails: '',
    preTreatmentEffect: null,
    hospitalizationReason: '',
    hospitalizationDate: todayISO(),

    // Anamnesis vitae — инфекции
    tbStatus: null,
    tbContact: null,
    hivStatus: null,
    hepatitisStatus: null,
    stdStatus: null,

    // Аллергии
    allergyStatus: 'none',
    allergies: [],

    // Операции
    operationsStatus: 'none',
    operations: [],

    // Сопутствующие
    comorbidities: patient?.medicalProblems?.map((mp, i) => ({
      id: `mp-${i}`,
      diagnosis: mp.name ?? '',
      activity: mp.diseaseStatus ?? 'Активное',
    })) ?? [],

    // Вредные привычки
    badHabitsStatus: 'none',
    smoking: false,
    smokingYears: '',
    alcohol: false,
    alcoholDetails: '',

    // Объективный статус
    generalCondition: null,
    consciousness: null,
    constitution: null,
    nutrition: null,

    // Кожа
    skinColor: null,
    skinTemp: null,
    skinMoisture: null,
    mucousState: null,
    cyanosis: false,
    acrocyanosis: false,
    edemaPresent: false,
    edemaLocation: '',
    lymphNodes: null,

    // Дыхание — из последних VitalSign через formatVitalsForForm
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

    // Сердце — разделённые поля АД из VitalSign
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

    // ЖКТ
    tongueState: null,
    abdomenState: null,
    abdomenPain: null,
    liverState: null,
    liverSize: '',
    spleenState: null,
    peritoneum: null,
    gktComment: '',

    // Мочевыделение
    kidneyPercussion: null,
    urination: null,
    stool: null,
    urologyComment: '',

    // Диагноз
    primaryDiagnosis: patient?.activeProblems?.[0] ?? '',
    complicationsDiagnosis: '',
    concomitantDiagnosis: '',

    // Назначения — из единого списка medications
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

    // Анализы
    labTests: DEFAULT_LAB_TESTS.map(t => ({ ...t })),

    // Итог
    generatedText: '',
  }
}

// ─── Начальное состояние ЕЖЕДНЕВНОГО осмотра ─────────────────────

export const getInitialDailyState = (
  patientId: string,
  patient?: Patient
): DailyRoundFormState => {
  // Используем formatVitalsForForm вместо устаревшего patient.vitals
  const vitals = formatVitalsForForm(patientId)
  const bp = parseBP(vitals.bp)
  // Источник данных: medications (единый список) с fallback на currentMeds
  const meds = patient?.medications ?? patient?.currentMeds ?? []
  return {
    // Мета
    inspectionDate: todayISO(),
    inspectionTime: timeISO(),
    doctor: patient?.doctor ?? 'Лечащий врач',
    status: 'draft',

    // Показатели (автоподтяжка из последних VitalSign)
    temperature: vitals.temp,
    hr: vitals.hr,
    bpSys: bp.sys,
    bpDia: bp.dia,
    rr: vitals.resp,
    spo2: vitals.spo2,

    // Жалобы
    complaints: [],
    complaintParams: {},
    complaintsNote: '',

    // Объективно
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

    // Динамика
    dynamics: null,
    dynamicsComment: '',

    // Лечение — из единого списка medications
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

    // План
    controlStudies: '',
    nextInspection: '',

    // Итог
    generatedText: '',
  }
}

// ─── Мок-процедуры (для ежедневного) ─────────────────────────────

export const MOCK_PROCEDURES = [
  { id: 'p1', date: '25.05.2026 08:00', name: 'Внутривенная инфузия', status: 'done' as const },
  { id: 'p2', date: '25.05.2026 12:00', name: 'Ингаляция', status: 'done' as const },
  { id: 'p3', date: '25.05.2026 18:00', name: 'Инъекция в/м', status: 'pending' as const },
]
