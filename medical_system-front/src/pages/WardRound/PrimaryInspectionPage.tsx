import React, { useState, useCallback, useEffect, useRef } from 'react'
import { formatLocalDate, toBackendDateTimeString } from 'utils/dateUtils'
import {
  Clock,
  Stethoscope,
  FileText,
  ClipboardList,
  FlaskConical,
  Pill as PillIcon,
  PenLine,
  Save,
  X,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  AlertTriangle,
  Sparkles,
  Printer,
  FilePlus,
  Building2,
  User,
  Calendar,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import {
  PrimaryFormState,
  ComplaintKey,
  COMPLAINT_LABELS,
  ComplaintParams,
  GeneralCondition,
  Consciousness,
  Constitution,
  Nutrition,
  SkinColor,
  SkinTemp,
  SkinMoisture,
  MucousState,
  ChestForm,
  ChestSymmetry,
  BreathingNose,
  BreathingType,
  RalesType,
  PercussionSound,
  HeartActivity,
  HeartRhythm,
  HeartTones,
  HeartMurmurs,
  TongueState,
  AbdomenState,
  AbdomenPain,
  LiverState,
  SpleenState,
  PeritoneumState,
  KidneyPercussion,
  StoolState,
  UrinationState,
  RoundPrescription,
  LabTestCheck,
  SavedInspection
} from './types'
import { getInitialPrimaryState, DEFAULT_LAB_TESTS } from './mockRoundData'
import { usePatientData } from 'context/PatientDataContext'
import { Patient } from 'data/mockData'
import { useSelector } from 'react-redux'
import { selectDisplayName } from 'features/App/selectors'

import {
  PatientHeader,
  PatientAvatar,
  PatientInfo,
  PatientName,
  PatientMeta,
  PatientMetaItem,
  HeaderRight,
  HeaderBtn,
  StartTimeDisplay
} from './styled'

const FONT = `'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: 'calc(100vh - 84px)',
    background: '#f3f4f6',
    fontFamily: FONT
  },
  header: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)',
    color: 'white',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexShrink: 0 as const,
    boxShadow: '0 4px 20px rgba(15,23,42,0.3)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 30,
    flexWrap: 'wrap' as const
  },
  body: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden'
  },
  nav: {
    width: 220,
    flexShrink: 0,
    background: 'white',
    borderRight: '1px solid #e5e7eb',
    overflowY: 'auto' as const,
    padding: '12px 0'
  },
  navItem: (active: boolean, done: boolean): React.CSSProperties => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    border: 'none',
    background: active ? '#eff6ff' : 'transparent',
    color: active ? '#1d4ed8' : '#374151',
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: active ? 600 : 450,
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s',
    borderLeft: `3px solid ${active ? '#1d4ed8' : 'transparent'}`,
    position: 'relative' as const
  }),
  centerForm: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px 24px',
    scrollBehavior: 'smooth' as const
  },
  block: {
    background: 'white',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    marginBottom: 20,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    scrollMarginTop: 20
  },
  blockHeader: {
    padding: '13px 18px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fafbfc'
  },
  blockIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1d4ed8',
    flexShrink: 0
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.01em',
    flex: 1
  },
  blockBody: {
    padding: '16px 18px'
  },
  subsection: {
    fontSize: 11,
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: '1px solid #f1f5f9'
  },
  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 6,
    marginBottom: 2
  },
  pill: (active: boolean, color?: string): React.CSSProperties => {
    const c = color ?? 'blue'
    const map: Record<
      string,
      { bg: string; text: string; border: string; aBg: string; aText: string; aBorder: string }
    > = {
      blue: {
        bg: 'white',
        text: '#64748b',
        border: '#e2e8f0',
        aBg: '#eff6ff',
        aText: '#1d4ed8',
        aBorder: '#93c5fd'
      },
      green: {
        bg: 'white',
        text: '#64748b',
        border: '#e2e8f0',
        aBg: '#f0fdf4',
        aText: '#166534',
        aBorder: '#86efac'
      },
      red: {
        bg: 'white',
        text: '#64748b',
        border: '#e2e8f0',
        aBg: '#fef2f2',
        aText: '#991b1b',
        aBorder: '#fca5a5'
      },
      orange: {
        bg: 'white',
        text: '#64748b',
        border: '#e2e8f0',
        aBg: '#fff7ed',
        aText: '#9a3412',
        aBorder: '#fdba74'
      }
    }
    const m = map[c]
    return {
      padding: '5px 12px',
      borderRadius: 20,
      border: `1.5px solid ${active ? m.aBorder : m.border}`,
      background: active ? m.aBg : m.bg,
      color: active ? m.aText : m.text,
      fontSize: 12,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.13s',
      fontFamily: FONT
    }
  },
  checkBtn: (checked: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '6px 12px',
    borderRadius: 8,
    border: `1.5px solid ${checked ? '#93c5fd' : '#e2e8f0'}`,
    background: checked ? '#eff6ff' : 'white',
    color: checked ? '#1d4ed8' : '#64748b',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.13s',
    fontFamily: FONT
  }),
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1.5px solid #e2e8f0',
    fontFamily: FONT,
    fontSize: 13,
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box' as const,
    background: 'white'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #e2e8f0',
    fontFamily: FONT,
    fontSize: 13,
    color: '#1e293b',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: 80,
    boxSizing: 'border-box' as const,
    background: 'white',
    lineHeight: 1.5
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    display: 'block',
    marginBottom: 5
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginTop: 10
  },
  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginTop: 10
  },
  paramCard: {
    border: '1px solid #f1f5f9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    background: '#fafbfc'
  },
  paramLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    marginBottom: 10
  },
  autoText: {
    padding: '10px 12px',
    borderRadius: 8,
    background: '#f0f9ff',
    border: '1.5px solid #bae6fd',
    color: '#0369a1',
    fontSize: 13,
    lineHeight: 1.6,
    marginTop: 8
  },
  toast: (type: string): React.CSSProperties => ({
    position: 'fixed' as const,
    bottom: 32,
    right: 32,
    zIndex: 9999,
    padding: '12px 20px',
    borderRadius: 10,
    background: type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#1d4ed8',
    color: 'white',
    fontSize: 14,
    fontWeight: 600,
    boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: FONT,
    animation: 'none'
  }),
  modal: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9000,
    background: 'rgba(15,23,42,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  modalBox: {
    background: 'white',
    borderRadius: 16,
    padding: 28,
    maxWidth: 700,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)'
  }
}

const NAV_SECTIONS = [
  { id: 'info', label: 'Информация об осмотре', icon: Calendar },
  { id: 'complaints', label: 'Жалобы', icon: PenLine },
  { id: 'anamnesis-morbi', label: 'Anamnesis morbi', icon: FileText },
  { id: 'anamnesis-vitae', label: 'Anamnesis vitae', icon: User },
  { id: 'objective', label: 'Объективный статус', icon: Stethoscope },
  { id: 'diagnosis', label: 'Клинический диагноз', icon: ClipboardList },
  { id: 'prescriptions', label: 'Назначения', icon: PillIcon },
  { id: 'examplan', label: 'План обследования', icon: FlaskConical }
]

function PillBtn({
  active,
  color,
  onClick,
  children
}: {
  active: boolean
  color?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button style={s.pill(active, color)} onClick={onClick}>
      {children}
    </button>
  )
}

function CheckBtnComp({
  checked,
  onClick,
  children
}: {
  checked: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      style={{ ...s.checkBtn(checked), ...(hover && !checked ? { borderColor: '#bfdbfe' } : {}) }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          flexShrink: 0,
          border: `1.5px solid ${checked ? '#3b82f6' : '#cbd5e1'}`,
          background: checked ? '#3b82f6' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.13s'
        }}
      >
        {checked && <Check size={10} color="white" />}
      </span>
      {children}
    </button>
  )
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      <input
        type={type}
        style={s.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function generatePrimaryText(form: PrimaryFormState, patient?: Patient): string {
  const parts: string[] = []
  const inspType = form.inspectionType === 'primary' ? 'Первичный осмотр' : 'Повторный осмотр'

  const dateRu = form.inspectionDate ? formatLocalDate(form.inspectionDate) : form.inspectionDate

  parts.push(`${inspType} лечащего врача от ${dateRu}. Время: ${form.inspectionTime}.`)

  const COMPLAINT_ACCUSATIVE_RU: Record<ComplaintKey, string> = {
    none: 'жалоб нет',
    weakness: 'общую слабость',
    cough_dry: 'малопродуктивный кашель',
    cough_productive: 'продуктивный кашель',
    dyspnea_exertion: 'одышку при физической нагрузке',
    dyspnea_rest: 'одышку в покое',
    fever: 'повышение температуры',
    chest_pain: 'боль в грудной клетке',
    sweating: 'повышенную потливость',
    dizziness: 'головокружение',
    nausea: 'тошноту',
    other: 'другие симптомы'
  }

  const activeComplaints = form.complaints.filter((c) => c !== 'none')
  if (form.complaints.includes('none') || activeComplaints.length === 0) {
    parts.push('Жалоб не предъявляет.')
  } else {
    const labels = activeComplaints.map((c) => {
      let text = COMPLAINT_ACCUSATIVE_RU[c] || c
      if (c === 'fever' && form.complaintParams.fever?.maxTemp) {
        text += ` до ${form.complaintParams.fever.maxTemp}°C`
      }
      if ((c === 'dyspnea_exertion' || c === 'dyspnea_rest') && form.complaintParams[c]?.severity) {
        const sev = form.complaintParams[c]!.severity
        text += ` (${sev === 'mild' ? 'легкая' : sev === 'moderate' ? 'умеренная' : 'выраженная'})`
      }
      return text
    })
    parts.push(`Жалобы на: ${labels.join(', ')}.`)
    if (form.complaintsNote) parts.push(form.complaintsNote)
  }

  // Anamnesis morbi
  const morbiParts: string[] = []
  const isFemale = patient?.gender === 'Женский'
  const bSuffix = isFemale ? 'больной' : 'больным'

  if (form.illnessStartDate) {
    const startRu = formatLocalDate(form.illnessStartDate)
    morbiParts.push(`Считает себя ${bSuffix} с ${startRu}.`)
  }

  if (form.illnessCauses && form.illnessCauses.length > 0) {
    const causesMap: Record<string, string> = {
      cold: 'переохлаждением',
      infection: 'перенесенной инфекцией',
      contact: 'контактом с больными',
      unknown: 'не установленной причиной'
    }
    const causesRu = form.illnessCauses.map((c) => causesMap[c] ?? c).join(', ')
    morbiParts.push(`Начало заболевания связывает с: ${causesRu}.`)
  }

  if (form.preTreatment && form.preTreatment.length > 0) {
    const treatType: Record<string, string> = {
      outpatient: 'амбулаторно',
      inpatient: 'в стационаре'
    }
    const treatTypeRu = form.preTreatment.map((t) => treatType[t] ?? t).join(', ')
    let preTreatStr = `Ранее проводилось лечение: ${treatTypeRu}`
    if (form.preTreatmentDetails) {
      preTreatStr += ` (${form.preTreatmentDetails})`
    }
    if (form.preTreatmentEffect) {
      const effectMap: Record<string, string> = {
        improvement: 'с улучшением',
        no_change: 'без динамики',
        deterioration: 'с ухудшением состояния'
      }
      preTreatStr += `, эффект от проводимой терапии: ${effectMap[form.preTreatmentEffect]}`
    }
    morbiParts.push(preTreatStr + '.')
  }

  if (form.hospitalizationReason) {
    morbiParts.push(`Причина госпитализации: ${form.hospitalizationReason}.`)
  }

  if (morbiParts.length > 0) {
    parts.push(`Анамнез заболевания:\n${morbiParts.join(' ')}`)
  }

  // Anamnesis vitae
  const vitaeParts: string[] = []

  const tbMap: Record<string, string> = { denies: 'отрицает', confirms: 'подтверждает' }
  const hivMap: Record<string, string> = { negative: 'отрицательный', positive: 'положительный' }
  const hepMap: Record<string, string> = { negative: 'отрицательный', positive: 'положительный' }
  const stdMap: Record<string, string> = { denies: 'отрицает', has: 'подтверждает' }

  const infHistory: string[] = []
  if (form.tbStatus)
    infHistory.push(
      `туберкулез - ${tbMap[form.tbStatus] ?? form.tbStatus}${form.tbContact === 'yes' ? ' (был контакт)' : ''}`
    )
  if (form.hivStatus) infHistory.push(`ВИЧ-статус - ${hivMap[form.hivStatus] ?? form.hivStatus}`)
  if (form.hepatitisStatus)
    infHistory.push(`вирусные гепатиты - ${hepMap[form.hepatitisStatus] ?? form.hepatitisStatus}`)
  if (form.stdStatus) infHistory.push(`ИППП - ${stdMap[form.stdStatus] ?? form.stdStatus}`)

  if (infHistory.length > 0) {
    vitaeParts.push(`Эпидемиологический анамнез: ${infHistory.join(', ')}`)
  }

  if (form.allergyStatus === 'none') {
    vitaeParts.push('Аллергологический анамнез: не отягощен')
  } else if (form.allergies && form.allergies.length > 0) {
    const allNames = form.allergies.map((a) => `${a.name} (реакция: ${a.reaction})`).join(', ')
    vitaeParts.push(`Аллергологический анамнез: отягощен (аллергия на: ${allNames})`)
  }

  if (form.operationsStatus === 'none') {
    vitaeParts.push('Хирургический анамнез: операции отрицает')
  } else if (form.operations && form.operations.length > 0) {
    const ops = form.operations
      .map((o) => `${o.name} (${o.date}${o.comment ? ', ' + o.comment : ''})`)
      .join('; ')
    vitaeParts.push(`Перенесенные операции: ${ops}`)
  }

  if (form.comorbidities && form.comorbidities.length > 0) {
    const comorbid = form.comorbidities.map((c) => `${c.diagnosis} (${c.activity})`).join(', ')
    vitaeParts.push(`Сопутствующие заболевания: ${comorbid}`)
  }

  if (form.badHabitsStatus === 'none') {
    vitaeParts.push('Вредные привычки: отрицает')
  } else {
    const habits: string[] = []
    if (form.smoking) habits.push(`курение (стаж ${form.smokingYears || 0} лет)`)
    if (form.alcohol)
      habits.push(`употребление алкоголя (${form.alcoholDetails || 'редко/умеренно'})`)
    vitaeParts.push(`Вредные привычки: ${habits.length > 0 ? habits.join(', ') : 'отрицает'}`)
  }

  if (vitaeParts.length > 0) {
    parts.push(`Анамнез жизни:\n${vitaeParts.join('.\n')}.`)
  }

  // Objective status
  parts.push('Объективный статус:')
  const objParts: string[] = []

  const condMap: Record<GeneralCondition, string> = {
    satisfactory: 'удовлетворительное',
    moderate: 'средней степени тяжести, стабильное',
    severe: 'тяжелое',
    critical: 'крайне тяжелое'
  }

  const consciousnessMap: Record<Consciousness, string> = {
    clear: 'ясное',
    drowsy: 'оглушение',
    confused: 'спутанное',
    absent: 'отсутствует (сопор/кома)'
  }

  const constitutionMap: Record<Constitution, string> = {
    normosthenic: 'нормостеническое',
    hypersthenic: 'гиперстеническое',
    asthenic: 'астеническое'
  }

  const nutritionMap: Record<Nutrition, string> = {
    satisfactory: 'удовлетворительное',
    elevated: 'повышенное',
    reduced: 'пониженное'
  }

  if (form.generalCondition) {
    let condStr = `Общее состояние: ${condMap[form.generalCondition]}.`
    if (form.consciousness)
      condStr += ` Сознание: ${consciousnessMap[form.consciousness] ?? form.consciousness}.`
    if (form.constitution) condStr += ` Телосложение: ${constitutionMap[form.constitution]}.`
    if (form.nutrition) condStr += ` Питание: ${nutritionMap[form.nutrition]}.`
    objParts.push(condStr)
  }

  // Skin and lymph nodes
  const skinColorText: Record<SkinColor, string> = {
    pale_pink: 'бледно-розовые',
    pale: 'бледные',
    hyperemia: 'гиперемированные',
    cyanosis: 'цианотичные',
    icteric: 'иктеричные'
  }
  const skinTempText: Record<SkinTemp, string> = {
    warm: 'теплые',
    cold: 'холодные',
    hot: 'горячие'
  }
  const skinMoistText: Record<SkinMoisture, string> = {
    dry: 'сухие',
    moist: 'влажные',
    excessive: 'с повышенной влажностью'
  }
  const mucousText: Record<MucousState, string> = {
    moist: 'влажные, чистые',
    dry: 'сухие'
  }

  let skinStr = 'Кожные покровы:'
  const skinDesc: string[] = []
  if (form.skinColor) skinDesc.push(skinColorText[form.skinColor] ?? form.skinColor)
  if (form.skinTemp) skinDesc.push(skinTempText[form.skinTemp])
  if (form.skinMoisture) skinDesc.push(skinMoistText[form.skinMoisture])

  if (skinDesc.length > 0) {
    skinStr += ` ${skinDesc.join(', ')}.`
  } else {
    skinStr += ' обычной окраски и влажности.'
  }

  if (form.mucousState) {
    skinStr += ` Видимые слизистые оболочки: ${mucousText[form.mucousState]}.`
  }

  const cyanosisParts: string[] = []
  if (form.cyanosis) cyanosisParts.push('диффузный цианоз')
  if (form.acrocyanosis) cyanosisParts.push('акроцианоз')
  if (cyanosisParts.length > 0) {
    skinStr += ` Отмечается: ${cyanosisParts.join(', ')}.`
  }

  if (form.edemaPresent) {
    skinStr += ` Имеются отеки: ${form.edemaLocation || 'локализованные'}.`
  } else {
    skinStr += ' Периферических отеков нет.'
  }

  if (form.lymphNodes) {
    skinStr += ` Периферические лимфатические узлы: ${form.lymphNodes === 'not_palpable' ? 'не пальпируются' : 'увеличены'}.`
  }
  objParts.push(skinStr)

  // Respiratory system
  let respStr = 'Органы дыхания:'
  if (form.breathingNose) {
    respStr += ` Дыхание через нос: ${form.breathingNose === 'free' ? 'свободное' : 'затруднено'}.`
  }
  if (form.chestForm) {
    const chestFormMap: Record<ChestForm, string> = {
      normosthenic: 'нормостеническая',
      hypersthenic: 'гиперстеническая',
      asthenic: 'астеническая',
      rachitic: 'рахитическая',
      emphysematous: 'эмфизематозная',
      funnel: 'воронкообразная',
      keel: 'килевидная'
    }
    respStr += ` Грудная клетка: ${chestFormMap[form.chestForm] ?? form.chestForm}.`
  }
  if (form.chestSymmetry) {
    respStr += ` Симметричность: ${form.chestSymmetry === 'symmetric' ? 'обе половины участвуют в дыхании' : 'асимметрична'}.`
  }
  if (form.rr) respStr += ` ЧДД: ${form.rr} в минуту.`
  if (form.spo2) respStr += ` SpO₂: ${form.spo2}%.`

  if (form.percussionSound) {
    const ps: Record<PercussionSound, string> = {
      clear: 'ясный легочный звук',
      dull: 'притупление перкуторного звука',
      tympanic: 'тимпанический звук',
      shortened: 'укорочение перкуторного звука'
    }
    respStr += ` Перкуторный звук: ${ps[form.percussionSound] ?? form.percussionSound}.`
  }

  if (form.breathingType) {
    const bt: Record<BreathingType, string> = {
      vesicular: 'везикулярное',
      harsh: 'жесткое',
      weakened: 'ослабленное',
      bronchial: 'бронхиальное'
    }
    respStr += ` Аускультативно: дыхание ${bt[form.breathingType] ?? form.breathingType}.`
  }

  if (form.ralesType) {
    const rt: Record<RalesType, string> = {
      none: 'Хрипы не выслушиваются.',
      dry: 'Выслушиваются сухие хрипы.',
      moist: 'Выслушиваются влажные хрипы.',
      crepitation: 'Выслушивается крепитация.'
    }
    respStr += ` ${rt[form.ralesType]}`
    if (form.ralesType !== 'none' && form.ralesLocation) {
      respStr += ` Локализация хрипов: ${form.ralesLocation}.`
    }
  }

  if (form.respiratoryComment) {
    respStr += ` Примечание: ${form.respiratoryComment}`
  }
  objParts.push(respStr)

  // Cardiovascular system
  let cvStr = 'Органы кровообращения:'
  if (form.heartRhythm || form.heartTones) {
    cvStr += ` Сердечная деятельность: ${form.heartRhythm === 'regular' ? 'ритмичная' : 'аритмичная'}.`
    const tonesMap: Record<HeartTones, string> = {
      clear: 'ясные',
      muffled: 'приглушены',
      deaf: 'глухие'
    }
    if (form.heartTones) {
      cvStr += ` Тоны сердца: ${tonesMap[form.heartTones] ?? form.heartTones}.`
    }
  }
  if (form.heartMurmurs) {
    const murmursMap: Record<HeartMurmurs, string> = {
      absent: 'шумы отсутствуют',
      systolic: 'выслушивается систолический шум',
      diastolic: 'выслушивается диастолический шум'
    }
    cvStr += ` Шумы: ${murmursMap[form.heartMurmurs]}.`
  }
  if (form.hr) cvStr += ` ЧСС: ${form.hr} в мин.`
  if (form.pulse) cvStr += ` Пульс: ${form.pulse} в мин.`

  const bpRight = form.bpRightSys && form.bpRightDia ? `${form.bpRightSys}/${form.bpRightDia}` : ''
  const bpLeft = form.bpLeftSys && form.bpLeftDia ? `${form.bpLeftSys}/${form.bpLeftDia}` : ''
  if (bpRight) {
    cvStr += ` АД на правой руке: ${bpRight} мм рт. ст.`
    if (bpLeft && bpLeft !== bpRight) {
      cvStr += `, на левой руке: ${bpLeft} мм рт. ст.`
    }
  }
  if (form.cardiovascularComment) {
    cvStr += ` Примечание: ${form.cardiovascularComment}`
  }
  objParts.push(cvStr)

  // Gastrointestinal system
  let gktStr = 'Органы пищеварения:'
  if (form.tongueState) {
    const ts: Record<TongueState, string> = {
      moist_clean: 'влажный, чистый',
      moist_coated: 'влажный, обложен налетом',
      dry_clean: 'сухой, чистый',
      dry_coated: 'сухой, обложен налетом'
    }
    gktStr += ` Язык: ${ts[form.tongueState]}.`
  }
  if (form.abdomenState) {
    const abdMap: Record<AbdomenState, string> = {
      soft: 'мягкий',
      tense: 'напряжен',
      bloated: 'вздут'
    }
    gktStr += ` Живот при пальпации: ${abdMap[form.abdomenState]}.`
  }
  if (form.abdomenPain) {
    const painMap: Record<AbdomenPain, string> = {
      painless: 'безболезненный',
      painful: 'болезненный',
      local: 'локально болезненный'
    }
    gktStr += ` Болезненность: ${painMap[form.abdomenPain]}.`
  }
  if (form.peritoneum) {
    gktStr += ` Симптомы раздражения брюшины: ${form.peritoneum === 'irritation_absent' ? 'отрицательные' : 'положительные'}.`
  }
  if (form.liverState) {
    const lsMap: Record<LiverState, string> = {
      not_protruding: 'печень не выступает из-под края реберной дуги',
      protruding_1: 'печень выступает на +1 см',
      protruding_2: 'печень выступает на +2 см',
      protruding_3: 'печень выступает на +3 см'
    }
    gktStr += ` Печень: ${lsMap[form.liverState]}`
    if (form.liverSize && form.liverState !== 'not_protruding') {
      gktStr += ` (размеры по Курлову: ${form.liverSize}).`
    } else {
      gktStr += '.'
    }
  }
  if (form.spleenState) {
    gktStr += ` Селезенка: ${form.spleenState === 'not_palpable' ? 'не пальпируется' : 'увеличена'}.`
  }
  if (form.gktComment) {
    gktStr += ` Примечание: ${form.gktComment}`
  }
  objParts.push(gktStr)

  // Urinary and bowel systems
  let urStoolStr = 'Мочевыделительная система и стул:'
  if (form.kidneyPercussion) {
    const kidneyMap: Record<KidneyPercussion, string> = {
      painless: 'симптом поколачивания отрицательный с обеих сторон',
      painful_left: 'симптом поколачивания положительный слева',
      painful_right: 'симптом поколачивания положительный справа',
      painful_both: 'симптом поколачивания положительный с обеих сторон'
    }
    urStoolStr += ` ${kidneyMap[form.kidneyPercussion]}.`
  }
  if (form.urination) {
    const urMap: Record<UrinationState, string> = {
      free_painless: 'мочеиспускание свободное, безболезненное',
      difficult: 'мочеиспускание затруднено',
      painful: 'мочеиспускание болезненное',
      frequent: 'мочеиспускание учащенное'
    }
    urStoolStr += ` ${urMap[form.urination]}.`
  }
  if (form.stool) {
    const stoolMap: Record<StoolState, string> = {
      normal: 'стул оформленный, регулярный',
      constipation: 'склонность к запорам / задержка стула',
      diarrhea: 'стул жидкий',
      absent: 'стул отсутствует'
    }
    urStoolStr += ` ${stoolMap[form.stool]}.`
  }
  if (form.urologyComment) {
    urStoolStr += ` Примечание: ${form.urologyComment}`
  }
  objParts.push(urStoolStr)

  parts.push(objParts.join('\n'))

  // Diagnosis
  if (form.primaryDiagnosis) {
    parts.push(`Клинический диагноз:\nОсновной: ${form.primaryDiagnosis}`)
    if (form.complicationsDiagnosis) parts.push(`Осложнения: ${form.complicationsDiagnosis}`)
    if (form.concomitantDiagnosis) parts.push(`Сопутствующий: ${form.concomitantDiagnosis}`)
  }

  // Prescriptions
  const activeMeds = form.prescriptions.filter((p) => p.action !== 'cancel')
  if (activeMeds.length > 0) {
    parts.push('Назначенное лечение:')
    activeMeds.forEach((p, i) => {
      parts.push(
        `${i + 1}. ${p.drug} ${p.dose} ${p.unit}, путь: ${p.route}, кратность: ${p.frequency}.${p.comment ? ' Примечание: ' + p.comment : ''}`
      )
    })
  }

  // Examination plan
  const checked = form.labTests.filter((t) => t.checked)
  if (checked.length > 0) {
    const labs = checked.filter((t) => t.category === 'lab').map((t) => t.name)
    const inst = checked.filter((t) => t.category === 'instrumental').map((t) => t.name)
    const plan: string[] = []
    if (labs.length > 0) plan.push(`лабораторные исследования: ${labs.join(', ')}`)
    if (inst.length > 0) plan.push(`инструментальные исследования: ${inst.join(', ')}`)
    parts.push(`План обследования: ${plan.join('; ')}.`)
  }

  return parts.join('\n\n')
}

interface PrimaryInspectionPageProps {
  patientId: string
  onClose: () => void
  onNavigateToTemperatureSheet?: (id: string) => void
  hideHeader?: boolean
  onRegisterActions?: (actions: any) => void
}

const PrimaryInspectionPage: React.FC<PrimaryInspectionPageProps> = ({
  patientId,
  onClose,
  onNavigateToTemperatureSheet,
  hideHeader = false,
  onRegisterActions
}) => {
  const {
    getPatient,
    saveInspection,
    updatePatientRoundData,
    addHistoryEntry,
    updateHistoryEntry,
    saveDraft,
    getDraft,
    getInspections,
    loadPatientEncounters,
    inspections
  } = usePatientData()
  const patient = getPatient(patientId)
  const currentUserDisplayName = useSelector(selectDisplayName)

  const loadedPatientIdRef = useRef<string | null>(null)
  const [editingEncounterId, setEditingEncounterId] = useState<string | null>(null)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('primary_round_sidebar_collapsed') === 'true'
  })
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 992

  useEffect(() => {
    loadPatientEncounters(patientId)
  }, [patientId])

  const [form, setForm] = useState<PrimaryFormState>(() => {
    const draft = getDraft(`${patientId}-primary`)
    if (draft) return draft
    const initial = getInitialPrimaryState(patientId, patient)
    if (currentUserDisplayName) {
      initial.doctor = currentUserDisplayName
    }
    return initial
  })

  useEffect(() => {
    if (
      !editingEncounterId &&
      currentUserDisplayName &&
      (!form.doctor || form.doctor === 'Лечащий врач' || form.doctor === patient?.doctor)
    ) {
      setForm((prev) => ({ ...prev, doctor: currentUserDisplayName }))
    }
  }, [currentUserDisplayName, patient, editingEncounterId])

  useEffect(() => {
    if (loadedPatientIdRef.current === patientId) return

    const isLoaded = inspections[patientId] !== undefined
    if (!isLoaded) return

    const draft = getDraft(`${patientId}-primary`)
    if (draft) {
      setForm(draft)
      loadedPatientIdRef.current = patientId
      return
    }

    const allInspections = inspections[patientId] || []
    const primaryRecord = allInspections.find((i) => i.type === 'primary')
    if (primaryRecord) {
      setEditingEncounterId(primaryRecord.id)
      if (primaryRecord.formData) {
        try {
          const parsed = JSON.parse(primaryRecord.formData)
          setForm(parsed)
        } catch (err) {
          console.error('Failed to parse primary formData', err)
        }
      }
    }
    loadedPatientIdRef.current = patientId
  }, [patientId, inspections, getDraft])
  const [activeSection, setActiveSection] = useState('info')
  const [toastMsg, setToastMsg] = useState<{
    text: string
    type: 'success' | 'info' | 'error'
  } | null>(null)
  const [showGenText, setShowGenText] = useState(false)
  const [showPrescModal, setShowPrescModal] = useState(false)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [newPresc, setNewPresc] = useState<Partial<RoundPrescription>>({})
  const [referralNote, setReferralNote] = useState('')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 3000)
    return () => clearTimeout(t)
  }, [toastMsg])

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMsg({ text, type })
  }, [])

  const setField = useCallback(
    <K extends keyof PrimaryFormState>(key: K, value: PrimaryFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const scrollTo = (id: string) => {
    setActiveSection(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleComplaint = (k: ComplaintKey) => {
    setForm((prev) => {
      const c = prev.complaints
      if (k === 'none') return { ...prev, complaints: ['none'] }
      const without = c.filter((x) => x !== 'none')
      return {
        ...prev,
        complaints: without.includes(k) ? without.filter((x) => x !== k) : [...without, k]
      }
    })
  }

  const setComplaintParam = <K extends keyof ComplaintParams>(key: K, val: ComplaintParams[K]) => {
    setForm((prev) => ({ ...prev, complaintParams: { ...prev.complaintParams, [key]: val } }))
  }

  const addPresc = () => {
    if (!newPresc.drug) return showToast('Укажите название препарата', 'error')
    const p: RoundPrescription = {
      id: `np-${Date.now()}`,
      drug: newPresc.drug ?? '',
      dose: newPresc.dose ?? '',
      unit: newPresc.unit ?? 'мг',
      route: newPresc.route ?? 'перорально',
      frequency: newPresc.frequency ?? '1р/д',
      form: newPresc.form ?? '',
      regimen: newPresc.regimen ?? '',
      comment: newPresc.comment ?? '',
      action: 'new'
    }
    setForm((prev) => ({ ...prev, prescriptions: [...prev.prescriptions, p] }))
    setNewPresc({})
    setShowPrescModal(false)
    showToast('Назначение добавлено', 'success')
  }

  const removePresc = (id: string) => {
    setForm((prev) => ({ ...prev, prescriptions: prev.prescriptions.filter((p) => p.id !== id) }))
  }

  const handleSaveDraft = () => {
    setField('status', 'draft')
    saveDraft(`${patientId}-primary`, { ...form, status: 'draft' })
    showToast('Черновик сохранен', 'success')
  }

  const handleComplete = async () => {
    // Validation
    if (!form.inspectionDate) return showToast('Укажите дату осмотра', 'error')
    if (!form.inspectionTime) return showToast('Укажите время осмотра', 'error')
    if (!form.doctor) return showToast('Укажите врача', 'error')
    if (form.complaints.length === 0) return showToast('Укажите жалобы (или «Нет жалоб»)', 'error')
    if (!form.primaryDiagnosis) return showToast('Укажите клинический диагноз', 'error')

    try {
      const text = generatePrimaryText(form, patient)

      const finalForm = {
        ...form,
        generatedText: text,
        status: 'completed' as const,
        doctorDisplayName: form.doctor
      }
      const formJson = JSON.stringify(finalForm)

      setForm(finalForm)

      const bpStr =
        form.bpRightSys && form.bpRightDia
          ? `${form.bpRightSys}/${form.bpRightDia}`
          : form.bpRightSys

      const activeMeds = form.prescriptions
        .filter((p) => p.action !== 'cancel')
        .map((p) => ({ name: p.drug, dose: p.dose, form: p.form, regimen: p.regimen }))

      const medicalProblems: any[] = []
      if (form.primaryDiagnosis) {
        medicalProblems.push({
          id: '00000000-0000-0000-0000-000000000000',
          name: form.primaryDiagnosis,
          isActive: true,
          diseaseStatus: 'Активное',
          diagnosisDate: toBackendDateTimeString(new Date())
        })
      }
      if (form.comorbidities) {
        form.comorbidities.forEach((c) => {
          if (c.diagnosis) {
            medicalProblems.push({
              id:
                c.id?.startsWith('cm-') || c.id?.startsWith('mp-')
                  ? '00000000-0000-0000-0000-000000000000'
                  : c.id,
              name: c.diagnosis,
              isActive:
                c.activity === 'Активное' || c.activity === 'active' || c.activity === 'Активно',
              diseaseStatus: c.activity || 'Активное',
              diagnosisDate: c.diagnosisDate
                ? toBackendDateTimeString(c.diagnosisDate)
                : toBackendDateTimeString(new Date()),
              severity: c.severity || '',
              complications: c.complications || ''
            })
          }
        })
      }

      const allergies: any[] = (form.allergies || []).map((a) => ({
        id:
          a.id?.startsWith('alg-') || a.id?.startsWith('all-') || a.id?.startsWith('a-')
            ? '00000000-0000-0000-0000-000000000000'
            : a.id,
        name: a.name,
        reaction: a.reaction,
        date: a.date ? toBackendDateTimeString(a.date) : null,
        comment: a.comment || ''
      }))

      const operations: any[] = (form.operations || []).map((o) => ({
        id: o.id?.startsWith('op-') ? '00000000-0000-0000-0000-000000000000' : o.id,
        name: o.name,
        date: o.date ? toBackendDateTimeString(o.date) : undefined,
        description: o.comment || '',
        diagnosis: o.diagnosis || '',
        result: o.result || '',
        complications: o.complications || ''
      }))

      const prescriptions: any[] = form.prescriptions
        .filter((p) => p.action !== 'cancel')
        .map((p) => {
          const original = (patient as any)?.prescriptions?.find((op: any) => op.id === p.id)
          const doseStr = p.dose && p.unit ? `${p.dose} ${p.unit}` : p.dose
          return {
            ...(original || {}),
            id:
              p.id?.startsWith('med-') || p.id?.startsWith('np-') || p.id?.startsWith('presc-')
                ? '00000000-0000-0000-0000-000000000000'
                : p.id,
            drug: p.drug,
            dose: doseStr,
            form: p.form,
            route: p.route,
            regimen: p.frequency || p.regimen,
            dateStart: original?.dateStart || toBackendDateTimeString(new Date()),
            doctorName: original?.doctorName || form.doctor,
            comment: p.comment || original?.comment || ''
          }
        })

      const checkedLabs = form.labTests.filter((t) => t.checked)
      const labs: any[] = checkedLabs.map((t) => ({
        id: '00000000-0000-0000-0000-000000000000',
        date: toBackendDateTimeString(new Date()),
        type: t.name,
        reason: form.inspectionType === 'primary' ? 'Первичный осмотр' : 'Повторный осмотр',
        doctorName: form.doctor,
        statusText: 'Назначено'
      }))

      await updatePatientRoundData(
        patientId,
        {
          hr: form.hr || undefined,
          bp: bpStr || undefined,
          spo2: form.spo2 || undefined,
          resp: form.rr || undefined,
          temp: form.complaintParams.fever?.maxTemp || undefined
        },
        form.primaryDiagnosis,
        undefined, // meds shouldn't be overwritten by prescriptions
        {
          doctorName: form.doctor,
          departmentName: form.department,
          allergies,
          operations,
          medicalProblems,
          prescriptions,
          labs
        }
      )

      const getPrescriptionsDiffPrimary = (oldMeds: any[], newPrescs: RoundPrescription[]) => {
        if (oldMeds.length === 0 && newPrescs.length === 0) return 'Назначений нет.'

        const oldMap = new Map(oldMeds.map((m, i) => [`med-${i}`, m]))
        const newMap = new Map(newPrescs.map((p) => [p.id, p]))

        const added: string[] = []
        const removed: string[] = []
        const changed: string[] = []

        oldMap.forEach((oldMed, id) => {
          if (!newMap.has(id)) {
            removed.push(`${oldMed.name} (${oldMed.dose})`)
          } else {
            const newMed = newMap.get(id)!
            if (
              newMed.drug !== oldMed.name ||
              newMed.dose !== oldMed.dose ||
              newMed.route !== oldMed.route ||
              newMed.frequency !== oldMed.regimen
            ) {
              changed.push(
                `${oldMed.name} ${oldMed.dose} -> ${newMed.drug} ${newMed.dose} ${newMed.unit} ${newMed.route}`
              )
            }
          }
        })

        newMap.forEach((newMed, id) => {
          if (id.startsWith('np-') || !oldMap.has(id)) {
            added.push(`${newMed.drug} ${newMed.dose}${newMed.unit}`)
          }
        })

        const parts: string[] = []
        if (added.length) parts.push(`Добавлено: ${added.join(', ')}`)
        if (removed.length) parts.push(`Убрано: ${removed.join(', ')}`)
        if (changed.length) parts.push(`Изменено: ${changed.join('; ')}`)

        if (parts.length === 0) return 'Не изменились.'
        return parts.join('.\n')
      }

      const COMPLAINT_ACCUSATIVE_RU: Record<ComplaintKey, string> = {
        none: 'жалоб нет',
        weakness: 'общую слабость',
        cough_dry: 'малопродуктивный кашель',
        cough_productive: 'продуктивный кашель',
        dyspnea_exertion: 'одышку при физической нагрузке',
        dyspnea_rest: 'одышку в покое',
        fever: 'повышение температуры',
        chest_pain: 'боль в грудной клетке',
        sweating: 'повышенную потливость',
        dizziness: 'головокружение',
        nausea: 'тошноту',
        other: 'другие симптомы'
      }

      const complaintsText =
        form.complaints.includes('none') || form.complaints.filter((c) => c !== 'none').length === 0
          ? 'Жалоб не предъявляет.'
          : `Жалобы на ${form.complaints
              .filter((c) => c !== 'none')
              .map((c) => {
                let t = COMPLAINT_ACCUSATIVE_RU[c] || c
                if (c === 'fever' && form.complaintParams.fever?.maxTemp)
                  t += ` до ${form.complaintParams.fever.maxTemp}°C`
                return t
              })
              .join(', ')}.` + (form.complaintsNote ? ` ${form.complaintsNote}` : '')

      const splitText = text.split('\n\n')
      const objectiveParts = splitText.filter((p) => {
        const lower = p.toLowerCase()
        if (lower.startsWith('первичный осмотр') || lower.startsWith('повторный осмотр'))
          return false
        if (lower.startsWith('жалобы:')) return false
        if (lower.startsWith('anamnesis morbi:') || lower.startsWith('anamnesis vitae:'))
          return false
        if (lower.startsWith('клинический диагноз:')) return false
        if (lower.startsWith('план обследования:')) return false
        return p.trim().length > 0 && p !== form.complaintsNote
      })

      const entryPayload = {
        dateTime: `${form.inspectionDate} ${form.inspectionTime}`,
        type: form.inspectionType === 'primary' ? 'Первичный осмотр' : 'Повторный осмотр',
        doctor: form.doctor,
        conclusion: text,
        complaints: complaintsText,
        objective: objectiveParts.join('\n\n'),
        recommendations: getPrescriptionsDiffPrimary(
          patient?.currentMeds || [],
          form.prescriptions
        ),
        formData: formJson
      }

      if (editingEncounterId) {
        await updateHistoryEntry(patientId, editingEncounterId, entryPayload)

        const insp: SavedInspection = {
          id: editingEncounterId,
          type: form.inspectionType === 'primary' ? 'primary' : 'daily',
          date: form.inspectionDate,
          time: form.inspectionTime,
          doctor: form.doctor,
          department: form.department,
          diagnosis: form.primaryDiagnosis,
          vitals: {
            temp: form.complaintParams.fever?.maxTemp,
            hr: form.hr,
            bp: bpStr,
            spo2: form.spo2,
            rr: form.rr
          },
          prescriptions: form.prescriptions,
          labTests: form.labTests.filter((t) => t.checked),
          generatedText: text,
          formData: formJson
        }
        saveInspection(patientId, insp)
      } else {
        const saved = await addHistoryEntry(patientId, entryPayload)
        const realId = saved.id

        const insp: SavedInspection = {
          id: realId,
          type: form.inspectionType === 'primary' ? 'primary' : 'daily',
          date: form.inspectionDate,
          time: form.inspectionTime,
          doctor: form.doctor,
          department: form.department,
          diagnosis: form.primaryDiagnosis,
          vitals: {
            temp: form.complaintParams.fever?.maxTemp,
            hr: form.hr,
            bp: bpStr,
            spo2: form.spo2,
            rr: form.rr
          },
          prescriptions: form.prescriptions,
          labTests: form.labTests.filter((t) => t.checked),
          generatedText: text,
          formData: formJson
        }
        saveInspection(patientId, insp)
        setEditingEncounterId(realId)
      }

      setShowGenText(true)
      showToast('Осмотр сохранен в карточке пациента', 'success')
      saveDraft(`${patientId}-primary`, null)
    } catch (err) {
      console.error(err)
      showToast(err instanceof Error ? err.message : 'Ошибка сохранения осмотра', 'error')
    }
  }

  const handleCreateReferral = () => {
    setShowReferralModal(true)
  }

  const blockDone: Record<string, boolean> = {
    info: !!form.inspectionDate,
    complaints: form.complaints.length > 0,
    'anamnesis-morbi': !!form.illnessStartDate || !!form.hospitalizationReason,
    'anamnesis-vitae': form.tbStatus !== null || form.hivStatus !== null,
    objective: !!(form.generalCondition && form.consciousness),
    diagnosis: !!form.primaryDiagnosis,
    prescriptions: form.prescriptions.length > 0,
    examplan: form.labTests.some((t) => t.checked)
  }

  useEffect(() => {
    if (onRegisterActions) {
      onRegisterActions({
        handleSaveDraft,
        handleComplete,
        inspectionTime: form.inspectionTime
      })
    }
    // Cleanup on unmount or when handlers change
    return () => {
      if (onRegisterActions) onRegisterActions(null)
    }
  }, [onRegisterActions, form.inspectionTime, handleSaveDraft, handleComplete])

  if (!patient) {
    return (
      <div
        style={{
          ...s.root,
          height: hideHeader ? '100%' : 'calc(100vh - 84px)',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ color: '#94a3b8', fontSize: 16 }}>Пациент не найден</div>
      </div>
    )
  }

  return (
    <div style={{ ...s.root, height: hideHeader ? '100%' : 'calc(100vh - 84px)' }}>
      {!hideHeader && (
        <PatientHeader
          style={{
            background: 'white',
            color: '#0f172a',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <HeaderBtn
            variant="ghost"
            onClick={onClose}
            style={{ color: '#475569', background: '#f1f5f9', flexShrink: 0 }}
          >
            <ChevronLeft size={15} /> Обходы
          </HeaderBtn>

          <PatientAvatar
            style={{
              width: '40px',
              height: '40px',
              fontSize: '14px',
              boxShadow: 'none',
              flexShrink: 0
            }}
          >
            {patient.lastName?.[0] || ''}
            {patient.firstName?.[0] || ''}
          </PatientAvatar>

          <PatientInfo style={{ flex: 1, minWidth: 0, marginRight: '16px' }}>
            <PatientName
              style={{
                fontSize: '15px',
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Первичный осмотр: {patient.lastName} {patient.firstName} {patient.middleName}
            </PatientName>
            <PatientMeta style={{ opacity: 0.8, color: '#64748b' }}>
              <PatientMetaItem>
                <strong>Палата:</strong> {patient.department}
              </PatientMetaItem>
              <PatientMetaItem>
                <strong>Возраст:</strong> {patient.age} лет
              </PatientMetaItem>
              <PatientMetaItem>
                <strong>МК:</strong> {patient.medcardNum}
              </PatientMetaItem>
            </PatientMeta>
          </PatientInfo>

          <HeaderRight style={{ flexShrink: 0, flexWrap: 'nowrap' }}>
            {!isMobile && (
              <>
                <HeaderBtn variant="ghost" onClick={handleSaveDraft}>
                  <Save size={14} /> Черновик
                </HeaderBtn>
                <HeaderBtn variant="primary" onClick={handleComplete}>
                  <Check size={14} /> Завершить осмотр
                </HeaderBtn>
              </>
            )}
            <HeaderBtn
              variant="ghost"
              onClick={onClose}
              style={{ padding: '7px 10px', flexShrink: 0 }}
            >
              <X size={15} />
            </HeaderBtn>
          </HeaderRight>
        </PatientHeader>
      )}

      <div
        style={{
          ...s.body,
          flexDirection: isMobile ? 'column' : 'row',
          overflow: isMobile ? 'visible' : 'hidden'
        }}
      >
        <nav
          style={{
            width: isMobile ? '100%' : sidebarCollapsed ? 64 : 220,
            transition: 'width 0.2s ease-in-out',
            flexShrink: 0,
            background: 'white',
            borderRight: isMobile ? 'none' : '1px solid #e5e7eb',
            borderBottom: isMobile ? '1px solid #e5e7eb' : 'none',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden'
          }}
        >
          <div
            style={{
              padding: isMobile ? '8px 16px' : '12px 0',
              overflowX: isMobile ? 'auto' : 'hidden',
              overflowY: isMobile ? 'hidden' : 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              gap: isMobile ? 8 : 0
            }}
          >
            {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                style={{
                  width: isMobile ? 'auto' : '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  padding: isMobile ? '8px 12px' : '10px 8px',
                  border: 'none',
                  background: activeSection === id ? '#eff6ff' : 'transparent',
                  color: activeSection === id ? '#1d4ed8' : '#374151',
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: activeSection === id ? 600 : 450,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  borderLeft: isMobile
                    ? 'none'
                    : `3px solid ${activeSection === id ? '#1d4ed8' : 'transparent'}`,
                  borderBottom: isMobile
                    ? `3px solid ${activeSection === id ? '#1d4ed8' : 'transparent'}`
                    : 'none',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  borderRadius: isMobile ? 6 : 0
                }}
                title={sidebarCollapsed && !isMobile ? label : undefined}
                onClick={() => scrollTo(id)}
              >
                <Icon size={14} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    display: sidebarCollapsed && !isMobile ? 'none' : 'inline',
                    marginLeft: 8,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: blockDone[id] ? '#22c55e' : '#d1d5db',
                    flexShrink: 0,
                    position: sidebarCollapsed && !isMobile ? 'absolute' : 'static',
                    top: sidebarCollapsed && !isMobile ? 8 : undefined,
                    right: sidebarCollapsed && !isMobile ? 8 : undefined,
                    marginLeft: sidebarCollapsed && !isMobile ? 0 : 8
                  }}
                />
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: 'auto',
              borderTop: '1px solid #f1f5f9',
              padding: '10px 0',
              display: isMobile ? 'none' : 'flex',
              justifyContent: 'center'
            }}
          >
            <button
              onClick={() => {
                const next = !sidebarCollapsed
                setSidebarCollapsed(next)
                localStorage.setItem('primary_round_sidebar_collapsed', String(next))
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '8px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: '12px',
                fontFamily: FONT,
                fontWeight: 600
              }}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={16} style={{ flexShrink: 0 }} />
              ) : (
                <>
                  <ChevronLeft size={16} style={{ flexShrink: 0 }} /> Свернуть
                </>
              )}
            </button>
          </div>
        </nav>

        <div style={{ ...s.centerForm, padding: isMobile ? '16px' : '20px 24px' }}>
          {isMobile && (
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 16,
                background: 'white',
                padding: 12,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}
            >
              <button
                onClick={handleSaveDraft}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  background: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 600,
                  border: 'none',
                  fontFamily: FONT,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Черновик
              </button>
              <button
                onClick={handleComplete}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  background: '#3b82f6',
                  color: 'white',
                  fontWeight: 600,
                  border: 'none',
                  fontFamily: FONT,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Завершить
              </button>
            </div>
          )}

          <div
            ref={(el) => {
              sectionRefs.current['info'] = el
            }}
            style={s.block}
          >
            <div style={s.blockHeader}>
              <div style={s.blockIcon}>
                <Calendar size={16} />
              </div>
              <div style={s.blockTitle}>Информация об осмотре</div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 20,
                  background: '#dcfce7',
                  color: '#166534',
                  letterSpacing: '0.03em'
                }}
              >
                Авто
              </span>
            </div>
            <div style={s.blockBody}>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Дата осмотра</label>
                  <input
                    type="date"
                    style={s.input}
                    value={form.inspectionDate}
                    onChange={(e) => setField('inspectionDate', e.target.value)}
                  />
                </div>
                <div>
                  <label style={s.label}>Время</label>
                  <input
                    type="time"
                    style={s.input}
                    value={form.inspectionTime}
                    onChange={(e) => setField('inspectionTime', e.target.value)}
                  />
                </div>
              </div>
              <div style={{ ...s.row, marginTop: 12 }}>
                <FieldInput
                  label="Врач"
                  value={form.doctor}
                  onChange={(v) => setField('doctor', v)}
                />
                <FieldInput
                  label="Отделение"
                  value={form.department}
                  onChange={(v) => setField('department', v)}
                />
              </div>
              <FieldInput
                label="Учреждение"
                value={form.institution}
                onChange={(v) => setField('institution', v)}
              />

              <div style={s.subsection}>Тип осмотра</div>
              <div style={s.pillGroup}>
                <PillBtn
                  active={form.inspectionType === 'primary'}
                  color="blue"
                  onClick={() => setField('inspectionType', 'primary')}
                >
                  ○ Первичный
                </PillBtn>
                <PillBtn
                  active={form.inspectionType === 'repeated'}
                  color="blue"
                  onClick={() => setField('inspectionType', 'repeated')}
                >
                  ○ Повторный
                </PillBtn>
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current['complaints'] = el
            }}
            style={s.block}
          >
            <div style={s.blockHeader}>
              <div style={s.blockIcon}>
                <PenLine size={16} />
              </div>
              <div style={s.blockTitle}>Жалобы пациента</div>
            </div>
            <div style={s.blockBody}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(Object.keys(COMPLAINT_LABELS) as ComplaintKey[]).map((k) => (
                  <CheckBtnComp
                    key={k}
                    checked={form.complaints.includes(k)}
                    onClick={() => toggleComplaint(k)}
                  >
                    {COMPLAINT_LABELS[k]}
                  </CheckBtnComp>
                ))}
              </div>

              {form.complaints.includes('fever') && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '12px 14px',
                    background: '#fff7ed',
                    borderRadius: 8,
                    border: '1px solid #fed7aa'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#9a3412', marginBottom: 8 }}>
                    Повышение температуры - параметры
                  </div>
                  <div style={s.row}>
                    <div>
                      <label style={s.label}>Максимальная температура (°C)</label>
                      <input
                        type="number"
                        min="35"
                        max="43"
                        step="0.1"
                        style={s.input}
                        placeholder="38.0"
                        value={form.complaintParams.fever?.maxTemp ?? ''}
                        onChange={(e) => setComplaintParam('fever', { maxTemp: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
              {(form.complaints.includes('dyspnea_exertion') ||
                form.complaints.includes('dyspnea_rest')) && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '12px 14px',
                    background: '#eff6ff',
                    borderRadius: 8,
                    border: '1px solid #bfdbfe'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8', marginBottom: 8 }}>
                    Одышка - степень
                  </div>
                  <div style={s.pillGroup}>
                    {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                      <PillBtn
                        key={sev}
                        active={
                          (form.complaintParams.dyspnea_exertion?.severity === sev &&
                            form.complaints.includes('dyspnea_exertion')) ||
                          (form.complaintParams.dyspnea_rest?.severity === sev &&
                            form.complaints.includes('dyspnea_rest'))
                        }
                        color="blue"
                        onClick={() => {
                          if (form.complaints.includes('dyspnea_exertion'))
                            setComplaintParam('dyspnea_exertion', { severity: sev })
                          if (form.complaints.includes('dyspnea_rest'))
                            setComplaintParam('dyspnea_rest', { severity: sev })
                        }}
                      >
                        {sev === 'mild'
                          ? 'Легкая'
                          : sev === 'moderate'
                            ? 'Умеренная'
                            : 'Выраженная'}
                      </PillBtn>
                    ))}
                  </div>
                </div>
              )}
              {form.complaints.includes('cough_productive') && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '12px 14px',
                    background: '#f0fdf4',
                    borderRadius: 8,
                    border: '1px solid #bbf7d0'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#166534', marginBottom: 8 }}>
                    Продуктивный кашель - мокрота
                  </div>
                  <div style={s.row}>
                    <FieldInput
                      label="Цвет мокроты"
                      value={form.complaintParams.cough_productive?.sputumColor ?? ''}
                      onChange={(v) =>
                        setComplaintParam('cough_productive', {
                          sputumColor: v,
                          sputumAmount: form.complaintParams.cough_productive?.sputumAmount ?? ''
                        })
                      }
                      placeholder="слизистая, гнойная..."
                    />
                    <FieldInput
                      label="Количество"
                      value={form.complaintParams.cough_productive?.sputumAmount ?? ''}
                      onChange={(v) =>
                        setComplaintParam('cough_productive', {
                          sputumColor: form.complaintParams.cough_productive?.sputumColor ?? '',
                          sputumAmount: v
                        })
                      }
                      placeholder="скудное, умеренное..."
                    />
                  </div>
                </div>
              )}

              <div style={{ marginTop: 14 }}>
                <label style={s.label}>Дополнение врача</label>
                <textarea
                  style={s.textarea}
                  placeholder="Уточнения, детализация жалоб..."
                  value={form.complaintsNote}
                  onChange={(e) => setField('complaintsNote', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current['anamnesis-morbi'] = el
            }}
            style={s.block}
          >
            <div style={s.blockHeader}>
              <div style={s.blockIcon}>
                <FileText size={16} />
              </div>
              <div style={s.blockTitle}>Anamnesis morbi (анамнез заболевания)</div>
            </div>
            <div style={s.blockBody}>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Дата начала заболевания</label>
                  <input
                    type="date"
                    style={s.input}
                    value={form.illnessStartDate}
                    onChange={(e) => setField('illnessStartDate', e.target.value)}
                  />
                </div>
                <div>
                  <label style={s.label}>Дата обращения</label>
                  <input
                    type="date"
                    style={s.input}
                    value={form.hospitalizationDate}
                    onChange={(e) => setField('hospitalizationDate', e.target.value)}
                  />
                </div>
              </div>

              <div style={s.subsection}>Причина начала заболевания</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  ['cold', 'Переохлаждение'],
                  ['infection', 'Инфекция'],
                  ['contact', 'Контакт'],
                  ['unknown', 'Неизвестно']
                ].map(([val, label]) => (
                  <CheckBtnComp
                    key={val}
                    checked={form.illnessCauses.includes(val as any)}
                    onClick={() => {
                      const causes = form.illnessCauses.includes(val as any)
                        ? form.illnessCauses.filter((c) => c !== val)
                        : [...form.illnessCauses, val as any]
                      setField('illnessCauses', causes)
                    }}
                  >
                    {label}
                  </CheckBtnComp>
                ))}
              </div>

              <div style={s.subsection}>Лечение до госпитализации</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  ['outpatient', 'Амбулаторное'],
                  ['inpatient', 'Стационарное']
                ].map(([val, label]) => (
                  <CheckBtnComp
                    key={val}
                    checked={form.preTreatment.includes(val as any)}
                    onClick={() => {
                      const t = form.preTreatment.includes(val as any)
                        ? form.preTreatment.filter((x) => x !== val)
                        : [...form.preTreatment, val as any]
                      setField('preTreatment', t)
                    }}
                  >
                    {label}
                  </CheckBtnComp>
                ))}
              </div>

              {form.preTreatment.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <FieldInput
                    label="Чем лечился"
                    value={form.preTreatmentDetails}
                    onChange={(v) => setField('preTreatmentDetails', v)}
                    placeholder="Препараты, процедуры..."
                  />
                  <div style={{ marginTop: 10 }}>
                    <label style={s.label}>Эффект лечения</label>
                    <div style={s.pillGroup}>
                      {[
                        ['improvement', 'Улучшение', 'green'],
                        ['no_change', 'Без изменений', 'blue'],
                        ['deterioration', 'Ухудшение', 'red']
                      ].map(([val, label, color]) => (
                        <PillBtn
                          key={val}
                          active={form.preTreatmentEffect === val}
                          color={color}
                          onClick={() => setField('preTreatmentEffect', val as any)}
                        >
                          {label}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <label style={s.label}>Причина госпитализации</label>
                <textarea
                  style={{ ...s.textarea, minHeight: 60 }}
                  placeholder="Причина направления..."
                  value={form.hospitalizationReason}
                  onChange={(e) => setField('hospitalizationReason', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current['anamnesis-vitae'] = el
            }}
            style={s.block}
          >
            <div style={s.blockHeader}>
              <div style={s.blockIcon}>
                <User size={16} />
              </div>
              <div style={s.blockTitle}>Anamnesis vitae</div>
            </div>
            <div style={s.blockBody}>
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Инфекционный анамнез</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    {
                      label: 'Туберкулез',
                      field: 'tbStatus' as const,
                      opts: [
                        ['denies', 'Отрицает'],
                        ['confirms', 'Подтверждает']
                      ]
                    },
                    {
                      label: 'Контакт с туберкулезом',
                      field: 'tbContact' as const,
                      opts: [
                        ['no', 'Нет'],
                        ['yes', 'Да']
                      ]
                    },
                    {
                      label: 'ВИЧ',
                      field: 'hivStatus' as const,
                      opts: [
                        ['negative', 'Отрицательный'],
                        ['positive', 'Положительный']
                      ]
                    },
                    {
                      label: 'Гепатит',
                      field: 'hepatitisStatus' as const,
                      opts: [
                        ['negative', 'Отрицательный'],
                        ['positive', 'Положительный']
                      ]
                    },
                    {
                      label: 'Венерические заболевания',
                      field: 'stdStatus' as const,
                      opts: [
                        ['denies', 'Отрицает'],
                        ['has', 'Имеются']
                      ]
                    }
                  ].map(({ label, field, opts }) => (
                    <div key={field}>
                      <div
                        style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}
                      >
                        {label}
                      </div>
                      <div style={s.pillGroup}>
                        {opts.map(([val, lbl]) => (
                          <PillBtn
                            key={val}
                            active={(form as any)[field] === val}
                            color={
                              val === 'positive' ||
                              val === 'yes' ||
                              val === 'confirms' ||
                              val === 'has'
                                ? 'red'
                                : 'green'
                            }
                            onClick={() => setField(field as any, val as any)}
                          >
                            {lbl}
                          </PillBtn>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>Аллергологический анамнез</div>
                <div style={s.pillGroup}>
                  <PillBtn
                    active={form.allergyStatus === 'none'}
                    color="green"
                    onClick={() => setField('allergyStatus', 'none')}
                  >
                    Не отягощен
                  </PillBtn>
                  <PillBtn
                    active={form.allergyStatus === 'has'}
                    color="red"
                    onClick={() => setField('allergyStatus', 'has')}
                  >
                    Имеются аллергии
                  </PillBtn>
                </div>
                {form.allergyStatus === 'has' && (
                  <div style={{ marginTop: 10 }}>
                    {form.allergies.map((a, i) => (
                      <div
                        key={a.id}
                        style={{
                          background: '#fef9f0',
                          borderRadius: 8,
                          padding: '10px 12px',
                          marginBottom: 8,
                          border: '1px solid #fed7aa'
                        }}
                      >
                        <div
                          style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}
                        >
                          <input
                            style={{ ...s.input, flex: 2 }}
                            placeholder="Аллерген"
                            value={a.name}
                            onChange={(e) =>
                              setField(
                                'allergies',
                                form.allergies.map((x, j) =>
                                  j === i ? { ...x, name: e.target.value } : x
                                )
                              )
                            }
                          />
                          <input
                            style={{ ...s.input, flex: 2 }}
                            placeholder="Реакция"
                            value={a.reaction}
                            onChange={(e) =>
                              setField(
                                'allergies',
                                form.allergies.map((x, j) =>
                                  j === i ? { ...x, reaction: e.target.value } : x
                                )
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              setField(
                                'allergies',
                                form.allergies.filter((_, j) => j !== i)
                              )
                            }
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#ef4444'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                          <div>
                            <label style={s.label}>Дата выявления</label>
                            <input
                              type="date"
                              style={s.input}
                              value={a.date ?? ''}
                              onChange={(e) =>
                                setField(
                                  'allergies',
                                  form.allergies.map((x, j) =>
                                    j === i ? { ...x, date: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </div>
                          <div>
                            <label style={s.label}>Комментарий</label>
                            <input
                              style={s.input}
                              placeholder="Доп. сведения..."
                              value={a.comment ?? ''}
                              onChange={(e) =>
                                setField(
                                  'allergies',
                                  form.allergies.map((x, j) =>
                                    j === i ? { ...x, comment: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setField('allergies', [
                          ...form.allergies,
                          { id: `a-${Date.now()}`, name: '', reaction: '', date: '', comment: '' }
                        ])
                      }
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: '#1d4ed8',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontFamily: FONT
                      }}
                    >
                      <Plus size={14} /> Добавить аллергию
                    </button>
                  </div>
                )}
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>Операции</div>
                <CheckBtnComp
                  checked={form.operationsStatus === 'none'}
                  onClick={() => setField('operationsStatus', 'none')}
                >
                  Отсутствуют
                </CheckBtnComp>
                {form.operationsStatus !== 'none' && (
                  <div style={{ marginTop: 10 }}>
                    {form.operations.map((op, i) => (
                      <div
                        key={op.id}
                        style={{
                          background: '#f8fafc',
                          borderRadius: 8,
                          padding: 10,
                          marginBottom: 8,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                          <div style={{ flex: '0 0 140px' }}>
                            <label style={s.label}>Дата</label>
                            <input
                              type="date"
                              style={s.input}
                              value={op.date}
                              onChange={(e) =>
                                setField(
                                  'operations',
                                  form.operations.map((x, j) =>
                                    j === i ? { ...x, date: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={s.label}>Название операции</label>
                            <input
                              style={s.input}
                              placeholder="Название"
                              value={op.name}
                              onChange={(e) =>
                                setField(
                                  'operations',
                                  form.operations.map((x, j) =>
                                    j === i ? { ...x, name: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </div>
                          <button
                            onClick={() =>
                              setField(
                                'operations',
                                form.operations.filter((_, j) => j !== i)
                              )
                            }
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#ef4444',
                              alignSelf: 'flex-end',
                              marginBottom: 2
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 8,
                            marginBottom: 6
                          }}
                        >
                          <div>
                            <label style={s.label}>Диагноз</label>
                            <input
                              style={s.input}
                              placeholder="Диагноз..."
                              value={op.diagnosis ?? ''}
                              onChange={(e) =>
                                setField(
                                  'operations',
                                  form.operations.map((x, j) =>
                                    j === i ? { ...x, diagnosis: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </div>
                          <div>
                            <label style={s.label}>Результат</label>
                            <input
                              style={s.input}
                              placeholder="Результат..."
                              value={op.result ?? ''}
                              onChange={(e) =>
                                setField(
                                  'operations',
                                  form.operations.map((x, j) =>
                                    j === i ? { ...x, result: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <label style={s.label}>Осложнения</label>
                            <input
                              style={s.input}
                              placeholder="Осложнения..."
                              value={op.complications ?? ''}
                              onChange={(e) =>
                                setField(
                                  'operations',
                                  form.operations.map((x, j) =>
                                    j === i ? { ...x, complications: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </div>
                          <div>
                            <label style={s.label}>Комментарий</label>
                            <input
                              style={s.input}
                              placeholder="Комментарий"
                              value={op.comment}
                              onChange={(e) =>
                                setField(
                                  'operations',
                                  form.operations.map((x, j) =>
                                    j === i ? { ...x, comment: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setField('operations', [
                          ...form.operations,
                          {
                            id: `op-${Date.now()}`,
                            date: '',
                            name: '',
                            comment: '',
                            diagnosis: '',
                            result: '',
                            complications: ''
                          }
                        ])
                      }
                      style={{
                        fontSize: 13,
                        color: '#1d4ed8',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontFamily: FONT
                      }}
                    >
                      <Plus size={14} /> Добавить операцию
                    </button>
                  </div>
                )}
                {form.operationsStatus === 'none' && (
                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => setField('operationsStatus', 'has')}
                      style={{
                        fontSize: 12,
                        color: '#1d4ed8',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: FONT
                      }}
                    >
                      Добавить операцию
                    </button>
                  </div>
                )}
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>Сопутствующие заболевания</div>
                {form.comorbidities.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {[
                          'Диагноз',
                          'Активность',
                          'Степень тяжести',
                          'Дата диагноза',
                          'Осложнения',
                          ''
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: 'left',
                              padding: '6px 8px',
                              fontSize: 11,
                              color: '#94a3b8',
                              fontWeight: 600,
                              background: '#f8fafc',
                              borderBottom: '1px solid #f1f5f9'
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.comorbidities.map((c, i) => (
                        <tr key={c.id}>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <input
                              style={s.input}
                              value={c.diagnosis}
                              placeholder="Диагноз..."
                              onChange={(e) =>
                                setField(
                                  'comorbidities',
                                  form.comorbidities.map((x, j) =>
                                    j === i ? { ...x, diagnosis: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <input
                              style={s.input}
                              value={c.activity}
                              placeholder="Активность..."
                              onChange={(e) =>
                                setField(
                                  'comorbidities',
                                  form.comorbidities.map((x, j) =>
                                    j === i ? { ...x, activity: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <input
                              style={s.input}
                              value={c.severity ?? ''}
                              placeholder="Степень..."
                              onChange={(e) =>
                                setField(
                                  'comorbidities',
                                  form.comorbidities.map((x, j) =>
                                    j === i ? { ...x, severity: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <input
                              type="date"
                              style={s.input}
                              value={c.diagnosisDate ?? ''}
                              onChange={(e) =>
                                setField(
                                  'comorbidities',
                                  form.comorbidities.map((x, j) =>
                                    j === i ? { ...x, diagnosisDate: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <input
                              style={s.input}
                              value={c.complications ?? ''}
                              placeholder="Осложнения..."
                              onChange={(e) =>
                                setField(
                                  'comorbidities',
                                  form.comorbidities.map((x, j) =>
                                    j === i ? { ...x, complications: e.target.value } : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <button
                              onClick={() =>
                                setField(
                                  'comorbidities',
                                  form.comorbidities.filter((_, j) => j !== i)
                                )
                              }
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#ef4444'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>
                    Нет сопутствующих заболеваний
                  </div>
                )}
                <button
                  onClick={() =>
                    setField('comorbidities', [
                      ...form.comorbidities,
                      {
                        id: `cm-${Date.now()}`,
                        diagnosis: '',
                        activity: 'Активное',
                        severity: '',
                        diagnosisDate: '',
                        complications: ''
                      }
                    ])
                  }
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: '#1d4ed8',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontFamily: FONT
                  }}
                >
                  <Plus size={14} /> Добавить
                </button>
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>Вредные привычки</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <PillBtn
                    active={form.badHabitsStatus === 'none'}
                    color="green"
                    onClick={() => setField('badHabitsStatus', 'none')}
                  >
                    Нет
                  </PillBtn>
                  <PillBtn
                    active={form.badHabitsStatus === 'has'}
                    color="orange"
                    onClick={() => setField('badHabitsStatus', 'has')}
                  >
                    Имеются
                  </PillBtn>
                </div>
                {form.badHabitsStatus === 'has' && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <CheckBtnComp
                        checked={form.smoking}
                        onClick={() => setField('smoking', !form.smoking)}
                      >
                        Курение
                      </CheckBtnComp>
                      <CheckBtnComp
                        checked={form.alcohol}
                        onClick={() => setField('alcohol', !form.alcohol)}
                      >
                        Алкоголь
                      </CheckBtnComp>
                    </div>
                    {form.smoking && (
                      <div style={{ marginTop: 8 }}>
                        <label style={s.label}>Стаж курения (лет)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          style={s.input}
                          placeholder="10"
                          value={form.smokingYears}
                          onChange={(e) => setField('smokingYears', e.target.value)}
                        />
                      </div>
                    )}
                    {form.alcohol && (
                      <div style={{ marginTop: 8 }}>
                        <FieldInput
                          label="Алкоголь - подробности"
                          value={form.alcoholDetails}
                          onChange={(v) => setField('alcoholDetails', v)}
                          placeholder="Эпизодически, регулярно..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current['objective'] = el
            }}
            style={s.block}
          >
            <div style={s.blockHeader}>
              <div style={s.blockIcon}>
                <Stethoscope size={16} />
              </div>
              <div style={s.blockTitle}>Объективный статус</div>
            </div>
            <div style={s.blockBody}>
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Общее состояние</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['satisfactory', 'Удовлетворительное', 'green'],
                      ['moderate', 'Средней тяжести', 'orange'],
                      ['severe', 'Тяжелое', 'red'],
                      ['critical', 'Крайне тяжелое', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.generalCondition === val}
                      color={c}
                      onClick={() =>
                        setField('generalCondition', form.generalCondition === val ? null : val)
                      }
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>
                <div style={s.subsection}>Сознание</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['clear', 'Ясное', 'green'],
                      ['drowsy', 'Заторможенное', 'orange'],
                      ['confused', 'Спутанное', 'orange'],
                      ['absent', 'Отсутствует', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.consciousness === val}
                      color={c}
                      onClick={() =>
                        setField('consciousness', form.consciousness === val ? null : val)
                      }
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>
                <div style={s.row}>
                  <div>
                    <div style={s.subsection}>Конституция</div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['normosthenic', 'Нормостеническая'],
                          ['hypersthenic', 'Гиперстеническая'],
                          ['asthenic', 'Астеническая']
                        ] as const
                      ).map(([val, lbl]) => (
                        <PillBtn
                          key={val}
                          active={form.constitution === val}
                          onClick={() =>
                            setField('constitution', form.constitution === val ? null : val)
                          }
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={s.subsection}>Питание</div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['satisfactory', 'Удовлетворительное', 'green'],
                          ['elevated', 'Повышенное', 'orange'],
                          ['reduced', 'Сниженное', 'blue']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.nutrition === val}
                          color={c}
                          onClick={() => setField('nutrition', form.nutrition === val ? null : val)}
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>Кожа и слизистые</div>
                <div style={s.row}>
                  <div>
                    <div
                      style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}
                    >
                      Цвет
                    </div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['pale_pink', 'Бледно-розовая', 'green'],
                          ['pale', 'Бледная', 'blue'],
                          ['hyperemia', 'Гиперемия', 'orange'],
                          ['cyanosis', 'Цианоз', 'blue'],
                          ['icteric', 'Иктеричная', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.skinColor === val}
                          color={c}
                          onClick={() => setField('skinColor', form.skinColor === val ? null : val)}
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}
                    >
                      Температура кожи
                    </div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['warm', 'Теплая', 'green'],
                          ['cold', 'Холодная', 'blue'],
                          ['hot', 'Горячая', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.skinTemp === val}
                          color={c}
                          onClick={() => setField('skinTemp', form.skinTemp === val ? null : val)}
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ ...s.row, marginTop: 12 }}>
                  <div>
                    <div
                      style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}
                    >
                      Влажность
                    </div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['dry', 'Сухая', 'orange'],
                          ['moist', 'Влажная', 'green'],
                          ['excessive', 'Повышенная', 'blue']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.skinMoisture === val}
                          color={c}
                          onClick={() =>
                            setField('skinMoisture', form.skinMoisture === val ? null : val)
                          }
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}
                    >
                      Слизистые
                    </div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['moist', 'Влажные', 'green'],
                          ['dry', 'Сухие', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.mucousState === val}
                          color={c}
                          onClick={() =>
                            setField('mucousState', form.mucousState === val ? null : val)
                          }
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  <CheckBtnComp
                    checked={form.cyanosis}
                    onClick={() => setField('cyanosis', !form.cyanosis)}
                  >
                    Цианоз
                  </CheckBtnComp>
                  <CheckBtnComp
                    checked={form.acrocyanosis}
                    onClick={() => setField('acrocyanosis', !form.acrocyanosis)}
                  >
                    Акроцианоз
                  </CheckBtnComp>
                  <CheckBtnComp
                    checked={form.edemaPresent}
                    onClick={() => setField('edemaPresent', !form.edemaPresent)}
                  >
                    Отеки
                  </CheckBtnComp>
                </div>
                {form.edemaPresent && (
                  <div style={{ marginTop: 8 }}>
                    <FieldInput
                      label="Локализация отеков"
                      value={form.edemaLocation}
                      onChange={(v) => setField('edemaLocation', v)}
                      placeholder="Нижние конечности..."
                    />
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <label style={s.label}>Лимфоузлы</label>
                  <div style={s.pillGroup}>
                    {(
                      [
                        ['not_palpable', 'Не пальпируются', 'green'],
                        ['enlarged', 'Увеличены', 'red']
                      ] as const
                    ).map(([val, lbl, c]) => (
                      <PillBtn
                        key={val}
                        active={form.lymphNodes === val}
                        color={c}
                        onClick={() => setField('lymphNodes', form.lymphNodes === val ? null : val)}
                      >
                        {lbl}
                      </PillBtn>
                    ))}
                  </div>
                </div>
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>Дыхательная система</div>
                <div style={s.row}>
                  <div>
                    <label style={s.label}>Дыхание через нос</label>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['free', 'Свободное', 'green'],
                          ['difficult', 'Затруднено', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.breathingNose === val}
                          color={c}
                          onClick={() =>
                            setField('breathingNose', form.breathingNose === val ? null : val)
                          }
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                  <div style={s.row}>
                    <FieldInput
                      label="ЧДД (в мин.)"
                      value={form.rr}
                      onChange={(v) => setField('rr', v)}
                      placeholder="18"
                    />
                    <FieldInput
                      label="SpO₂ (%)"
                      value={form.spo2}
                      onChange={(v) => setField('spo2', v)}
                      placeholder="98"
                    />
                  </div>
                </div>

                <div style={s.subsection}>Форма грудной клетки</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['normosthenic', 'Нормостеническая'],
                      ['hypersthenic', 'Гиперстеническая'],
                      ['asthenic', 'Астеническая'],
                      ['emphysematous', 'Эмфизематозная']
                    ] as const
                  ).map(([val, lbl]) => (
                    <PillBtn
                      key={val}
                      active={form.chestForm === val}
                      onClick={() => setField('chestForm', form.chestForm === val ? null : val)}
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>

                <div style={s.subsection}>Симметрия</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['symmetric', 'Симметричная', 'green'],
                      ['asymmetric', 'Асимметричная', 'orange']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.chestSymmetry === val}
                      color={c}
                      onClick={() =>
                        setField('chestSymmetry', form.chestSymmetry === val ? null : val)
                      }
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>

                <div style={s.subsection}>Перкуторный звук</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['clear', 'Ясный легочный', 'green'],
                      ['dull', 'Тупой', 'red'],
                      ['tympanic', 'Тимпанит', 'blue'],
                      ['shortened', 'Укорочен', 'orange']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.percussionSound === val}
                      color={c}
                      onClick={() =>
                        setField('percussionSound', form.percussionSound === val ? null : val)
                      }
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>

                <div style={s.subsection}>Аускультация - тип дыхания</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['vesicular', 'Везикулярное', 'green'],
                      ['harsh', 'Жесткое', 'orange'],
                      ['weakened', 'Ослабленное', 'blue'],
                      ['bronchial', 'Бронхиальное', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.breathingType === val}
                      color={c}
                      onClick={() =>
                        setField('breathingType', form.breathingType === val ? null : val)
                      }
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>

                <div style={s.subsection}>Хрипы</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['none', 'Отсутствуют', 'green'],
                      ['dry', 'Сухие', 'orange'],
                      ['moist', 'Влажные', 'blue'],
                      ['crepitation', 'Крепитация', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.ralesType === val}
                      color={c}
                      onClick={() => setField('ralesType', form.ralesType === val ? null : val)}
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>
                {form.ralesType && form.ralesType !== 'none' && (
                  <div style={{ marginTop: 8 }}>
                    <FieldInput
                      label="Локализация хрипов"
                      value={form.ralesLocation}
                      onChange={(v) => setField('ralesLocation', v)}
                      placeholder="В нижних отделах слева..."
                    />
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <FieldInput
                    label="Комментарий"
                    value={form.respiratoryComment}
                    onChange={(v) => setField('respiratoryComment', v)}
                    placeholder="Доп. данные..."
                  />
                </div>
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>Сердечно-сосудистая система</div>
                <div style={s.row3}>
                  <div>
                    <label style={s.label}>ЧСС (уд/мин)</label>
                    <input
                      type="number"
                      min="20"
                      max="250"
                      style={s.input}
                      placeholder="77"
                      value={form.hr}
                      onChange={(e) => setField('hr', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Пульс (уд/мин)</label>
                    <input
                      type="number"
                      min="20"
                      max="250"
                      style={s.input}
                      placeholder="77"
                      value={form.pulse}
                      onChange={(e) => setField('pulse', e.target.value)}
                    />
                  </div>
                  <div />
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
                    АД правая рука (мм рт. ст.)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={s.label}>Систолическое</label>
                      <input
                        type="number"
                        min="60"
                        max="260"
                        style={s.input}
                        placeholder="120"
                        value={form.bpRightSys}
                        onChange={(e) => setField('bpRightSys', e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={s.label}>Диастолическое</label>
                      <input
                        type="number"
                        min="40"
                        max="160"
                        style={s.input}
                        placeholder="80"
                        value={form.bpRightDia}
                        onChange={(e) => setField('bpRightDia', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
                    АД левая рука (мм рт. ст.)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={s.label}>Систолическое</label>
                      <input
                        type="number"
                        min="60"
                        max="260"
                        style={s.input}
                        placeholder="120"
                        value={form.bpLeftSys}
                        onChange={(e) => setField('bpLeftSys', e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={s.label}>Диастолическое</label>
                      <input
                        type="number"
                        min="40"
                        max="160"
                        style={s.input}
                        placeholder="80"
                        value={form.bpLeftDia}
                        onChange={(e) => setField('bpLeftDia', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div style={s.subsection}>Ритм</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['regular', 'Правильный', 'green'],
                      ['irregular', 'Неправильный', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.heartRhythm === val}
                      color={c}
                      onClick={() => setField('heartRhythm', form.heartRhythm === val ? null : val)}
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>
                <div style={s.subsection}>Тоны сердца</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['clear', 'Ясные', 'green'],
                      ['muffled', 'Приглушены', 'orange'],
                      ['deaf', 'Глухие', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.heartTones === val}
                      color={c}
                      onClick={() => setField('heartTones', form.heartTones === val ? null : val)}
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>
                <div style={s.subsection}>Шумы</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['absent', 'Отсутствуют', 'green'],
                      ['systolic', 'Систолический', 'orange'],
                      ['diastolic', 'Диастолический', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.heartMurmurs === val}
                      color={c}
                      onClick={() =>
                        setField('heartMurmurs', form.heartMurmurs === val ? null : val)
                      }
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>ЖКТ</div>
                <div style={s.subsection}>Язык</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['moist_clean', 'Влажный, чистый', 'green'],
                      ['moist_coated', 'Влажный, обложен', 'orange'],
                      ['dry_clean', 'Сухой, чистый', 'orange'],
                      ['dry_coated', 'Сухой, обложен', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.tongueState === val}
                      color={c}
                      onClick={() => setField('tongueState', form.tongueState === val ? null : val)}
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>
                <div style={s.subsection}>Живот</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}
                    >
                      Состояние
                    </div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['soft', 'Мягкий', 'green'],
                          ['tense', 'Напряжен', 'red'],
                          ['bloated', 'Вздут', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.abdomenState === val}
                          color={c}
                          onClick={() =>
                            setField('abdomenState', form.abdomenState === val ? null : val)
                          }
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}
                    >
                      Болезненность
                    </div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['painless', 'Безболезненный', 'green'],
                          ['painful', 'Болезненный', 'red'],
                          ['local', 'Локальная', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.abdomenPain === val}
                          color={c}
                          onClick={() =>
                            setField('abdomenPain', form.abdomenPain === val ? null : val)
                          }
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ ...s.row, marginTop: 12 }}>
                  <div>
                    <div
                      style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}
                    >
                      Печень
                    </div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['not_protruding', 'Не выступает', 'green'],
                          ['protruding_1', '+1 см', 'orange'],
                          ['protruding_2', '+2 см', 'orange'],
                          ['protruding_3', '+3 см', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.liverState === val}
                          color={c}
                          onClick={() =>
                            setField('liverState', form.liverState === val ? null : val)
                          }
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}
                    >
                      Селезенка
                    </div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['not_palpable', 'Не пальпируется', 'green'],
                          ['enlarged', 'Увеличена', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.spleenState === val}
                          color={c}
                          onClick={() =>
                            setField('spleenState', form.spleenState === val ? null : val)
                          }
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <label style={s.label}>Брюшина (симптомы раздражения)</label>
                  <div style={s.pillGroup}>
                    {(
                      [
                        ['irritation_absent', 'Отсутствуют', 'green'],
                        ['irritation_present', 'Положительные', 'red']
                      ] as const
                    ).map(([val, lbl, c]) => (
                      <PillBtn
                        key={val}
                        active={form.peritoneum === val}
                        color={c}
                        onClick={() => setField('peritoneum', form.peritoneum === val ? null : val)}
                      >
                        {lbl}
                      </PillBtn>
                    ))}
                  </div>
                </div>
              </div>

              <div style={s.paramCard}>
                <div style={s.paramLabel}>Мочевыделительная система</div>
                <div style={s.subsection}>Симптом поколачивания</div>
                <div style={s.pillGroup}>
                  {(
                    [
                      ['painless', 'Безболезненный с обеих сторон', 'green'],
                      ['painful_left', 'Положительный слева', 'orange'],
                      ['painful_right', 'Положительный справа', 'orange'],
                      ['painful_both', 'Положительный с обеих сторон', 'red']
                    ] as const
                  ).map(([val, lbl, c]) => (
                    <PillBtn
                      key={val}
                      active={form.kidneyPercussion === val}
                      color={c}
                      onClick={() =>
                        setField('kidneyPercussion', form.kidneyPercussion === val ? null : val)
                      }
                    >
                      {lbl}
                    </PillBtn>
                  ))}
                </div>
                <div style={{ ...s.row, marginTop: 12 }}>
                  <div>
                    <div style={s.subsection}>Мочеиспускание</div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['free_painless', 'Свободное, безболезненное', 'green'],
                          ['difficult', 'Затруднено', 'orange'],
                          ['painful', 'Болезненное', 'red'],
                          ['frequent', 'Учащенное', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.urination === val}
                          color={c}
                          onClick={() => setField('urination', form.urination === val ? null : val)}
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={s.subsection}>Стул</div>
                    <div style={s.pillGroup}>
                      {(
                        [
                          ['normal', 'Оформленный, регулярный', 'green'],
                          ['constipation', 'Задержка', 'orange'],
                          ['diarrhea', 'Жидкий', 'red'],
                          ['absent', 'Нет', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <PillBtn
                          key={val}
                          active={form.stool === val}
                          color={c}
                          onClick={() => setField('stool', form.stool === val ? null : val)}
                        >
                          {lbl}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current['diagnosis'] = el
            }}
            style={s.block}
          >
            <div style={s.blockHeader}>
              <div style={s.blockIcon}>
                <ClipboardList size={16} />
              </div>
              <div style={s.blockTitle}>Клинический диагноз</div>
            </div>
            <div style={s.blockBody}>
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Основной диагноз</label>
                <textarea
                  style={{ ...s.textarea, minHeight: 70 }}
                  placeholder="Внебольничная пневмония, левосторонняя..."
                  value={form.primaryDiagnosis}
                  onChange={(e) => setField('primaryDiagnosis', e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Осложнения</label>
                <textarea
                  style={{ ...s.textarea, minHeight: 60 }}
                  placeholder="ОДН I ст...."
                  value={form.complicationsDiagnosis}
                  onChange={(e) => setField('complicationsDiagnosis', e.target.value)}
                />
              </div>
              <div>
                <label style={s.label}>Сопутствующий диагноз</label>
                <textarea
                  style={{ ...s.textarea, minHeight: 60 }}
                  placeholder="ИБС, гипертоническая болезнь..."
                  value={form.concomitantDiagnosis}
                  onChange={(e) => setField('concomitantDiagnosis', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current['prescriptions'] = el
            }}
            style={s.block}
          >
            <div style={s.blockHeader}>
              <div style={s.blockIcon}>
                <PillIcon size={16} />
              </div>
              <div style={s.blockTitle}>Назначения врача</div>
              <button
                onClick={() => setShowPrescModal(true)}
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: FONT
                }}
              >
                <Plus size={14} /> Добавить назначение
              </button>
            </div>
            <div style={s.blockBody}>
              {form.prescriptions.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: 13, padding: '16px 0' }}>
                  Нет назначений. Нажмите «Добавить назначение».
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {['Препарат', 'Доза', 'Ед.', 'Путь', 'Кратность', 'Комментарий', ''].map(
                          (h) => (
                            <th
                              key={h}
                              style={{
                                textAlign: 'left',
                                padding: '8px 10px',
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#94a3b8',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                background: '#f8fafc',
                                borderBottom: '1px solid #f1f5f9'
                              }}
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {form.prescriptions.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '10px' }}>
                            <input
                              style={{
                                ...s.input,
                                border: 'none',
                                background: 'transparent',
                                fontWeight: 600,
                                padding: 0
                              }}
                              value={p.drug}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  prescriptions: prev.prescriptions.map((x) =>
                                    x.id === p.id ? { ...x, drug: e.target.value } : x
                                  )
                                }))
                              }
                            />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input
                              style={{
                                ...s.input,
                                border: 'none',
                                background: 'transparent',
                                padding: 0,
                                width: 60
                              }}
                              value={p.dose}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  prescriptions: prev.prescriptions.map((x) =>
                                    x.id === p.id ? { ...x, dose: e.target.value } : x
                                  )
                                }))
                              }
                            />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input
                              style={{
                                ...s.input,
                                border: 'none',
                                background: 'transparent',
                                padding: 0,
                                width: 40
                              }}
                              value={p.unit}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  prescriptions: prev.prescriptions.map((x) =>
                                    x.id === p.id ? { ...x, unit: e.target.value } : x
                                  )
                                }))
                              }
                            />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input
                              style={{
                                ...s.input,
                                border: 'none',
                                background: 'transparent',
                                padding: 0,
                                width: 80
                              }}
                              value={p.route}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  prescriptions: prev.prescriptions.map((x) =>
                                    x.id === p.id ? { ...x, route: e.target.value } : x
                                  )
                                }))
                              }
                            />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input
                              style={{
                                ...s.input,
                                border: 'none',
                                background: 'transparent',
                                padding: 0,
                                width: 60
                              }}
                              value={p.frequency}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  prescriptions: prev.prescriptions.map((x) =>
                                    x.id === p.id ? { ...x, frequency: e.target.value } : x
                                  )
                                }))
                              }
                            />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input
                              style={{
                                ...s.input,
                                border: 'none',
                                background: 'transparent',
                                padding: 0
                              }}
                              value={p.comment ?? ''}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  prescriptions: prev.prescriptions.map((x) =>
                                    x.id === p.id ? { ...x, comment: e.target.value } : x
                                  )
                                }))
                              }
                              placeholder="-"
                            />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <button
                              onClick={() => removePresc(p.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#ef4444'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current['examplan'] = el
            }}
            style={s.block}
          >
            <div style={s.blockHeader}>
              <div style={s.blockIcon}>
                <FlaskConical size={16} />
              </div>
              <div style={s.blockTitle}>План обследования</div>
              <button
                onClick={handleCreateReferral}
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#f0fdf4',
                  color: '#059669',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: FONT
                }}
              >
                <FilePlus size={14} /> Создать направление
              </button>
            </div>
            <div style={s.blockBody}>
              <div style={s.subsection}>Лаборатория</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {form.labTests
                  .filter((t) => t.category === 'lab')
                  .map((t) => (
                    <CheckBtnComp
                      key={t.id}
                      checked={t.checked}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          labTests: prev.labTests.map((x) =>
                            x.id === t.id ? { ...x, checked: !x.checked } : x
                          )
                        }))
                      }
                    >
                      {t.name}
                    </CheckBtnComp>
                  ))}
              </div>
              <div style={s.subsection}>Инструментальные</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {form.labTests
                  .filter((t) => t.category === 'instrumental')
                  .map((t) => (
                    <CheckBtnComp
                      key={t.id}
                      checked={t.checked}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          labTests: prev.labTests.map((x) =>
                            x.id === t.id ? { ...x, checked: !x.checked } : x
                          )
                        }))
                      }
                    >
                      {t.name}
                    </CheckBtnComp>
                  ))}
              </div>
            </div>
          </div>

          {showGenText && form.generatedText && (
            <div style={{ ...s.block, border: '2px solid #22c55e' }}>
              <div style={{ ...s.blockHeader, background: '#f0fdf4' }}>
                <div
                  style={{
                    ...s.blockIcon,
                    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    color: '#059669'
                  }}
                >
                  <FileText size={16} />
                </div>
                <div style={{ ...s.blockTitle, color: '#059669' }}>Запись осмотра сформирована</div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(form.generatedText)
                    showToast('Текст скопирован', 'success')
                  }}
                  style={{
                    marginLeft: 'auto',
                    padding: '5px 12px',
                    borderRadius: 8,
                    border: '1px solid #86efac',
                    background: 'white',
                    color: '#059669',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: FONT
                  }}
                >
                  Копировать
                </button>
              </div>
              <div style={{ ...s.blockBody, background: '#fafffe' }}>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: FONT,
                    fontSize: 13,
                    color: '#1e293b',
                    lineHeight: 1.7,
                    margin: 0
                  }}
                >
                  {form.generatedText}
                </pre>
              </div>
            </div>
          )}

          {!showGenText && (
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <button
                onClick={handleComplete}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 32px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  boxShadow: '0 4px 18px rgba(29,78,216,0.35)'
                }}
              >
                <Sparkles size={18} /> Завершить осмотр и сформировать запись
              </button>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                Данные будут сохранены в карточке пациента
              </div>
            </div>
          )}
        </div>
      </div>

      {showPrescModal && (
        <div style={s.modal} onClick={() => setShowPrescModal(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Добавить назначение
              </h3>
              <button
                onClick={() => setShowPrescModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Препарат *</label>
              <input
                style={s.input}
                placeholder="Цефтриаксон"
                value={newPresc.drug ?? ''}
                onChange={(e) => setNewPresc((p) => ({ ...p, drug: e.target.value }))}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                marginBottom: 12
              }}
            >
              <div>
                <label style={s.label}>Форма</label>
                <select
                  style={{ ...s.input, appearance: 'auto' as any }}
                  value={newPresc.form ?? ''}
                  onChange={(e) => setNewPresc((p) => ({ ...p, form: e.target.value }))}
                >
                  <option value="">Выбрать...</option>
                  <option>Таблетки</option>
                  <option>Капсулы</option>
                  <option>р-р д/ин.</option>
                  <option>р-р д/инф.</option>
                  <option>Порошок</option>
                  <option>Суспензия</option>
                  <option>Капли</option>
                  <option>Мазь</option>
                  <option>Аэрозоль</option>
                  <option>Суппозиторий</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Доза</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  style={s.input}
                  placeholder="1.0"
                  value={newPresc.dose ?? ''}
                  onChange={(e) => setNewPresc((p) => ({ ...p, dose: e.target.value }))}
                />
              </div>
              <div>
                <label style={s.label}>Единицы</label>
                <select
                  style={{ ...s.input, appearance: 'auto' as any }}
                  value={newPresc.unit ?? 'мг'}
                  onChange={(e) => setNewPresc((p) => ({ ...p, unit: e.target.value }))}
                >
                  <option>мг</option>
                  <option>г</option>
                  <option>мл</option>
                  <option>ЕД</option>
                  <option>МЕ</option>
                  <option>мкг</option>
                  <option>%</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                marginBottom: 12
              }}
            >
              <div>
                <label style={s.label}>Путь введения</label>
                <select
                  style={{ ...s.input, appearance: 'auto' as any }}
                  value={newPresc.route ?? 'перорально'}
                  onChange={(e) => setNewPresc((p) => ({ ...p, route: e.target.value }))}
                >
                  <option>перорально</option>
                  <option>в/в</option>
                  <option>в/в капельно</option>
                  <option>в/м</option>
                  <option>п/к</option>
                  <option>ингаляционно</option>
                  <option>местно</option>
                  <option>ректально</option>
                  <option>сублингвально</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Кратность</label>
                <select
                  style={{ ...s.input, appearance: 'auto' as any }}
                  value={newPresc.frequency ?? '1р/д'}
                  onChange={(e) => setNewPresc((p) => ({ ...p, frequency: e.target.value }))}
                >
                  <option>1р/д</option>
                  <option>2р/д</option>
                  <option>3р/д</option>
                  <option>4р/д</option>
                  <option>каждые 6ч</option>
                  <option>каждые 8ч</option>
                  <option>каждые 12ч</option>
                  <option>1р/нед</option>
                  <option>по требованию</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Длительность</label>
                <select
                  style={{ ...s.input, appearance: 'auto' as any }}
                  value={newPresc.regimen ?? ''}
                  onChange={(e) => setNewPresc((p) => ({ ...p, regimen: e.target.value }))}
                >
                  <option value="">Не указано</option>
                  <option>3 дня</option>
                  <option>5 дней</option>
                  <option>7 дней</option>
                  <option>10 дней</option>
                  <option>14 дней</option>
                  <option>1 месяц</option>
                  <option>постоянно</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Комментарий</label>
              <input
                style={s.input}
                placeholder="Развести в 200 мл NaCl 0.9%..."
                value={newPresc.comment ?? ''}
                onChange={(e) => setNewPresc((p) => ({ ...p, comment: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPrescModal(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 13
                }}
              >
                Отмена
              </button>
              <button
                onClick={addPresc}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#1d4ed8',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {showReferralModal && (
        <div style={s.modal} onClick={() => setShowReferralModal(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Создать направление
              </h3>
              <button
                onClick={() => setShowReferralModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div
              style={{ padding: '16px', background: '#f8fafc', borderRadius: 10, marginBottom: 16 }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
                Выбранные исследования:
              </div>
              {form.labTests
                .filter((t) => t.checked)
                .map((t) => (
                  <div
                    key={t.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}
                  >
                    <Check size={14} color="#22c55e" />
                    <span style={{ fontSize: 13 }}>{t.name}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>
                      {t.category === 'lab' ? 'лаборатория' : 'инструментальное'}
                    </span>
                  </div>
                ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Пациент</label>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                {patient?.lastName} {patient?.firstName} {patient?.middleName}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Направляющий врач</label>
              <div style={{ fontSize: 14 }}>{form.doctor}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Примечание</label>
              <textarea
                style={{ ...s.textarea, minHeight: 60 }}
                placeholder="Дополнительные указания..."
                value={referralNote}
                onChange={(e) => setReferralNote(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowReferralModal(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 13
                }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setShowReferralModal(false)
                  showToast(
                    `Направление на ${form.labTests.filter((t) => t.checked).length} исследований создано`,
                    'success'
                  )
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#059669',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                Создать направление
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div style={s.toast(toastMsg.type)}>
          {toastMsg.type === 'success' ? (
            <Check size={18} />
          ) : toastMsg.type === 'error' ? (
            <AlertTriangle size={18} />
          ) : null}
          {toastMsg.text}
        </div>
      )}
    </div>
  )
}

export default PrimaryInspectionPage
