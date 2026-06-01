import { useState, useEffect, useMemo } from 'react'
import {
  Thermometer,
  Activity,
  Heart,
  Droplet,
  Save,
  FileLineChart,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,

  User,
  Home,
  Calendar,
  Loader2,
} from 'lucide-react'

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea
} from 'recharts'
import { toast } from 'react-toastify'
import { z } from 'zod'
import Select, { components, DropdownIndicatorProps, StylesConfig } from 'react-select'

import {
  Content,
  TwoColumnGrid,
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  FieldLabel,
  FieldLabelIcon,
  BpGrid,
  OpenSheetBtn,
  SaveBtn,
  Container,
  StyledCard,
  HeaderRow,
  HeaderLeft,
  Title,
  CardContent,
  InfoGrid,
  InfoItem,
  InfoText,
  InfoLabel,
  InfoValue
} from './styled'

import Input from 'components/Input/index'
import colors from 'consts/colors'

import {
  fetchHospitalizedPatients,
  fetchVitals,
  fetchWarnings,
  fetchTrends,
  postVitalSign,
  ServerWarningDto,
  ServerTrendDto,
  ServerPatientDto,
  ServerVitalSignDto,
} from 'api/vitalSignsApi'


interface LocalVitalSign {
  id: string
  recordedAt: string  
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  temperature: number
  pulse: number
  spo2: number
  respiratoryRate: number
}

const SERVER_TO_LOCAL: Record<string, string> = {
  Temperature:            'temperature',
  BloodPressureSystolic:  'bloodPressureSystolic',
  BloodPressureDiastolic: 'bloodPressureDiastolic',
  Pulse:                  'pulse',
  SpO2:                   'spo2',
  RespiratoryRate:        'respiratoryRate',
}

const mapServerVital = (dto: ServerVitalSignDto): LocalVitalSign => ({
  id: dto.id,
  recordedAt: dto.recordedAt,
  bloodPressureSystolic:  dto.bloodPressureSystolic  ?? 0,
  bloodPressureDiastolic: dto.bloodPressureDiastolic ?? 0,
  temperature:            dto.temperature            ?? 0,
  pulse:                  dto.pulse                  ?? 0,
  spo2:                   dto.spO2                   ?? 0,
  respiratoryRate:        dto.respiratoryRate        ?? 0,
})


type VitalSignField =
  | 'temperature'
  | 'bloodPressureSystolic'
  | 'bloodPressureDiastolic'
  | 'pulse'
  | 'spo2'
  | 'respiratoryRate'

const NORMAL_RANGES: Record<string, { min: number; max: number; label: string; unit: string }> = {
  temperature:            { min: 36.0, max: 37.2, label: 'Температура',         unit: '°C'           },
  bloodPressureSystolic:  { min: 100,  max: 130,  label: 'АД систолическое',    unit: 'мм рт. ст.'   },
  bloodPressureDiastolic: { min: 60,   max: 90,   label: 'АД диастолическое',   unit: 'мм рт. ст.'   },
  pulse:                  { min: 60,   max: 100,  label: 'Пульс',               unit: 'уд/мин'       },
  spo2:                   { min: 95,   max: 100,  label: 'Сатурация',           unit: '%'            },
  respiratoryRate:        { min: 12,   max: 20,   label: 'Частота дыхания',     unit: 'дых/мин'      },
}

const VITAL_RULES: Record<
  VitalSignField,
  { label: string; min: number; max: number; integerOnly?: boolean }
> = {
  temperature:            { label: 'Температура',           min: 34,  max: 42,  integerOnly: false },
  bloodPressureSystolic:  { label: 'Систолическое давление', min: 70,  max: 250, integerOnly: true  },
  bloodPressureDiastolic: { label: 'Диастолическое давление',min: 40,  max: 150, integerOnly: true  },
  pulse:                  { label: 'Пульс',                 min: 30,  max: 220, integerOnly: true  },
  spo2:                   { label: 'Сатурация',             min: 50,  max: 100, integerOnly: true  },
  respiratoryRate:        { label: 'Частота дыхания',       min: 5,   max: 60,  integerOnly: true  },
}

type TrendDir = 'up' | 'down' | 'stable'

const TREND_META: {
  field: VitalSignField
  label: string
  goodDir: TrendDir | 'any'
}[] = [
  { field: 'temperature',           label: 'Темп.',    goodDir: 'any' },
  { field: 'pulse',                 label: 'Пульс',    goodDir: 'any' },
  { field: 'bloodPressureSystolic', label: 'АД с.',    goodDir: 'any' },
  { field: 'bloodPressureDiastolic',label: 'АД д.',    goodDir: 'any' },
  { field: 'respiratoryRate',       label: 'ЧД',       goodDir: 'any' },
  { field: 'spo2',                  label: 'SpO₂ (%)', goodDir: 'up'  },
]

const createFieldErrors = (): Record<VitalSignField, string> => ({
  temperature: '', bloodPressureSystolic: '', bloodPressureDiastolic: '',
  pulse: '', spo2: '', respiratoryRate: '',
})

const createVitalFieldSchema = (field: VitalSignField) => {
  const rule = VITAL_RULES[field]
  return z
    .string().trim()
    .min(1, `${rule.label}: введите числовое значение`)
    .refine(v => Number.isFinite(Number(v.replace(',', '.'))), `${rule.label}: введите числовое значение`)
    .refine(v => !rule.integerOnly || Number.isInteger(Number(v.replace(',', '.'))), `${rule.label}: допустимы только целые числа`)
    .refine(v => { const n = Number(v.replace(',', '.')); return n >= rule.min && n <= rule.max }, `${rule.label}: диапазон ${rule.min}-${rule.max}`)
}

const vitalFieldSchemas: Record<VitalSignField, ReturnType<typeof createVitalFieldSchema>> = {
  temperature:            createVitalFieldSchema('temperature'),
  bloodPressureSystolic:  createVitalFieldSchema('bloodPressureSystolic'),
  bloodPressureDiastolic: createVitalFieldSchema('bloodPressureDiastolic'),
  pulse:                  createVitalFieldSchema('pulse'),
  spo2:                   createVitalFieldSchema('spo2'),
  respiratoryRate:        createVitalFieldSchema('respiratoryRate'),
}

const vitalSignsSchema = z.object(vitalFieldSchemas)

const mapZodErrors = (error: z.ZodError): Record<VitalSignField, string> => {
  const next = createFieldErrors()
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key !== 'string' || !(key in next)) continue
    const f = key as VitalSignField
    if (!next[f]) next[f] = issue.message
  }
  return next
}


const getPulseSegments = (pulse: number) => {
  const { min, max } = NORMAL_RANGES.pulse
  if (pulse < min) return { pulseRange: 0, pulseUpper: pulse }
  if (pulse <= max) return { pulseRange: pulse, pulseUpper: 0 }
  return { pulseRange: max, pulseUpper: pulse - max }
}

const getBloodPressureSegments = (systolic: number, diastolic: number) => {
  const min = NORMAL_RANGES.bloodPressureDiastolic.min
  const max = NORMAL_RANGES.bloodPressureSystolic.max
  const start = Math.min(diastolic, systolic)
  const end   = Math.max(diastolic, systolic)
  const below       = Math.max(Math.min(end, min) - start, 0)
  const normalStart = Math.max(start, min)
  const normalEnd   = Math.min(end, max)
  const normal      = Math.max(normalEnd - normalStart, 0)
  const above       = Math.max(end - Math.max(start, max), 0)
  return { bpBase: start, bpLow: below, bpNormal: normal, bpHigh: above }
}

const formatChartDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })

const CustomTempDot = (props: any) => {
  const { cx, cy, payload } = props

  if (props.dataKey === 'temperature') {
    const abnormal = payload.temperature > NORMAL_RANGES.temperature.max || payload.temperature < NORMAL_RANGES.temperature.min
    return (
      <g>
        {abnormal && (<><circle cx={cx} cy={cy} r={13} fill="#ef4444" fillOpacity={0.12} /><circle cx={cx} cy={cy} r={9} fill="#ef4444" fillOpacity={0.2} /></>)}
        <circle cx={cx} cy={cy} r={abnormal ? 6 : 4} fill={abnormal ? '#ef4444' : '#f97316'} />
      </g>
    )
  }

  if (props.dataKey === 'spo2') {
    const abnormal = payload.spo2 > NORMAL_RANGES.spo2.max || payload.spo2 < NORMAL_RANGES.spo2.min
    return (
      <g>
        {abnormal && (<><circle cx={cx} cy={cy} r={14} fill="#3b82f6" fillOpacity={0.15} /><circle cx={cx} cy={cy} r={9} fill="#3b82f6" fillOpacity={0.25} /></>)}
        <circle cx={cx} cy={cy} r={abnormal ? 6 : 4} fill={abnormal ? '#1d4ed8' : '#60a5fa'} stroke={abnormal ? '#fff' : 'none'} strokeWidth={2} />
      </g>
    )
  }

  if (props.dataKey === 'respiratoryRate') {
    const abnormal = payload.respiratoryRate > NORMAL_RANGES.respiratoryRate.max || payload.respiratoryRate < NORMAL_RANGES.respiratoryRate.min
    return (
      <g>
        {abnormal && (<><circle cx={cx} cy={cy} r={14} fill="#10b981" fillOpacity={0.15} /><circle cx={cx} cy={cy} r={9} fill="#10b981" fillOpacity={0.25} /></>)}
        <circle cx={cx} cy={cy} r={abnormal ? 6 : 4} fill={abnormal ? '#059669' : '#34d399'} stroke={abnormal ? '#fff' : 'none'} strokeWidth={2} />
      </g>
    )
  }

  return null
}

const CustomTempActiveDot = (props: any) => {
  const { cx, cy, payload } = props
  const abnormal = payload.temperature > NORMAL_RANGES.temperature.max || payload.temperature < NORMAL_RANGES.temperature.min
  return <circle cx={cx} cy={cy} r={7} fill={abnormal ? '#ef4444' : '#f97316'} />
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface PatientOption { value: string; label: string }

const DropdownIndicator = (props: DropdownIndicatorProps<PatientOption, false>) =>
  <components.DropdownIndicator {...props}></components.DropdownIndicator>

const patientSelectStyles: StylesConfig<PatientOption, false> = {
  control: (base, state) => ({
    ...base, minHeight: '40px', borderRadius: '8px',
    borderColor: state.isFocused ? colors.button : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
    backgroundColor: '#ffffff', transition: 'all 0.2s ease',
    '&:hover': { borderColor: state.isFocused ? colors.button : '#9ca3af' },
  }),
  valueContainer: base => ({ ...base, padding: '0 8px 0 12px' }),
  placeholder:    base => ({ ...base, color: '#9ca3af', fontSize: '14px' }),
  input:          base => ({ ...base, color: '#111827', fontSize: '14px' }),
  singleValue:    base => ({ ...base, color: '#111827', fontSize: '14px' }),
  indicatorsContainer: base => ({ ...base, paddingRight: '5px' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base, color: state.isFocused ? colors.mainColor : '#64748b', padding: '2px', margin: '0 4px',
    borderRadius: '6px', border: '1px solid #e2e8f0',
    backgroundColor: state.selectProps.menuIsOpen ? '#eaf1ff' : '#f8fafc', transition: 'all 0.15s ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    '&:hover': { color: colors.mainColor, backgroundColor: '#eaf1ff', borderColor: '#c7d2fe' },
    svg: { width: '14px', height: '14px' },
  }),
  menu:     base => ({ ...base, marginTop: '6px', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)', overflow: 'hidden' }),
  menuList: base => ({ ...base, padding: '6px' }),
  option: (base, state) => ({
    ...base, borderRadius: '7px', fontSize: '14px', cursor: 'pointer',
    backgroundColor: state.isSelected ? colors.mainColor : state.isFocused ? '#eff6ff' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#1f2937', transition: 'all 0.15s ease',
    ':active': { backgroundColor: state.isSelected ? colors.mainColor : '#dbeafe' },
  }),
}


interface NurseWorkplaceProps {
  onNavigate: (screen: string) => void
  onLogout: () => void
  userRole: 'doctor' | 'nurse' | 'patient' | null
  patientId?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

const TemperaturePage: React.FC<NurseWorkplaceProps> = ({ patientId }) => {
  // ── Server data ──────────────────────────────────────────────────────────────
  const [vitals,    setVitals]    = useState<LocalVitalSign[]>([])
  const [serverWarnings, setServerWarnings] = useState<ServerWarningDto[]>([])
  const [serverTrends,   setServerTrends]   = useState<ServerTrendDto[]>([])
  const [patients,  setPatients]  = useState<ServerPatientDto[]>([])

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId || '')
  const [loading, setLoading] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '', bloodPressureSystolic: '', bloodPressureDiastolic: '',
    pulse: '', spo2: '', respiratoryRate: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<VitalSignField, string>>(createFieldErrors())

  useEffect(() => {
    fetchHospitalizedPatients()
      .then(data => setPatients(data))
      .catch(() => toast.error('Не удалось загрузить список пациентов'))
  }, [])

  useEffect(() => {
    if (patientId) setSelectedPatientId(patientId)
  }, [patientId])

  useEffect(() => {
    if (!selectedPatientId) {
      setVitals([])
      setServerWarnings([])
      setServerTrends([])
      return
    }
    loadPatientData(selectedPatientId)
  }, [selectedPatientId])

  const loadPatientData = async (pid: string) => {
    setLoading(true)
    try {
      const [vitalsData, warningsData, trendsData] = await Promise.all([
        fetchVitals(pid),
        fetchWarnings(pid),
        fetchTrends(pid),
      ])
      setVitals([...vitalsData].reverse().map(mapServerVital))
      setServerWarnings(warningsData)
      setServerTrends(trendsData)
    } catch (err: any) {
      let message = "Ошибка загрузки данных пациента"
      if (err instanceof Error && err.message) {
        message = err.message
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const latestVitals  = vitals.at(-1) ?? null
  const selectedPatient = patients.find(p => p.id === selectedPatientId)

  const warnings = useMemo(() =>
    serverWarnings.map(w => {
      const localKey = SERVER_TO_LOCAL[w.fieldName] ?? ''
      const range    = NORMAL_RANGES[localKey]
      return {
        label:     range?.label   ?? w.fieldName,
        value:     parseFloat(w.value ?? '0'),
        unit:      range?.unit    ?? '',
        direction: w.direction as 'high' | 'low',
      }
    }),
    [serverWarnings]
  )

  const getTrend = (localField: VitalSignField): TrendDir => {
    const serverKey = Object.entries(SERVER_TO_LOCAL).find(([, v]) => v === localField)?.[0]
    const found = serverTrends.find(t => t.fieldName === serverKey)
    return (found?.direction as TrendDir) ?? 'stable'
  }
  const months = useMemo(() => {
    const set = new Set<string>()
    const fmt = new Intl.DateTimeFormat('ru-RU', { month: 'long' })
    vitals.forEach(v => {
      const d = new Date(v.recordedAt)
      if (!isNaN(d.getTime())) {
        const m = fmt.format(d)
        set.add(m.charAt(0).toUpperCase() + m.slice(1))
      }
    })
    return Array.from(set)
  }, [vitals])

  const chartData = useMemo(() =>
    vitals.map(item => {
      const pulseSegments = getPulseSegments(item.pulse)
      const bpSegments    = getBloodPressureSegments(item.bloodPressureSystolic, item.bloodPressureDiastolic)
      return {
        ...item,
        name: formatChartDate(item.recordedAt),
        pulseBase:  0,
        pulseRange: pulseSegments.pulseRange,
        pulseUpper: pulseSegments.pulseUpper,
        bpBase:     bpSegments.bpBase,
        bpLow:      bpSegments.bpLow,
        bpNormal:   bpSegments.bpNormal,
        bpHigh:     bpSegments.bpHigh,
        bpsUpper:   NORMAL_RANGES.bloodPressureSystolic.max,
        bpsLower:   NORMAL_RANGES.bloodPressureSystolic.min,
        bpdUpper:   NORMAL_RANGES.bloodPressureDiastolic.max,
        bpdLower:   NORMAL_RANGES.bloodPressureDiastolic.min,
      }
    }),
    [vitals]
  )

  /** Данные для второго графика (SpO₂, ЧД) */
  const spoRespiratoryRate = useMemo(() =>
    vitals.map(item => ({
      name:           formatChartDate(item.recordedAt),
      spo2:           item.spo2,
      respiratoryRate:item.respiratoryRate,
    })),
    [vitals]
  )

  const patientOptions: PatientOption[] = patients.map(p => ({
    value: p.id,
    label: p.fullName + (p.roomAndBed ? ` (${p.roomAndBed})` : ''),
  }))

  // ── Обработчики формы ─────────────────────────────────────────────────────────
  const validateField = (field: VitalSignField, raw: string): string => {
    const r = vitalFieldSchemas[field].safeParse(raw)
    return r.success ? '' : (r.error.issues[0]?.message ?? '')
  }

  const handleVitalChange = (field: VitalSignField, next: string) => {
    setVitalSigns(prev => ({ ...prev, [field]: next }))
    if (next.trim() === '') {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
      return
    }
    setFieldErrors(prev => ({ ...prev, [field]: validateField(field, next) }))
  }

  const handleSaveVitals = async () => {
    const validationResult = vitalSignsSchema.safeParse(vitalSigns)
    if (!validationResult.success) {
      setFieldErrors(mapZodErrors(validationResult.error))
      toast.error('Проверьте корректность показателей перед сохранением')
      return
    }
    if (!selectedPatientId) {
      toast.error('Выберите пациента')
      return
    }

    setSaving(true)
    try {
      const parse = (v: string) => parseFloat(v.replace(',', '.'))
      await postVitalSign(selectedPatientId, {
        temperature:            parse(vitalSigns.temperature),
        bloodPressureSystolic:  parseInt(vitalSigns.bloodPressureSystolic),
        bloodPressureDiastolic: parseInt(vitalSigns.bloodPressureDiastolic),
        pulse:                  parseInt(vitalSigns.pulse),
        spO2:                   parseInt(vitalSigns.spo2),
        respiratoryRate:        parseInt(vitalSigns.respiratoryRate),
      })

      toast.success('Показатели сохранены в карточку пациента')
      setFieldErrors(createFieldErrors())
      setVitalSigns({ temperature: '', bloodPressureSystolic: '', bloodPressureDiastolic: '', pulse: '', spo2: '', respiratoryRate: '' })

      await loadPatientData(selectedPatientId)
    } catch (err: any) {
      let message = 'Ошибка при сохранении показателей'
      if (err instanceof Error && err.message) {
        message = err.message
      }
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Content>
      <Container>
        <StyledCard>
          <CardHeader>
            <HeaderRow>
              <HeaderLeft>
                <Thermometer size={32} />
                <Title>Температурный лист</Title>
              </HeaderLeft>
            </HeaderRow>
          </CardHeader>

          <CardContent>
            <InfoGrid>
              <InfoItem>
                <User size={20} color="#2563eb" />
                <InfoText>
                  <InfoLabel>Пациент</InfoLabel>
                  <InfoValue>{selectedPatient?.fullName ?? '—'}</InfoValue>
                </InfoText>
              </InfoItem>

              <InfoItem>
                <Home size={20} color="#2563eb" />
                <InfoText>
                  <InfoLabel>Палата / Койка</InfoLabel>
                  <InfoValue>{selectedPatient?.roomAndBed ?? '—'}</InfoValue>
                </InfoText>
              </InfoItem>

              <InfoItem>
                <Calendar size={20} color="#2563eb" />
                <InfoText>
                  <InfoLabel>Месяц</InfoLabel>
                  <InfoValue>{months.length > 0 ? months.join(', ') : '—'}</InfoValue>
                </InfoText>
              </InfoItem>
            </InfoGrid>
          </CardContent>
        </StyledCard>
      </Container>

      <TwoColumnGrid>
        {/* ── Левая колонка: форма ввода ── */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Регистрация показателей</CardTitle>
              <CardSubtitle>Внесение данных осмотра в температурный лист</CardSubtitle>
            </CardHeader>

            <CardBody>
              <div>
                <FieldLabel htmlFor="patient-select">Пациент</FieldLabel>
                <Select
                  inputId="patient-select"
                  placeholder="Выберите пациента..."
                  options={patientOptions}
                  styles={patientSelectStyles}
                  components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                  isSearchable
                  noOptionsMessage={() => 'Пациенты не найдены'}
                  value={patientOptions.find(o => o.value === selectedPatientId) ?? null}
                  onChange={option => setSelectedPatientId(option?.value || '')}
                />
              </div>

              {selectedPatient && (
                <OpenSheetBtn onClick={() => {}}>
                  <FileLineChart size={20} />
                  <span>Открыть температурный лист</span>
                </OpenSheetBtn>
              )}

              {/* Загрузка */}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Загрузка данных...
                </div>
              )}

              {!loading && selectedPatientId && warnings.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', borderRadius: '10px', backgroundColor: '#fff5f5', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px', color: '#dc2626' }}>
                    <AlertTriangle size={15} />
                    <span>Требует внимания (последний замер)</span>
                  </div>
                  {warnings.map((w, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#b91c1c', paddingLeft: '21px', lineHeight: 1.5 }}>
                      <b>{w.label}:</b> {w.value} {w.unit} —{' '}
                      {w.direction === 'high' ? '↑ выше нормы' : '↓ ниже нормы'}
                    </div>
                  ))}
                </div>
              )}

              {/* Всё в норме */}
              {!loading && selectedPatientId && warnings.length === 0 && latestVitals && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '13px', fontWeight: 500, color: '#16a34a' }}>
                  ✓ Все последние показатели в норме
                </div>
              )}

              {/* Поля ввода */}
              <div>
                <FieldLabelIcon>
                  <Thermometer size={16} color="#ea580c" />
                  <span>Температура (°C)</span>
                </FieldLabelIcon>
                <Input
                  type="number" step="0.1"
                  min={VITAL_RULES.temperature.min} max={VITAL_RULES.temperature.max}
                  placeholder="36.6"
                  value={vitalSigns.temperature} error={fieldErrors.temperature}
                  onChange={e => handleVitalChange('temperature', e.target.value)}
                />
              </div>

              <div>
                <FieldLabelIcon>
                  <Activity size={16} color="#dc2626" />
                  <span>Артериальное давление (мм рт. ст.)</span>
                </FieldLabelIcon>
                <BpGrid>
                  <Input
                    type="number" placeholder="120" step="1"
                    min={VITAL_RULES.bloodPressureSystolic.min} max={VITAL_RULES.bloodPressureSystolic.max}
                    value={vitalSigns.bloodPressureSystolic} error={fieldErrors.bloodPressureSystolic}
                    onChange={e => handleVitalChange('bloodPressureSystolic', e.target.value)}
                  />
                  <Input
                    type="number" placeholder="80" step="1"
                    min={VITAL_RULES.bloodPressureDiastolic.min} max={VITAL_RULES.bloodPressureDiastolic.max}
                    value={vitalSigns.bloodPressureDiastolic} error={fieldErrors.bloodPressureDiastolic}
                    onChange={e => handleVitalChange('bloodPressureDiastolic', e.target.value)}
                  />
                </BpGrid>
              </div>

              <div>
                <FieldLabelIcon>
                  <Heart size={16} color="#db2777" />
                  <span>Пульс (уд/мин)</span>
                </FieldLabelIcon>
                <Input
                  type="number" placeholder="80" step="1"
                  min={VITAL_RULES.pulse.min} max={VITAL_RULES.pulse.max}
                  value={vitalSigns.pulse} error={fieldErrors.pulse}
                  onChange={e => handleVitalChange('pulse', e.target.value)}
                />
              </div>

              <div>
                <FieldLabelIcon>
                  <Droplet size={16} color="#2563eb" />
                  <span>Сатурация (SpO2, %)</span>
                </FieldLabelIcon>
                <Input
                  type="number" placeholder="98" step="1"
                  min={VITAL_RULES.spo2.min} max={VITAL_RULES.spo2.max}
                  value={vitalSigns.spo2} error={fieldErrors.spo2}
                  onChange={e => handleVitalChange('spo2', e.target.value)}
                />
              </div>

              <div>
                <FieldLabelIcon>
                  <Activity size={16} color="#0d9488" />
                  <span>Частота дыхания (в минуту)</span>
                </FieldLabelIcon>
                <Input
                  type="number" placeholder="18" step="1"
                  min={VITAL_RULES.respiratoryRate.min} max={VITAL_RULES.respiratoryRate.max}
                  value={vitalSigns.respiratoryRate} error={fieldErrors.respiratoryRate}
                  onChange={e => handleVitalChange('respiratoryRate', e.target.value)}
                />
              </div>

              <SaveBtn onClick={handleSaveVitals} disabled={saving}>
                {saving
                  ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  : <Save size={20} />
                }
                <span>{saving ? 'Сохранение...' : 'Сохранить показатели'}</span>
              </SaveBtn>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Динамика состояния</CardTitle>
              <CardSubtitle>График изменения температуры и жизненно важных функций</CardSubtitle>
            </CardHeader>

            <CardBody $noPadding>
              {/* Тренды (верхняя строка) */}
              {serverTrends.length >= 2 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>Динамика:</span>
                  {TREND_META.filter(m => m.field !== 'spo2' && m.field !== 'respiratoryRate').map(({ field, label, goodDir }) => {
                    const dir = getTrend(field)
                    const currentValue = latestVitals?.[field] as number | undefined
                    const range = NORMAL_RANGES[field]
                    const isOutOfRange = currentValue !== undefined && (currentValue < range.min || currentValue > range.max)
                    const isGood = !isOutOfRange && (goodDir === 'any' || dir === goodDir || dir === 'stable')
                    const color = dir === 'stable' ? '#94a3b8' : isGood ? '#16a34a' : '#dc2626'
                    const Icon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus
                    return (
                      <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', backgroundColor: `${color}14`, border: `1px solid ${color}33`, fontSize: '12px', fontWeight: 500, color }}>
                        <Icon size={13} />
                        <span>{label}</span>
                      </div>
                    )
                  })}
                  <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center', marginLeft: 'auto' }}>← vs предыдущий замер</span>
                </div>
              )}

              {/* Пустое состояние */}
              {!loading && chartData.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: '#94a3b8', fontSize: '14px' }}>
                  {selectedPatientId ? 'Нет данных для отображения' : 'Выберите пациента'}
                </div>
              )}

              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={420}>
                  <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 6, left: 6 }}>
                    <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                    <XAxis dataKey="name" />

                    <YAxis yAxisId="vitals" domain={[30, 250]} width={52} tickCount={12}
                      label={{ value: 'Пульс / АД', angle: -90, position: 'insideLeft', offset: 0 }} />
                    <YAxis yAxisId="temp" orientation="right"
                      domain={[VITAL_RULES.temperature.min, VITAL_RULES.temperature.max]}
                      tickCount={10} width={52}
                      label={{ value: 'Температура, °C', angle: 90, position: 'insideRight', offset: -10 }} />

                    <Tooltip
                      formatter={(value, name, entry) => {
                        const row = entry.payload as any
                        const dataKey = entry.dataKey as string
                        const formatAlert = (text: string, alertText?: string) =>
                          alertText ? <span style={{ color: '#dc2626', fontWeight: 600 }}>{text} ({alertText})</span> : text

                        const tempAlert = row.temperature > NORMAL_RANGES.temperature.max ? '⚠ ↑ выше нормы' : row.temperature < NORMAL_RANGES.temperature.min ? '⚠ ↓ ниже нормы' : ''
                        const pulseAlert = row.pulse > NORMAL_RANGES.pulse.max ? '↑ выше нормы' : row.pulse < NORMAL_RANGES.pulse.min ? '↓ ниже нормы' : ''
                        const bpAlerts: string[] = []
                        if (row.bloodPressureSystolic  > NORMAL_RANGES.bloodPressureSystolic.max)  bpAlerts.push('↑ сист.')
                        if (row.bloodPressureSystolic  < NORMAL_RANGES.bloodPressureSystolic.min)  bpAlerts.push('↓ сист.')
                        if (row.bloodPressureDiastolic > NORMAL_RANGES.bloodPressureDiastolic.max) bpAlerts.push('↑ диаст.')
                        if (row.bloodPressureDiastolic < NORMAL_RANGES.bloodPressureDiastolic.min) bpAlerts.push('↓ диаст.')

                        if (dataKey === 'temperature') return [formatAlert(`${row.temperature.toFixed(1)} °C`, tempAlert), 'Температура']
                        if (dataKey === 'pulseBase' || dataKey === 'bpBase') return null
                        if (dataKey === 'pulseRange' || dataKey === 'pulseUpper') {
                          const seg = typeof value === 'number' ? value : Number(value)
                          if (!Number.isFinite(seg) || seg <= 0) return null
                          if (dataKey === 'pulseUpper' && row.pulseRange > 0) return null
                          return [formatAlert(`${row.pulse} уд/мин`, pulseAlert), 'Пульс']
                        }
                        if (dataKey === 'bpNormal') return [formatAlert(`${row.bloodPressureSystolic}/${row.bloodPressureDiastolic} мм рт. ст.`, bpAlerts.length ? `⚠ ${bpAlerts.join(', ')}` : ''), 'АД']
                        if (dataKey === 'bpLow' || dataKey === 'bpHigh') {
                          if (row.bpNormal !== 0) return null
                          return [formatAlert(`${row.bloodPressureSystolic}/${row.bloodPressureDiastolic} мм рт. ст.`, bpAlerts.length ? `⚠ ${bpAlerts.join(', ')}` : ''), 'АД']
                        }
                        return [value, name]
                      }}
                    />
                    <Legend verticalAlign="bottom" align="center" />

                    <ReferenceArea yAxisId="temp" y1={NORMAL_RANGES.temperature.min} y2={NORMAL_RANGES.temperature.max} fill="#dcfce7" fillOpacity={0.35} strokeOpacity={0} />
                    <ReferenceLine yAxisId="temp" y={37.2} stroke="#16a34a" strokeDasharray="5 4" strokeOpacity={0.55} strokeWidth={1.5} label={{ value: `${NORMAL_RANGES.temperature.max}°`, position: 'left', fontSize: 10, fill: '#16a34a', dy: -12, dx: 4 }} />
                    <ReferenceLine yAxisId="temp" y={36.0} stroke="#16a34a" strokeDasharray="5 4" strokeOpacity={0.4}  strokeWidth={1.5} label={{ value: `${NORMAL_RANGES.temperature.min}.0°`, position: 'left', fontSize: 10, fill: '#16a34a', dy: -4, dx: 4 }} />

                    <ReferenceLine yAxisId="vitals" y={NORMAL_RANGES.bloodPressureSystolic.max}  stroke="#f97316" strokeDasharray="6 4" strokeOpacity={0.45} strokeWidth={1.5} label={{ value: `АД ${NORMAL_RANGES.bloodPressureSystolic.max}`,  position: 'left', fontSize: 10, fill: '#f97316', dy: -7, dx: 3 }} />
                    <ReferenceLine yAxisId="vitals" y={NORMAL_RANGES.bloodPressureDiastolic.min} stroke="#f97316" strokeDasharray="4 4" strokeOpacity={0.35} strokeWidth={1.5} label={{ value: `АД ${NORMAL_RANGES.bloodPressureDiastolic.min}`, position: 'left', fontSize: 10, fill: '#f97316', dy: 2,  dx: 3 }} />
                    <ReferenceLine yAxisId="vitals" y={NORMAL_RANGES.pulse.max} stroke="#db2777" strokeDasharray="4 3" strokeOpacity={0.35} strokeWidth={1.5} label={{ value: `Пульс ${NORMAL_RANGES.pulse.max}`, position: 'right', fontSize: 10, fill: '#db2777' }} />
                    <ReferenceLine yAxisId="vitals" y={NORMAL_RANGES.pulse.min} stroke="#db2777" strokeDasharray="4 3" strokeOpacity={0.25} strokeWidth={1.5} label={{ value: `Пульс ${NORMAL_RANGES.pulse.min}`, position: 'right', fontSize: 10, fill: '#db2777', dy: -5 }} />

                    <Bar yAxisId="vitals" dataKey="pulseBase"  stackId="pulse" fill="transparent" legendType="none" />
                    <Bar yAxisId="vitals" dataKey="pulseRange" stackId="pulse" name="Пульс" fill="#db2777" barSize={14} radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="vitals" dataKey="pulseUpper" stackId="pulse" name="Пульс (плохой)" fill="#ff0026" barSize={14} radius={[4, 4, 4, 4]} legendType="none" />

                    <Bar yAxisId="vitals" dataKey="bpBase"   stackId="bp" fill="transparent" legendType="none" />
                    <Bar yAxisId="vitals" dataKey="bpLow"    stackId="bp" name="АД (выше нормы)"    fill="#000c8b" legendType="none" barSize={14} radius={[4, 4, 4, 4]} />
                    <Bar yAxisId="vitals" dataKey="bpNormal" stackId="bp" name="АД (нижн.-верхн.)" fill="#2563eb" barSize={14} radius={[4, 4, 4, 4]} />
                    <Bar yAxisId="vitals" dataKey="bpHigh"   stackId="bp" name="АД (ниже нормы)"   fill="#000c8b" legendType="none" barSize={14} radius={[4, 4, 4, 4]} />

                    <Line yAxisId="temp" type="monotone" dataKey="temperature" name="Температура"
                      stroke="#f97316" strokeWidth={3}
                      dot={<CustomTempDot />} activeDot={<CustomTempActiveDot />} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>

          {/* График 2: SpO₂ и Частота дыхания */}
          <Card>
            {serverTrends.length >= 2 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>Динамика:</span>
                {TREND_META.filter(m => m.field === 'spo2' || m.field === 'respiratoryRate').map(({ field, label, goodDir }) => {
                  const dir = getTrend(field)
                  const currentValue = latestVitals?.[field] as number | undefined
                  const range = NORMAL_RANGES[field]
                  const isOutOfRange = currentValue !== undefined && (currentValue < range.min || currentValue > range.max)
                  const isGood = !isOutOfRange && (goodDir === 'any' || dir === goodDir || dir === 'stable')
                  const color = dir === 'stable' ? '#94a3b8' : isGood ? '#16a34a' : '#dc2626'
                  const Icon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus
                  return (
                    <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', backgroundColor: isGood ? '#16a34a14' : '#dc262614', border: `1px solid ${isGood ? '#16a34a33' : '#dc262633'}`, fontSize: '12px', fontWeight: 500, color }}>
                      <Icon size={13} />
                      <span>{label}</span>
                    </div>
                  )
                })}
                <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center', marginLeft: 'auto' }}>← vs предыдущий замер</span>
              </div>
            )}

            {!loading && spoRespiratoryRate.length === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: '#94a3b8', fontSize: '14px' }}>
                {selectedPatientId ? 'Нет данных для отображения' : 'Выберите пациента'}
              </div>
            )}

            {spoRespiratoryRate.length > 0 && (
              <ResponsiveContainer width="100%" height={420}>
                <ComposedChart data={spoRespiratoryRate} margin={{ top: 20, right: 20, bottom: 6, left: 6 }}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis dataKey="name" />

                  <Tooltip
                    formatter={(value, name, entry) => {
                      const row = entry.payload as any
                      const dataKey = entry.dataKey as string
                      const formatAlert = (text: string, alert?: string) =>
                        alert ? <span style={{ color: '#dc2626', fontWeight: 600 }}>{text} ({alert})</span> : text

                      if (dataKey === 'spo2') {
                        const a = row.spo2 > NORMAL_RANGES.spo2.max ? '⚠ ↑ выше нормы' : row.spo2 < NORMAL_RANGES.spo2.min ? '⚠ ↓ ниже нормы' : ''
                        return [formatAlert(`${row.spo2.toFixed(1)} %`, a), 'SpO₂ (%)']
                      }
                      if (dataKey === 'respiratoryRate') {
                        const a = row.respiratoryRate > NORMAL_RANGES.respiratoryRate.max ? '⚠ ↑ выше нормы' : row.respiratoryRate < NORMAL_RANGES.respiratoryRate.min ? '⚠ ↓ ниже нормы' : ''
                        return [formatAlert(`${row.respiratoryRate} дых/мин`, a), 'Частота дыхания']
                      }
                      return [value, name]
                    }}
                  />
                  <Legend verticalAlign="bottom" align="center" />

                  <YAxis yAxisId="spo2" domain={[VITAL_RULES.spo2.min, VITAL_RULES.spo2.max]} width={52} tickCount={8}
                    label={{ value: 'SpO₂ (%)', angle: -90, position: 'insideLeft', offset: 10, dy: 50 }} />
                  <YAxis yAxisId="resp" orientation="right"
                    domain={[VITAL_RULES.respiratoryRate.min, VITAL_RULES.respiratoryRate.max]} width={52} tickCount={8}
                    label={{ value: 'Частота дыхания, дых/мин', angle: 90, position: 'insideRight', offset: 0, dy: 90 }} />

                  <ReferenceArea yAxisId="spo2" y1={NORMAL_RANGES.spo2.min} y2={NORMAL_RANGES.spo2.max} fill="#dcfce7" fillOpacity={0.3} strokeOpacity={0} />
                  <ReferenceLine yAxisId="spo2" y={NORMAL_RANGES.spo2.max} stroke="#2563eb" strokeDasharray="5 4" strokeOpacity={0.55} strokeWidth={1.4} label={{ value: `SpO₂ ${NORMAL_RANGES.spo2.max}%`, position: 'center', fontSize: 10, fill: '#2563eb', dy: -6 }} />
                  <ReferenceLine yAxisId="spo2" y={NORMAL_RANGES.spo2.min} stroke="#2563eb" strokeDasharray="5 4" strokeOpacity={0.45} strokeWidth={1.4} label={{ value: `SpO₂ ${NORMAL_RANGES.spo2.min}%`, position: 'left',   fontSize: 10, fill: '#2563eb', dy: 12  }} />

                  <ReferenceArea yAxisId="resp" y1={NORMAL_RANGES.respiratoryRate.min} y2={NORMAL_RANGES.respiratoryRate.max} fill="#dcfce7" fillOpacity={0.22} strokeOpacity={0} />
                  <ReferenceLine yAxisId="resp" y={NORMAL_RANGES.respiratoryRate.max} stroke="#10b981" strokeDasharray="5 4" strokeOpacity={0.55} strokeWidth={1.4} label={{ value: `ЧД ${NORMAL_RANGES.respiratoryRate.max}`, position: 'right', fontSize: 10, fill: '#10b981', dy: 5  }} />
                  <ReferenceLine yAxisId="resp" y={NORMAL_RANGES.respiratoryRate.min} stroke="#10b981" strokeDasharray="5 4" strokeOpacity={0.45} strokeWidth={1.4} label={{ value: `ЧД ${NORMAL_RANGES.respiratoryRate.min}`, position: 'right', fontSize: 10, fill: '#10b981', dy: 12 }} />

                  <Line yAxisId="spo2" type="monotone" dataKey="spo2" name="SpO₂ (%)"        stroke="#2563eb" strokeWidth={3} dot={<CustomTempDot />} />
                  <Line yAxisId="resp" type="monotone" dataKey="respiratoryRate" name="Частота дыхания" stroke="#10b981" strokeWidth={3} dot={<CustomTempDot />} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      </TwoColumnGrid>
    </Content>
  )
}

export default TemperaturePage
