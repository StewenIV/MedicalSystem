import React, { useState, useEffect, useMemo, useRef } from 'react'
import Select, { StylesConfig } from 'react-select'
import { toast } from 'react-toastify'
import { Save, ClipboardList } from 'lucide-react'

import { usePatientData } from 'context/PatientDataContext'
import { fetchBeds, dischargePatient } from 'api/bedsApi'
import { formatLocalDate, toBackendDateTimeString, toBackendDateString } from 'utils/dateUtils'
import { uploadFile } from 'api/filesApi'
import { SavedInspection } from 'pages/WardRound/types'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import {
  DischargeContainer,
  DischargeHeader,
  DischargeTitle,
  DischargeSubtitle,
  FormCard,
  FormGrid,
  FormGroup,
  Label,
  Input,
  TextArea,
  PatientSummaryPanel,
  SummaryItem,
  GeneratedCard,
  GeneratedCardHeader,
  GeneratedCardTitle,
  GenerateTextButton,
  GeneratedPreview,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  AutoGenerateBtn,
  PrintWrapper,
  PrintContainer,
  PrintHeaderFlex,
  PrintHospitalName,
  PrintDepartmentName,
  PrintAddress,
  PrintDateInfo,
  PrintTitleContainer,
  PrintTitle,
  PrintSubtitle,
  PrintPatientCard,
  PrintSection,
  PrintSectionTitle,
  PrintSectionContent,
  PrintSignaturesFlex,
  PrintSignatureLine
} from './styled'

const html2pdf = require('html2pdf.js')

interface DischargePageProps {
  patientId?: string
  onClose: () => void
}

interface SelectOption {
  value: string
  label: string
}

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '40px',
    borderRadius: '10px',
    borderColor: state.isFocused ? '#2563eb' : 'rgba(191,219,254,0.8)',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : 'none',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': { borderColor: state.isFocused ? '#2563eb' : '#93c5fd' }
  }),
  valueContainer: (base) => ({ ...base, padding: '0 12px' }),
  placeholder: (base) => ({ ...base, color: '#94a3b8', fontSize: '14px' }),
  input: (base) => ({ ...base, color: '#111827', fontSize: '14px' }),
  singleValue: (base) => ({ ...base, color: '#111827', fontSize: '14px' }),
  menu: (base) => ({
    ...base,
    marginTop: '6px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 24px rgba(15,23,42,0.12)',
    overflow: 'hidden',
    zIndex: 20
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#1f2937',
    transition: 'all 0.15s ease',
    ':active': { backgroundColor: state.isSelected ? '#2563eb' : '#dbeafe' }
  })
}

const DISCHARGE_VARIANTS = [
  { value: 'Recovery', label: 'Выписан с выздоровлением' },
  { value: 'Improvement', label: 'Выписан с улучшением' },
  { value: 'NoChange', label: 'Выписан без изменений' },
  { value: 'Transfer', label: 'Перевод в другое ЛПУ/отделение' },
  { value: 'AgainstMedicalAdvice', label: 'Самовольный уход / Отказ от лечения' },
  { value: 'Lethal', label: 'Смерть пациента' }
]

export default function DischargePage({ patientId, onClose }: DischargePageProps) {
  const { patients, updatePatient, refreshPatients, loadPatientEncounters, getInspections } =
    usePatientData()

  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [dischargeVariant, setDischargeVariant] = useState<SelectOption | null>(
    DISCHARGE_VARIANTS[1]
  ) // Improvement by default
  const [dischargeDateTime, setDischargeDateTime] = useState<string>(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [finalDiagnosis, setFinalDiagnosis] = useState<string>('')
  const [epicrisis, setEpicrisis] = useState<string>('')
  const [recommendations, setRecommendations] = useState<string>('')
  const [generatedDischargeText, setGeneratedDischargeText] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [beds, setBeds] = useState<any[]>([])

  const printContainerRef = useRef<HTMLDivElement>(null)

  const [dischargeState, setDischargeState] = useState('')
  // Load hospitalized and outpatient patients for selection list
  const hospitalizedPatients = useMemo(() => {
    return patients.filter((p) => {
      const s = p.status?.toLowerCase() || ''
      const st = p.statusText?.toLowerCase() || ''
      return (
        s === 'hospitalized' || 
        s === 'outpatient' || 
        st.includes('госпитал') || 
        st.includes('стационар') || 
        st.includes('амбулатор')
      )
    })
  }, [patients])

  const patientOptions = useMemo(() => {
    return hospitalizedPatients.map((p) => ({
      value: p.id,
      label: `${p.lastName} ${p.firstName} ${p.middleName || ''} (Карта: ${p.medcardNum || '—'})`
    }))
  }, [hospitalizedPatients])

  const selectedPatient = useMemo(() => {
    const patient = patients.find((p) => p.id === selectedPatientId);
    if (patient) {
      const s = patient.status?.toLowerCase() || ''
      const st = patient.statusText?.toLowerCase() || ''
      if (
        s === 'hospitalized' || 
        s === 'outpatient' || 
        st.includes('госпитал') || 
        st.includes('стационар') || 
        st.includes('амбулатор')
      ) {
        return patient;
      }
    }
    return null;
  }, [patients, selectedPatientId])

  const assignedBed = useMemo(() => {
    return beds.find((b) => b.patientId === selectedPatientId) || null
  }, [beds, selectedPatientId])

  // Use proper SavedInspection[] from context (contains formData, correct type='primary'/'daily' mapping)
  const patientInspections = useMemo((): SavedInspection[] => {
    if (!selectedPatientId) return []
    return getInspections(selectedPatientId)
  }, [getInspections, selectedPatientId])

  useEffect(() => {
    if (!selectedPatientId) return
    loadPatientEncounters(selectedPatientId).catch(console.error)
  }, [loadPatientEncounters, selectedPatientId])

  // Fetch beds on mount to search for patient bed assignment later
  useEffect(() => {
    fetchBeds()
      .then((resp) => {
        if (resp && resp.beds) {
          setBeds(resp.beds)
        }
      })
      .catch(console.error)
  }, [])

  const [initializedPatientId, setInitializedPatientId] = useState<string | null>(null)
  const [loadedForPatientId, setLoadedForPatientId] = useState<string | null>(null)

  // Hook when patientId is passed from patient card or when selectedPatient changes
  useEffect(() => {
    if (patientId) {
      setSelectedPatientId(patientId)
    }
  }, [patientId])

  useEffect(() => {
    if (selectedPatient) {
      // Prefill diagnosis
      const primaryProblem = selectedPatient.medicalProblems?.find((p: any) => p.isActive)
      setFinalDiagnosis(primaryProblem?.name || selectedPatient.activeProblems?.[0] || '')
    } else {
      setFinalDiagnosis('')
      setEpicrisis('')
      setRecommendations('')
      setDischargeState('')
    }
  }, [selectedPatient])

  useEffect(() => {
    if (!selectedPatient) {
      setEpicrisis('')
      setRecommendations('')
      setDischargeState('')
      setFinalDiagnosis('')
      setDestination('')
      setInitializedPatientId(null)
      setLoadedForPatientId(null)
      return
    }

    if (initializedPatientId !== selectedPatient.id) {
      setEpicrisis(buildAdmissionComplaintText())
      setRecommendations(buildRecommendationsLines())
      setDischargeState(buildDischargeStateLines())

      const selectedProblems = selectedPatient.medicalProblems ?? []
      const autoDiagnosis =
        selectedProblems.find((problem: any) => problem.isActive)?.name ||
        selectedPatient.activeProblems?.[0] ||
        (selectedPatient as any).diagnosis ||
        ''
      setFinalDiagnosis(autoDiagnosis)
      setInitializedPatientId(selectedPatient.id)
    }

    if (patientInspections.length > 0 && loadedForPatientId !== selectedPatient.id) {
      setEpicrisis(buildAdmissionComplaintText())
      setDischargeState(buildDischargeStateLines())
      setLoadedForPatientId(selectedPatient.id)
    }
  }, [selectedPatient, initializedPatientId, patientInspections, loadedForPatientId])

  function pluralize(count: number, forms: [string, string, string]) {
    const rule = new Intl.PluralRules('ru-RU').select(count)
    switch (rule) {
      case 'one':
        return forms[0]
      case 'few':
        return forms[1]
      default:
        return forms[2]
    }
  }

  const normalizeText = (value?: string | null): string => {
    const text = value?.trim()
    return text ? text : 'Не указано'
  }

  const renderLines = (text: string) => {
    if (!text) return 'Не указано'
    return text.split('\n').map((line, idx) => (
      <div key={idx} style={{ minHeight: '1em', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        {line}
      </div>
    ))
  }

  const sortInspByDateAsc = (left: SavedInspection, right: SavedInspection) => {
    const leftTime = left.date ? new Date(`${left.date}T${left.time || '00:00'}`).getTime() : 0
    const rightTime = right.date ? new Date(`${right.date}T${right.time || '00:00'}`).getTime() : 0
    return leftTime - rightTime
  }

  const sortInspByDateDesc = (left: SavedInspection, right: SavedInspection) => {
    const leftTime = left.date ? new Date(`${left.date}T${left.time || '00:00'}`).getTime() : 0
    const rightTime = right.date ? new Date(`${right.date}T${right.time || '00:00'}`).getTime() : 0
    return rightTime - leftTime
  }

  const parseFormData = (inspection?: SavedInspection | null): any | null => {
    if (!inspection?.formData) return null
    try {
      return JSON.parse(inspection.formData)
    } catch {
      return null
    }
  }

  const latestEncounter = useMemo(() => {
    return [...patientInspections].sort(sortInspByDateDesc)[0] ?? null
  }, [patientInspections])

  // Primary encounter: type='primary' (mapped in encountersApi from 'Primary Inspection'/'Первичный осмотр')
  const primaryEncounter = useMemo(() => {
    const sorted = [...patientInspections].sort(sortInspByDateAsc)
    return sorted.find((enc) => enc.type === 'primary') ?? sorted[0] ?? null
  }, [patientInspections])

  const firstInspectionWithData = useMemo(() => {
    return [...patientInspections].sort(sortInspByDateAsc)[0] ?? null
  }, [patientInspections])

  const buildComorbidityLines = () => {
    const items = (selectedPatient?.medicalProblems ?? [])
      .filter((problem: any) => !problem.isActive && normalizeText(problem.name) !== 'Не указано')
      .map((problem: any) => normalizeText(problem.name))

    return items.length > 0 ? items.join('\n') : 'Не указано'
  }

  const buildInvestigationLines = () => {
    const labs = [...(selectedPatient?.labs ?? [])].sort((a: any, b: any) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0
      const bTime = b.date ? new Date(b.date).getTime() : 0
      return aTime - bTime
    })

    const items = labs
      .map((lab: any) => {
        const title = normalizeText(lab.type)
        if (title === 'Не указано') return ''

        const parts: string[] = [`- ${title}`]
        if (lab.date) {
          parts.push(`(${formatLocalDate(lab.date)})`)
        }
        const lines: string[] = [parts.join(' ')]

        if (lab.reason) {
          lines.push(`  Цель: ${lab.reason.trim()}`)
        }
        const result = lab.resultData?.trim()
        if (result) {
          lines.push(`  Результат: ${result}`)
        } else if (lab.statusText && lab.statusText.trim()) {
          lines.push(`  Статус: ${lab.statusText.trim()}`)
        }
        if (lab.comments?.trim()) {
          lines.push(`  Комментарий: ${lab.comments.trim()}`)
        }

        return lines.join('\n')
      })
      .filter(Boolean)

    return items.length > 0 ? items.join('\n') : 'Не указано'
  }

  const buildTreatmentLines = () => {
    const patientRecord = selectedPatient as unknown as {
      prescriptions?: any[]
      currentMeds?: any[]
    } | null
    const source =
      patientRecord?.prescriptions && patientRecord.prescriptions.length > 0
        ? patientRecord.prescriptions
        : (selectedPatient?.currentMeds ?? [])

    const items = [...source]
      .sort((left: any, right: any) => {
        const leftTime = left.dateStart ? new Date(left.dateStart).getTime() : 0
        const rightTime = right.dateStart ? new Date(right.dateStart).getTime() : 0
        return leftTime - rightTime
      })
      .map((item: any) => {
        const name = normalizeText(item.drug || item.name)
        if (name === 'Не указано') return ''

        const details: string[] = []
        if (item.dose) details.push(`дозировка: ${item.dose}`)
        if (item.form) details.push(`форма: ${item.form}`)
        if (item.route) details.push(`путь введения: ${item.route}`)
        if (item.regimen) details.push(`кратность: ${item.regimen}`)

        const durationStart = item.dateStart ? formatLocalDate(item.dateStart) : ''
        const durationEnd = item.dateEnd ? formatLocalDate(item.dateEnd) : ''
        if (durationStart || durationEnd) {
          details.push(
            `продолжительность: ${[durationStart, durationEnd].filter(Boolean).join(' - ')}`
          )
        }

        return details.length > 0 ? `- ${name} (${details.join(', ')})` : `- ${name}`
      })
      .filter(Boolean)

    return items.length > 0 ? items.join('\n') : 'Не указано'
  }

  const buildAdmissionComplaintText = () => {
    // Primary encounter from SavedInspection context: has complaints field and formData with complaintsNote
    const enc = primaryEncounter ?? firstInspectionWithData
    const data = parseFormData(enc)

    // First try the free-text complaints field from the encounter
    const directComplaints = enc?.complaints?.trim()
    if (directComplaints) return directComplaints

    // Then try complaintsNote from formData (PrimaryFormState.complaintsNote)
    const fromNote = data?.complaintsNote?.trim()
    if (fromNote) return fromNote

    // Then build from selected complaint keys + params stored in formData
    if (data?.complaints && Array.isArray(data.complaints) && data.complaints.length > 0) {
      const labels: Record<string, string> = {
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
        other: 'Другое'
      }
      const parts = (data.complaints as string[]).map((k) => labels[k] || k).filter(Boolean)
      if (parts.length > 0) return parts.join(', ')
    }

    return 'Не указано'
  }

  const buildDischargeStateLines = () => {
    const dailyRounds = [...patientInspections].filter(i => i.type === 'daily').sort(sortInspByDateDesc)
    const enc = dailyRounds[0] || latestEncounter
    const data = parseFormData(enc) ?? {}

    const generalConditionMap: Record<string, string> = {
      satisfactory: 'Удовлетворительное',
      moderate: 'Средней степени тяжести',
      severe: 'Тяжелое',
      critical: 'Крайне тяжелое'
    }

    const dynamicsMap: Record<string, string> = {
      improvement: 'Положительная динамика',
      no_change: 'Без динамики',
      deterioration: 'Отрицательная динамика'
    }

    // For DailyRoundFormState: temperature is a top-level field
    // For PrimaryFormState: generalCondition, breathingType, etc.
    const tempValue = data.temperature || data.temp

    const btMap: Record<string, string> = {
      vesicular: 'Везикулярное',
      harsh: 'Жесткое',
      weakened: 'Ослабленное',
      bronchial: 'Бронхиальное'
    }
    const rtMap: Record<string, string> = {
      dry: 'Сухие хрипы',
      moist_fine: 'Влажные мелкопузырчатые хрипы',
      moist_medium: 'Влажные среднепузырчатые хрипы',
      moist_large: 'Влажные крупнопузырчатые хрипы',
      crepitus: 'Крепитация',
      none: 'Хрипов нет'
    }
    const hrMap: Record<string, string> = {
      regular: 'Ритмичный',
      irregular: 'Аритмичный',
      atrial_fibrillation: 'Фибрилляция предсердий'
    }
    const htMap: Record<string, string> = {
      clear: 'Ясные',
      muffled: 'Приглушены',
      deaf: 'Глухие'
    }

    const respiratoryParts = [
      data.breathingType ? btMap[data.breathingType] || data.breathingType : undefined,
      data.respiratoryNote,
      data.ralesType ? rtMap[data.ralesType] || data.ralesType : undefined
    ]
      .map((item) => normalizeText(item))
      .filter((item) => item !== 'Не указано')

    const cardiovascularParts = [
      data.heartRhythm ? hrMap[data.heartRhythm] || data.heartRhythm : undefined,
      data.heartTones ? htMap[data.heartTones] || data.heartTones : undefined,
      data.heartNote,
      data.cardiovascularComment
    ]
      .map((item) => normalizeText(item))
      .filter((item) => item !== 'Не указано')

    const lines = [
      data.generalCondition
        ? `Общее состояние: ${generalConditionMap[data.generalCondition] ?? data.generalCondition}`
        : null,
      tempValue ? `Температура: ${tempValue}` : null,
      respiratoryParts.length > 0
        ? `Состояние дыхательной системы: ${respiratoryParts.join(', ')}`
        : null,
      cardiovascularParts.length > 0
        ? `Состояние сердечно-сосудистой системы: ${cardiovascularParts.join(', ')}`
        : null,
      data.dynamics ? `Динамика заболевания: ${dynamicsMap[data.dynamics] ?? data.dynamics}` : null,
      data.dynamicsComment?.trim() ? `Комментарий: ${data.dynamicsComment.trim()}` : null
    ].filter((item): item is string => Boolean(item))

    return lines.length > 0 ? lines.join('\n') : 'Не указано'
  }

  const buildRecommendationsLines = () => {
    if (!selectedPatient) return 'Не указано'
    
    const patientRecord = selectedPatient as unknown as {
      prescriptions?: any[]
      currentMeds?: any[]
    }
    const source =
      patientRecord?.prescriptions && patientRecord.prescriptions.length > 0
        ? patientRecord.prescriptions
        : (selectedPatient?.currentMeds ?? [])

    if (source.length === 0) return 'Наблюдение у профильного специалиста по месту жительства.'

    const meds = source.map((item: any, idx: number) => {
      const name = normalizeText(item.drug || item.name)
      const details: string[] = []
      if (item.dose) details.push(`дозировка: ${item.dose}`)
      if (item.form) details.push(`форма: ${item.form}`)
      if (item.route) details.push(`путь введения: ${item.route}`)
      if (item.regimen || item.frequency) details.push(`кратность: ${item.regimen || item.frequency}`)

      return `${idx + 1}. ${name}${details.length > 0 ? ` (${details.join(', ')})` : ''}`
    })

    return 'Продолжить прием препаратов амбулаторно:\n' + meds.join('\n')
  }

  const buildDischargeText = () => {
    if (!selectedPatient) return ''

    const fio = [selectedPatient.lastName, selectedPatient.firstName, selectedPatient.middleName]
      .filter((part) => part && part.trim())
      .join(' ')

    // Build address: city + address
    const addressParts = [selectedPatient.contacts?.city, selectedPatient.contacts?.address].filter(
      (part) => part && part.trim()
    )
    const address = addressParts.length > 0 ? addressParts.join(', ') : 'Не указано'

    const work = [
      selectedPatient.work?.profession,
      selectedPatient.work?.organization,
      selectedPatient.work?.address
    ]
      .filter((part) => part && part.trim())
      .join(', ')

    const selectedProblems = selectedPatient.medicalProblems ?? []
    const mainDiagnosis = finalDiagnosis || normalizeText(
      selectedProblems.find((problem: any) => problem.isActive)?.name ||
        selectedPatient.activeProblems?.[0]
    )

    const admissionDate = assignedBed?.admissionDate
      ? formatLocalDate(assignedBed.admissionDate)
      : 'Не указано'
    const dischargeDate = formatLocalDate(dischargeDateTime)
    const comorbidities = buildComorbidityLines()
    const complaints = epicrisis || buildAdmissionComplaintText()
    const investigations = buildInvestigationLines()
    const treatment = buildTreatmentLines()
    const state = dischargeState || buildDischargeStateLines()
    const recommendationsText = recommendations || buildRecommendationsLines()
    const doctor = normalizeText(selectedPatient.doctor || (selectedPatient as any).doctorName)

    return [
      `ФИО: ${fio || 'Не указано'}`,
      '',
      `Дата рождения: ${selectedPatient.dateOfBirth ? formatLocalDate(selectedPatient.dateOfBirth) : 'Не указано'}`,
      '',
      `Адрес: ${address}`,
      '',
      `Место работы: ${work || 'Не указано'}`,
      '',
      `Дата поступления: ${admissionDate}`,
      '',
      `Дата выписки: ${dischargeDate}`,
      '',
      `Основной диагноз: ${mainDiagnosis}`,
      '',
      'Сопутствующие заболевания:',
      comorbidities,
      '',
      'Жалобы при поступлении:',
      complaints,
      '',
      'Проведённые исследования:',
      investigations,
      '',
      'Проведённое лечение:',
      treatment,
      '',
      'Состояние при выписке:',
      state,
      '',
      'Рекомендации:',
      recommendationsText,
      '',
      `Лечащий врач: ${doctor}`,
      `Дата: ${dischargeDate}`
    ].join('\n')
  }

  const handleGenerateDischargeText = async () => {
    if (!selectedPatient) {
      setGeneratedDischargeText('')
      return
    }

    setGeneratedDischargeText(buildDischargeText())
  }

  const handleAutoGenerateEpicrisis = () => {
    setEpicrisis(buildAdmissionComplaintText())
  }

  const handleAutoGenerateRecommendations = () => {
    setRecommendations(buildRecommendationsLines())
  }

  const handleDischargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatientId || !selectedPatient) {
      toast.error('Выберите пациента для выписки')
      return
    }

    const s = selectedPatient.status?.toLowerCase() || ''
    const st = selectedPatient.statusText?.toLowerCase() || ''
    const isValid = s === 'hospitalized' || s === 'outpatient' || st.includes('госпитал') || st.includes('стационар') || st.includes('амбулатор')
    if (!isValid) {
      toast.error('Выписывать можно только пациентов со статусом "Госпитализирован" или "Амбулаторно"')
      return
    }

    if (!generatedDischargeText) {
      await handleGenerateDischargeText()
    }

    const dischargeText = buildDischargeText()
    setGeneratedDischargeText(dischargeText)

    setLoading(true)
    try {
      // 1. Generate PDF and Upload to MinIO
      if (!printContainerRef.current) {
        toast.error('Ошибка при генерации документа')
        setLoading(false)
        return
      }

      const fileName = `Выписка_${selectedPatient.lastName || 'Пациент'}_${formatLocalDate(dischargeDateTime).replace(/[:.]/g, '-')}.pdf`

      const opt = {
        margin:       10,
        filename:     fileName,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      }

      const fileBlob = await html2pdf().set(opt).from(printContainerRef.current).output('blob')

      const file = new File([fileBlob], fileName, { type: 'application/pdf' })
      const uploadResult = await uploadFile(file)

      const newDocument = {
        name: 'Выписной эпикриз',
        date: toBackendDateString(new Date()),
        filePath: uploadResult.objectName,
        url: `${process.env.REACT_APP_API_URL ?? ''}${uploadResult.url}`
      }

      // 3. Update the patient record with new status and document
      const updatedDto = {
        ...selectedPatient,
        status: 'Discharged',
        statusText: 'Выписан',
        documents: [...(selectedPatient.documents || []), newDocument]
      } as any
      await updatePatient(selectedPatientId, updatedDto)

      // 4. Identify and release the bed
      const assignedBed = beds.find((b) => b.patientId === selectedPatientId)
      if (assignedBed) {
        await dischargePatient(assignedBed.id, dischargeText)
      }

      // 5. Refresh context state
      await refreshPatients()

      toast.success('Пациент успешно выписан из отделения')
      onClose()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Произошла ошибка при выписке пациента')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DischargeContainer>
      <DischargeHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ClipboardList size={28} style={{ color: '#2563eb', flexShrink: 0 }} />
          <div style={{ padding: 12 }}>
            <DischargeTitle>Выписка пациента из пульмонологического отделения</DischargeTitle>
            <DischargeSubtitle>
              Зафиксируйте исход госпитализации, составьте выписной эпикриз и освободите койко-место
            </DischargeSubtitle>
          </div>
        </div>
      </DischargeHeader>

      <FormCard>
        <form
          onSubmit={handleDischargeSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          <FormGrid>
            <FormGroup>
              <Label htmlFor="patient-select">Пациент</Label>
              <Select
                id="patient-select"
                options={patientOptions}
                styles={selectStyles}
                placeholder="Выберите пациента..."
                value={
                  selectedPatient
                    ? {
                        value: selectedPatient.id,
                        label: `${selectedPatient.lastName} ${selectedPatient.firstName} ${selectedPatient.middleName || ''} (Карта: ${selectedPatient.medcardNum || '—'})`
                      }
                    : null
                }
                onChange={(opt) => setSelectedPatientId(opt ? opt.value : '')}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="discharge-date">Дата и время выписки</Label>
              <Input
                id="discharge-date"
                type="datetime-local"
                value={dischargeDateTime}
                onChange={(e) => setDischargeDateTime(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="discharge-variant">Вариант выписки</Label>
              <Select
                id="discharge-variant"
                options={DISCHARGE_VARIANTS}
                styles={selectStyles}
                value={dischargeVariant}
                onChange={(opt) => setDischargeVariant(opt)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="final-diagnosis">Заключительный клинический диагноз</Label>
              <Input
                id="final-diagnosis"
                type="text"
                placeholder="Введите окончательный диагноз..."
                value={finalDiagnosis}
                onChange={(e) => setFinalDiagnosis(e.target.value)}
                required
                disabled={!selectedPatient}
              />
            </FormGroup>

            {dischargeVariant?.value === 'Transfer' && (
              <FormGroup $fullWidth>
                <Label htmlFor="destination">Куда направлен / В какое отделение переведен</Label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="Наименование учреждения или отделения..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </FormGroup>
            )}
          </FormGrid>

          {selectedPatient && (
            <PatientSummaryPanel>
              <SummaryItem>
                <span className="label">Возраст и пол</span>
                <span className="value">
                  {selectedPatient.age} {pluralize(selectedPatient.age, ['год', 'года', 'лет'])} ·{' '}
                  {selectedPatient.gender}
                </span>
              </SummaryItem>
              <SummaryItem>
                <span className="label">Лечащий врач</span>
                <span className="value">{selectedPatient.doctor || 'Не назначен'}</span>
              </SummaryItem>
              <SummaryItem>
                <span className="label">Палата и койка</span>
                <span className="value">
                  {assignedBed?.roomNumber
                    ? `Палата ${assignedBed.roomNumber} (Койка ${assignedBed.bedNumber || 1})`
                    : 'Не прикреплен к койке'}
                </span>
              </SummaryItem>
              <SummaryItem>
                <span className="label">Номер карты</span>
                <span className="value">{selectedPatient.medcardNum || '—'}</span>
              </SummaryItem>
            </PatientSummaryPanel>
          )}

          <FormGroup $fullWidth>
            <Label htmlFor="epicrisis">Выписной эпикриз / Анамнез и ход лечения</Label>
            <TextArea
              id="epicrisis"
              placeholder="Данные автоматически подтягиваются из первичного осмотра"
              value={epicrisis}
              onChange={(e) => setEpicrisis(e.target.value)}
              disabled={!selectedPatient}
            />
          </FormGroup>

          <FormGroup $fullWidth>
            <Label htmlFor="dischargeState">Состояние при выписке</Label>
            <TextArea
              id="dischargeState"
              placeholder="Впишите состояние пациента при выписке, жалобы (если есть) и объективные данные..."
              value={dischargeState}
              onChange={(e) => setDischargeState(e.target.value)}
              disabled={!selectedPatient}
            />
          </FormGroup>

          <FormGroup $fullWidth>
            <Label htmlFor="recommendations">Рекомендации при выписке</Label>
            <TextArea
              id="recommendations"
              placeholder="Впишите рекомендации для пациента..."
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              disabled={!selectedPatient}
            />
          </FormGroup>

          <GeneratedCard>
            <GeneratedCardHeader>
              <GeneratedCardTitle>
                <h2>Сформированный текст выписки</h2>
                <p>
                  Нажмите кнопку ниже, чтобы собрать текст по шаблону и отредактировать его перед
                  сохранением.
                </p>
              </GeneratedCardTitle>
              <GenerateTextButton
                type="button"
                onClick={handleGenerateDischargeText}
                disabled={!selectedPatient}
              >
                <ClipboardList size={16} />
                Сформировать текст выписки
              </GenerateTextButton>
            </GeneratedCardHeader>

            <GeneratedPreview
              value={generatedDischargeText}
              placeholder="Сформируйте текст выписки, чтобы увидеть готовый шаблон здесь..."
              readOnly
              disabled={!selectedPatient}
            />
          </GeneratedCard>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Отмена
            </CancelButton>
            <SubmitButton type="submit" disabled={loading || !selectedPatientId}>
              <Save size={18} />
              {loading ? 'Сохранение...' : 'Выписать пациента'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </FormCard>

      <PrintWrapper>
        {selectedPatient && (
          <PrintContainer ref={printContainerRef}>
            <PrintHeaderFlex>
              <div>
                <PrintHospitalName>
                  ГУ БЕНДЕРСКАЯ ЦЕНТРАЛЬНАЯ ГОРОДСКАЯ БОЛЬНИЦА
                </PrintHospitalName>
                <PrintDepartmentName>Пульмонологическое отделение</PrintDepartmentName>
                <PrintAddress>Адрес: ПМР, г. Бендеры, ул. Бендерского Восстания, 146</PrintAddress>
              </div>
              <PrintDateInfo>
                <div>
                  <strong>Дата выписки:</strong> {formatLocalDate(dischargeDateTime)}
                </div>
                <div>
                  <strong>Время:</strong> {new Date(dischargeDateTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </PrintDateInfo>
            </PrintHeaderFlex>

            <PrintTitleContainer>
              <PrintTitle>ВЫПИСНОЙ ЭПИКРИЗ</PrintTitle>
              <PrintSubtitle>Медицинская карта № {selectedPatient.medcardNum || '—'}</PrintSubtitle>
            </PrintTitleContainer>

            <PrintPatientCard>
              <div>
                <strong>Пациент (ФИО):</strong> {`${selectedPatient.lastName} ${selectedPatient.firstName} ${selectedPatient.middleName || ''}`}
              </div>
              <div>
                <strong>Дата рождения:</strong> {selectedPatient.dateOfBirth ? formatLocalDate(selectedPatient.dateOfBirth) : '—'} ({selectedPatient.age} лет)
              </div>
              <div>
                <strong>Палата / Койка:</strong> {assignedBed?.roomNumber ? `Пал. ${assignedBed.roomNumber}, Койка ${assignedBed.bedNumber || 1}` : '—'}
              </div>
              <div>
                <strong>Лечащий врач:</strong> {selectedPatient.doctor || '—'}
              </div>
              <div>
                <strong>Пол:</strong> {selectedPatient.gender}
              </div>
              <div>
                <strong>Место работы:</strong> {[selectedPatient.work?.profession, selectedPatient.work?.organization].filter(Boolean).join(', ') || '—'}
              </div>
            </PrintPatientCard>

             <PrintSection>
              <PrintSectionTitle>Заключительный клинический диагноз</PrintSectionTitle>
              <PrintSectionContent>{renderLines(finalDiagnosis)}</PrintSectionContent>
            </PrintSection>

            <PrintSection>
              <PrintSectionTitle>Сопутствующие заболевания</PrintSectionTitle>
              <PrintSectionContent>{renderLines(buildComorbidityLines())}</PrintSectionContent>
            </PrintSection>

            <PrintSection>
              <PrintSectionTitle>Жалобы при поступлении</PrintSectionTitle>
              <PrintSectionContent>{renderLines(epicrisis || buildAdmissionComplaintText())}</PrintSectionContent>
            </PrintSection>

            <PrintSection>
              <PrintSectionTitle>Проведённые исследования</PrintSectionTitle>
              <PrintSectionContent>{renderLines(buildInvestigationLines())}</PrintSectionContent>
            </PrintSection>

            <PrintSection>
              <PrintSectionTitle>Проведённое лечение</PrintSectionTitle>
              <PrintSectionContent>{renderLines(buildTreatmentLines())}</PrintSectionContent>
            </PrintSection>

            <PrintSection>
              <PrintSectionTitle>Состояние при выписке</PrintSectionTitle>
              <PrintSectionContent>{renderLines(dischargeState || buildDischargeStateLines())}</PrintSectionContent>
            </PrintSection>

            <PrintSection>
              <PrintSectionTitle>Рекомендации</PrintSectionTitle>
              <PrintSectionContent>{renderLines(recommendations || buildRecommendationsLines())}</PrintSectionContent>
            </PrintSection>

            <PrintSignaturesFlex>
              <div>
                <strong>Лечащий врач:</strong> {selectedPatient.doctor || 'Врач отделения'}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>
                  <strong>Дата:</strong> {formatLocalDate(dischargeDateTime)}
                </div>
                <PrintSignatureLine>Подпись / М.П. ___________________</PrintSignatureLine>
              </div>
            </PrintSignaturesFlex>
          </PrintContainer>
        )}
      </PrintWrapper>
    </DischargeContainer>
  )
}
