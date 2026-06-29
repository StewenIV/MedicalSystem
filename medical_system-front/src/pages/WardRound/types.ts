
export type InspectionType = 'primary' | 'repeated' | 'daily' | 'discharge'


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

export interface ComplaintParams {
  fever?: { maxTemp: string }
  dyspnea_exertion?: { severity: 'mild' | 'moderate' | 'severe' }
  dyspnea_rest?: { severity: 'mild' | 'moderate' | 'severe' }
  cough_dry?: { duration: string }
  cough_productive?: { sputumColor: string; sputumAmount: string }
  chest_pain?: { character: string; location: string }
}


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


export type PrescriptionAction = 'keep' | 'adjust' | 'cancel' | 'new'

export interface RoundPrescription {
  id: string
  medicineId?: string
  drug: string
  dose: string
  unit: string     
  route: string    
  frequency: string 
  form: string
  regimen: string
  comment?: string
  action: PrescriptionAction
  adjustedDose?: string
  adjustedRegimen?: string
}


export interface LabTestCheck {
  id: string
  name: string
  category: 'lab' | 'instrumental'
  checked: boolean
}


export type ProcedureStatus = 'done' | 'pending' | 'cancelled'

export interface Procedure {
  id: string
  date: string
  name: string
  status: ProcedureStatus
}


export interface PrimaryFormState {
  inspectionDate: string
  inspectionTime: string
  doctor: string
  department: string
  institution: string
  inspectionType: 'primary' | 'repeated'
  status: 'draft' | 'completed'

  complaints: ComplaintKey[]
  complaintParams: ComplaintParams
  complaintsNote: string

  illnessStartDate: string
  illnessCauses: ('cold' | 'infection' | 'contact' | 'unknown')[]
  preTreatment: ('outpatient' | 'inpatient')[]
  preTreatmentDetails: string
  preTreatmentEffect: 'improvement' | 'no_change' | 'deterioration' | null
  hospitalizationReason: string
  hospitalizationDate: string

  tbStatus: 'denies' | 'confirms' | null
  tbContact: 'yes' | 'no' | null
  hivStatus: 'negative' | 'positive' | null
  hepatitisStatus: 'negative' | 'positive' | null
  stdStatus: 'denies' | 'has' | null

  allergyStatus: 'none' | 'has'
  allergies: { id: string; name: string; reaction: string; date?: string; comment?: string }[]

  operationsStatus: 'none' | 'has'
  operations: { id: string; date: string; name: string; comment: string; diagnosis?: string; result?: string; complications?: string }[]

  comorbidities: { id: string; diagnosis: string; activity: string; severity?: string; diagnosisDate?: string; complications?: string }[]

  badHabitsStatus: 'none' | 'has'
  smoking: boolean
  smokingYears: string
  alcohol: boolean
  alcoholDetails: string


  generalCondition: GeneralCondition | null
  consciousness: Consciousness | null
  constitution: Constitution | null
  nutrition: Nutrition | null

  skinColor: SkinColor | null
  skinTemp: SkinTemp | null
  skinMoisture: SkinMoisture | null
  mucousState: MucousState | null
  cyanosis: boolean
  acrocyanosis: boolean
  edemaPresent: boolean
  edemaLocation: string
  lymphNodes: 'not_palpable' | 'enlarged' | null

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

  tongueState: TongueState | null
  abdomenState: AbdomenState | null
  abdomenPain: AbdomenPain | null
  liverState: LiverState | null
  liverSize: string  
  spleenState: SpleenState | null
  peritoneum: PeritoneumState | null
  gktComment: string

  kidneyPercussion: KidneyPercussion | null
  urination: UrinationState | null
  stool: StoolState | null
  urologyComment: string

  primaryDiagnosis: string
  complicationsDiagnosis: string
  concomitantDiagnosis: string

  prescriptions: RoundPrescription[]

  labTests: LabTestCheck[]

  generatedText: string
}


export interface DailyRoundFormState {
  inspectionDate: string
  inspectionTime: string
  doctor: string
  doctorDisplayName?: string
  status: 'draft' | 'completed'

  temperature: string
  hr: string
  bpSys: string
  bpDia: string
  rr: string
  spo2: string

  complaints: ComplaintKey[]
  complaintParams: ComplaintParams
  complaintsNote: string

  generalCondition: GeneralCondition | null
  skinColor: SkinColor | null
  skinTemp: SkinTemp | null
  skinMoisture: SkinMoisture | null
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

  dynamics: DynamicsState | null
  dynamicsComment: string

  treatmentDecision: 'keep' | 'modify'
  prescriptions: RoundPrescription[]

  
  allergyStatus: 'none' | 'has'
  allergies: { id: string; name: string; reaction: string; date?: string; comment?: string }[]
  operationsStatus: 'none' | 'has'
  operations: { id: string; date: string; name: string; comment: string; diagnosis?: string; result?: string; complications?: string }[]
  comorbidities: { id: string; diagnosis: string; activity: string; severity?: string; diagnosisDate?: string; complications?: string }[]

  controlStudies: string
  nextInspection: string

  generatedText: string
}


export interface SavedInspection {
  id: string
  type: InspectionType
  date: string
  time: string
  doctor: string
  doctorDisplayName?: string
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
  complaints?: string
  objective?: string
  recommendations?: string
  formData?: string
}
