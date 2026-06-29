import React, { useState, useCallback, useEffect } from 'react'
import Select from 'react-select'
import { formatLocalDate, toBackendDateTimeString } from 'utils/dateUtils'
import {
  Clock,
  Save,
  X,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  Heart,
  Wind,
  Droplets,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Plus,
  Trash2,
  History,
  BookOpen,
  Info
} from 'lucide-react'
import {
  DailyRoundFormState,
  ComplaintKey,
  COMPLAINT_LABELS,
  ComplaintParams,
  GeneralCondition,
  BreathingType,
  RalesType,
  HeartRhythm,
  HeartTones,
  TongueState,
  AbdomenState,
  StoolState,
  UrinationState,
  DynamicsState,
  SkinColor,
  SkinTemp,
  SkinMoisture,
  ChestForm,
  ChestSymmetry,
  RoundPrescription,
  SavedInspection
} from './types'
import { getInitialDailyState } from './mockRoundData'
import { usePatientData } from 'context/PatientDataContext'
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

const FONT = `'SF Pro Display', 'Inter', -apple-system, sans-serif`

const pill = (active: boolean, color = 'blue'): React.CSSProperties => {
  const m: Record<
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
  const c = m[color] ?? m.blue
  return {
    padding: '5px 12px',
    borderRadius: 20,
    fontFamily: FONT,
    border: `1.5px solid ${active ? c.aBorder : c.border}`,
    background: active ? c.aBg : c.bg,
    color: active ? c.aText : c.text,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.13s'
  }
}

const checkBtn = (checked: boolean): React.CSSProperties => ({
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
  fontFamily: FONT
})

const inputStyle: React.CSSProperties = {
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
}

const label: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#64748b',
  display: 'block',
  marginBottom: 5
}

const block: React.CSSProperties = {
  background: 'white',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  marginBottom: 0,
  overflow: 'hidden',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
}

const blockHeader: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #f1f5f9',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: '#fafbfc',
  fontSize: 13,
  fontWeight: 700,
  color: '#0f172a'
}

const blockBody: React.CSSProperties = { padding: '14px 16px' }

const pillGroup: React.CSSProperties = { display: 'flex', flexWrap: 'wrap' as const, gap: 6 }

const sub: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#94a3b8',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  marginTop: 12,
  marginBottom: 6,
  paddingBottom: 4,
  borderBottom: '1px solid #f1f5f9'
}

function generateDailyText(form: DailyRoundFormState, patientName: string): string {
  const parts: string[] = []

  const dateRu = form.inspectionDate ? formatLocalDate(form.inspectionDate) : form.inspectionDate

  parts.push(`Осмотр лечащего врача от ${dateRu}. Время: ${form.inspectionTime}.`)

  const condMap: Record<GeneralCondition, string> = {
    satisfactory: 'удовлетворительное',
    moderate: 'средней степени тяжести, стабильное',
    severe: 'тяжелое',
    critical: 'крайне тяжелое'
  }
  if (form.generalCondition) {
    parts.push(`Общее состояние: ${condMap[form.generalCondition]}.`)
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

  const active = form.complaints.filter((c) => c !== 'none')
  if (form.complaints.includes('none') || active.length === 0) {
    parts.push('Жалоб не предъявляет.')
  } else {
    const labels = active.map((c) => {
      let t = COMPLAINT_ACCUSATIVE_RU[c] || c
      if (c === 'fever' && form.complaintParams.fever?.maxTemp)
        t += ` до ${form.complaintParams.fever.maxTemp}°C`
      return t
    })
    parts.push(`Жалобы на: ${labels.join(', ')}.`)
    if (form.complaintsNote) parts.push(form.complaintsNote)
  }

  const bpStr = form.bpSys && form.bpDia ? `${form.bpSys}/${form.bpDia}` : ''
  const vitalParts: string[] = []
  if (form.temperature) vitalParts.push(`температура - ${form.temperature}°C`)
  if (form.hr) vitalParts.push(`ЧСС - ${form.hr} в мин`)
  if (bpStr) vitalParts.push(`АД - ${bpStr} мм рт. ст.`)
  if (form.rr) vitalParts.push(`ЧДД - ${form.rr} в мин`)
  if (form.spo2) vitalParts.push(`SpO₂ - ${form.spo2}%`)
  if (vitalParts.length > 0) {
    parts.push(`Физиологические показатели: ${vitalParts.join(', ')}.`)
  }

  const skinColorMap: Record<string, string> = {
    pale_pink: 'бледно-розовые',
    pale: 'бледные',
    hyperemia: 'гиперемированные',
    cyanosis: 'цианотичные',
    icteric: 'иктеричные'
  }
  const skinTempMap: Record<string, string> = {
    warm: 'теплые',
    cold: 'холодные',
    hot: 'горячие'
  }
  const skinMoistMap: Record<string, string> = {
    dry: 'сухие',
    moist: 'влажные',
    excessive: 'с повышенной влажностью'
  }

  if (form.skinColor || form.skinTemp || form.skinMoisture) {
    let skinParts: string[] = []
    if (form.skinColor) skinParts.push(skinColorMap[form.skinColor] ?? form.skinColor)
    if (form.skinTemp) skinParts.push(skinTempMap[form.skinTemp] ?? form.skinTemp)
    if (form.skinMoisture) skinParts.push(skinMoistMap[form.skinMoisture] ?? form.skinMoisture)
    parts.push(`Кожные покровы: ${skinParts.join(', ')}.`)
  }

  if (form.breathingType) {
    const bt: Record<string, string> = {
      vesicular: 'везикулярное',
      harsh: 'жесткое',
      weakened: 'ослабленное',
      bronchial: 'бронхиальное'
    }
    let respStr = `Аускультативно: над легкими дыхание ${bt[form.breathingType] ?? form.breathingType}`
    if (form.ralesType) {
      const rt: Record<string, string> = {
        none: ', хрипы не выслушиваются',
        dry: ', выслушиваются сухие хрипы',
        moist: ', выслушиваются влажные хрипы',
        crepitation: ', отмечается крепитация'
      }
      respStr += rt[form.ralesType] ?? ''
    }
    respStr += '.'
    if (form.respiratoryNote) respStr += ' ' + form.respiratoryNote
    parts.push(respStr)
  }

  if (form.heartRhythm) {
    const tonesMap: Record<HeartTones, string> = {
      clear: 'ясные',
      muffled: 'приглушены',
      deaf: 'глухие'
    }
    let heartStr = `Сердечная деятельность ${form.heartRhythm === 'regular' ? 'ритмичная' : 'аритмичная'}, тоны сердца ${tonesMap[form.heartTones ?? 'clear'] ?? form.heartTones}.`
    if (form.heartNote) heartStr += ' ' + form.heartNote
    parts.push(heartStr)
  }

  if (form.tongueState) {
    const ts: Record<string, string> = {
      moist_clean: 'влажный, чистый',
      moist_coated: 'влажный, обложен налетом',
      dry_clean: 'сухой, чистый',
      dry_coated: 'сухой, обложен налетом'
    }
    parts.push(`Язык: ${ts[form.tongueState]}.`)
  }

  if (form.abdomenState) {
    const abdMap: Record<string, string> = {
      soft: 'мягкий, безболезненный',
      tense: 'напряжен',
      bloated: 'вздут'
    }
    let abdStr = `Живот при пальпации ${abdMap[form.abdomenState]}.`
    if (form.abdomenNote) abdStr += ` ${form.abdomenNote}`
    parts.push(abdStr)
  }

  if (form.stool || form.urination) {
    let excretions: string[] = []
    if (form.urination) {
      const urMap: Record<string, string> = {
        free_painless: 'свободное, безболезненное',
        difficult: 'затруднено',
        painful: 'болезненное',
        frequent: 'учащенное'
      }
      excretions.push(`мочеиспускание - ${urMap[form.urination]}`)
    }
    if (form.stool) {
      const stoolMap: Record<string, string> = {
        normal: 'оформленный, регулярный',
        constipation: 'склонность к запорам / задержка стула',
        diarrhea: 'жидкий',
        absent: 'отсутствует'
      }
      excretions.push(`стул - ${stoolMap[form.stool]}`)
    }
    parts.push(`Физиологические отправления: ${excretions.join(', ')}.`)
  }

  const dynMap: Record<DynamicsState, string> = {
    improvement: 'Отмечается положительная динамика.',
    no_change: 'Динамика отсутствует (стабильное состояние).',
    deterioration: 'Отмечается ухудшение состояния.'
  }
  if (form.dynamics) parts.push(dynMap[form.dynamics])
  if (form.dynamicsComment) parts.push(form.dynamicsComment)

  if (form.treatmentDecision === 'keep') {
    parts.push('Лечение продолжить по листу назначений.')
  } else {
    parts.push('Лечение скорректировано.')
  }

  if (form.controlStudies) parts.push(`Контроль исследований: ${form.controlStudies}.`)
  if (form.nextInspection) parts.push(`Повторный осмотр: ${form.nextInspection}.`)

  return parts.join(' ')
}

interface DailyRoundPageProps {
  patientId: string
  onClose: () => void
  onNavigateToTemperatureSheet?: (id: string) => void
  hideHeader?: boolean
  onRegisterActions?: (
    actions: {
      handleSaveDraft: () => void
      handleComplete: () => void
      inspectionTime?: string
    } | null
  ) => void
}

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: '38px',
    borderRadius: '8px',
    borderColor: state.isFocused ? '#2563eb' : '#cbd5e1',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    cursor: 'pointer'
  }),
  valueContainer: (base: any) => ({ ...base, padding: '0 8px 0 10px' }),
  placeholder: (base: any) => ({ ...base, color: '#94a3b8' }),
  input: (base: any) => ({ ...base, color: '#1f2937' }),
  singleValue: (base: any) => ({ ...base, color: '#1f2937' }),
  menu: (base: any) => ({
    ...base,
    marginTop: '4px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    zIndex: 9999
  })
}

const DailyRoundPage: React.FC<DailyRoundPageProps> = ({
  patientId,
  onClose,
  onNavigateToTemperatureSheet,
  hideHeader,
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
    loadPatientEncounters,
    getInspections
  } = usePatientData()
  const patient = getPatient(patientId)
  const currentUserDisplayName = useSelector(selectDisplayName)

  const [form, setForm] = useState<DailyRoundFormState>(() => {
    const draft = getDraft(`${patientId}-daily`)
    if (draft) return draft
    const initial = getInitialDailyState(patientId, patient)
    if (currentUserDisplayName) {
      initial.doctor = currentUserDisplayName
      initial.doctorDisplayName = currentUserDisplayName
    }
    return initial
  })
  const [medicines, setMedicines] = useState<any[]>([])

  useEffect(() => {
    import('api/medicinesApi').then(({ fetchAllMedicines }) => {
      fetchAllMedicines().then(setMedicines).catch(console.error)
    })
  }, [])

  const [toastMsg, setToastMsg] = useState<{
    text: string
    type: 'success' | 'info' | 'error'
  } | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showPrescModal, setShowPrescModal] = useState(false)
  const [newPresc, setNewPresc] = useState<Partial<RoundPrescription>>({})
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [activeSection, setActiveSection] = useState('info')

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('ward_round_sidebar_collapsed') === 'true'
  })

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const isMobile = windowWidth < 992

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (
      selectedHistoryId === null &&
      currentUserDisplayName &&
      (!form.doctor || form.doctor === 'Лечащий врач' || form.doctor === patient?.doctor)
    ) {
      setForm((prev) => ({
        ...prev,
        doctor: currentUserDisplayName,
        doctorDisplayName: currentUserDisplayName
      }))
    }
  }, [currentUserDisplayName, patient, selectedHistoryId])

  useEffect(() => {
    loadPatientEncounters(patientId)
  }, [patientId])

  const allInspections = getInspections(patientId)
  const dailyInspections = allInspections
    .filter((i) => i.type === 'daily')
    .sort((a, b) => {
      const dtA = new Date(`${a.date}T${a.time}`).getTime()
      const dtB = new Date(`${b.date}T${b.time}`).getTime()
      return dtB - dtA
    })
  const selectedRecord = selectedHistoryId
    ? (allInspections.find((i) => i.id === selectedHistoryId) ?? null)
    : null

  useEffect(() => {
    if (selectedRecord && selectedRecord.formData) {
      try {
        const parsed = JSON.parse(selectedRecord.formData)
        setForm(parsed)
        setShowResult(Boolean(parsed.generatedText))
      } catch (err) {
        console.error('Failed to parse formData', err)
      }
    } else if (selectedHistoryId === null) {
      const draft = getDraft(`${patientId}-daily`)
      if (draft) {
        setForm(draft)
        setShowResult(Boolean((draft as DailyRoundFormState).generatedText))
      } else {
        const initial = getInitialDailyState(patientId, patient)
        if (currentUserDisplayName) {
          initial.doctor = currentUserDisplayName
          initial.doctorDisplayName = currentUserDisplayName
        }
        setForm(initial)
        setShowResult(false)
      }
    }
  }, [selectedHistoryId, selectedRecord, patientId, patient, getDraft, currentUserDisplayName])

  useEffect(() => {
    if (onRegisterActions) {
      onRegisterActions({
        handleSaveDraft,
        handleComplete: handleGenerateAndSave,
        inspectionTime: form.inspectionTime
      })
    }
    return () => {
      if (onRegisterActions) {
        onRegisterActions(null)
      }
    }
  }, [
    onRegisterActions,
    form.inspectionTime,
    form.inspectionDate,
    form.doctor,
    form.generalCondition,
    form.complaints
  ])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 3000)
    return () => clearTimeout(t)
  }, [toastMsg])

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMsg({ text, type })
  }, [])

  const setField = useCallback(
    <K extends keyof DailyRoundFormState>(key: K, value: DailyRoundFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

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

  const handleSaveDraft = () => {
    setField('status', 'draft')
    saveDraft(`${patientId}-daily`, { ...form, status: 'draft' })
    showToast('Черновик сохранен', 'success')
  }

  const handleGenerateAndSave = async () => {
    if (!patient) return

    // Validation
    if (!form.inspectionDate) return showToast('Укажите дату осмотра', 'error')
    if (!form.inspectionTime) return showToast('Укажите время осмотра', 'error')
    if (!form.doctor) return showToast('Укажите врача', 'error')
    if (!form.generalCondition) return showToast('Оцените общее состояние пациента', 'error')
    if (form.complaints.length === 0) return showToast('Укажите жалобы (или «Нет жалоб»)', 'error')

    try {
      const text = generateDailyText(form, `${patient.lastName} ${patient.firstName}`)

      // Always store doctorDisplayName in formData for history restoration
      const finalForm = {
        ...form,
        generatedText: text,
        status: 'completed' as const,
        doctorDisplayName: form.doctor
      }
      const formJson = JSON.stringify(finalForm)

      setForm(finalForm)
      setShowResult(true)

      const bpStr = form.bpSys && form.bpDia ? `${form.bpSys}/${form.bpDia}` : ''

      const prescriptionsForSync = form.prescriptions
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
            comment: p.comment || original?.comment || '',
            medicineId: p.medicineId || original?.medicineId
          }
        })

      const additionalData: any = {
        doctorName: form.doctor,
        prescriptions: prescriptionsForSync
      }

      await updatePatientRoundData(
        patientId,
        {
          temp: form.temperature || undefined,
          hr: form.hr || undefined,
          bp: bpStr || undefined,
          spo2: form.spo2 || undefined,
          resp: form.rr || undefined
        },
        undefined,
        undefined, // meds shouldn't be overwritten by prescriptions
        additionalData
      )

      const getPrescriptionsDiff = (
        oldMeds: any[],
        newPrescs: RoundPrescription[],
        decision: string
      ) => {
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
            added.push(`${newMed.drug} ${newMed.dose} ${newMed.unit}`)
          }
        })

        const parts: string[] = []
        if (added.length) parts.push(`Добавлено: ${added.join(', ')}`)
        if (removed.length) parts.push(`Убрано: ${removed.join(', ')}`)
        if (changed.length) parts.push(`Изменено: ${changed.join('; ')}`)

        if (parts.length === 0) {
          if (decision === 'keep') return 'Не изменились.'
          if (oldMeds.length === 0 && newPrescs.length === 0) return 'Назначений нет.'
          return 'Не изменились.'
        }
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

      const splitText = text.split('.')
      const objectiveParts = splitText.filter((p) => {
        const lower = p.toLowerCase()
        if (lower.includes('осмотр лечащего врача от') || lower.includes('время:')) return false
        if (lower.includes('жалобы на') || lower.includes('жалоб не предъявляет')) return false
        if (lower.includes('контроль:') || lower.includes('повторный осмотр:')) return false
        if (lower.includes('лечение продолжить') || lower.includes('лечение скорректировано'))
          return false
        return p.trim().length > 0 && p !== form.complaintsNote
      })

      const entryPayload = {
        dateTime: `${form.inspectionDate} ${form.inspectionTime}`,
        type: 'Ежедневный осмотр',
        doctor: form.doctor,
        conclusion: text,
        complaints: complaintsText,
        objective: objectiveParts.join('. ') + '.',
        recommendations: getPrescriptionsDiff(
          (patient as any).prescriptions || [],
          form.prescriptions,
          form.treatmentDecision || 'keep'
        ),
        formData: formJson
      }

      if (selectedHistoryId) {
        await updateHistoryEntry(patientId, selectedHistoryId, entryPayload)

        const insp: SavedInspection = {
          id: selectedHistoryId,
          type: 'daily',
          date: form.inspectionDate,
          time: form.inspectionTime,
          doctor: form.doctor,
          doctorDisplayName: form.doctor,
          vitals: { temp: form.temperature, hr: form.hr, bp: bpStr, spo2: form.spo2, rr: form.rr },
          generatedText: text,
          formData: formJson
        }
        saveInspection(patientId, insp)
      } else {
        const saved = await addHistoryEntry(patientId, entryPayload)
        const realId = saved.id

        const insp: SavedInspection = {
          id: realId,
          type: 'daily',
          date: form.inspectionDate,
          time: form.inspectionTime,
          doctor: form.doctor,
          doctorDisplayName: form.doctor,
          vitals: { temp: form.temperature, hr: form.hr, bp: bpStr, spo2: form.spo2, rr: form.rr },
          generatedText: text,
          formData: formJson
        }
        saveInspection(patientId, insp)
        setSelectedHistoryId(realId)
      }

      setShowResult(true)
      showToast('Осмотр сохранен в карточке пациента', 'success')
      saveDraft(`${patientId}-daily`, null)
    } catch (err) {
      console.error(err)
      showToast(err instanceof Error ? err.message : 'Ошибка сохранения осмотра', 'error')
    }
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
      comment: newPresc.comment,
      action: 'new',
      medicineId: newPresc.medicineId
    }
    setForm((prev) => ({ ...prev, prescriptions: [...prev.prescriptions, p] }))
    setNewPresc({})
    setShowPrescModal(false)
    showToast('Назначение добавлено', 'success')
  }

  if (!patient)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#94a3b8'
        }}
      >
        Пациент не найден
      </div>
    )

  const blockDone: Record<string, boolean> = {
    info: !!form.inspectionDate && !!form.inspectionTime && !!form.doctor,
    vitals: !!form.temperature || !!form.hr || !!form.bpSys || !!form.rr || !!form.spo2,
    complaints: form.complaints.length > 0,
    objective: !!form.generalCondition,
    diagnosis: true,
    prescriptions: form.prescriptions.length > 0,
    recommendations:
      !!form.controlStudies || !!form.nextInspection || form.treatmentDecision !== undefined
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: hideHeader ? '100%' : 'calc(100vh - 84px)',
        background: '#f3f4f6',
        fontFamily: FONT
      }}
    >
      {!hideHeader && (
        <PatientHeader>
          <HeaderBtn variant="ghost" onClick={onClose}>
            <ChevronLeft size={15} /> Обходы
          </HeaderBtn>

          <PatientAvatar>
            {patient.lastName?.[0] || ''}
            {patient.firstName?.[0] || ''}
          </PatientAvatar>

          <PatientInfo>
            <PatientName>
              Ежедневный осмотр: {patient.lastName} {patient.firstName} {patient.middleName}
            </PatientName>
            <PatientMeta>
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

          <HeaderRight>
            <StartTimeDisplay>
              <Clock size={14} /> Начато: {form.inspectionTime}
            </StartTimeDisplay>
            <HeaderBtn variant="ghost" onClick={handleSaveDraft}>
              <Save size={14} /> Черновик
            </HeaderBtn>
            <HeaderBtn variant="primary" onClick={handleGenerateAndSave}>
              <Check size={14} /> Завершить
            </HeaderBtn>
            <HeaderBtn variant="ghost" onClick={onClose} style={{ padding: '7px 10px' }}>
              <X size={15} />
            </HeaderBtn>
          </HeaderRight>
        </PatientHeader>
      )}

      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflow: isMobile ? 'visible' : 'hidden',
          flexDirection: isMobile ? 'column' : 'row'
        }}
      >
        {/* ===== LEFT SIDEBAR ===== */}
        <nav
          style={{
            width: isMobile ? '100%' : sidebarCollapsed ? 64 : 232,
            transition: 'width 0.2s ease-in-out',
            flexShrink: 0,
            background: 'white',
            borderRight: isMobile ? 'none' : '1px solid #e5e7eb',
            borderBottom: isMobile ? '1px solid #e5e7eb' : 'none',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden',
            maxHeight: isMobile && showHistory ? '350px' : 'none'
          }}
        >
          {/* Tab toggle */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
            <button
              onClick={() => {
                setShowHistory(false)
                setSelectedHistoryId(null)
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: FONT,
                border: 'none',
                cursor: 'pointer',
                background: !showHistory ? '#eff6ff' : 'white',
                color: !showHistory ? '#1d4ed8' : '#64748b',
                borderBottom: !showHistory ? '2px solid #1d4ed8' : '2px solid transparent',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5
              }}
              title={sidebarCollapsed && !isMobile ? 'Осмотр' : undefined}
            >
              <BookOpen size={13} />
              {(!sidebarCollapsed || isMobile) && 'Осмотр'}
            </button>
            <button
              onClick={() => setShowHistory(true)}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: FONT,
                border: 'none',
                cursor: 'pointer',
                background: showHistory ? '#eff6ff' : 'white',
                color: showHistory ? '#1d4ed8' : '#64748b',
                borderBottom: showHistory ? '2px solid #1d4ed8' : '2px solid transparent',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5
              }}
              title={
                sidebarCollapsed && !isMobile ? `История (${dailyInspections.length})` : undefined
              }
            >
              <History size={13} />
              {(!sidebarCollapsed || isMobile) && `История (${dailyInspections.length})`}
            </button>
          </div>

          {!showHistory ? (
            /* Form section navigation */
            <div
              style={{
                padding: isMobile ? '8px 16px' : '8px 0',
                overflowX: isMobile ? 'auto' : 'hidden',
                overflowY: isMobile ? 'hidden' : 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                gap: isMobile ? 8 : 0
              }}
            >
              {[
                { id: 'info', label: 'Информация', icon: Clock },
                { id: 'vitals', label: 'Показатели', icon: Activity },
                { id: 'complaints', label: 'Жалобы', icon: FileText },
                { id: 'objective', label: 'Объективно', icon: Heart },
                { id: 'diagnosis', label: 'Динамика', icon: TrendingUp },
                { id: 'prescriptions', label: 'Назначения', icon: Plus },
                { id: 'recommendations', label: 'Рекомендации', icon: Sparkles }
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id)
                    document
                      .getElementById(`daily-${sec.id}`)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  style={{
                    width: isMobile ? 'auto' : '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: isMobile ? '8px 12px' : '10px 14px',
                    border: 'none',
                    background: activeSection === sec.id ? '#eff6ff' : 'transparent',
                    color: activeSection === sec.id ? '#1d4ed8' : '#374151',
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: activeSection === sec.id ? 600 : 450,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    borderLeft: isMobile
                      ? 'none'
                      : `3px solid ${activeSection === sec.id ? '#1d4ed8' : 'transparent'}`,
                    borderBottom: isMobile
                      ? `3px solid ${activeSection === sec.id ? '#1d4ed8' : 'transparent'}`
                      : 'none',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    borderRadius: isMobile ? 6 : 0
                  }}
                  title={sidebarCollapsed && !isMobile ? sec.label : undefined}
                >
                  <sec.icon size={13} />
                  <span
                    style={{
                      flex: 1,
                      display: sidebarCollapsed && !isMobile ? 'none' : 'inline',
                      marginLeft: 8
                    }}
                  >
                    {sec.label}
                  </span>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: blockDone[sec.id] ? '#22c55e' : '#d1d5db',
                      flexShrink: 0,
                      position: sidebarCollapsed && !isMobile ? 'absolute' : 'static',
                      top: sidebarCollapsed && !isMobile ? 8 : undefined,
                      right: sidebarCollapsed && !isMobile ? 8 : undefined
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            /* History list */
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {dailyInspections.length === 0 ? (
                <div
                  style={{
                    padding: '20px 14px',
                    color: '#94a3b8',
                    fontSize: 13,
                    textAlign: 'center'
                  }}
                >
                  <History
                    size={28}
                    color="#cbd5e1"
                    style={{ display: 'block', margin: '0 auto 8px' }}
                  />
                  {(!sidebarCollapsed || isMobile) && 'Нет записей'}
                </div>
              ) : (
                dailyInspections.map((insp) => {
                  const isSelected = selectedHistoryId === insp.id
                  return (
                    <button
                      key={insp.id}
                      onClick={() => setSelectedHistoryId(isSelected ? null : insp.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '10px 14px',
                        border: 'none',
                        background: isSelected ? '#eff6ff' : 'transparent',
                        borderLeft: `3px solid ${isSelected ? '#1d4ed8' : 'transparent'}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.13s',
                        gap: 3
                      }}
                      title={
                        sidebarCollapsed && !isMobile
                          ? `${formatLocalDate(insp.date)} ${insp.time} - ${insp.doctor}`
                          : undefined
                      }
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%'
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: isSelected ? '#1d4ed8' : '#1e293b',
                            fontFamily: FONT,
                            display: sidebarCollapsed && !isMobile ? 'none' : 'inline'
                          }}
                        >
                          {formatLocalDate(insp.date, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: '#94a3b8',
                            fontFamily: FONT,
                            display: sidebarCollapsed && !isMobile ? 'none' : 'inline'
                          }}
                        >
                          {insp.time}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#64748b',
                          fontFamily: FONT,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                          display: sidebarCollapsed && !isMobile ? 'none' : 'block'
                        }}
                      >
                        {insp.doctor}
                      </div>
                      {sidebarCollapsed && !isMobile && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            color: isSelected ? '#1d4ed8' : '#64748b'
                          }}
                        >
                          <History size={16} />
                        </div>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          )}

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
                localStorage.setItem('ward_round_sidebar_collapsed', String(next))
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
                <ChevronRight size={16} />
              ) : (
                <>
                  <ChevronLeft size={16} /> Свернуть
                </>
              )}
            </button>
          </div>
        </nav>

        {/* ===== MAIN CONTENT AREA ===== */}
        <div
          style={{
            flex: 1,
            overflowY: isMobile ? 'visible' : 'auto',
            padding: isMobile ? '16px' : '24px 32px',
            scrollBehavior: 'smooth'
          }}
        >
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
                onClick={handleGenerateAndSave}
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
          {selectedRecord && (
            <div
              style={{
                maxWidth: 900,
                width: '100%',
                margin: '0 auto 16px',
                padding: '12px 16px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ fontSize: 13, color: '#1e3a8a', fontFamily: FONT }}>
                <strong>Режим просмотра:</strong> Вы просматриваете запись от{' '}
                {formatLocalDate(selectedRecord.date)} {selectedRecord.time} (Врач:{' '}
                {selectedRecord.doctor})
              </div>
              <button
                onClick={() => setSelectedHistoryId(null)}
                style={{
                  padding: '6px 12px',
                  background: '#ffffff',
                  border: '1px solid #93c5fd',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#1d4ed8',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontWeight: 500
                }}
              >
                Вернуться к новому осмотру
              </button>
            </div>
          )}

          {/* ===== NEW INSPECTION FORM ===== */}
          <div
            style={{
              maxWidth: 900,
              width: '100%',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}
          >
            <div id="daily-info" style={block}>
              <div style={blockHeader}>
                <Clock size={15} /> Информация об осмотре
              </div>
              <div
                style={{
                  ...blockBody,
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                  gap: 12
                }}
              >
                <div>
                  <label style={label}>Дата</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={form.inspectionDate}
                    onChange={(e) => setField('inspectionDate', e.target.value)}
                  />
                </div>
                <div>
                  <label style={label}>Время</label>
                  <input
                    type="time"
                    style={inputStyle}
                    value={form.inspectionTime}
                    onChange={(e) => setField('inspectionTime', e.target.value)}
                  />
                </div>
                <div>
                  <label style={label}>Врач</label>
                  <input
                    style={inputStyle}
                    value={form.doctor}
                    onChange={(e) => setField('doctor', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div id="daily-vitals" style={block}>
              <div style={blockHeader}>
                <Activity size={15} /> Показатели
                {onNavigateToTemperatureSheet && (
                  <button
                    onClick={() => onNavigateToTemperatureSheet(patientId)}
                    style={{
                      marginLeft: 'auto',
                      fontSize: 11,
                      color: '#3b82f6',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontFamily: FONT
                    }}
                  >
                    Температурный лист →
                  </button>
                )}
              </div>
              <div style={blockBody}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
                    gap: 12,
                    marginBottom: 12
                  }}
                >
                  {(
                    [
                      {
                        key: 'temperature',
                        lbl: 'Температура',
                        unit: '°C',
                        icon: <Thermometer size={16} color="#3b82f6" />,
                        min: 35,
                        max: 43,
                        step: '0.1',
                        alert: (v: string) => parseFloat(v) >= 38
                      },
                      {
                        key: 'hr',
                        lbl: 'ЧСС',
                        unit: 'уд/мин',
                        icon: <Heart size={16} color="#ef4444" />,
                        min: 20,
                        max: 250,
                        step: '1',
                        alert: () => false
                      },
                      {
                        key: 'rr',
                        lbl: 'ЧДД',
                        unit: 'в мин',
                        icon: <Wind size={16} color="#06b6d4" />,
                        min: 6,
                        max: 60,
                        step: '1',
                        alert: () => false
                      },
                      {
                        key: 'spo2',
                        lbl: 'SpO₂',
                        unit: '%',
                        icon: <Droplets size={16} color="#22c55e" />,
                        min: 50,
                        max: 100,
                        step: '1',
                        alert: (v: string) => parseFloat(v) < 95
                      }
                    ] as const
                  ).map((v) => {
                    const val = (form as any)[v.key] as string
                    const isAlert = v.alert(val)
                    return (
                      <div
                        key={v.key}
                        style={{
                          background: '#f8fafc',
                          borderRadius: 10,
                          padding: '12px 12px 10px',
                          border: `1.5px solid ${isAlert ? '#fca5a5' : '#f1f5f9'}`
                        }}
                      >
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}
                        >
                          {v.icon}
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>
                            {v.lbl}
                          </span>
                        </div>
                        <input
                          type="number"
                          min={v.min}
                          max={v.max}
                          step={v.step}
                          style={{
                            width: '100%',
                            fontSize: 18,
                            fontWeight: 700,
                            border: 'none',
                            background: 'transparent',
                            color: isAlert ? '#dc2626' : '#0f172a',
                            outline: 'none',
                            fontFamily: FONT,
                            padding: '2px 0'
                          }}
                          value={val}
                          onChange={(e) => setField(v.key as any, e.target.value)}
                        />
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{v.unit}</div>
                      </div>
                    )
                  })}

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 10,
                      padding: '12px 12px 10px',
                      border: '1.5px solid #f1f5f9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Activity size={16} color="#8b5cf6" />
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>АД</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input
                        type="number"
                        min={60}
                        max={260}
                        style={{
                          width: '50%',
                          fontSize: 16,
                          fontWeight: 700,
                          border: '1px solid #e2e8f0',
                          borderRadius: 6,
                          background: 'white',
                          color: '#0f172a',
                          outline: 'none',
                          fontFamily: FONT,
                          padding: '4px 6px'
                        }}
                        placeholder="120"
                        value={form.bpSys}
                        onChange={(e) => setField('bpSys', e.target.value)}
                      />
                      <span style={{ color: '#94a3b8', fontWeight: 700 }}>/</span>
                      <input
                        type="number"
                        min={40}
                        max={160}
                        style={{
                          width: '50%',
                          fontSize: 16,
                          fontWeight: 700,
                          border: '1px solid #e2e8f0',
                          borderRadius: 6,
                          background: 'white',
                          color: '#0f172a',
                          outline: 'none',
                          fontFamily: FONT,
                          padding: '4px 6px'
                        }}
                        placeholder="80"
                        value={form.bpDia}
                        onChange={(e) => setField('bpDia', e.target.value)}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>мм рт.ст</div>
                  </div>
                </div>
              </div>
            </div>

            <div id="daily-complaints" style={block}>
              <div style={blockHeader}>
                <FileText size={15} /> Жалобы
              </div>
              <div style={blockBody}>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 12 }}
                >
                  {(Object.keys(COMPLAINT_LABELS) as ComplaintKey[]).map((k) => (
                    <button
                      key={k}
                      style={checkBtn(form.complaints.includes(k))}
                      onClick={() => toggleComplaint(k)}
                    >
                      <span
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: 3,
                          border: `1.5px solid ${form.complaints.includes(k) ? '#3b82f6' : '#cbd5e1'}`,
                          background: form.complaints.includes(k) ? '#3b82f6' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {form.complaints.includes(k) && <Check size={9} color="white" />}
                      </span>
                      {COMPLAINT_LABELS[k]}
                    </button>
                  ))}
                </div>
                {form.complaints.includes('fever') && (
                  <div
                    style={{
                      padding: '10px 12px',
                      background: '#fff7ed',
                      borderRadius: 8,
                      border: '1px solid #fed7aa',
                      marginBottom: 10
                    }}
                  >
                    <label style={{ ...label, color: '#9a3412' }}>
                      Максимальная температура (°C)
                    </label>
                    <input
                      type="number"
                      min={35}
                      max={43}
                      step={0.1}
                      style={inputStyle}
                      placeholder="38.5"
                      value={form.complaintParams.fever?.maxTemp ?? ''}
                      onChange={(e) =>
                        setField('complaintParams', {
                          ...form.complaintParams,
                          fever: { maxTemp: e.target.value }
                        })
                      }
                    />
                  </div>
                )}
                <div>
                  <label style={label}>Дополнение врача</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 60, resize: 'vertical' as const }}
                    placeholder="Уточнения..."
                    value={form.complaintsNote}
                    onChange={(e) => setField('complaintsNote', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div id="daily-objective" style={block}>
              <div style={blockHeader}>
                <Activity size={15} /> Объективно
              </div>
              <div style={blockBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Общее состояние
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 5 }}>
                      {(
                        [
                          ['satisfactory', 'Удовлетворительное', 'green'],
                          ['moderate', 'Средней тяжести', 'orange'],
                          ['severe', 'Тяжелое', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.generalCondition === val, c)}
                          onClick={() =>
                            setField('generalCondition', form.generalCondition === val ? null : val)
                          }
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Кожа
                    </div>
                    <div style={sub}>Цвет</div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['pale_pink', 'Бледно-розовая', 'green'],
                          ['pale', 'Бледная', 'blue'],
                          ['hyperemia', 'Гиперемия', 'orange'],
                          ['cyanosis', 'Цианоз', 'blue']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.skinColor === val, c)}
                          onClick={() => setField('skinColor', form.skinColor === val ? null : val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <div style={sub}>Температура</div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['warm', 'Теплая', 'green'],
                          ['cold', 'Холодная', 'blue'],
                          ['hot', 'Горячая', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.skinTemp === val, c)}
                          onClick={() => setField('skinTemp', form.skinTemp === val ? null : val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <div style={sub}>Влажность</div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['dry', 'Сухая', 'orange'],
                          ['moist', 'Влажная', 'green'],
                          ['excessive', 'Повышенная', 'blue']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.skinMoisture === val, c)}
                          onClick={() =>
                            setField('skinMoisture', form.skinMoisture === val ? null : val)
                          }
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Грудная клетка
                    </div>
                    <div style={sub}>Форма</div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['normosthenic', 'Нормостен.'],
                          ['hypersthenic', 'Гиперстен.'],
                          ['asthenic', 'Астен.'],
                          ['emphysematous', 'Эмфизем.']
                        ] as const
                      ).map(([val, lbl]) => (
                        <button
                          key={val}
                          style={pill(form.chestForm === val)}
                          onClick={() => setField('chestForm', form.chestForm === val ? null : val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <div style={sub}>Симметрия</div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['symmetric', 'Симметричная', 'green'],
                          ['asymmetric', 'Асимметричная', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.chestSymmetry === val, c)}
                          onClick={() =>
                            setField('chestSymmetry', form.chestSymmetry === val ? null : val)
                          }
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Дыхание
                    </div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['vesicular', 'Везикулярное', 'green'],
                          ['harsh', 'Жесткое', 'orange'],
                          ['weakened', 'Ослабленное', 'blue']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.breathingType === val, c)}
                          onClick={() =>
                            setField('breathingType', form.breathingType === val ? null : val)
                          }
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 6, ...sub }}>Хрипы</div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['none', 'Нет', 'green'],
                          ['dry', 'Сухие', 'orange'],
                          ['moist', 'Влажные', 'blue']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.ralesType === val, c)}
                          onClick={() => setField('ralesType', form.ralesType === val ? null : val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <input
                      style={{ ...inputStyle, marginTop: 6, fontSize: 12 }}
                      placeholder="Доп. данные..."
                      value={form.respiratoryNote}
                      onChange={(e) => setField('respiratoryNote', e.target.value)}
                    />
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Сердце
                    </div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['regular', 'Ритмичное', 'green'],
                          ['irregular', 'Аритмия', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.heartRhythm === val, c)}
                          onClick={() =>
                            setField('heartRhythm', form.heartRhythm === val ? null : val)
                          }
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 6, ...pillGroup }}>
                      {(
                        [
                          ['clear', 'Тоны ясные', 'green'],
                          ['muffled', 'Приглушены', 'orange'],
                          ['deaf', 'Глухие', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.heartTones === val, c)}
                          onClick={() =>
                            setField('heartTones', form.heartTones === val ? null : val)
                          }
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <input
                      style={{ ...inputStyle, marginTop: 6, fontSize: 12 }}
                      placeholder="Комментарий..."
                      value={form.heartNote}
                      onChange={(e) => setField('heartNote', e.target.value)}
                    />
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Язык
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                      {(
                        [
                          ['moist_clean', 'Влажный, чистый', 'green'],
                          ['moist_coated', 'Влажный, обложен', 'orange'],
                          ['dry_clean', 'Сухой, чистый', 'orange'],
                          ['dry_coated', 'Сухой, обложен', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.tongueState === val, c)}
                          onClick={() =>
                            setField('tongueState', form.tongueState === val ? null : val)
                          }
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Живот
                    </div>
                    <div style={pillGroup}>
                      {(
                        [
                          ['soft', 'Мягкий, б/б', 'green'],
                          ['tense', 'Напряжен', 'red'],
                          ['bloated', 'Вздут', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.abdomenState === val, c)}
                          onClick={() =>
                            setField('abdomenState', form.abdomenState === val ? null : val)
                          }
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <input
                      style={{ ...inputStyle, marginTop: 6, fontSize: 12 }}
                      placeholder="Комментарий..."
                      value={form.abdomenNote}
                      onChange={(e) => setField('abdomenNote', e.target.value)}
                    />
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Стул
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                      {(
                        [
                          ['normal', 'Норм., регулярный', 'green'],
                          ['constipation', 'Задержка', 'orange'],
                          ['diarrhea', 'Жидкий', 'red'],
                          ['absent', 'Нет', 'red']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.stool === val, c)}
                          onClick={() => setField('stool', form.stool === val ? null : val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase' as const,
                        marginBottom: 8
                      }}
                    >
                      Мочеиспускание
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                      {(
                        [
                          ['free_painless', 'Свободное, б/б', 'green'],
                          ['difficult', 'Затруднено', 'orange'],
                          ['painful', 'Болезненное', 'red'],
                          ['frequent', 'Учащенное', 'orange']
                        ] as const
                      ).map(([val, lbl, c]) => (
                        <button
                          key={val}
                          style={pill(form.urination === val, c)}
                          onClick={() => setField('urination', form.urination === val ? null : val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="daily-diagnosis" style={block}>
              <div style={blockHeader}>
                <TrendingUp size={15} /> Динамика
              </div>
              <div style={blockBody}>
                <div style={pillGroup}>
                  {(
                    [
                      ['improvement', 'Улучшение', 'green', TrendingUp],
                      ['no_change', 'Стабильно', 'blue', Minus],
                      ['deterioration', 'Ухудшение', 'red', TrendingDown]
                    ] as const
                  ).map(([val, lbl, c, Icon]) => (
                    <button
                      key={val}
                      style={{
                        ...pill(form.dynamics === val, c),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      onClick={() => setField('dynamics', form.dynamics === val ? null : val)}
                    >
                      <Icon size={13} /> {lbl}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 10 }}>
                  <label style={label}>Комментарий к динамике</label>
                  <input
                    style={inputStyle}
                    placeholder="Состояние улучшается на фоне проводимой терапии..."
                    value={form.dynamicsComment}
                    onChange={(e) => setField('dynamicsComment', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div id="daily-prescriptions" style={block}>
              <div style={blockHeader}>
                Лечение
                {form.treatmentDecision === 'modify' && (
                  <button
                    onClick={() => setShowPrescModal(true)}
                    style={{
                      marginLeft: 'auto',
                      fontSize: 12,
                      color: '#1d4ed8',
                      background: '#eff6ff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '4px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontFamily: FONT,
                      fontWeight: 600
                    }}
                  >
                    <Plus size={13} /> Добавить назначение
                  </button>
                )}
              </div>
              <div style={blockBody}>
                <div style={pillGroup}>
                  {(
                    [
                      ['keep', 'Оставить по листу назначений'],
                      ['modify', 'Изменить']
                    ] as const
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      style={checkBtn(form.treatmentDecision === val)}
                      onClick={() => setField('treatmentDecision', val)}
                    >
                      <span
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: '50%',
                          border: `2px solid ${form.treatmentDecision === val ? '#3b82f6' : '#cbd5e1'}`,
                          background: form.treatmentDecision === val ? '#3b82f6' : 'white',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {form.treatmentDecision === val && (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: 'white',
                              display: 'block'
                            }}
                          />
                        )}
                      </span>
                      {lbl}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 14 }}>
                  {form.prescriptions.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontSize: 13, padding: '12px 0' }}>
                      Назначений нет. Нажмите «Добавить назначение».
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr>
                            {[
                              'Препарат',
                              'Доза',
                              'Ед.',
                              'Путь',
                              'Кратность',
                              'Комментарий',
                              ''
                            ].map((h) => (
                              <th
                                key={h}
                                style={{
                                  textAlign: 'left',
                                  padding: '6px 8px',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: '#94a3b8',
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
                          {form.prescriptions.map((p) => (
                            <tr
                              key={p.id}
                              style={{
                                borderBottom: '1px solid #f8fafc',
                                opacity: p.action === 'cancel' ? 0.4 : 1
                              }}
                            >
                              <td style={{ padding: '8px' }}>
                                <input
                                  style={{
                                    ...inputStyle,
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
                              <td style={{ padding: '8px' }}>
                                <input
                                  style={{
                                    ...inputStyle,
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
                              <td style={{ padding: '8px' }}>
                                <input
                                  style={{
                                    ...inputStyle,
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
                              <td style={{ padding: '8px' }}>
                                <input
                                  style={{
                                    ...inputStyle,
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
                              <td style={{ padding: '8px' }}>
                                <input
                                  style={{
                                    ...inputStyle,
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
                              <td style={{ padding: '8px' }}>
                                <input
                                  style={{
                                    ...inputStyle,
                                    border: 'none',
                                    background: 'transparent',
                                    padding: 0
                                  }}
                                  value={p.comment ?? ''}
                                  placeholder="-"
                                  onChange={(e) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      prescriptions: prev.prescriptions.map((x) =>
                                        x.id === p.id ? { ...x, comment: e.target.value } : x
                                      )
                                    }))
                                  }
                                />
                              </td>
                              <td style={{ padding: '8px' }}>
                                <button
                                  onClick={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      prescriptions: prev.prescriptions.filter((x) => x.id !== p.id)
                                    }))
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
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical history info sections */}
            {form.allergies.length > 0 && (
              <div style={block}>
                <div style={blockHeader}>Аллергический анамнез</div>
                <div style={blockBody}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {['Аллерген', 'Реакция', 'Дата выявления', 'Комментарий'].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: 'left',
                              padding: '6px 8px',
                              fontSize: 11,
                              color: '#94a3b8',
                              fontWeight: 600,
                              background: '#fef9f0',
                              borderBottom: '1px solid #fed7aa'
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.allergies.map((a) => (
                        <tr key={a.id} style={{ borderBottom: '1px solid #fff7ed' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 600 }}>{a.name}</td>
                          <td style={{ padding: '6px 8px', color: '#dc2626' }}>{a.reaction}</td>
                          <td style={{ padding: '6px 8px', color: '#64748b' }}>
                            {a.date ? formatLocalDate(a.date) : '—'}
                          </td>
                          <td style={{ padding: '6px 8px', color: '#64748b' }}>
                            {a.comment || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {form.operations.length > 0 && (
              <div style={block}>
                <div style={blockHeader}>Операции в анамнезе</div>
                <div style={blockBody}>
                  {form.operations.map((op) => (
                    <div
                      key={op.id}
                      style={{
                        background: '#f8fafc',
                        borderRadius: 8,
                        padding: '10px 12px',
                        marginBottom: 8
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                        {op.name}
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: 8,
                          fontSize: 12,
                          color: '#64748b'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 600 }}>Дата:</span>{' '}
                          {op.date ? formatLocalDate(op.date) : '—'}
                        </div>
                        {op.diagnosis && (
                          <div>
                            <span style={{ fontWeight: 600 }}>Диагноз:</span> {op.diagnosis}
                          </div>
                        )}
                        {op.result && (
                          <div>
                            <span style={{ fontWeight: 600 }}>Результат:</span> {op.result}
                          </div>
                        )}
                        {op.complications && (
                          <div>
                            <span style={{ fontWeight: 600 }}>Осложнения:</span> {op.complications}
                          </div>
                        )}
                        {op.comment && (
                          <div>
                            <span style={{ fontWeight: 600 }}>Комментарий:</span> {op.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {form.comorbidities.length > 0 && (
              <div style={block}>
                <div style={blockHeader}>Сопутствующие заболевания</div>
                <div style={blockBody}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {['Диагноз', 'Активность', 'Степень тяжести', 'Осложнения'].map((h) => (
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
                      {form.comorbidities.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 500 }}>{c.diagnosis}</td>
                          <td
                            style={{
                              padding: '6px 8px',
                              color: c.activity === 'Активное' ? '#059669' : '#64748b'
                            }}
                          >
                            {c.activity}
                          </td>
                          <td style={{ padding: '6px 8px', color: '#64748b' }}>
                            {c.severity || '—'}
                          </td>
                          <td style={{ padding: '6px 8px', color: '#64748b' }}>
                            {c.complications || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div id="daily-recommendations" style={block}>
              <div style={blockHeader}>План</div>
              <div
                style={{ ...blockBody, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
              >
                <div>
                  <label style={label}>Контроль исследований</label>
                  <input
                    style={inputStyle}
                    placeholder="ФГ ОГК контроль..."
                    value={form.controlStudies}
                    onChange={(e) => setField('controlStudies', e.target.value)}
                  />
                </div>
                <div>
                  <label style={label}>Повторный осмотр</label>
                  <input
                    style={inputStyle}
                    placeholder="Завтра в 10:00..."
                    value={form.nextInspection}
                    onChange={(e) => setField('nextInspection', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {showResult && form.generatedText ? (
              <div style={{ ...block, border: '2px solid #22c55e', marginTop: 15, marginBottom: 20 }}>
                <div style={{ ...blockHeader, background: '#f0fdf4', color: '#059669' }}>
                  <FileText size={15} color="#059669" /> Запись осмотра сформирована и сохранена
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(form.generatedText)
                      showToast('Текст скопирован', 'success')
                    }}
                    style={{
                      marginLeft: 'auto',
                      padding: '4px 10px',
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
                <div style={{ ...blockBody, background: '#fafffe' }}>
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap' as const,
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
            ) : null}

            {!showResult && selectedHistoryId === null && (
              <>
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 12,
                    padding: '16px 20px',
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Info size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e3a8a', marginBottom: 2 }}>
                      Новый осмотр
                    </div>
                    <div style={{ fontSize: 13, color: '#1e40af' }}>
                      Заполните данные выше, чтобы сформировать медицинскую запись в истории болезни.
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <button
                    onClick={handleGenerateAndSave}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '14px 32px',
                      borderRadius: 12,
                      border: 'none',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: FONT,
                      boxShadow: '0 4px 18px rgba(5,150,105,0.35)'
                    }}
                  >
                    Сформировать запись осмотра
                  </button>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                    Текст будет сохранен в истории пациента
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showPrescModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            background: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setShowPrescModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 28,
              maxWidth: 540,
              width: '100%',
              boxShadow: '0 24px 80px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>
              Добавить назначение
            </h3>

            <div style={{ marginBottom: 12 }}>
              <label style={label}>Препарат *</label>
              <Select
                options={medicines.map((m) => ({ value: m.id, label: m.name, unit: m.unit }))}
                styles={selectStyles}
                placeholder="Выберите препарат..."
                value={newPresc.drug ? { value: newPresc.medicineId, label: newPresc.drug } : null}
                onChange={(opt: any) => {
                  setNewPresc((p) => ({
                    ...p,
                    drug: opt ? opt.label : '',
                    medicineId: opt ? opt.value : '',
                    form: opt ? opt.unit : '',
                    unit: opt ? opt.unit : ''
                  }))
                }}
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
                <label style={label}>Форма</label>
                <input
                  style={inputStyle}
                  disabled
                  placeholder="Авто..."
                  value={newPresc.form ?? ''}
                />
              </div>
              <div>
                <label style={label}>Доза</label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  style={inputStyle}
                  placeholder="1.0"
                  value={newPresc.dose ?? ''}
                  onChange={(e) => setNewPresc((p) => ({ ...p, dose: e.target.value }))}
                />
              </div>
              <div>
                <label style={label}>Единицы</label>
                <input
                  style={inputStyle}
                  disabled
                  placeholder="Авто..."
                  value={newPresc.unit ?? ''}
                />
              </div>
            </div>

            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}
            >
              <div>
                <label style={label}>Путь введения</label>
                <select
                  style={{ ...inputStyle, appearance: 'auto' as any }}
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
                </select>
              </div>
              <div>
                <label style={label}>Кратность</label>
                <select
                  style={{ ...inputStyle, appearance: 'auto' as any }}
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
                  <option>по требованию</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={() => setShowPrescModal(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: 'pointer',
                  fontFamily: FONT
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
                  background: '#059669',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontWeight: 600
                }}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: 10,
            background:
              toastMsg.type === 'success'
                ? '#059669'
                : toastMsg.type === 'error'
                  ? '#dc2626'
                  : '#1d4ed8',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: FONT
          }}
        >
          {toastMsg.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          {toastMsg.text}
        </div>
      )}
    </div>
  )
}

export default DailyRoundPage
