import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  Clock, Stethoscope, FileText, ClipboardList, FlaskConical,
  Pill as PillIcon, PenLine, Save, X, Check, Plus, Trash2,
  ChevronLeft, AlertTriangle, Sparkles, Printer, FilePlus,
  Building2, User, Calendar, ChevronRight, ExternalLink,
} from 'lucide-react'
import {
  PrimaryFormState, ComplaintKey, COMPLAINT_LABELS, ComplaintParams,
  GeneralCondition, Consciousness, Constitution, Nutrition,
  SkinColor, SkinTemp, SkinMoisture, MucousState,
  ChestForm, ChestSymmetry, BreathingNose, BreathingType, RalesType, PercussionSound,
  HeartActivity, HeartRhythm, HeartTones, HeartMurmurs,
  TongueState, AbdomenState, AbdomenPain, LiverState, SpleenState, PeritoneumState,
  KidneyPercussion, StoolState, UrinationState,
  RoundPrescription, LabTestCheck, SavedInspection,
} from './types'
import { getInitialPrimaryState, DEFAULT_LAB_TESTS } from './mockRoundData'
import { usePatientData } from 'context/PatientDataContext'

import {
  PatientHeader,
  PatientAvatar,
  PatientInfo,
  PatientName,
  PatientMeta,
  PatientMetaItem,
  HeaderRight,
  HeaderBtn,
  StartTimeDisplay,
} from './styled'

// ─── Styled helpers ───────────────────────────────────────────────

const FONT = `'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: 'calc(100vh - 84px)',
    background: '#f3f4f6',
    fontFamily: FONT,
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
    flexWrap: 'wrap' as const,
  },
  body: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  nav: {
    width: 220,
    flexShrink: 0,
    background: 'white',
    borderRight: '1px solid #e5e7eb',
    overflowY: 'auto' as const,
    padding: '12px 0',
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
    position: 'relative' as const,
  }),
  centerForm: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px 24px',
    scrollBehavior: 'smooth' as const,
  },
  block: {
    background: 'white',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    marginBottom: 20,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    scrollMarginTop: 20,
  },
  blockHeader: {
    padding: '13px 18px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fafbfc',
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
    flexShrink: 0,
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.01em',
    flex: 1,
  },
  blockBody: {
    padding: '16px 18px',
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
    borderBottom: '1px solid #f1f5f9',
  },
  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 6,
    marginBottom: 2,
  },
  pill: (active: boolean, color?: string): React.CSSProperties => {
    const c = color ?? 'blue'
    const map: Record<string, { bg: string; text: string; border: string; aBg: string; aText: string; aBorder: string }> = {
      blue: { bg: 'white', text: '#64748b', border: '#e2e8f0', aBg: '#eff6ff', aText: '#1d4ed8', aBorder: '#93c5fd' },
      green: { bg: 'white', text: '#64748b', border: '#e2e8f0', aBg: '#f0fdf4', aText: '#166534', aBorder: '#86efac' },
      red: { bg: 'white', text: '#64748b', border: '#e2e8f0', aBg: '#fef2f2', aText: '#991b1b', aBorder: '#fca5a5' },
      orange: { bg: 'white', text: '#64748b', border: '#e2e8f0', aBg: '#fff7ed', aText: '#9a3412', aBorder: '#fdba74' },
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
      fontFamily: FONT,
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
    fontFamily: FONT,
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
    background: 'white',
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
    lineHeight: 1.5,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    display: 'block',
    marginBottom: 5,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginTop: 10,
  },
  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginTop: 10,
  },
  paramCard: {
    border: '1px solid #f1f5f9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    background: '#fafbfc',
  },
  paramLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    marginBottom: 10,
  },
  autoText: {
    padding: '10px 12px',
    borderRadius: 8,
    background: '#f0f9ff',
    border: '1.5px solid #bae6fd',
    color: '#0369a1',
    fontSize: 13,
    lineHeight: 1.6,
    marginTop: 8,
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
    animation: 'none',
  }),
  modal: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9000,
    background: 'rgba(15,23,42,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    background: 'white',
    borderRadius: 16,
    padding: 28,
    maxWidth: 700,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
  },
}

// ─── Навигационные секции ─────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'info', label: 'Информация об осмотре', icon: Calendar },
  { id: 'complaints', label: 'Жалобы', icon: PenLine },
  { id: 'anamnesis-morbi', label: 'Anamnesis morbi', icon: FileText },
  { id: 'anamnesis-vitae', label: 'Anamnesis vitae', icon: User },
  { id: 'objective', label: 'Объективный статус', icon: Stethoscope },
  { id: 'diagnosis', label: 'Клинический диагноз', icon: ClipboardList },
  { id: 'prescriptions', label: 'Назначения', icon: PillIcon },
  { id: 'examplan', label: 'План обследования', icon: FlaskConical },
]

// ─── Хелперы ─────────────────────────────────────────────────────

function PillBtn({ active, color, onClick, children }: {
  active: boolean; color?: string; onClick: () => void; children: React.ReactNode
}) {
  return <button style={s.pill(active, color)} onClick={onClick}>{children}</button>
}

function CheckBtnComp({ checked, onClick, children }: {
  checked: boolean; onClick: () => void; children: React.ReactNode
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      style={{ ...s.checkBtn(checked), ...(hover && !checked ? { borderColor: '#bfdbfe' } : {}) }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${checked ? '#3b82f6' : '#cbd5e1'}`,
        background: checked ? '#3b82f6' : 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.13s',
      }}>
        {checked && <Check size={10} color="white" />}
      </span>
      {children}
    </button>
  )
}

function FieldInput({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      <input
        type={type}
        style={s.input}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

// ─── Генерация итогового текста ───────────────────────────────────

function generatePrimaryText(form: PrimaryFormState): string {
  const parts: string[] = []
  const inspType = form.inspectionType === 'primary' ? 'Первичный осмотр' : 'Повторный осмотр'
  parts.push(`${inspType} лечащего врача от ${form.inspectionDate}. Время: ${form.inspectionTime}.`)

  // Жалобы
  const activeComplaints = form.complaints.filter(c => c !== 'none')
  if (form.complaints.includes('none') || activeComplaints.length === 0) {
    parts.push('Жалоб не предъявляет.')
  } else {
    const labels = activeComplaints.map(c => {
      let text = COMPLAINT_LABELS[c].toLowerCase()
      if (c === 'fever' && form.complaintParams.fever?.maxTemp) {
        text += ` до ${form.complaintParams.fever.maxTemp}°C`
      }
      if ((c === 'dyspnea_exertion' || c === 'dyspnea_rest') && form.complaintParams[c]?.severity) {
        const sev = form.complaintParams[c]!.severity
        text += ` (${sev === 'mild' ? 'лёгкая' : sev === 'moderate' ? 'умеренная' : 'выраженная'})`
      }
      return text
    })
    parts.push(`Жалобы: на ${labels.join(', ')}.`)
    if (form.complaintsNote) parts.push(form.complaintsNote)
  }

  // Anamnesis morbi
  if (form.illnessStartDate) {
    parts.push(`Заболел ${form.illnessStartDate}.`)
  }
  if (form.hospitalizationReason) {
    parts.push(`Госпитализирован: ${form.hospitalizationReason}.`)
  }

  // Anamnesis vitae
  const infections: string[] = []
  if (form.tbStatus === 'denies') infections.push('туберкулёз отрицает')
  if (form.hivStatus === 'negative') infections.push('ВИЧ отрицательный')
  if (form.hepatitisStatus === 'negative') infections.push('гепатит отрицательный')
  if (infections.length) parts.push(`Инфекционный анамнез: ${infections.join(', ')}.`)

  if (form.allergyStatus === 'none') {
    parts.push('Аллергологический анамнез не отягощён.')
  } else if (form.allergies.length > 0) {
    const allNames = form.allergies.map(a => `${a.name} (${a.reaction})`).join(', ')
    parts.push(`Аллергия: ${allNames}.`)
  }

  // Объективно
  parts.push('Объективно:')
  const condMap: Record<GeneralCondition, string> = {
    satisfactory: 'удовлетворительное',
    moderate: 'средней степени тяжести, стабильное',
    severe: 'тяжёлое',
    critical: 'крайне тяжёлое',
  }
  if (form.generalCondition) {
    parts.push(`Общее состояние ${condMap[form.generalCondition]}. Сознание ${form.consciousness === 'clear' ? 'ясное' : form.consciousness === 'confused' ? 'спутанное' : form.consciousness ?? 'ясное'}.`)
  }

  if (form.skinColor) {
    const skinColorText: Record<string, string> = {
      pale_pink: 'бледно-розовой окраски',
      pale: 'бледные',
      hyperemia: 'гиперемированные',
      cyanosis: 'цианотичные',
      icteric: 'иктеричные',
    }
    let skinStr = `Кожные покровы ${skinColorText[form.skinColor] ?? form.skinColor}`
    if (!form.cyanosis) skinStr += ', периферических отёков нет'
    if (!form.edemaPresent) skinStr += '.'
    else skinStr += `. Отёки: ${form.edemaLocation || 'имеются'}.`
    parts.push(skinStr)
  }

  if (form.rr || form.spo2) {
    let respStr = 'Дыхание через нос свободное.'
    if (form.chestForm) respStr += ` Грудная клетка ${form.chestForm === 'normosthenic' ? 'нормостенической формы' : form.chestForm}, ${form.chestSymmetry === 'symmetric' ? 'обе половины одинаково участвуют в акте дыхания' : 'асимметрична'}.`
    if (form.rr) respStr += ` ЧДД ${form.rr} в минуту.`
    if (form.spo2) respStr += ` SpO₂ ${form.spo2}%.`
    if (form.percussionSound) {
      const ps: Record<string, string> = { clear: 'ясный лёгочный звук', dull: 'притупление', tympanic: 'тимпанит', shortened: 'укорочение' }
      respStr += ` Перкуторно над проекцией лёгких ${ps[form.percussionSound] ?? form.percussionSound}.`
    }
    if (form.breathingType) {
      const bt: Record<string, string> = { vesicular: 'везикулярное', harsh: 'жёсткое', weakened: 'ослабленное', bronchial: 'бронхиальное' }
      respStr += ` Аускультативно над лёгкими дыхание ${bt[form.breathingType] ?? form.breathingType}.`
    }
    if (form.ralesType) {
      const rt: Record<string, string> = { none: 'Хрипы не выслушиваются.', dry: 'Выслушиваются сухие хрипы.', moist: 'Выслушиваются влажные хрипы.', crepitation: 'Выслушивается крепитация.' }
      respStr += ' ' + (rt[form.ralesType] ?? '')
    }
    parts.push(respStr)
  }

  const bpRight = form.bpRightSys && form.bpRightDia ? `${form.bpRightSys}/${form.bpRightDia}` : (form.bpRightSys || '')
  const bpLeft = form.bpLeftSys && form.bpLeftDia ? `${form.bpLeftSys}/${form.bpLeftDia}` : (form.bpLeftSys || '')
  if (form.hr || bpRight) {
    let heartStr = `Сердечная деятельность ${form.heartRhythm === 'regular' ? 'ритмичная' : 'аритмичная'}, тоны ${form.heartTones === 'clear' ? 'ясные' : form.heartTones === 'muffled' ? 'приглушены' : 'глухие'}.`
    if (form.heartMurmurs === 'absent') heartStr += ' Шумы не выслушиваются.'
    if (form.hr) heartStr += ` ЧСС ${form.hr} в мин.`
    if (bpRight) heartStr += ` АД ${bpRight} мм рт. ст.`
    if (bpLeft && bpLeft !== bpRight) heartStr += ` (левая рука ${bpLeft}).`
    parts.push(heartStr)
  }

  if (form.tongueState) {
    const ts: Record<string, string> = {
      moist_clean: 'влажный, чистый',
      moist_coated: 'влажный, обложен',
      dry_clean: 'сухой, чистый',
      dry_coated: 'сухой, обложен',
    }
    parts.push(`Язык ${ts[form.tongueState] ?? form.tongueState}.`)
  }
  if (form.abdomenState) {
    parts.push(`Живот при пальпации ${form.abdomenState === 'soft' ? 'мягкий, безболезненный' : form.abdomenState === 'tense' ? 'напряжённый' : 'вздут'}.`)
  }
  if (form.liverState) {
    const ls: Record<string, string> = { not_protruding: 'Печень не выступает.', protruding_1: 'Печень +1 см.', protruding_2: 'Печень +2 см.', protruding_3: 'Печень +3 см.' }
    parts.push(ls[form.liverState] ?? '')
  }

  if (form.urination) {
    parts.push(`Мочеиспускание ${form.urination === 'free_painless' ? 'свободное, безболезненное' : form.urination}.`)
  }
  if (form.stool) {
    const st: Record<string, string> = { normal: 'оформленный, регулярный', constipation: 'задержка стула', diarrhea: 'жидкий', absent: 'стула нет' }
    parts.push(`Стул ${st[form.stool] ?? form.stool}.`)
  }

  // Диагноз
  if (form.primaryDiagnosis) {
    parts.push(`\nКлинический диагноз:\nОсновной: ${form.primaryDiagnosis}.`)
    if (form.complicationsDiagnosis) parts.push(`Осложнения: ${form.complicationsDiagnosis}.`)
    if (form.concomitantDiagnosis) parts.push(`Сопутствующий: ${form.concomitantDiagnosis}.`)
  }

  // Назначения
  const activeMeds = form.prescriptions.filter(p => p.action !== 'cancel')
  if (activeMeds.length > 0) {
    parts.push('\nНазначения:')
    activeMeds.forEach((p, i) => {
      parts.push(`${i + 1}. ${p.drug} ${p.dose} ${p.unit}, ${p.route}, ${p.frequency}.${p.comment ? ' ' + p.comment : ''}`)
    })
  }

  // Анализы
  const checked = form.labTests.filter(t => t.checked)
  if (checked.length > 0) {
    const labs = checked.filter(t => t.category === 'lab').map(t => t.name)
    const inst = checked.filter(t => t.category === 'instrumental').map(t => t.name)
    if (labs.length) parts.push(`Лабораторные исследования: ${labs.join(', ')}.`)
    if (inst) parts.push(`Инструментальные: ${inst.join(', ')}.`)
  }

  return parts.join('\n')
}

// ─── Пропсы ───────────────────────────────────────────────────────

interface PrimaryInspectionPageProps {
  patientId: string
  onClose: () => void
  onNavigateToTemperatureSheet?: (id: string) => void
}

// ═══════════════════════════════════════════════════════════════════
// ГЛАВНЫЙ КОМПОНЕНТ
// ═══════════════════════════════════════════════════════════════════

const PrimaryInspectionPage: React.FC<PrimaryInspectionPageProps> = ({
  patientId,
  onClose,
  onNavigateToTemperatureSheet,
}) => {
  const { getPatient, saveInspection, updatePatientVitals, updatePatientDiagnosis, updatePatientMeds, addHistoryEntry, saveDraft, getDraft } = usePatientData()
  const patient = getPatient(patientId)

  const [form, setForm] = useState<PrimaryFormState>(() => {
    const draft = getDraft(`${patientId}-primary`)
    if (draft) return draft
    return getInitialPrimaryState(patientId, patient)
  })
  const [activeSection, setActiveSection] = useState('info')
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)
  const [showGenText, setShowGenText] = useState(false)
  const [showPrescModal, setShowPrescModal] = useState(false)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [newPresc, setNewPresc] = useState<Partial<RoundPrescription>>({})
  const [referralNote, setReferralNote] = useState('')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Toast auto-close
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 3000)
    return () => clearTimeout(t)
  }, [toastMsg])

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMsg({ text, type })
  }, [])

  const setField = useCallback(<K extends keyof PrimaryFormState>(key: K, value: PrimaryFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

  const scrollTo = (id: string) => {
    setActiveSection(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ─── Жалобы ───────────────────────────────────────────────────

  const toggleComplaint = (k: ComplaintKey) => {
    setForm(prev => {
      const c = prev.complaints
      if (k === 'none') return { ...prev, complaints: ['none'] }
      const without = c.filter(x => x !== 'none')
      return {
        ...prev,
        complaints: without.includes(k) ? without.filter(x => x !== k) : [...without, k],
      }
    })
  }

  const setComplaintParam = <K extends keyof ComplaintParams>(key: K, val: ComplaintParams[K]) => {
    setForm(prev => ({ ...prev, complaintParams: { ...prev.complaintParams, [key]: val } }))
  }

  // ─── Назначения ───────────────────────────────────────────────

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
      action: 'new',
    }
    setForm(prev => ({ ...prev, prescriptions: [...prev.prescriptions, p] }))
    setNewPresc({})
    setShowPrescModal(false)
    showToast('Назначение добавлено', 'success')
  }

  const removePresc = (id: string) => {
    setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.filter(p => p.id !== id) }))
  }

  // ─── Сохранение ───────────────────────────────────────────────

  const handleSaveDraft = () => {
    setField('status', 'draft')
    saveDraft(`${patientId}-primary`, { ...form, status: 'draft' })
    showToast('Черновик сохранён', 'success')
  }

  const handleComplete = () => {
    const text = generatePrimaryText(form)
    setField('generatedText', text)
    setField('status', 'completed')
    
    // Очистить черновик
    saveDraft(`${patientId}-primary`, null)

    // Сохранить в контекст
    const insp: SavedInspection = {
      id: `insp-${Date.now()}`,
      type: 'primary',
      date: form.inspectionDate,
      time: form.inspectionTime,
      doctor: form.doctor,
      department: form.department,
      diagnosis: form.primaryDiagnosis,
      vitals: { temp: form.complaintParams.fever?.maxTemp, hr: form.hr, bp: form.bpRightSys && form.bpRightDia ? `${form.bpRightSys}/${form.bpRightDia}` : form.bpRightSys, spo2: form.spo2, rr: form.rr },
      prescriptions: form.prescriptions,
      labTests: form.labTests.filter(t => t.checked),
      generatedText: text,
    }

    saveInspection(patientId, insp)

    // Обновить витальные
    if (form.hr || form.bpRightSys || form.spo2 || form.rr) {
      updatePatientVitals(patientId, {
        hr: form.hr || undefined,
        bp: form.bpRightSys && form.bpRightDia ? `${form.bpRightSys}/${form.bpRightDia}` : form.bpRightSys || undefined,
        spo2: form.spo2 || undefined,
        resp: form.rr || undefined,
      })
    }

    // Обновить диагноз
    if (form.primaryDiagnosis) {
      updatePatientDiagnosis(patientId, form.primaryDiagnosis)
    }

    // Обновить мед. назначения
    const activeMeds = form.prescriptions
      .filter(p => p.action !== 'cancel')
      .map(p => ({ name: p.drug, dose: p.dose, form: p.form, regimen: p.regimen }))
    if (activeMeds.length) updatePatientMeds(patientId, activeMeds)

    const getPrescriptionsDiffPrimary = (oldMeds: any[], newPrescs: RoundPrescription[]) => {
      if (oldMeds.length === 0 && newPrescs.length === 0) return 'Назначений нет.'
      
      const oldMap = new Map(oldMeds.map((m, i) => [`med-${i}`, m]))
      const newMap = new Map(newPrescs.map(p => [p.id, p]))
      
      const added: string[] = []
      const removed: string[] = []
      const changed: string[] = []
      
      oldMap.forEach((oldMed, id) => {
        if (!newMap.has(id)) {
          removed.push(`${oldMed.name} (${oldMed.dose})`)
        } else {
          const newMed = newMap.get(id)!
          if (newMed.drug !== oldMed.name || newMed.dose !== oldMed.dose || newMed.route !== oldMed.route || newMed.frequency !== oldMed.regimen) {
            changed.push(`${oldMed.name} ${oldMed.dose} -> ${newMed.drug} ${newMed.dose} ${newMed.unit} ${newMed.route}`)
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

    const complaintsText = form.complaints.includes('none') || form.complaints.filter(c => c !== 'none').length === 0
      ? 'Жалоб не предъявляет.'
      : `Жалобы на ${form.complaints.filter(c => c !== 'none').map(c => {
          let t = COMPLAINT_LABELS[c].toLowerCase()
          if (c === 'fever' && form.complaintParams.fever?.maxTemp) t += ` до ${form.complaintParams.fever.maxTemp}°C`
          return t
        }).join(', ')}.` + (form.complaintsNote ? ` ${form.complaintsNote}` : '')

    // Extract objective string by removing complaints, anamnesis, diagnosis, and plan
    const splitText = text.split('\n\n')
    const objectiveParts = splitText.filter(p => {
      const lower = p.toLowerCase()
      if (lower.startsWith('первичный осмотр') || lower.startsWith('повторный осмотр')) return false
      if (lower.startsWith('жалобы:')) return false
      if (lower.startsWith('anamnesis morbi:') || lower.startsWith('anamnesis vitae:')) return false
      if (lower.startsWith('клинический диагноз:')) return false
      if (lower.startsWith('план обследования:')) return false
      return p.trim().length > 0 && p !== form.complaintsNote
    })

    // Запись в историю
    addHistoryEntry(patientId, {
      dateTime: `${form.inspectionDate} ${form.inspectionTime}`,
      type: form.inspectionType === 'primary' ? 'Первичный осмотр' : 'Повторный осмотр',
      doctor: form.doctor,
      conclusion: text, // Полное заключение
      complaints: complaintsText,
      objective: objectiveParts.join('\n\n'),
      recommendations: getPrescriptionsDiffPrimary(patient?.currentMeds || [], form.prescriptions),
    })

    setShowGenText(true)
    showToast('Осмотр завершён и сохранён в карточке пациента', 'success')
  }

  const handleCreateReferral = () => {
    const checked = form.labTests.filter(t => t.checked)
    if (checked.length === 0) return showToast('Выберите исследования для направления', 'error')
    setShowReferralModal(true)
  }

  // ─── Блок заполненности ───────────────────────────────────────

  const blockDone: Record<string, boolean> = {
    info: !!form.inspectionDate,
    complaints: form.complaints.length > 0,
    'anamnesis-morbi': !!form.illnessStartDate || !!form.hospitalizationReason,
    'anamnesis-vitae': form.tbStatus !== null || form.hivStatus !== null,
    objective: !!(form.generalCondition && form.consciousness),
    diagnosis: !!form.primaryDiagnosis,
    prescriptions: form.prescriptions.length > 0,
    examplan: form.labTests.some(t => t.checked),
  }

  if (!patient) {
    return (
      <div style={{ ...s.root, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: 16 }}>Пациент не найден</div>
      </div>
    )
  }

  // ─── РЕНДЕР ───────────────────────────────────────────────────

  return (
    <div style={s.root}>
      {/* ── Хедер ── */}
      <PatientHeader>
        <HeaderBtn variant="ghost" onClick={onClose}>
          <ChevronLeft size={15} /> Обходы
        </HeaderBtn>

        <PatientAvatar>
          {patient.lastName?.[0] || ''}{patient.firstName?.[0] || ''}
        </PatientAvatar>

        <PatientInfo>
          <PatientName>Первичный осмотр: {patient.lastName} {patient.firstName} {patient.middleName}</PatientName>
          <PatientMeta>
            <PatientMetaItem><strong>Палата:</strong> {patient.department}</PatientMetaItem>
            <PatientMetaItem><strong>Возраст:</strong> {patient.age} лет</PatientMetaItem>
            <PatientMetaItem><strong>МК:</strong> {patient.medcardNum}</PatientMetaItem>
          </PatientMeta>
        </PatientInfo>

        <HeaderRight>
          <HeaderBtn variant="ghost" onClick={handleSaveDraft}>
            <Save size={14} /> Черновик
          </HeaderBtn>
          <HeaderBtn variant="primary" onClick={handleComplete}>
            <Check size={14} /> Завершить осмотр
          </HeaderBtn>
          <HeaderBtn variant="ghost" onClick={onClose} style={{ padding: '7px 10px' }}>
            <X size={15} />
          </HeaderBtn>
        </HeaderRight>
      </PatientHeader>

      {/* ── Тело ── */}
      <div style={s.body}>
        {/* Левая навигация */}
        <nav style={s.nav}>
          {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              style={s.navItem(activeSection === id, blockDone[id])}
              onClick={() => scrollTo(id)}
            >
              <Icon size={14} />
              <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: blockDone[id] ? '#22c55e' : '#d1d5db',
                flexShrink: 0,
              }} />
            </button>
          ))}
        </nav>

        {/* Форма */}
        <div style={s.centerForm}>

          {/* ════ БЛОК 1: ИНФОРМАЦИЯ ════ */}
          <div ref={el => { sectionRefs.current['info'] = el }} style={s.block}>
            <div style={s.blockHeader}>
              <div style={s.blockIcon}><Calendar size={16} /></div>
              <div style={s.blockTitle}>Информация об осмотре</div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: '#dcfce7', color: '#166534', letterSpacing: '0.03em' }}>Авто</span>
            </div>
            <div style={s.blockBody}>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Дата осмотра</label>
                  <input type="date" style={s.input} value={form.inspectionDate} onChange={e => setField('inspectionDate', e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>Время</label>
                  <input type="time" style={s.input} value={form.inspectionTime} onChange={e => setField('inspectionTime', e.target.value)} />
                </div>
              </div>
              <div style={{ ...s.row, marginTop: 12 }}>
                <FieldInput label="Врач" value={form.doctor} onChange={v => setField('doctor', v)} />
                <FieldInput label="Отделение" value={form.department} onChange={v => setField('department', v)} />
              </div>
              <FieldInput label="Учреждение" value={form.institution} onChange={v => setField('institution', v)} />

              <div style={s.subsection}>Тип осмотра</div>
              <div style={s.pillGroup}>
                <PillBtn active={form.inspectionType === 'primary'} color="blue" onClick={() => setField('inspectionType', 'primary')}>
                  ○ Первичный
                </PillBtn>
                <PillBtn active={form.inspectionType === 'repeated'} color="blue" onClick={() => setField('inspectionType', 'repeated')}>
                  ○ Повторный
                </PillBtn>
              </div>
            </div>
          </div>

          {/* ════ БЛОК 2: ЖАЛОБЫ ════ */}
          <div ref={el => { sectionRefs.current['complaints'] = el }} style={s.block}>
            <div style={s.blockHeader}>
              <div style={s.blockIcon}><PenLine size={16} /></div>
              <div style={s.blockTitle}>Жалобы пациента</div>
            </div>
            <div style={s.blockBody}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(Object.keys(COMPLAINT_LABELS) as ComplaintKey[]).map(k => (
                  <CheckBtnComp key={k} checked={form.complaints.includes(k)} onClick={() => toggleComplaint(k)}>
                    {COMPLAINT_LABELS[k]}
                  </CheckBtnComp>
                ))}
              </div>

              {/* Зависимые параметры */}
              {form.complaints.includes('fever') && (
                <div style={{ marginTop: 12, padding: '12px 14px', background: '#fff7ed', borderRadius: 8, border: '1px solid #fed7aa' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#9a3412', marginBottom: 8 }}>Повышение температуры — параметры</div>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Максимальная температура (°C)</label>
                  <input
                    type="number" min="35" max="43" step="0.1"
                    style={s.input} placeholder="38.0"
                    value={form.complaintParams.fever?.maxTemp ?? ''}
                    onChange={e => setComplaintParam('fever', { maxTemp: e.target.value })}
                  />
                </div>
              </div>
                </div>
              )}
              {(form.complaints.includes('dyspnea_exertion') || form.complaints.includes('dyspnea_rest')) && (
                <div style={{ marginTop: 12, padding: '12px 14px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8', marginBottom: 8 }}>Одышка — степень</div>
                  <div style={s.pillGroup}>
                    {(['mild', 'moderate', 'severe'] as const).map(sev => (
                      <PillBtn
                        key={sev}
                        active={
                          (form.complaintParams.dyspnea_exertion?.severity === sev && form.complaints.includes('dyspnea_exertion')) ||
                          (form.complaintParams.dyspnea_rest?.severity === sev && form.complaints.includes('dyspnea_rest'))
                        }
                        color="blue"
                        onClick={() => {
                          if (form.complaints.includes('dyspnea_exertion')) setComplaintParam('dyspnea_exertion', { severity: sev })
                          if (form.complaints.includes('dyspnea_rest')) setComplaintParam('dyspnea_rest', { severity: sev })
                        }}
                      >
                        {sev === 'mild' ? 'Лёгкая' : sev === 'moderate' ? 'Умеренная' : 'Выраженная'}
                      </PillBtn>
                    ))}
                  </div>
                </div>
              )}
              {form.complaints.includes('cough_productive') && (
                <div style={{ marginTop: 12, padding: '12px 14px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#166534', marginBottom: 8 }}>Продуктивный кашель — мокрота</div>
                  <div style={s.row}>
                    <FieldInput label="Цвет мокроты" value={form.complaintParams.cough_productive?.sputumColor ?? ''} onChange={v => setComplaintParam('cough_productive', { sputumColor: v, sputumAmount: form.complaintParams.cough_productive?.sputumAmount ?? '' })} placeholder="слизистая, гнойная..." />
                    <FieldInput label="Количество" value={form.complaintParams.cough_productive?.sputumAmount ?? ''} onChange={v => setComplaintParam('cough_productive', { sputumColor: form.complaintParams.cough_productive?.sputumColor ?? '', sputumAmount: v })} placeholder="скудное, умеренное..." />
                  </div>
                </div>
              )}

              <div style={{ marginTop: 14 }}>
                <label style={s.label}>Дополнение врача</label>
                <textarea
                  style={s.textarea}
                  placeholder="Уточнения, детализация жалоб..."
                  value={form.complaintsNote}
                  onChange={e => setField('complaintsNote', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ════ БЛОК 3: ANAMNESIS MORBI ════ */}
          <div ref={el => { sectionRefs.current['anamnesis-morbi'] = el }} style={s.block}>
            <div style={s.blockHeader}>
              <div style={s.blockIcon}><FileText size={16} /></div>
              <div style={s.blockTitle}>Anamnesis morbi (анамнез заболевания)</div>
            </div>
            <div style={s.blockBody}>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Дата начала заболевания</label>
                  <input type="date" style={s.input} value={form.illnessStartDate} onChange={e => setField('illnessStartDate', e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>Дата обращения</label>
                  <input type="date" style={s.input} value={form.hospitalizationDate} onChange={e => setField('hospitalizationDate', e.target.value)} />
                </div>
              </div>

              <div style={s.subsection}>Причина начала заболевания</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  ['cold', 'Переохлаждение'],
                  ['infection', 'Инфекция'],
                  ['contact', 'Контакт'],
                  ['unknown', 'Неизвестно'],
                ].map(([val, label]) => (
                  <CheckBtnComp
                    key={val}
                    checked={form.illnessCauses.includes(val as any)}
                    onClick={() => {
                      const causes = form.illnessCauses.includes(val as any)
                        ? form.illnessCauses.filter(c => c !== val)
                        : [...form.illnessCauses, val as any]
                      setField('illnessCauses', causes)
                    }}
                  >{label}</CheckBtnComp>
                ))}
              </div>

              <div style={s.subsection}>Лечение до госпитализации</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['outpatient', 'Амбулаторное'], ['inpatient', 'Стационарное']].map(([val, label]) => (
                  <CheckBtnComp
                    key={val}
                    checked={form.preTreatment.includes(val as any)}
                    onClick={() => {
                      const t = form.preTreatment.includes(val as any)
                        ? form.preTreatment.filter(x => x !== val)
                        : [...form.preTreatment, val as any]
                      setField('preTreatment', t)
                    }}
                  >{label}</CheckBtnComp>
                ))}
              </div>

              {form.preTreatment.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <FieldInput label="Чем лечился" value={form.preTreatmentDetails} onChange={v => setField('preTreatmentDetails', v)} placeholder="Препараты, процедуры..." />
                  <div style={{ marginTop: 10 }}>
                    <label style={s.label}>Эффект лечения</label>
                    <div style={s.pillGroup}>
                      {[
                        ['improvement', 'Улучшение', 'green'],
                        ['no_change', 'Без изменений', 'blue'],
                        ['deterioration', 'Ухудшение', 'red'],
                      ].map(([val, label, color]) => (
                        <PillBtn key={val} active={form.preTreatmentEffect === val} color={color} onClick={() => setField('preTreatmentEffect', val as any)}>
                          {label}
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <label style={s.label}>Причина госпитализации</label>
                <textarea style={{ ...s.textarea, minHeight: 60 }} placeholder="Причина направления..." value={form.hospitalizationReason} onChange={e => setField('hospitalizationReason', e.target.value)} />
              </div>
            </div>
          </div>

          {/* ════ БЛОК 4: ANAMNESIS VITAE ════ */}
          <div ref={el => { sectionRefs.current['anamnesis-vitae'] = el }} style={s.block}>
            <div style={s.blockHeader}>
              <div style={s.blockIcon}><User size={16} /></div>
              <div style={s.blockTitle}>Anamnesis vitae</div>
            </div>
            <div style={s.blockBody}>
              {/* Инфекционный анамнез */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Инфекционный анамнез</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Туберкулёз', field: 'tbStatus' as const, opts: [['denies', 'Отрицает'], ['confirms', 'Подтверждает']] },
                    { label: 'Контакт с туберкулёзом', field: 'tbContact' as const, opts: [['no', 'Нет'], ['yes', 'Да']] },
                    { label: 'ВИЧ', field: 'hivStatus' as const, opts: [['negative', 'Отрицательный'], ['positive', 'Положительный']] },
                    { label: 'Гепатит', field: 'hepatitisStatus' as const, opts: [['negative', 'Отрицательный'], ['positive', 'Положительный']] },
                    { label: 'Венерические заболевания', field: 'stdStatus' as const, opts: [['denies', 'Отрицает'], ['has', 'Имеются']] },
                  ].map(({ label, field, opts }) => (
                    <div key={field}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{label}</div>
                      <div style={s.pillGroup}>
                        {opts.map(([val, lbl]) => (
                          <PillBtn key={val} active={(form as any)[field] === val} color={val === 'positive' || val === 'yes' || val === 'confirms' || val === 'has' ? 'red' : 'green'} onClick={() => setField(field as any, val as any)}>
                            {lbl}
                          </PillBtn>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Аллергии */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Аллергологический анамнез</div>
                <div style={s.pillGroup}>
                  <PillBtn active={form.allergyStatus === 'none'} color="green" onClick={() => setField('allergyStatus', 'none')}>Не отягощён</PillBtn>
                  <PillBtn active={form.allergyStatus === 'has'} color="red" onClick={() => setField('allergyStatus', 'has')}>Имеются аллергии</PillBtn>
                </div>
                {form.allergyStatus === 'has' && (
                  <div style={{ marginTop: 10 }}>
                    {form.allergies.map((a, i) => (
                      <div key={a.id} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                        <input style={{ ...s.input, flex: 1 }} placeholder="Аллерген" value={a.name} onChange={e => setField('allergies', form.allergies.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                        <input style={{ ...s.input, flex: 1 }} placeholder="Реакция" value={a.reaction} onChange={e => setField('allergies', form.allergies.map((x, j) => j === i ? { ...x, reaction: e.target.value } : x))} />
                        <button onClick={() => setField('allergies', form.allergies.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={15} /></button>
                      </div>
                    ))}
                    <button
                      onClick={() => setField('allergies', [...form.allergies, { id: `a-${Date.now()}`, name: '', reaction: '' }])}
                      style={{ marginTop: 6, fontSize: 13, color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT }}
                    >
                      <Plus size={14} /> Добавить аллергию
                    </button>
                  </div>
                )}
              </div>

              {/* Операции */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Операции</div>
                <CheckBtnComp checked={form.operationsStatus === 'none'} onClick={() => setField('operationsStatus', 'none')}>Отсутствуют</CheckBtnComp>
                {form.operationsStatus !== 'none' && (
                  <div style={{ marginTop: 10 }}>
                    {form.operations.map((op, i) => (
                      <div key={op.id} style={{ background: '#f8fafc', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                          <div style={{ flex: '0 0 140px' }}>
                            <label style={s.label}>Дата</label>
                            <input type="date" style={s.input} value={op.date} onChange={e => setField('operations', form.operations.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={s.label}>Операция</label>
                            <input style={s.input} placeholder="Название" value={op.name} onChange={e => setField('operations', form.operations.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                          </div>
                          <button onClick={() => setField('operations', form.operations.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', alignSelf: 'flex-end', marginBottom: 2 }}><Trash2 size={15} /></button>
                        </div>
                        <input style={s.input} placeholder="Комментарий" value={op.comment} onChange={e => setField('operations', form.operations.map((x, j) => j === i ? { ...x, comment: e.target.value } : x))} />
                      </div>
                    ))}
                    <button onClick={() => setField('operations', [...form.operations, { id: `op-${Date.now()}`, date: '', name: '', comment: '' }])} style={{ fontSize: 13, color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT }}>
                      <Plus size={14} /> Добавить операцию
                    </button>
                  </div>
                )}
                {form.operationsStatus === 'none' && (
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => setField('operationsStatus', 'has')} style={{ fontSize: 12, color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT }}>Добавить операцию</button>
                  </div>
                )}
              </div>

              {/* Сопутствующие заболевания */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Сопутствующие заболевания</div>
                {form.comorbidities.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {['Диагноз', 'Активность', ''].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 11, color: '#94a3b8', fontWeight: 600, background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.comorbidities.map((c, i) => (
                        <tr key={c.id}>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <input style={s.input} value={c.diagnosis} placeholder="Диагноз..." onChange={e => setField('comorbidities', form.comorbidities.map((x, j) => j === i ? { ...x, diagnosis: e.target.value } : x))} />
                          </td>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <input style={s.input} value={c.activity} placeholder="Активность..." onChange={e => setField('comorbidities', form.comorbidities.map((x, j) => j === i ? { ...x, activity: e.target.value } : x))} />
                          </td>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #f8fafc' }}>
                            <button onClick={() => setField('comorbidities', form.comorbidities.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <div style={{ color: '#94a3b8', fontSize: 13 }}>Нет сопутствующих заболеваний</div>}
                <button onClick={() => setField('comorbidities', [...form.comorbidities, { id: `cm-${Date.now()}`, diagnosis: '', activity: 'Активное' }])} style={{ marginTop: 8, fontSize: 13, color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT }}>
                  <Plus size={14} /> Добавить
                </button>
              </div>

              {/* Вредные привычки */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Вредные привычки</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <PillBtn active={form.badHabitsStatus === 'none'} color="green" onClick={() => setField('badHabitsStatus', 'none')}>Нет</PillBtn>
                  <PillBtn active={form.badHabitsStatus === 'has'} color="orange" onClick={() => setField('badHabitsStatus', 'has')}>Имеются</PillBtn>
                </div>
                {form.badHabitsStatus === 'has' && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <CheckBtnComp checked={form.smoking} onClick={() => setField('smoking', !form.smoking)}>Курение</CheckBtnComp>
                      <CheckBtnComp checked={form.alcohol} onClick={() => setField('alcohol', !form.alcohol)}>Алкоголь</CheckBtnComp>
                    </div>
                    {form.smoking && (
                      <div style={{ marginTop: 8 }}>
                        <label style={s.label}>Стаж курения (лет)</label>
                        <input type="number" min="0" max="100" style={s.input} placeholder="10" value={form.smokingYears} onChange={e => setField('smokingYears', e.target.value)} />
                      </div>
                    )}
                    {form.alcohol && <div style={{ marginTop: 8 }}><FieldInput label="Алкоголь — подробности" value={form.alcoholDetails} onChange={v => setField('alcoholDetails', v)} placeholder="Эпизодически, регулярно..." /></div>}
                  </div>
                )}
              </div>


            </div>
          </div>

          {/* ════ БЛОК 5: ОБЪЕКТИВНЫЙ СТАТУС ════ */}
          <div ref={el => { sectionRefs.current['objective'] = el }} style={s.block}>
            <div style={s.blockHeader}>
              <div style={s.blockIcon}><Stethoscope size={16} /></div>
              <div style={s.blockTitle}>Объективный статус</div>
            </div>
            <div style={s.blockBody}>
              {/* Общее */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Общее состояние</div>
                <div style={s.pillGroup}>
                  {([['satisfactory', 'Удовлетворительное', 'green'], ['moderate', 'Средней тяжести', 'orange'], ['severe', 'Тяжёлое', 'red'], ['critical', 'Крайне тяжёлое', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.generalCondition === val} color={c} onClick={() => setField('generalCondition', form.generalCondition === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>
                <div style={s.subsection}>Сознание</div>
                <div style={s.pillGroup}>
                  {([['clear', 'Ясное', 'green'], ['drowsy', 'Заторможенное', 'orange'], ['confused', 'Спутанное', 'orange'], ['absent', 'Отсутствует', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.consciousness === val} color={c} onClick={() => setField('consciousness', form.consciousness === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>
                <div style={s.row}>
                  <div>
                    <div style={s.subsection}>Конституция</div>
                    <div style={s.pillGroup}>
                      {([['normosthenic', 'Нормостеническая'], ['hypersthenic', 'Гиперстеническая'], ['asthenic', 'Астеническая']] as const).map(([val, lbl]) => (
                        <PillBtn key={val} active={form.constitution === val} onClick={() => setField('constitution', form.constitution === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={s.subsection}>Питание</div>
                    <div style={s.pillGroup}>
                      {([['satisfactory', 'Удовлетворительное', 'green'], ['elevated', 'Повышенное', 'orange'], ['reduced', 'Сниженное', 'blue']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.nutrition === val} color={c} onClick={() => setField('nutrition', form.nutrition === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Кожа */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Кожа и слизистые</div>
                <div style={s.row}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>Цвет</div>
                    <div style={s.pillGroup}>
                      {([['pale_pink', 'Бледно-розовая', 'green'], ['pale', 'Бледная', 'blue'], ['hyperemia', 'Гиперемия', 'orange'], ['cyanosis', 'Цианоз', 'blue'], ['icteric', 'Иктеричная', 'orange']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.skinColor === val} color={c} onClick={() => setField('skinColor', form.skinColor === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>Температура кожи</div>
                    <div style={s.pillGroup}>
                      {([['warm', 'Тёплая', 'green'], ['cold', 'Холодная', 'blue'], ['hot', 'Горячая', 'red']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.skinTemp === val} color={c} onClick={() => setField('skinTemp', form.skinTemp === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ ...s.row, marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>Влажность</div>
                    <div style={s.pillGroup}>
                      {([['dry', 'Сухая', 'orange'], ['moist', 'Влажная', 'green'], ['excessive', 'Повышенная', 'blue']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.skinMoisture === val} color={c} onClick={() => setField('skinMoisture', form.skinMoisture === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>Слизистые</div>
                    <div style={s.pillGroup}>
                      {([['moist', 'Влажные', 'green'], ['dry', 'Сухие', 'orange']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.mucousState === val} color={c} onClick={() => setField('mucousState', form.mucousState === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  <CheckBtnComp checked={form.cyanosis} onClick={() => setField('cyanosis', !form.cyanosis)}>Цианоз</CheckBtnComp>
                  <CheckBtnComp checked={form.acrocyanosis} onClick={() => setField('acrocyanosis', !form.acrocyanosis)}>Акроцианоз</CheckBtnComp>
                  <CheckBtnComp checked={form.edemaPresent} onClick={() => setField('edemaPresent', !form.edemaPresent)}>Отёки</CheckBtnComp>
                </div>
                {form.edemaPresent && (
                  <div style={{ marginTop: 8 }}>
                    <FieldInput label="Локализация отёков" value={form.edemaLocation} onChange={v => setField('edemaLocation', v)} placeholder="Нижние конечности..." />
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <label style={s.label}>Лимфоузлы</label>
                  <div style={s.pillGroup}>
                    {([['not_palpable', 'Не пальпируются', 'green'], ['enlarged', 'Увеличены', 'red']] as const).map(([val, lbl, c]) => (
                      <PillBtn key={val} active={form.lymphNodes === val} color={c} onClick={() => setField('lymphNodes', form.lymphNodes === val ? null : val)}>{lbl}</PillBtn>
                    ))}
                  </div>
                </div>
              </div>

              {/* Дыхательная система */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Дыхательная система</div>
                <div style={s.row}>
                  <div>
                    <label style={s.label}>Дыхание через нос</label>
                    <div style={s.pillGroup}>
                      {([['free', 'Свободное', 'green'], ['difficult', 'Затруднено', 'orange']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.breathingNose === val} color={c} onClick={() => setField('breathingNose', form.breathingNose === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                  <div style={s.row}>
                    <FieldInput label="ЧДД (в мин.)" value={form.rr} onChange={v => setField('rr', v)} placeholder="18" />
                    <FieldInput label="SpO₂ (%)" value={form.spo2} onChange={v => setField('spo2', v)} placeholder="98" />
                  </div>
                </div>

                <div style={s.subsection}>Форма грудной клетки</div>
                <div style={s.pillGroup}>
                  {([['normosthenic', 'Нормостеническая'], ['hypersthenic', 'Гиперстеническая'], ['asthenic', 'Астеническая'], ['emphysematous', 'Эмфизематозная']] as const).map(([val, lbl]) => (
                    <PillBtn key={val} active={form.chestForm === val} onClick={() => setField('chestForm', form.chestForm === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>

                <div style={s.subsection}>Симметрия</div>
                <div style={s.pillGroup}>
                  {([['symmetric', 'Симметричная', 'green'], ['asymmetric', 'Асимметричная', 'orange']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.chestSymmetry === val} color={c} onClick={() => setField('chestSymmetry', form.chestSymmetry === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>

                <div style={s.subsection}>Перкуторный звук</div>
                <div style={s.pillGroup}>
                  {([['clear', 'Ясный лёгочный', 'green'], ['dull', 'Тупой', 'red'], ['tympanic', 'Тимпанит', 'blue'], ['shortened', 'Укорочен', 'orange']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.percussionSound === val} color={c} onClick={() => setField('percussionSound', form.percussionSound === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>

                <div style={s.subsection}>Аускультация — тип дыхания</div>
                <div style={s.pillGroup}>
                  {([['vesicular', 'Везикулярное', 'green'], ['harsh', 'Жёсткое', 'orange'], ['weakened', 'Ослабленное', 'blue'], ['bronchial', 'Бронхиальное', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.breathingType === val} color={c} onClick={() => setField('breathingType', form.breathingType === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>

                <div style={s.subsection}>Хрипы</div>
                <div style={s.pillGroup}>
                  {([['none', 'Отсутствуют', 'green'], ['dry', 'Сухие', 'orange'], ['moist', 'Влажные', 'blue'], ['crepitation', 'Крепитация', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.ralesType === val} color={c} onClick={() => setField('ralesType', form.ralesType === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>
                {form.ralesType && form.ralesType !== 'none' && (
                  <div style={{ marginTop: 8 }}>
                    <FieldInput label="Локализация хрипов" value={form.ralesLocation} onChange={v => setField('ralesLocation', v)} placeholder="В нижних отделах слева..." />
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <FieldInput label="Комментарий" value={form.respiratoryComment} onChange={v => setField('respiratoryComment', v)} placeholder="Доп. данные..." />
                </div>
              </div>

              {/* Сердечно-сосудистая */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Сердечно-сосудистая система</div>
                <div style={s.row3}>
                  <div>
                    <label style={s.label}>ЧСС (уд/мин)</label>
                    <input type="number" min="20" max="250" style={s.input} placeholder="77" value={form.hr} onChange={e => setField('hr', e.target.value)} />
                  </div>
                  <div>
                    <label style={s.label}>Пульс (уд/мин)</label>
                    <input type="number" min="20" max="250" style={s.input} placeholder="77" value={form.pulse} onChange={e => setField('pulse', e.target.value)} />
                  </div>
                  <div />
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>АД правая рука (мм рт. ст.)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={s.label}>Систолическое</label>
                      <input type="number" min="60" max="260" style={s.input} placeholder="120" value={form.bpRightSys} onChange={e => setField('bpRightSys', e.target.value)} />
                    </div>
                    <div>
                      <label style={s.label}>Диастолическое</label>
                      <input type="number" min="40" max="160" style={s.input} placeholder="80" value={form.bpRightDia} onChange={e => setField('bpRightDia', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>АД левая рука (мм рт. ст.)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={s.label}>Систолическое</label>
                      <input type="number" min="60" max="260" style={s.input} placeholder="120" value={form.bpLeftSys} onChange={e => setField('bpLeftSys', e.target.value)} />
                    </div>
                    <div>
                      <label style={s.label}>Диастолическое</label>
                      <input type="number" min="40" max="160" style={s.input} placeholder="80" value={form.bpLeftDia} onChange={e => setField('bpLeftDia', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div style={s.subsection}>Ритм</div>
                <div style={s.pillGroup}>
                  {([['regular', 'Правильный', 'green'], ['irregular', 'Неправильный', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.heartRhythm === val} color={c} onClick={() => setField('heartRhythm', form.heartRhythm === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>
                <div style={s.subsection}>Тоны сердца</div>
                <div style={s.pillGroup}>
                  {([['clear', 'Ясные', 'green'], ['muffled', 'Приглушены', 'orange'], ['deaf', 'Глухие', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.heartTones === val} color={c} onClick={() => setField('heartTones', form.heartTones === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>
                <div style={s.subsection}>Шумы</div>
                <div style={s.pillGroup}>
                  {([['absent', 'Отсутствуют', 'green'], ['systolic', 'Систолический', 'orange'], ['diastolic', 'Диастолический', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.heartMurmurs === val} color={c} onClick={() => setField('heartMurmurs', form.heartMurmurs === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>
              </div>

              {/* ЖКТ */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>ЖКТ</div>
                <div style={s.subsection}>Язык</div>
                <div style={s.pillGroup}>
                  {([['moist_clean', 'Влажный, чистый', 'green'], ['moist_coated', 'Влажный, обложен', 'orange'], ['dry_clean', 'Сухой, чистый', 'orange'], ['dry_coated', 'Сухой, обложен', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.tongueState === val} color={c} onClick={() => setField('tongueState', form.tongueState === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>
                <div style={s.subsection}>Живот</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>Состояние</div>
                    <div style={s.pillGroup}>
                      {([['soft', 'Мягкий', 'green'], ['tense', 'Напряжён', 'red'], ['bloated', 'Вздут', 'orange']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.abdomenState === val} color={c} onClick={() => setField('abdomenState', form.abdomenState === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>Болезненность</div>
                    <div style={s.pillGroup}>
                      {([['painless', 'Безболезненный', 'green'], ['painful', 'Болезненный', 'red'], ['local', 'Локальная', 'orange']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.abdomenPain === val} color={c} onClick={() => setField('abdomenPain', form.abdomenPain === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ ...s.row, marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>Печень</div>
                    <div style={s.pillGroup}>
                      {([['not_protruding', 'Не выступает', 'green'], ['protruding_1', '+1 см', 'orange'], ['protruding_2', '+2 см', 'orange'], ['protruding_3', '+3 см', 'red']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.liverState === val} color={c} onClick={() => setField('liverState', form.liverState === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>Селезёнка</div>
                    <div style={s.pillGroup}>
                      {([['not_palpable', 'Не пальпируется', 'green'], ['enlarged', 'Увеличена', 'orange']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.spleenState === val} color={c} onClick={() => setField('spleenState', form.spleenState === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <label style={s.label}>Брюшина (симптомы раздражения)</label>
                  <div style={s.pillGroup}>
                    {([['irritation_absent', 'Отсутствуют', 'green'], ['irritation_present', 'Положительные', 'red']] as const).map(([val, lbl, c]) => (
                      <PillBtn key={val} active={form.peritoneum === val} color={c} onClick={() => setField('peritoneum', form.peritoneum === val ? null : val)}>{lbl}</PillBtn>
                    ))}
                  </div>
                </div>
              </div>

              {/* Мочевыделение */}
              <div style={s.paramCard}>
                <div style={s.paramLabel}>Мочевыделительная система</div>
                <div style={s.subsection}>Симптом поколачивания</div>
                <div style={s.pillGroup}>
                  {([['painless', 'Безболезненный с обеих сторон', 'green'], ['painful_left', 'Положительный слева', 'orange'], ['painful_right', 'Положительный справа', 'orange'], ['painful_both', 'Положительный с обеих сторон', 'red']] as const).map(([val, lbl, c]) => (
                    <PillBtn key={val} active={form.kidneyPercussion === val} color={c} onClick={() => setField('kidneyPercussion', form.kidneyPercussion === val ? null : val)}>{lbl}</PillBtn>
                  ))}
                </div>
                <div style={{ ...s.row, marginTop: 12 }}>
                  <div>
                    <div style={s.subsection}>Мочеиспускание</div>
                    <div style={s.pillGroup}>
                      {([['free_painless', 'Свободное, безболезненное', 'green'], ['difficult', 'Затруднено', 'orange'], ['painful', 'Болезненное', 'red'], ['frequent', 'Учащённое', 'orange']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.urination === val} color={c} onClick={() => setField('urination', form.urination === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={s.subsection}>Стул</div>
                    <div style={s.pillGroup}>
                      {([['normal', 'Оформленный, регулярный', 'green'], ['constipation', 'Задержка', 'orange'], ['diarrhea', 'Жидкий', 'red'], ['absent', 'Нет', 'red']] as const).map(([val, lbl, c]) => (
                        <PillBtn key={val} active={form.stool === val} color={c} onClick={() => setField('stool', form.stool === val ? null : val)}>{lbl}</PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════ БЛОК 6: ДИАГНОЗ ════ */}
          <div ref={el => { sectionRefs.current['diagnosis'] = el }} style={s.block}>
            <div style={s.blockHeader}>
              <div style={s.blockIcon}><ClipboardList size={16} /></div>
              <div style={s.blockTitle}>Клинический диагноз</div>
            </div>
            <div style={s.blockBody}>
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Основной диагноз</label>
                <textarea style={{ ...s.textarea, minHeight: 70 }} placeholder="Внебольничная пневмония, левосторонняя..." value={form.primaryDiagnosis} onChange={e => setField('primaryDiagnosis', e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Осложнения</label>
                <textarea style={{ ...s.textarea, minHeight: 60 }} placeholder="ОДН I ст...." value={form.complicationsDiagnosis} onChange={e => setField('complicationsDiagnosis', e.target.value)} />
              </div>
              <div>
                <label style={s.label}>Сопутствующий диагноз</label>
                <textarea style={{ ...s.textarea, minHeight: 60 }} placeholder="ИБС, гипертоническая болезнь..." value={form.concomitantDiagnosis} onChange={e => setField('concomitantDiagnosis', e.target.value)} />
              </div>
            </div>
          </div>

          {/* ════ БЛОК 7: НАЗНАЧЕНИЯ ════ */}
          <div ref={el => { sectionRefs.current['prescriptions'] = el }} style={s.block}>
            <div style={s.blockHeader}>
              <div style={s.blockIcon}><PillIcon size={16} /></div>
              <div style={s.blockTitle}>Назначения врача</div>
              <button
                onClick={() => setShowPrescModal(true)}
                style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
              >
                <Plus size={14} /> Добавить назначение
              </button>
            </div>
            <div style={s.blockBody}>
              {form.prescriptions.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: 13, padding: '16px 0' }}>Нет назначений. Нажмите «Добавить назначение».</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {['Препарат', 'Доза', 'Ед.', 'Путь', 'Кратность', 'Комментарий', ''].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.prescriptions.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '10px' }}>
                            <input style={{ ...s.input, border: 'none', background: 'transparent', fontWeight: 600, padding: 0 }} value={p.drug} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, drug: e.target.value } : x) }))} />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input style={{ ...s.input, border: 'none', background: 'transparent', padding: 0, width: 60 }} value={p.dose} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, dose: e.target.value } : x) }))} />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input style={{ ...s.input, border: 'none', background: 'transparent', padding: 0, width: 40 }} value={p.unit} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, unit: e.target.value } : x) }))} />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input style={{ ...s.input, border: 'none', background: 'transparent', padding: 0, width: 80 }} value={p.route} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, route: e.target.value } : x) }))} />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input style={{ ...s.input, border: 'none', background: 'transparent', padding: 0, width: 60 }} value={p.frequency} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, frequency: e.target.value } : x) }))} />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input style={{ ...s.input, border: 'none', background: 'transparent', padding: 0 }} value={p.comment ?? ''} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, comment: e.target.value } : x) }))} placeholder="—" />
                          </td>
                          <td style={{ padding: '10px' }}>
                            <button onClick={() => removePresc(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ════ БЛОК 8: ПЛАН ОБСЛЕДОВАНИЯ ════ */}
          <div ref={el => { sectionRefs.current['examplan'] = el }} style={s.block}>
            <div style={s.blockHeader}>
              <div style={s.blockIcon}><FlaskConical size={16} /></div>
              <div style={s.blockTitle}>План обследования</div>
              <button
                onClick={handleCreateReferral}
                style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#f0fdf4', color: '#059669', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
              >
                <FilePlus size={14} /> Создать направление
              </button>
            </div>
            <div style={s.blockBody}>
              <div style={s.subsection}>Лаборатория</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {form.labTests.filter(t => t.category === 'lab').map(t => (
                  <CheckBtnComp key={t.id} checked={t.checked} onClick={() => setForm(prev => ({ ...prev, labTests: prev.labTests.map(x => x.id === t.id ? { ...x, checked: !x.checked } : x) }))}>
                    {t.name}
                  </CheckBtnComp>
                ))}
              </div>
              <div style={s.subsection}>Инструментальные</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {form.labTests.filter(t => t.category === 'instrumental').map(t => (
                  <CheckBtnComp key={t.id} checked={t.checked} onClick={() => setForm(prev => ({ ...prev, labTests: prev.labTests.map(x => x.id === t.id ? { ...x, checked: !x.checked } : x) }))}>
                    {t.name}
                  </CheckBtnComp>
                ))}
              </div>
            </div>
          </div>

          {/* Итоговая запись */}
          {showGenText && form.generatedText && (
            <div style={{ ...s.block, border: '2px solid #22c55e' }}>
              <div style={{ ...s.blockHeader, background: '#f0fdf4' }}>
                <div style={{ ...s.blockIcon, background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', color: '#059669' }}><FileText size={16} /></div>
                <div style={{ ...s.blockTitle, color: '#059669' }}>Запись осмотра сформирована</div>
                <button
                  onClick={() => { navigator.clipboard.writeText(form.generatedText); showToast('Текст скопирован', 'success') }}
                  style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: 8, border: '1px solid #86efac', background: 'white', color: '#059669', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
                >
                  Копировать
                </button>
              </div>
              <div style={{ ...s.blockBody, background: '#fafffe' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: FONT, fontSize: 13, color: '#1e293b', lineHeight: 1.7, margin: 0 }}>
                  {form.generatedText}
                </pre>
              </div>
            </div>
          )}

          {!showGenText && (
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <button
                onClick={handleComplete}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, boxShadow: '0 4px 18px rgba(29,78,216,0.35)' }}
              >
                <Sparkles size={18} /> Завершить осмотр и сформировать запись
              </button>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Данные будут сохранены в карточке пациента</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Модал: Добавить назначение ── */}
      {showPrescModal && (
        <div style={s.modal} onClick={() => setShowPrescModal(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Добавить назначение</h3>
              <button onClick={() => setShowPrescModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Препарат */}
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Препарат *</label>
              <input style={s.input} placeholder="Цефтриаксон" value={newPresc.drug ?? ''} onChange={e => setNewPresc(p => ({ ...p, drug: e.target.value }))} />
            </div>

            {/* Форма / Доза / Единицы */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={s.label}>Форма</label>
                <select style={{ ...s.input, appearance: 'auto' as any }} value={newPresc.form ?? ''} onChange={e => setNewPresc(p => ({ ...p, form: e.target.value }))}>
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
                <input type="number" min="0" step="0.1" style={s.input} placeholder="1.0" value={newPresc.dose ?? ''} onChange={e => setNewPresc(p => ({ ...p, dose: e.target.value }))} />
              </div>
              <div>
                <label style={s.label}>Единицы</label>
                <select style={{ ...s.input, appearance: 'auto' as any }} value={newPresc.unit ?? 'мг'} onChange={e => setNewPresc(p => ({ ...p, unit: e.target.value }))}>
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

            {/* Путь введения / Кратность / Длительность */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={s.label}>Путь введения</label>
                <select style={{ ...s.input, appearance: 'auto' as any }} value={newPresc.route ?? 'перорально'} onChange={e => setNewPresc(p => ({ ...p, route: e.target.value }))}>
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
                <select style={{ ...s.input, appearance: 'auto' as any }} value={newPresc.frequency ?? '1р/д'} onChange={e => setNewPresc(p => ({ ...p, frequency: e.target.value }))}>
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
                <select style={{ ...s.input, appearance: 'auto' as any }} value={newPresc.regimen ?? ''} onChange={e => setNewPresc(p => ({ ...p, regimen: e.target.value }))}>
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
              <input style={s.input} placeholder="Развести в 200 мл NaCl 0.9%..." value={newPresc.comment ?? ''} onChange={e => setNewPresc(p => ({ ...p, comment: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowPrescModal(false)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontFamily: FONT, fontSize: 13 }}>Отмена</button>
              <button onClick={addPresc} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#1d4ed8', color: 'white', cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600 }}>Добавить</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Модал: Направление ── */}
      {showReferralModal && (
        <div style={s.modal} onClick={() => setShowReferralModal(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Создать направление</h3>
              <button onClick={() => setShowReferralModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Выбранные исследования:</div>
              {form.labTests.filter(t => t.checked).map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Check size={14} color="#22c55e" />
                  <span style={{ fontSize: 13 }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{t.category === 'lab' ? 'лаборатория' : 'инструментальное'}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Пациент</label>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{patient?.lastName} {patient?.firstName} {patient?.middleName}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Направляющий врач</label>
              <div style={{ fontSize: 14 }}>{form.doctor}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Примечание</label>
              <textarea style={{ ...s.textarea, minHeight: 60 }} placeholder="Дополнительные указания..." value={referralNote} onChange={e => setReferralNote(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowReferralModal(false)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontFamily: FONT, fontSize: 13 }}>Отмена</button>
              <button
                onClick={() => {
                  setShowReferralModal(false)
                  showToast(`Направление на ${form.labTests.filter(t => t.checked).length} исследований создано`, 'success')
                }}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600 }}
              >
                Создать направление
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div style={s.toast(toastMsg.type)}>
          {toastMsg.type === 'success' ? <Check size={18} /> : toastMsg.type === 'error' ? <AlertTriangle size={18} /> : null}
          {toastMsg.text}
        </div>
      )}
    </div>
  )
}

export default PrimaryInspectionPage
