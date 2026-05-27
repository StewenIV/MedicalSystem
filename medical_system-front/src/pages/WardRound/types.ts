// ═══════════════════════════════════════════════════════════════════
// ОБЩИЕ ТИПЫ
// ═══════════════════════════════════════════════════════════════════

export type InspectionType = 'primary' | 'repeated' | 'daily'

// ─── Жалобы (расширенные) ─────────────────────────────────────────

export type ComplaintKey =
  | 'none'
  | 'weakness'
  | 'cough_dry'
  | 'cough_productive'
  | 'dyspnea_exertion'
  | 'dyspnea_rest'
  | 'fever'
  | 'chest_pain'
  | 'sweating'
  | 'dizziness'
  | 'nausea'
  | 'other'

export const COMPLAINT_LABELS: Record<ComplaintKey, string> = {
  none: 'Нет жалоб',
  weakness: 'Общая слабость',
  cough_dry: 'Малопродуктивный кашель',
  cough_productive: 'Продуктивный кашель',
  dyspnea_exertion: 'Одышка при физической нагрузке',
  dyspnea_rest: 'Одышка в покое',
  fever: 'Повышение температуры',
  chest_pain: 'Боль в грудной клетке',
  sweating: 'Потливость',
  dizziness: 'Головокружение',
  nausea: 'Тошнота',
  other: 'Другое',
}

// Дополнительные параметры жалоб
export interface ComplaintParams {
  fever?: { maxTemp: string }
  dyspnea_exertion?: { severity: 'mild' | 'moderate' | 'severe' }
  dyspnea_rest?: { severity: 'mild' | 'moderate' | 'severe' }
  cough_dry?: { duration: string }
  cough_productive?: { sputumColor: string; sputumAmount: string }
  chest_pain?: { character: string; location: string }
}

// ─── Объективный статус ───────────────────────────────────────────

export type GeneralCondition = 'satisfactory' | 'moderate' | 'severe' | 'critical'
export type Consciousness = 'clear' | 'drowsy' | 'confused' | 'absent'
export type Constitution = 'normosthenic' | 'hypersthenic' | 'asthenic'
export type Nutrition = 'satisfactory' | 'elevated' | 'reduced'

export type SkinColor = 'pale_pink' | 'pale' | 'hyperemia' | 'cyanosis' | 'icteric'
export type SkinTemp = 'warm' | 'cold' | 'hot'
export type SkinMoisture = 'dry' | 'moist' | 'excessive'
export type MucousState = 'moist' | 'dry'

export type ChestForm =
  | 'normosthenic'
  | 'hypersthenic'
  | 'asthenic'
  | 'rachitic'
  | 'emphysematous'
  | 'funnel'
  | 'keel'
export type ChestSymmetry = 'symmetric' | 'asymmetric'
export type BreathingNose = 'free' | 'difficult'
export type BreathingType = 'vesicular' | 'harsh' | 'weakened' | 'bronchial'
export type RalesType = 'none' | 'dry' | 'moist' | 'crepitation'
export type PercussionSound = 'clear' | 'dull' | 'tympanic' | 'shortened'

export type HeartActivity = 'rhythmic' | 'arrhythmia'
export type HeartRhythm = 'regular' | 'irregular'
export type HeartTones = 'clear' | 'muffled' | 'deaf'
export type HeartMurmurs = 'absent' | 'systolic' | 'diastolic'

export type TongueState = 'moist_clean' | 'moist_coated' | 'dry_clean' | 'dry_coated'
export type AbdomenState = 'soft' | 'tense' | 'bloated'
export type AbdomenPain = 'painless' | 'painful' | 'local'
export type LiverState = 'not_protruding' | 'protruding_1' | 'protruding_2' | 'protruding_3'
export type SpleenState = 'not_palpable' | 'enlarged'
export type PeritoneumState = 'irritation_absent' | 'irritation_present'

export type KidneyPercussion = 'painless' | 'painful_left' | 'painful_right' | 'painful_both'
export type StoolState = 'normal' | 'constipation' | 'diarrhea' | 'absent'
export type UrinationState = 'free_painless' | 'difficult' | 'painful' | 'frequent'

export type DynamicsState = 'improvement' | 'no_change' | 'deterioration'

// ─── Назначение (для первичного осмотра) ─────────────────────────

export type PrescriptionAction = 'keep' | 'adjust' | 'cancel' | 'new'

export interface RoundPrescription {
  id: string
  drug: string
  dose: string
  unit: string     // мг, мл, ЕД, г
  route: string    // в/в, в/м, перорально и т.д.
  frequency: string // 1р/д, 2р/д и т.д.
  form: string
  regimen: string
  comment?: string
  action: PrescriptionAction
  adjustedDose?: string
  adjustedRegimen?: string
}

// ─── Лабораторный тест ────────────────────────────────────────────

export interface LabTestCheck {
  id: string
  name: string
  category: 'lab' | 'instrumental'
  checked: boolean
}

// ─── Процедура ────────────────────────────────────────────────────

export type ProcedureStatus = 'done' | 'pending' | 'cancelled'

export interface Procedure {
  id: string
  date: string
  name: string
  status: ProcedureStatus
}

// ═══════════════════════════════════════════════════════════════════
// ПЕРВИЧНЫЙ ОСМОТР — полное состояние формы
// ═══════════════════════════════════════════════════════════════════

export interface PrimaryFormState {
  // Мета
  inspectionDate: string
  inspectionTime: string
  doctor: string
  department: string
  institution: string
  inspectionType: 'primary' | 'repeated'
  status: 'draft' | 'completed'

  // Блок 2 — Жалобы
  complaints: ComplaintKey[]
  complaintParams: ComplaintParams
  complaintsNote: string

  // Блок 3 — Anamnesis morbi
  illnessStartDate: string
  illnessCauses: ('cold' | 'infection' | 'contact' | 'unknown')[]
  preTreatment: ('outpatient' | 'inpatient')[]
  preTreatmentDetails: string
  preTreatmentEffect: 'improvement' | 'no_change' | 'deterioration' | null
  hospitalizationReason: string
  hospitalizationDate: string

  // Блок 4 — Anamnesis vitae
  // Инфекционный анамнез
  tbStatus: 'denies' | 'confirms' | null
  tbContact: 'yes' | 'no' | null
  hivStatus: 'negative' | 'positive' | null
  hepatitisStatus: 'negative' | 'positive' | null
  stdStatus: 'denies' | 'has' | null

  // Аллергии
  allergyStatus: 'none' | 'has'
  allergies: { id: string; name: string; reaction: string }[]

  // Операции
  operationsStatus: 'none' | 'has'
  operations: { id: string; date: string; name: string; comment: string }[]

  // Сопутствующие заболевания
  comorbidities: { id: string; diagnosis: string; activity: string }[]

  // Вредные привычки
  badHabitsStatus: 'none' | 'has'
  smoking: boolean
  smokingYears: string
  alcohol: boolean
  alcoholDetails: string


  // Блок 5 — Объективный статус
  generalCondition: GeneralCondition | null
  consciousness: Consciousness | null
  constitution: Constitution | null
  nutrition: Nutrition | null

  // Кожа
  skinColor: SkinColor | null
  skinTemp: SkinTemp | null
  skinMoisture: SkinMoisture | null
  mucousState: MucousState | null
  cyanosis: boolean
  acrocyanosis: boolean
  edemaPresent: boolean
  edemaLocation: string
  lymphNodes: 'not_palpable' | 'enlarged' | null

  // Дыхательная система
  breathingNose: BreathingNose | null
  rr: string
  spo2: string
  chestForm: ChestForm | null
  chestSymmetry: ChestSymmetry | null
  percussionSound: PercussionSound | null
  breathingType: BreathingType | null
  ralesType: RalesType | null
  ralesLocation: string
  respiratoryComment: string

  // Сердечно-сосудистая
  hr: string
  pulse: string
  bpRightSys: string
  bpRightDia: string
  bpLeftSys: string
  bpLeftDia: string
  heartRhythm: HeartRhythm | null
  heartTones: HeartTones | null
  heartMurmurs: HeartMurmurs | null
  cardiovascularComment: string

  // ЖКТ
  tongueState: TongueState | null
  abdomenState: AbdomenState | null
  abdomenPain: AbdomenPain | null
  liverState: LiverState | null
  liverSize: string  // в см
  spleenState: SpleenState | null
  peritoneum: PeritoneumState | null
  gktComment: string

  // Мочевыделение
  kidneyPercussion: KidneyPercussion | null
  urination: UrinationState | null
  stool: StoolState | null
  urologyComment: string

  // Блок 6 — Диагноз
  primaryDiagnosis: string
  complicationsDiagnosis: string
  concomitantDiagnosis: string

  // Блок 7 — Назначения
  prescriptions: RoundPrescription[]

  // Блок 8 — План обследования
  labTests: LabTestCheck[]

  // Итоговый текст
  generatedText: string
}

// ═══════════════════════════════════════════════════════════════════
// ЕЖЕДНЕВНЫЙ ОСМОТР — упрощённое состояние
// ═══════════════════════════════════════════════════════════════════

export interface DailyRoundFormState {
  // Мета
  inspectionDate: string
  inspectionTime: string
  doctor: string
  status: 'draft' | 'completed'

  // Показатели
  temperature: string
  hr: string
  bpSys: string
  bpDia: string
  rr: string
  spo2: string

  // Жалобы
  complaints: ComplaintKey[]
  complaintParams: ComplaintParams
  complaintsNote: string

  // Объективно — короткие значения
  generalCondition: GeneralCondition | null
  // Кожа (pill-выбор)
  skinColor: SkinColor | null
  skinTemp: SkinTemp | null
  skinMoisture: SkinMoisture | null
  // Грудная клетка (pill-выбор)
  chestForm: ChestForm | null
  chestSymmetry: ChestSymmetry | null
  breathingType: BreathingType | null
  ralesType: RalesType | null
  respiratoryNote: string
  heartRhythm: HeartRhythm | null
  heartTones: HeartTones | null
  heartNote: string
  tongueState: TongueState | null
  abdomenState: AbdomenState | null
  abdomenNote: string
  stool: StoolState | null
  urination: UrinationState | null

  // Динамика
  dynamics: DynamicsState | null
  dynamicsComment: string

  // Лечение
  treatmentDecision: 'keep' | 'modify'
  prescriptions: RoundPrescription[]

  // План
  controlStudies: string
  nextInspection: string

  // Итоговый текст
  generatedText: string
}

// ─── Запись осмотра (сохраняется в patient.inspections) ───────────

export interface SavedInspection {
  id: string
  type: InspectionType
  date: string
  time: string
  doctor: string
  department?: string
  diagnosis?: string
  vitals?: {
    temp?: string
    hr?: string
    bp?: string
    spo2?: string
    rr?: string
  }
  prescriptions?: RoundPrescription[]
  labTests?: LabTestCheck[]
  generatedText: string
}
