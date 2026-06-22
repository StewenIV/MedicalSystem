import React, { useState, useEffect, useMemo } from 'react'
import Select, { StylesConfig } from 'react-select'
import { toast } from 'react-toastify'
import { ArrowLeft, Save, ClipboardList, Wand2 } from 'lucide-react'

import { usePatientData } from 'context/PatientDataContext'
import { fetchBeds, dischargePatient } from 'api/bedsApi'
import { createEncounter } from 'api/encountersApi'
import { toBackendDateTimeString } from 'utils/dateUtils'

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
  ButtonGroup,
  SubmitButton,
  CancelButton,
  AutoGenerateBtn
} from './styled'

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
  const { patients, updatePatient, refreshPatients } = usePatientData()

  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [dischargeVariant, setDischargeVariant] = useState<SelectOption | null>(DISCHARGE_VARIANTS[1]) // Improvement by default
  const [dischargeDateTime, setDischargeDateTime] = useState<string>(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [finalDiagnosis, setFinalDiagnosis] = useState<string>('')
  const [epicrisis, setEpicrisis] = useState<string>('')
  const [recommendations, setRecommendations] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [beds, setBeds] = useState<any[]>([])

  // Load hospitalized patients for selection list
  const hospitalizedPatients = useMemo(() => {
    return patients.filter((p) => p.status?.toLowerCase() === 'hospitalized')
  }, [patients])

  const patientOptions = useMemo(() => {
    return hospitalizedPatients.map((p) => ({
      value: p.id,
      label: `${p.lastName} ${p.firstName} ${p.middleName || ''} (Карта: ${p.medcardNum || '—'})`
    }))
  }, [hospitalizedPatients])

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || null
  }, [patients, selectedPatientId])

  // Fetch beds on mount to search for patient bed assignment later
  useEffect(() => {
    fetchBeds().then((resp) => {
      if (resp && resp.beds) {
        setBeds(resp.beds)
      }
    }).catch(console.error)
  }, [])

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
    }
  }, [selectedPatient])

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

  const handleAutoGenerateEpicrisis = () => {
    if (!selectedPatient) return
    const genderWord = selectedPatient.gender === 'Женский' ? 'пациентка' : 'пациент'
    const ageWord = pluralize(selectedPatient.age, ['год', 'года', 'лет'])

    let text = `Пациент ${selectedPatient.lastName} ${selectedPatient.firstName} ${selectedPatient.middleName || ''}, ${selectedPatient.age} ${ageWord}, находился на стационарном лечении в пульмонологическом отделении.\n\n`

    if (finalDiagnosis) {
      text += `Клинический диагноз при выписке: ${finalDiagnosis}\n\n`
    }

    text += `Жалобы при поступлении: кашель, затруднённое дыхание, одышка, общая слабость.\n`
    text += `За время госпитализации проведена комплексная консервативная терапия.\n`

    const vitals = (selectedPatient as any).vitals
    if (vitals) {
      text += `Состояние при выписке стабильное. Объективные показатели:\n`
      if (vitals.temp) text += `- Температура тела: ${vitals.temp} °C\n`
      if (vitals.bp) text += `- Артериальное давление: ${vitals.bp} мм рт. ст.\n`
      if (vitals.hr) text += `- Пульс / ЧСС: ${vitals.hr} уд/мин\n`
      if (vitals.spo2) text += `- Сатурация кислорода: ${vitals.spo2} %\n`
    } else {
      text += `Состояние при выписке удовлетворительное, показатели жизнедеятельности в пределах нормы.\n`
    }

    setEpicrisis(text)
  }

  const handleAutoGenerateRecommendations = () => {
    if (!selectedPatient) return
    let text = `1. Динамическое наблюдение врача-пульмонолога и терапевта по месту жительства.\n`
    text += `2. Проведение дыхательной гимнастики, ЛФК, избегание переохлаждений.\n`

    if (selectedPatient.currentMeds && selectedPatient.currentMeds.length > 0) {
      text += `3. Рекомендовано продолжить медикаментозное лечение:\n`
      selectedPatient.currentMeds.forEach((med: any) => {
        text += `   - ${med.name} ${med.dose || ''} ${med.form || ''} (${med.regimen || 'согласно схеме'})\n`
      })
    } else {
      text += `3. Рекомендован приём поливитаминов, симптоматическое лечение.\n`
    }

    setRecommendations(text)
  }

  const handleDischargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatientId) {
      toast.error('Выберите пациента для выписки')
      return
    }

    setLoading(true)
    try {
      // 1. Create the Discharge Encounter
      const formattedDateTime = toBackendDateTimeString(dischargeDateTime) || new Date().toISOString()
      const encounterPayload = {
        dateTime: formattedDateTime,
        type: 'Выписка',
        conclusion: `Заключительный диагноз: ${finalDiagnosis}\n\nРезультат выписки: ${dischargeVariant?.label || 'Выписан'}`,
        complaints: epicrisis,
        objective: `Исходящее состояние: стабильное. ${destination ? `Направление: ${destination}` : ''}`,
        recommendations: recommendations,
        formData: JSON.stringify({
          dischargeVariant: dischargeVariant?.value,
          dischargeVariantLabel: dischargeVariant?.label,
          destination: destination || null,
          finalDiagnosis
        })
      }

      await createEncounter(selectedPatientId, encounterPayload)

      // 2. Identify and release the bed
      const assignedBed = beds.find((b) => b.patientId === selectedPatientId)
      if (assignedBed) {
        await dischargePatient(assignedBed.id)
      } else {
        // If no bed was assigned, update the patient status card directly
        const updatedDto = {
          ...selectedPatient,
          status: 'Discharged',
          statusText: 'Выписан'
        } as any
        await updatePatient(selectedPatientId, updatedDto)
      }

      // 3. Refresh context state
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
          <div>
            <DischargeTitle>
              Выписка пациента из пульмонологического отделения
            </DischargeTitle>
            <DischargeSubtitle>
              Зафиксируйте исход госпитализации, составьте выписной эпикриз и освободите койко-место
            </DischargeSubtitle>
          </div>
        </div>
      </DischargeHeader>

      <FormCard>
        <form onSubmit={handleDischargeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                isDisabled={!!patientId}
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
                  {(selectedPatient as any).roomNumber
                    ? `Палата ${(selectedPatient as any).roomNumber} (Койка ${(selectedPatient as any).bedNumber || 1})`
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label htmlFor="epicrisis">Выписной эпикриз / Анамнез и ход лечения</Label>
              {selectedPatient && (
                <AutoGenerateBtn
                  type="button"
                  onClick={handleAutoGenerateEpicrisis}
                >
                  <Wand2 size={14} />
                  Сформировать по умолчанию
                </AutoGenerateBtn>
              )}
            </div>
            <TextArea
              id="epicrisis"
              placeholder="Подробно опишите жалобы, объективное состояние, динамику заболевания и ход лечения..."
              value={epicrisis}
              onChange={(e) => setEpicrisis(e.target.value)}
              disabled={!selectedPatient}
            />
          </FormGroup>

          <FormGroup $fullWidth>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label htmlFor="recommendations">Рекомендации при выписке</Label>
              {selectedPatient && (
                <AutoGenerateBtn
                  type="button"
                  onClick={handleAutoGenerateRecommendations}
                >
                  <Wand2 size={14} />
                  Сформировать по назначениям
                </AutoGenerateBtn>
              )}
            </div>
            <TextArea
              id="recommendations"
              placeholder="Рекомендации по амбулаторной терапии, препаратам, дозировкам, образу жизни и срокам контрольных осмотров..."
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              disabled={!selectedPatient}
            />
          </FormGroup>

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
    </DischargeContainer>
  )
}
