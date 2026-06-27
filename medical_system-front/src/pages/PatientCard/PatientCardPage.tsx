import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  parseBackendDateTime,
  formatLocalDateTime,
  formatLocalTime,
  formatLocalDate,
  toBackendDateString,
  toBackendDateTimeString,
  toLocalDateTimeLocalString
} from 'utils/dateUtils'
import TemperaturePage from 'pages/TemperatureSheet'
import { Helmet } from 'react-helmet'
import Select, { components, DropdownIndicatorProps, StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { z } from 'zod'
import { PatternFormat } from 'react-number-format'
import CustomInput from 'components/Input'
import { getPhoneFormat } from 'utils/phoneFormat'
import { paths } from 'routes/helpers'
import {
  User,
  Edit,
  Plus,
  Trash2,
  FileText,
  Download,
  Eye,
  Activity,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckSquare,
  X,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  Loader2,
  ChevronRight,
  Users,
  Thermometer,
  Heart,
  Droplet,
  Save,
  Syringe,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Shield,
  Clock,
  Stethoscope,
  TestTube,
  Pill,
  Clipboard,
  Upload,
  FilePlus,
  TrendingUp,
  TrendingDown,
  Minus as MinusIcon,
  Calendar,
  FileLineChart
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
import colors from 'consts/colors'
import { toast } from 'react-toastify'
import { showApiError } from 'utils/showApiError'

import { usePatientData } from 'context/PatientDataContext'
import { extractDoctorFromFormData } from 'api/encountersApi'
import { uploadFile, downloadFileFromServer } from 'api/filesApi'
import {
  PatientCardContainer,
  PatientHeader,
  Avatar,
  HeaderMain,
  PatientName,
  Demographics,
  HeaderInfoGrid,
  InfoItem,
  StatusBadge,
  TabsContainer,
  TabButton,
  ContentArea,
  SectionCard,
  GridRow,
  Table,
  TableWrapper,
  ActionButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  SearchPageWrapper,
  SearchCard,
  SearchCardHeader,
  SearchCardTitle,
  SearchCardSubtitle,
  SearchFilterBar,
  FilterLabel,
  SearchFilterInput,
  SearchFilterSelect,
  SearchResetBtn,
  SearchAddBtn,
  SearchTableWrap,
  SearchTableViewport,
  SearchTable,
  SearchThead,
  SearchTh,
  SearchTr,
  SearchTd,
  SearchTdBold,
  SearchTdMuted,
  PatientAvatar,
  PatientNameCell,
  StatusPill,
  SearchPaginationRow,
  SearchPaginationInfo,
  SearchPaginationBtns,
  SearchPageBtn,
  SearchEmptyState,
  SearchResultsCount,
  SearchPageSizeSelect,
  CardHeader,
  CardTitle,
  CardSubtitle,
  OpenSheetBtn
} from './styled'

interface SelectOption {
  value: string
  label: string
}

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '40px',
    borderRadius: '10px',
    borderColor: state.isFocused ? colors.button : 'rgba(191,219,254,0.8)',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': { borderColor: state.isFocused ? colors.button : '#9ca3af' }
  }),
  valueContainer: (base) => ({ ...base, padding: '0 8px 0 12px' }),
  placeholder: (base) => ({ ...base, color: '#94a3b8', fontSize: '14px' }),
  input: (base) => ({ ...base, color: '#111827', fontSize: '14px' }),
  singleValue: (base) => ({ ...base, color: '#111827', fontSize: '14px' }),
  indicatorsContainer: (base) => ({ ...base, paddingRight: '5px' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? colors.mainColor : '#64748b',
    padding: '2px',
    margin: '0 4px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: state.selectProps.menuIsOpen ? '#eaf1ff' : '#f8fafc',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { color: colors.mainColor, backgroundColor: '#eaf1ff', borderColor: '#c7d2fe' },
    svg: { width: '14px', height: '14px' }
  }),
  menu: (base) => ({
    ...base,
    marginTop: '6px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 24px rgba(15,23,42,0.12)',
    overflow: 'hidden',
    zIndex: 20
  }),
  menuList: (base) => ({ ...base, padding: '6px' }),
  option: (base, state) => ({
    ...base,
    borderRadius: '7px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? colors.mainColor : state.isFocused ? '#eff6ff' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#1f2937',
    transition: 'all 0.15s ease',
    ':active': { backgroundColor: state.isSelected ? colors.mainColor : '#dbeafe' }
  })
}

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, false>) => (
  <components.DropdownIndicator {...props} />
)
const selectComponents = { DropdownIndicator, IndicatorSeparator: () => null }

const NORMAL_RANGES: Record<string, { min: number; max: number; label: string; unit: string }> = {
  temperature: { min: 36.0, max: 37.2, label: 'Температура', unit: '°C' },
  bloodPressureSystolic: { min: 100, max: 130, label: 'АД сист.', unit: 'мм рт. ст.' },
  bloodPressureDiastolic: { min: 60, max: 90, label: 'АД диаст.', unit: 'мм рт. ст.' },
  pulse: { min: 65, max: 95, label: 'Пульс', unit: 'уд/мин' },
  spo2: { min: 95, max: 100, label: 'Сатурация', unit: '%' },
  respiratoryRate: { min: 12, max: 20, label: 'ЧД', unit: 'дых/мин' }
}

const VITAL_RULES = {
  temperature: { label: 'Температура', min: 34, max: 42 },
  bloodPressureSystolic: { label: 'Систолическое давление', min: 70, max: 250 },
  bloodPressureDiastolic: { label: 'Диастолическое давление', min: 40, max: 150 },
  pulse: { label: 'Пульс', min: 30, max: 220 },
  spo2: { label: 'Сатурация', min: 50, max: 100 },
  respiratoryRate: { label: 'Частота дыхания', min: 5, max: 60 }
}

const getPulseSegments = (pulse: number) => {
  const min = NORMAL_RANGES.pulse.min
  const max = NORMAL_RANGES.pulse.max

  if (pulse < min) {
    return { pulseRange: 0, pulseUpper: pulse }
  }

  if (pulse <= max) {
    return { pulseRange: pulse, pulseUpper: 0 }
  }

  return { pulseRange: max, pulseUpper: pulse - max }
}

const getBloodPressureSegments = (systolic: number, diastolic: number) => {
  const min = NORMAL_RANGES.bloodPressureDiastolic.min
  const max = NORMAL_RANGES.bloodPressureSystolic.max
  const start = Math.min(diastolic, systolic)
  const end = Math.max(diastolic, systolic)

  const below = Math.max(Math.min(end, min) - start, 0)
  const normalStart = Math.max(start, min)
  const normalEnd = Math.min(end, max)
  const normal = Math.max(normalEnd - normalStart, 0)
  const above = Math.max(end - Math.max(start, max), 0)

  return {
    bpBase: start,
    bpLow: below,
    bpNormal: normal,
    bpHigh: above
  }
}

const formatChartDate = (iso: string) => {
  return formatLocalDateTime(iso, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const buildChartData = (signs: any[]) => {
  const sorted = [...signs].sort((a, b) => {
    const da = (parseBackendDateTime(a.recordedAt || a.date) || new Date(0)).getTime()
    const db = (parseBackendDateTime(b.recordedAt || b.date) || new Date(0)).getTime()
    return da - db
  })

  return sorted.map((v) => {
    const pulse =
      v.pulse !== undefined && v.pulse !== null ? Number(v.pulse) : v.hr ? Number(v.hr) : undefined
    const temperature =
      v.temperature !== undefined && v.temperature !== null
        ? Number(v.temperature)
        : v.temp
          ? Number(v.temp)
          : undefined
    const respiratoryRate =
      v.respiratoryRate !== undefined && v.respiratoryRate !== null
        ? Number(v.respiratoryRate)
        : v.resp
          ? Number(v.resp)
          : undefined
    const spo2 =
      v.spO2 !== undefined && v.spO2 !== null
        ? Number(v.spO2)
        : v.spo2 !== undefined && v.spo2 !== null
          ? Number(v.spo2)
          : undefined

    let bps =
      v.bloodPressureSystolic !== undefined && v.bloodPressureSystolic !== null
        ? Number(v.bloodPressureSystolic)
        : undefined
    let bpd =
      v.bloodPressureDiastolic !== undefined && v.bloodPressureDiastolic !== null
        ? Number(v.bloodPressureDiastolic)
        : undefined
    if (v.bp && typeof v.bp === 'string') {
      const parts = v.bp.split('/')
      if (parts.length === 2) {
        bps = Number(parts[0])
        bpd = Number(parts[1])
      }
    }

    const ps = getPulseSegments(pulse || 0)
    const bp = getBloodPressureSegments(bps || 0, bpd || 0)

    return {
      ...v,
      temperature,
      pulse,
      respiratoryRate,
      spo2,
      bloodPressureSystolic: bps,
      bloodPressureDiastolic: bpd,
      name: formatChartDate(v.recordedAt || v.date),
      pulseBase: 0,
      pulseRange: ps.pulseRange,
      pulseUpper: ps.pulseUpper,
      bpBase: bp.bpBase,
      bpLow: bp.bpLow,
      bpNormal: bp.bpNormal,
      bpHigh: bp.bpHigh
    }
  })
}

const CustomTempDot = (props: any) => {
  const { cx, cy, payload } = props

  if (props.dataKey === 'temperature') {
    const abnormal =
      payload.temperature > NORMAL_RANGES.temperature.max ||
      payload.temperature < NORMAL_RANGES.temperature.min

    return (
      <g>
        {abnormal && (
          <>
            <circle cx={cx} cy={cy} r={13} fill="#ef4444" fillOpacity={0.12} />
            <circle cx={cx} cy={cy} r={9} fill="#ef4444" fillOpacity={0.2} />
          </>
        )}
        <circle cx={cx} cy={cy} r={abnormal ? 6 : 4} fill={abnormal ? '#ef4444' : '#f97316'} />
      </g>
    )
  }

  if (props.dataKey === 'spo2') {
    const abnormal = payload.spo2 > NORMAL_RANGES.spo2.max || payload.spo2 < NORMAL_RANGES.spo2.min

    return (
      <g>
        {abnormal && (
          <>
            <circle cx={cx} cy={cy} r={14} fill="#3b82f6" fillOpacity={0.15} />
            <circle cx={cx} cy={cy} r={9} fill="#3b82f6" fillOpacity={0.25} />
          </>
        )}

        <circle
          cx={cx}
          cy={cy}
          r={abnormal ? 6 : 4}
          fill={abnormal ? '#1d4ed8' : '#60a5fa'}
          stroke={abnormal ? '#fff' : 'none'}
          strokeWidth={2}
        />
      </g>
    )
  }

  if (props.dataKey === 'respiratoryRate') {
    const abnormal =
      payload.respiratoryRate > NORMAL_RANGES.respiratoryRate.max ||
      payload.respiratoryRate < NORMAL_RANGES.respiratoryRate.min

    return (
      <g>
        {abnormal && (
          <>
            <circle cx={cx} cy={cy} r={14} fill="#10b981" fillOpacity={0.15} />
            <circle cx={cx} cy={cy} r={9} fill="#10b981" fillOpacity={0.25} />
          </>
        )}
        <circle
          cx={cx}
          cy={cy}
          r={abnormal ? 6 : 4}
          fill={abnormal ? '#059669' : '#34d399'}
          stroke={abnormal ? '#fff' : 'none'}
          strokeWidth={2}
        />
      </g>
    )
  }

  return null
}

const CustomTempActiveDot = (props: any) => {
  const { cx, cy, payload } = props
  const abnormal =
    payload.temperature > NORMAL_RANGES.temperature.max ||
    payload.temperature < NORMAL_RANGES.temperature.min
  return <circle cx={cx} cy={cy} r={7} fill={abnormal ? '#ef4444' : '#f97316'} />
}

const DRUG_FORMS: SelectOption[] = [
  { value: 'таблетки', label: 'Таблетки' },
  { value: 'капсулы', label: 'Капсулы' },
  { value: 'раствор', label: 'Раствор для инъекций' },
  { value: 'аэрозоль', label: 'Аэрозоль (ингалятор)' },
  { value: 'мазь', label: 'Мазь' },
  { value: 'гель', label: 'Гель' },
  { value: 'спрей', label: 'Спрей' },
  { value: 'сироп', label: 'Сироп' },
  { value: 'суппозиторий', label: 'Суппозиторий' },
  { value: 'пластырь', label: 'Трансдермальный пластырь' }
]
const DRUG_ROUTES: SelectOption[] = [
  { value: 'перорально', label: 'Перорально (внутрь)' },
  { value: 'ингаляционно', label: 'Ингаляционно' },
  { value: 'внутривенно', label: 'Внутривенно (в/в)' },
  { value: 'внутримышечно', label: 'Внутримышечно (в/м)' },
  { value: 'подкожно', label: 'Подкожно (п/к)' },
  { value: 'местно', label: 'Местно (наружно)' },
  { value: 'ректально', label: 'Ректально' },
  { value: 'сублингвально', label: 'Сублингвально' }
]
const DRUG_REGIMENS: SelectOption[] = [
  { value: '1 раз в день', label: '1 раз в день' },
  { value: '2 раза в день', label: '2 раза в день' },
  { value: '3 раза в день', label: '3 раза в день' },
  { value: '4 раза в день', label: '4 раза в день' },
  { value: 'утром', label: 'Утром' },
  { value: 'вечером', label: 'Вечером' },
  { value: 'натощак', label: 'Натощак' },
  { value: 'после еды', label: 'После еды' },
  { value: 'по необходимости', label: 'По необходимости' },
  { value: 'перед сном', label: 'Перед сном' }
]
const DRUG_DOSES: SelectOption[] = [
  { value: '5 мг', label: '5 мг' },
  { value: '10 мг', label: '10 мг' },
  { value: '25 мг', label: '25 мг' },
  { value: '50 мг', label: '50 мг' },
  { value: '100 мг', label: '100 мг' },
  { value: '250 мг', label: '250 мг' },
  { value: '500 мг', label: '500 мг' },
  { value: '1000 мг', label: '1000 мг' },
  { value: '100 мкг', label: '100 мкг' },
  { value: '250 мкг', label: '250 мкг' }
]
const RELATION_OPTIONS: SelectOption[] = [
  { value: 'Супруг(а)', label: 'Супруг(а)' },
  { value: 'Мать', label: 'Мать' },
  { value: 'Отец', label: 'Отец' },
  { value: 'Сын', label: 'Сын' },
  { value: 'Дочь', label: 'Дочь' },
  { value: 'Брат', label: 'Брат' },
  { value: 'Сестра', label: 'Сестра' },
  { value: 'Бабушка', label: 'Бабушка' },
  { value: 'Дедушка', label: 'Дедушка' },
  { value: 'Опекун', label: 'Опекун' },
  { value: 'Другое', label: 'Другое' }
]
const DISEASE_STATUS_OPTIONS: SelectOption[] = [
  { value: 'Активное', label: 'Активное' },
  { value: 'Хроническое', label: 'Хроническое' },
  { value: 'Вылечено', label: 'Вылечено' },
  { value: 'Ремиссия', label: 'Ремиссия' }
]
const MARITAL_STATUS_OPTIONS: SelectOption[] = [
  { value: 'Холост/Не замужем', label: 'Холост/Не замужем' },
  { value: 'Женат/Замужем', label: 'Женат/Замужем' },
  { value: 'В разводе', label: 'В разводе' },
  { value: 'Вдовец/Вдова', label: 'Вдовец/Вдова' }
]
const SEVERITY_OPTIONS: SelectOption[] = [
  { value: 'Легкая', label: 'Легкая' },
  { value: 'Умеренная', label: 'Умеренная' },
  { value: 'Тяжелая', label: 'Тяжелая' },
  { value: 'Критическая', label: 'Критическая' }
]
const VACCINE_OPTIONS: Array<{ label: string; disease: string; validity: string }> = [
  { label: 'Гриппол Плюс', disease: 'Грипп', validity: '1 год' },
  { label: 'Спутник V', disease: 'COVID-19', validity: '1 год' },
  { label: 'Пневмо-23', disease: 'Пневмококковая инфекция', validity: '5 лет' },
  { label: 'ЭнцеВир', disease: 'Клещевой энцефалит', validity: '3 года' },
  { label: 'Вакцина против гепатита B', disease: 'Гепатит B', validity: '10 лет' },
  { label: 'АДС-М', disease: 'Дифтерия, столбняк', validity: '10 лет' },
  { label: 'ЖКВ', disease: 'Корь, краснуха, паротит', validity: 'Пожизненно' },
  { label: 'Полиорикс', disease: 'Полиомиелит', validity: '10 лет' },
  { label: 'БЦЖ', disease: 'Туберкулез', validity: '7-10 лет' },
  { label: 'Другое', disease: '', validity: '' }
]
const VACCINE_SELECT_OPTIONS: SelectOption[] = VACCINE_OPTIONS.map((v) => ({
  value: v.label,
  label: v.label
}))

const getPatientRoom = (patient: any): string => {
  return patient.roomNumber ? `Палата ${patient.roomNumber}` : '—'
}

const getInitials = (firstName: string, lastName: string) => {
  return `${lastName?.[0] || ''}${firstName?.[0] || ''}`.toUpperCase()
}

const formatDateHuman = (dateStr?: string) => {
  return formatLocalDate(dateStr)
}

const formatDateHumanWithTime = (dateStr?: string) => {
  return formatLocalDateTime(dateStr)
}

const getUniqueDoctors = (patientsList: any[]): SelectOption[] => {
  const set = new Set(patientsList.map((p) => p.doctor).filter(Boolean))
  return Array.from(set)
    .sort()
    .map((d) => ({ value: d, label: d }))
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'hospitalized', label: 'Госпитализован' },
  { value: 'outpatient', label: 'Амбулаторно' },
  { value: 'discharged', label: 'Выписан' }
]
const GENDER_OPTIONS: SelectOption[] = [
  { value: 'Мужской', label: 'Мужской' },
  { value: 'Женский', label: 'Женский' }
]

interface PatientSearchPanelProps {
  onSelectPatient: (id: string) => void
  onDoubleClickPatient?: (patient: any) => void
  onAddPatientClick?: () => void
  cardRef?: React.MutableRefObject<HTMLDivElement | null>
  initialQuery?: string
}

const PatientSearchPanel: React.FC<PatientSearchPanelProps> = ({
  onSelectPatient,
  onDoubleClickPatient,
  onAddPatientClick,
  cardRef,
  initialQuery = ''
}) => {
  const { patients, loading, refreshPatients } = usePatientData()

  const [query, setQuery] = useState(initialQuery)
  const [doctor, setDoctor] = useState<SelectOption | null>(null)
  const [status, setStatus] = useState<SelectOption | null>(null)
  const [gender, setGender] = useState<SelectOption | null>(null)
  const [room, setRoom] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickCountRef = useRef<number>(0)
  const lastClickedPatientRef = useRef<string | null>(null)
  const tableWrapRef = useRef<HTMLDivElement>(null)
  const tableScrollRef = useRef<HTMLDivElement>(null)

  const updateTableScrollHint = useCallback(() => {
    const wrapEl = tableWrapRef.current
    const scrollEl = tableScrollRef.current
    if (!wrapEl || !scrollEl) return

    const isScrollable = scrollEl.scrollWidth - scrollEl.clientWidth > 4
    const isScrolledEnd =
      !isScrollable || scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 4
    const maxScroll = Math.max(scrollEl.scrollWidth - scrollEl.clientWidth, 1)
    const scrollProgress = isScrollable ? Math.min(scrollEl.scrollLeft / maxScroll, 1) : 1
    const hintOpacity = Math.pow(1 - scrollProgress, 2.4)

    wrapEl.classList.toggle('is-scrollable', isScrollable)
    wrapEl.classList.toggle('is-scrolled-end', isScrolledEnd)
    wrapEl.style.setProperty('--scroll-hint-opacity', isScrollable ? hintOpacity.toFixed(3) : '0')
  }, [])

  useEffect(() => {
    setQuery(initialQuery)
    setPage(1)
  }, [initialQuery])

  useEffect(() => {
    refreshPatients?.()
  }, [refreshPatients])

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  const doctors = useMemo(() => getUniqueDoctors(patients), [patients])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return patients.filter((p) => {
      const fullName = `${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase()
      if (
        q &&
        !fullName.includes(q) &&
        !p.id.toLowerCase().includes(q) &&
        !p.medcardNum?.toLowerCase().includes(q) &&
        !p.historyNum?.toLowerCase().includes(q)
      )
        return false
      if (doctor && p.doctor !== doctor.value) return false
      if (status && p.status?.toLowerCase() !== status.value.toLowerCase()) return false
      if (gender && p.gender !== gender.value) return false
      if (room) {
        if ((p as any).roomNumber !== room) return false
      }
      return true
    })
  }, [query, doctor, status, gender, room, patients])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  useEffect(() => {
    updateTableScrollHint()
    window.addEventListener('resize', updateTableScrollHint)

    return () => {
      window.removeEventListener('resize', updateTableScrollHint)
    }
  }, [updateTableScrollHint, paged.length, safePage])

  const resetFilters = () => {
    setQuery('')
    setDoctor(null)
    setStatus(null)
    setGender(null)
    setRoom('')
    setPage(1)
  }

  const hasFilters = query || doctor || status || gender || room

  const handlePageChange = (p: number) => {
    setPage(p)
  }

  const handleRowClick = (patientId: string) => {
    if (lastClickedPatientRef.current !== patientId) {
      clickCountRef.current = 0
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }

    lastClickedPatientRef.current = patientId
    clickCountRef.current++

    if (clickCountRef.current === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          onSelectPatient(patientId)
          setTimeout(() => {
            cardRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
        clickCountRef.current = 0
        lastClickedPatientRef.current = null
      }, 300)
    } else if (clickCountRef.current === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      const patient = patients.find((p) => p.id?.toLowerCase() === patientId?.toLowerCase())
      if (patient) {
        onDoubleClickPatient?.(patient)
      }
      clickCountRef.current = 0
      lastClickedPatientRef.current = null
    }
  }
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

  return (
    <SearchPageWrapper>
      <SearchCard>
        <SearchCardHeader>
          <SearchCardTitle>Поиск пациентов</SearchCardTitle>
          <SearchCardSubtitle>
            Найдите пациента по ФИО, номеру карты, истории болезни, врачу или палате
          </SearchCardSubtitle>
        </SearchCardHeader>

        <SearchFilterBar>
          <FilterLabel>
            <SlidersHorizontal size={13} />
            Фильтры:
          </FilterLabel>

          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                pointerEvents: 'none'
              }}
            />
            <SearchFilterInput
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="ФИО, номер карты или история болезни..."
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <Select
              inputId="doctor-filter"
              placeholder="Все врачи"
              options={doctors}
              styles={selectStyles}
              components={selectComponents}
              isClearable
              value={doctor}
              onChange={(opt) => {
                setDoctor(opt as SelectOption | null)
                setPage(1)
              }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <Select
              inputId="gender-filter"
              placeholder="Пол"
              options={GENDER_OPTIONS}
              styles={selectStyles}
              components={selectComponents}
              isClearable
              isSearchable={false}
              value={gender}
              onChange={(opt) => {
                setGender(opt as SelectOption | null)
                setPage(1)
              }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <Select
              inputId="status-filter"
              placeholder="Статус"
              options={STATUS_OPTIONS}
              styles={selectStyles}
              components={selectComponents}
              isClearable
              isSearchable={false}
              value={status}
              onChange={(opt) => {
                setStatus(opt as SelectOption | null)
                setPage(1)
              }}
            />
          </div>

          <SearchResetBtn onClick={resetFilters} disabled={!hasFilters as any}>
            <RotateCcw size={13} />
            Сбросить
          </SearchResetBtn>

          {onAddPatientClick && (
            <SearchAddBtn onClick={onAddPatientClick} type="button">
              <Plus size={13} />
              Добавить
            </SearchAddBtn>
          )}
        </SearchFilterBar>

        {filtered.length > 0 && (
          <SearchResultsCount>
            Найдено: <strong>{filtered.length}</strong> пациент
            {filtered.length === 1 ? '' : filtered.length < 5 ? 'а' : 'ов'}
          </SearchResultsCount>
        )}

        <SearchTableWrap ref={tableWrapRef}>
          <SearchTableViewport ref={tableScrollRef} onScroll={updateTableScrollHint}>
            <SearchTable>
              <SearchThead>
                <tr>
                  <SearchTh>Пациент</SearchTh>
                  <SearchTh>Возраст / Пол</SearchTh>
                  <SearchTh>Лечащий врач</SearchTh>
                  <SearchTh>Палата</SearchTh>
                  <SearchTh>Статус</SearchTh>
                  <SearchTh>Номер карты</SearchTh>
                </tr>
              </SearchThead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <SearchEmptyState>
                        <Loader2 className="animate-spin" size={48} style={{ animation: 'spin 1s linear infinite' }} />
                        <p>Загрузка пациентов...</p>
                        <span>Пожалуйста, подождите</span>
                      </SearchEmptyState>
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <SearchEmptyState>
                        <Users size={48} />
                        <p>Пациенты не найдены</p>
                        <span>Попробуйте изменить параметры поиска</span>
                      </SearchEmptyState>
                    </td>
                  </tr>
                ) : (
                  paged.map((patient) => (
                    <SearchTr
                      key={patient.id}
                      onClick={() => handleRowClick(patient.id)}
                      title="Одинарный клик — открыть карту | Двойной клик — быстрый просмотр"
                    >
                      <SearchTdBold>
                        <PatientNameCell>
                          <PatientAvatar>
                            {getInitials(patient.firstName, patient.lastName)}
                          </PatientAvatar>
                          <div>
                            <div>
                              {patient.lastName} {patient.firstName}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: '#94a3b8',
                                fontWeight: 400,
                                marginTop: 2
                              }}
                            >
                              {patient.middleName}
                            </div>
                          </div>
                        </PatientNameCell>
                      </SearchTdBold>
                      <SearchTd>
                        {patient.age} {pluralize(patient.age, ['год', 'года', 'лет'])},{' '}
                        {(patient.gender as any) === 'Male' ||
                        (patient.gender as any) === '0' ||
                        (patient.gender as any) === 0 ||
                        (patient.gender as any) === 'Мужской'
                          ? 'М'
                          : (patient.gender as any) === 'Female' ||
                              (patient.gender as any) === '1' ||
                              (patient.gender as any) === 1 ||
                              (patient.gender as any) === 'Женский'
                            ? 'Ж'
                            : patient.gender}
                      </SearchTd>
                      <SearchTd>{patient.doctor}</SearchTd>
                      <SearchTdMuted>{getPatientRoom(patient)}</SearchTdMuted>
                      <SearchTd>
                        <StatusPill $status={patient.status}>{patient.statusText}</StatusPill>
                      </SearchTd>
                      <SearchTdMuted>{patient.medcardNum}</SearchTdMuted>
                    </SearchTr>
                  ))
                )}
              </tbody>
            </SearchTable>
          </SearchTableViewport>
        </SearchTableWrap>

        {totalPages >= 1 && (
          <SearchPaginationRow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SearchPaginationInfo>
                Показано {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
                {Math.min(safePage * pageSize, filtered.length)} из {filtered.length}
              </SearchPaginationInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>По</span>
                <SearchPageSizeSelect
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPage(1)
                  }}
                >
                  {[5, 8, 15, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </SearchPageSizeSelect>
              </div>
            </div>
            <SearchPaginationBtns>
              <SearchPageBtn onClick={() => handlePageChange(1)} disabled={safePage === 1}>
                <ChevronLeft size={14} />
                <ChevronLeft size={14} />
              </SearchPageBtn>
              <SearchPageBtn
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
              >
                <ChevronLeft size={14} />
              </SearchPageBtn>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p = i + 1
                if (totalPages > 5) {
                  const start = Math.max(1, Math.min(safePage - 2, totalPages - 4))
                  p = start + i
                }
                return (
                  <SearchPageBtn
                    key={p}
                    $active={p === safePage}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </SearchPageBtn>
                )
              })}
              <SearchPageBtn
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
              >
                <ChevronRight size={14} />
              </SearchPageBtn>
              <SearchPageBtn
                onClick={() => handlePageChange(totalPages)}
                disabled={safePage === totalPages}
              >
                <ChevronRight size={14} />
                <ChevronRight size={14} />
              </SearchPageBtn>
            </SearchPaginationBtns>
          </SearchPaginationRow>
        )}
      </SearchCard>
    </SearchPageWrapper>
  )
}

interface PatientCardPageProps {
  patientId?: string
  initialSearchQuery?: string
  initialTab?: string
  onSelectPatient?: (id: string) => void
  onNavigateToTemperatureSheet?: (id: string) => void
  onNavigateToWardRound?: (id: string) => void
  onNavigateToDischarge?: (id: string) => void
}

interface PatientCardProps {
  patientId?: string
  initialTab?: string
  onSelectPatientFromPreview?: (id: string) => void
  onNavigateToTemperatureSheet?: (id: string) => void
  onNavigateToWardRound?: (id: string) => void
  onNavigateToDischarge?: (id: string) => void
  onLoaded?: () => void
}

enum TabsEnum {
  Overview = 'Обзор',
  PersonalData = 'Персональные данные',
  MedicalInfo = 'Медицинская информация',
  Prescriptions = 'Назначения',
  Tests = 'Анализы',
  VitalSigns = 'Показатели',
  History = 'История',
  Vaccination = 'Вакцинация',
  Documents = 'Документы'
}

const PatientCard: React.FC<PatientCardProps> = ({
  patientId,
  initialTab,
  onSelectPatientFromPreview,
  onNavigateToTemperatureSheet,
  onNavigateToWardRound,
  onNavigateToDischarge,
  onLoaded
}) => {
  const { patients, updatePatient, deletePatient } = usePatientData()

  const [localPatient, setLocalPatient] = useState<any>(null)
  const [medicines, setMedicines] = useState<any[]>([])

  useEffect(() => {
    import('../../api/medicinesApi').then(({ fetchAllMedicines }) => {
      fetchAllMedicines().then(setMedicines).catch(console.error)
    })
  }, [])

  const [activeTab, setActiveTab] = useState<string>(initialTab || TabsEnum.Overview)
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null)

  const onLoadedRef = useRef(onLoaded)
  useEffect(() => {
    onLoadedRef.current = onLoaded
  }, [onLoaded])

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const loadPatientDetails = useCallback(() => {
    if (patientId) {
      import('../../api/patientsApi').then(({ fetchPatientCard, fetchPatientVitals }) => {
        Promise.all([fetchPatientCard(patientId), fetchPatientVitals(patientId).catch(() => [])])
          .then(([dto, vitalsData]) => {
            const sortedVitals = [...vitalsData].sort((a, b) => {
              const da = (parseBackendDateTime(a.recordedAt || a.date) || new Date(0)).getTime()
              const db = (parseBackendDateTime(b.recordedAt || b.date) || new Date(0)).getTime()
              return da - db
            })
            setLocalPatient({
              ...dto,
              doctor: dto.doctorName,
              department: dto.departmentName,
              activeProblems: dto.medicalProblems?.map((m: any) => m.name) || [],
              contacts: dto.contacts || {},
              passport: dto.passport || {},
              work: dto.work || {},
              other: dto.other || {},
              vitals: dto.vitals || {},
              vitalsHistory: sortedVitals,
              currentMeds: dto.currentMeds || [],
              history: dto.history || [],
              vaccines: dto.vaccines || [],
              operations: dto.operations || [],
              documents: dto.documents || [],
              labs: dto.labs || [],
              allergies: dto.allergies || [],
              relatives: dto.relatives || []
            })
            onLoadedRef.current?.()
          })
          .catch(console.error)
      })
    } else {
      setLocalPatient(null)
    }
  }, [patientId])

  useEffect(() => {
    loadPatientDetails()
  }, [loadPatientDetails])

  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: string; data: any }>({
    isOpen: false,
    type: '',
    data: null
  })
  const [formData, setFormData] = useState<any>({})

  const openModal = (type: string, data: any = null) => {
    setModalConfig({ isOpen: true, type, data })
    let initialData = data ? { ...data } : {}
    if (type === 'EDIT_NESTED_contacts') {
      if (!initialData.country) {
        initialData.country = 'Приднестровская Молдавская Республика'
      }
    } else if (type === 'EDIT_NESTED_other') {
      if (!initialData.language) {
        initialData.language = 'Русский'
      }
      if (!initialData.nationality) {
        initialData.nationality = 'Русский'
      }
    } else if (type === 'ADD_LIST_prescriptions') {
      const now = new Date();
      const tzOffset = now.getTimezoneOffset() * 60000;
      const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
      initialData.dateStart = localISOTime;
    }
    setFormData(initialData)
  }

  const handleBack = () => {
    if (onNavigateToTemperatureSheet) {
      window.scrollTo({
        top: 0
      })
      onNavigateToTemperatureSheet(localPatient?.id || patientId || '')
    }
  }

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', data: null })
    setFormData({})
  }

  const handleSave = async () => {
    if (!localPatient) return
    const { type, data } = modalConfig

    if (type === 'DELETE_PATIENT') {
      try {
        await deletePatient(localPatient.id)
        toast.success('Карта пациента успешно удалена')
        closeModal()
        onSelectPatientFromPreview?.('')
      } catch (err) {
        showApiError(err, 'Ошибка при удалении пациента')
      }
      return
    }

    if (type === 'EDIT_NESTED_vitals') {
      try {
        let bps: number | null = null
        let bpd: number | null = null
        if (formData.bp && typeof formData.bp === 'string') {
          const parts = formData.bp.split('/')
          if (parts.length === 2) {
            bps = parseInt(parts[0], 10) || null
            bpd = parseInt(parts[1], 10) || null
          }
        }

        const { postVitalSign } = await import('../../api/vitalSignsApi')
        await postVitalSign(localPatient.id, {
          temperature:
            formData.temp != null && formData.temp !== ''
              ? parseFloat(String(formData.temp).replace(',', '.'))
              : null,
          bloodPressureSystolic: bps,
          bloodPressureDiastolic: bpd,
          pulse:
            formData.hr != null && formData.hr !== '' ? parseInt(String(formData.hr), 10) : null,
          spO2:
            formData.spo2 != null && formData.spo2 !== ''
              ? parseInt(String(formData.spo2), 10)
              : null,
          respiratoryRate:
            formData.resp != null && formData.resp !== ''
              ? parseInt(String(formData.resp), 10)
              : null
        })

        toast.success('Показатели успешно внесены в историю')
        closeModal()
        loadPatientDetails()
      } catch (err) {
        showApiError(err, 'Ошибка при сохранении показателей')
      }
      return
    }

    let updatedData = { ...localPatient }

    if (type === 'EDIT_BASIC') {
      Object.assign(updatedData, formData)
      if (formData.status) {
        const foundOption = STATUS_OPTIONS.find((o) => o.value === formData.status)
        if (foundOption) {
          updatedData.statusText = foundOption.label
        }
      }
    } else if (type.startsWith('EDIT_NESTED_')) {
      const section = type.replace('EDIT_NESTED_', '')
      updatedData[section] = { ...(updatedData[section] || {}), ...formData }
    } else if (type.startsWith('ADD_LIST_')) {
      const listName = type.replace('ADD_LIST_', '')
      updatedData[listName] = [...(updatedData[listName] || []), formData]
    } else if (type.startsWith('EDIT_LIST_')) {
      const listName = type.replace('EDIT_LIST_', '')
      updatedData[listName] = [...updatedData[listName]]
      updatedData[listName][data.index] = formData
    } else if (type.startsWith('DELETE_LIST_')) {
      const listName = type.replace('DELETE_LIST_', '')
      updatedData[listName] = updatedData[listName].filter((_: any, i: number) => i !== data.index)
    } else if (type.startsWith('ADD_STR_')) {
      const listName = type.replace('ADD_STR_', '')
      updatedData[listName] = [...(updatedData[listName] || []), formData.value]
    }

    if (updatedData.prescriptions) {
      updatedData.prescriptions = updatedData.prescriptions.map((p: any) => ({
        ...p,
        doctorName: p.doctorName || p.doctor,
        dateStart: toBackendDateTimeString(p.dateStart) || null,
        dateEnd: toBackendDateString(p.dateEnd) || null
      }))
    }
    if (updatedData.labs) {
      updatedData.labs = updatedData.labs.map((l: any) => ({
        ...l,
        doctorName: l.doctorName || l.doctor
      }))
    }

    try {
      updatedData.lastUpdated = toBackendDateTimeString(new Date())
      await updatePatient(localPatient.id, updatedData)
      loadPatientDetails()
      toast.success('Данные пациента успешно сохранены')
      closeModal()
    } catch (err) {
      showApiError(err, 'Ошибка при сохранении изменений')
    }
  }

  const handleQuickAction = (actionType: string, data?: any) => {
    if (!localPatient) return
    let updatedData = { ...localPatient }
    if (actionType === 'ADD_MED_FROM_PRESCRIPTION') {
      const newMed = { name: data.drug, dose: data.dose, form: data.form, regimen: data.regimen }
      updatedData.currentMeds = [...(updatedData.currentMeds || []), newMed]
    }
    setLocalPatient(updatedData)
  }

  const [docFile, setDocFile] = useState<File | null>(null)
  const [docDragOver, setDocDragOver] = useState(false)
  const [docUploading, setDocUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDocumentUpload = async (file: File) => {
    setDocFile(file)
    setDocUploading(true)
    try {
      const result = await uploadFile(file)
      setFormData((p: any) => ({
        ...p,
        name: file.name,
        date: toBackendDateString(new Date()),
        filePath: result.objectName,
        url: `${process.env.REACT_APP_API_URL ?? ''}${result.url}`
      }))
      toast.success('Файл успешно загружен в хранилище')
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при загрузке файла')
      setDocFile(null)
    } finally {
      setDocUploading(false)
    }
  }

  const handleDocDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDocDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type === 'application/pdf') {
      handleDocumentUpload(f)
    }
  }

  const DOCTOR_OPTIONS = useMemo(() => {
    const docs = new Set<string>()
    patients.forEach((p) => {
      if (p.doctor) docs.add(p.doctor)
      p.history?.forEach((h) => {
        if (h.doctor) docs.add(h.doctor)
      })
    })
    return Array.from(docs).map((d) => ({ value: d, label: d }))
  }, [patients])

  const SELECT_FIELDS: Record<string, { options: SelectOption[]; placeholder: string }> = {
    form: { options: DRUG_FORMS, placeholder: 'Форма выпуска...' },
    route: { options: DRUG_ROUTES, placeholder: 'Путь введения...' },
    regimen: { options: DRUG_REGIMENS, placeholder: 'Режим приема...' },
    dose: { options: DRUG_DOSES, placeholder: 'Дозировка...' },
    relation: { options: RELATION_OPTIONS, placeholder: 'Кем приходится...' },
    diseaseStatus: { options: DISEASE_STATUS_OPTIONS, placeholder: 'Статус заболевания...' },
    severity: { options: SEVERITY_OPTIONS, placeholder: 'Степень тяжести...' },
    gender: { options: GENDER_OPTIONS, placeholder: 'Пол...' },
    maritalStatus: { options: MARITAL_STATUS_OPTIONS, placeholder: 'Семейное положение...' },
    status: { options: STATUS_OPTIONS, placeholder: 'Статус...' },
    doctor: { options: DOCTOR_OPTIONS, placeholder: 'Выберите врача...' }
  }

  const phoneSchema = z.string().superRefine((val, ctx) => {
    const digits = val.replace(/\D/g, '')
    if (!val || digits.length === 0) return
    if (digits.length < 6 || digits.length > 18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Номер должен содержать от 6 до 18 цифр'
      })
    }
  })

  const [phoneErrors, setPhoneErrors] = useState<Record<string, string>>({})

  const validatePhoneWithZod = (fieldName: string, val: string) => {
    const result = phoneSchema.safeParse(val)
    if (!result.success) {
      setPhoneErrors((p) => ({
        ...p,
        [fieldName]: result.error.issues[0]?.message || 'Ошибка валидации'
      }))
    } else {
      setPhoneErrors((p) => ({ ...p, [fieldName]: '' }))
    }
  }

  const PHONE_FIELDS = new Set(['phone', 'phoneMobile', 'phoneHome'])
  const EMAIL_FIELDS = new Set(['email'])
  const TEXTAREA_FIELDS = new Set([
    'description',
    'complications',
    'objective',
    'causeOfDeath',
    'recommendations',
    'complaints',
    'conclusion'
  ])

  const FIELD_LABELS: Record<string, string> = {
    name: 'Название',
    drug: 'Препарат',
    dose: 'Дозировка',
    form: 'Форма выпуска',
    route: 'Путь введения',
    regimen: 'Режим приема',
    doctor: 'Врач',
    comment: 'Комментарий',
    dateStart: 'Дата начала',
    dateEnd: 'Дата окончания',
    date: 'Дата',
    type: 'Тип анализа',
    reason: 'Причина анализа',
    statusText: 'Статус',
    reaction: 'Реакция',
    relation: 'Кем приходится',
    phone: 'Телефон',
    phoneMobile: 'Мобильный телефон',
    phoneHome: 'Домашний телефон',
    email: 'Email',
    country: 'Страна',
    region: 'Область/Регион',
    city: 'Город',
    address: 'Адрес',
    zip: 'Индекс',
    language: 'Язык',
    nationality: 'Национальность',
    dateOfDeath: 'Дата смерти',
    causeOfDeath: 'Причина смерти',
    profession: 'Профессия',
    organization: 'Организация',
    lastName: 'Фамилия',
    firstName: 'Имя',
    middleName: 'Отчество',
    dateOfBirth: 'Дата рождения',
    gender: 'Пол',
    maritalStatus: 'Семейное положение',
    seriesNumber: 'Серия и номер',
    issuedBy: 'Кем выдан',
    dateIssued: 'Дата выдачи',
    diagnosis: 'Диагноз',
    description: 'Описание операции',
    implants: 'Импланты / протезы',
    result: 'Результат',
    complications: 'Осложнения',
    diagnosisDate: 'Дата постановки диагноза',
    diseaseStatus: 'Статус заболевания',
    severity: 'Степень тяжести',
    disease: 'От чего защищает',
    validity: 'Срок действия',
    manufacturer: 'Производитель',
    series: 'Серия',
    temp: 'Температура (°C)',
    bp: 'АД (мм рт. ст.)',
    hr: 'ЧСС (уд/мин)',
    resp: 'Частота дыхания (д/мин)',
    spo2: 'SpO2 (%)',
    complaints: 'Жалобы',
    objective: 'Объективные данные',
    conclusion: 'Заключение',
    recommendations: 'Назначения / Рекомендации',
    dateTime: 'Дата и время',
    category: 'Тип записи'
  }

  type ModalField = {
    name: string
    label: string
    type?: string
    options?: string[]
    optional?: boolean
    min?: number
    max?: number
    step?: number
  }
  const modalDefs: Record<string, { title: string; fields?: ModalField[]; text?: string }> = {
    DELETE_PATIENT: {
      title: 'Удалить карту пациента',
      text: 'Вы действительно хотите удалить медицинскую карту этого пациента? Все связанные с ним данные будут полностью удалены.'
    },
    EDIT_BASIC: {
      title: 'Основные данные',
      fields: [
        { name: 'lastName', label: 'Фамилия' },
        { name: 'firstName', label: 'Имя' },
        { name: 'middleName', label: 'Отчество' },
        { name: 'dateOfBirth', label: 'Дата рождения', type: 'date' },
        { name: 'gender', label: 'Пол', type: 'select', options: ['Мужской', 'Женский'] },
        {
          name: 'maritalStatus',
          label: 'Семейное положение',
          type: 'select',
          options: ['Холост/Не замужем', 'Женат/Замужем', 'В разводе', 'Вдовец/Вдова']
        },
      ]
    },
    EDIT_NESTED_passport: {
      title: 'Паспорт',
      fields: [
        { name: 'seriesNumber', label: 'Серия и номер' },
        { name: 'issuedBy', label: 'Кем выдан' },
        { name: 'dateIssued', label: 'Дата выдачи', type: 'date' }
      ]
    },
    EDIT_NESTED_contacts: {
      title: 'Контакты',
      fields: [
        { name: 'country', label: 'Страна' },
        { name: 'region', label: 'Область/Регион' },
        { name: 'city', label: 'Город' },
        { name: 'address', label: 'Адрес' },
        { name: 'zip', label: 'Индекс' },
        { name: 'phoneMobile', label: 'Мобильный телефон' },
        { name: 'phoneHome', label: 'Домашний телефон' },
        { name: 'email', label: 'Email' }
      ]
    },
    EDIT_NESTED_other: {
      title: 'Прочее',
      fields: [
        { name: 'language', label: 'Язык' },
        { name: 'nationality', label: 'Национальность' },
        { name: 'dateOfDeath', label: 'Дата смерти', type: 'date' },
        { name: 'causeOfDeath', label: 'Причина смерти' }
      ]
    },
    EDIT_NESTED_work: {
      title: 'Место работы',
      fields: [
        { name: 'profession', label: 'Профессия' },
        { name: 'organization', label: 'Организация' },
        { name: 'address', label: 'Адрес работы' }
      ]
    },
    EDIT_NESTED_vitals: {
      title: 'Внести показатели',
      fields: [
        {
          name: 'temp',
          label: 'Температура (°C)',
          type: 'number',
          min: 35.0,
          max: 42.0,
          step: 0.1
        },
        { name: 'bp', label: 'АД (мм рт. ст.)', type: 'text' },
        { name: 'hr', label: 'ЧСС (уд/мин)', type: 'number', min: 40, max: 200, step: 1 },
        { name: 'resp', label: 'Частота дыхания', type: 'number', min: 10, max: 40, step: 1 },
        { name: 'spo2', label: 'SpO2 (%)', type: 'number', min: 70, max: 100, step: 1 }
      ]
    },
    ADD_LIST_relatives: {
      title: 'Добавить родственника',
      fields: [
        { name: 'name', label: 'ФИО' },
        { name: 'relation', label: 'Кем приходится' },
        { name: 'phone', label: 'Телефон' }
      ]
    },
    EDIT_LIST_relatives: {
      title: 'Редактировать родственника',
      fields: [
        { name: 'name', label: 'ФИО' },
        { name: 'relation', label: 'Кем приходится' },
        { name: 'phone', label: 'Телефон' }
      ]
    },
    DELETE_LIST_relatives: { title: 'Удалить родственника', text: 'Удалить эту запись?' },
    ADD_LIST_allergies: {
      title: 'Добавить аллергию',
      fields: [
        {
          name: 'name',
          label: 'Вещество',
          type: 'select',
          options: [
            'Пенициллин',
            'Ампициллин',
            'Цефалоспорины',
            'Лидокаин',
            'Новокаин',
            'Йод',
            'Пыльца',
            'Домашняя пыль',
            'Шерсть животных',
            'Арахис',
            'Цитрусовые',
            'Латекс',
            'Другое'
          ]
        },
        {
          name: 'reaction',
          label: 'Реакция',
          type: 'select',
          options: ['Крапивница', 'Анафилактический шок', 'Зуд', 'Отек Квинке', 'Сыпь', 'Другое']
        },
        { name: 'date', label: 'Дата', type: 'date' },
        { name: 'comment', label: 'Комментарий', type: 'textarea' }
      ]
    },
    EDIT_LIST_allergies: {
      title: 'Редактировать аллергию',
      fields: [
        {
          name: 'name',
          label: 'Вещество',
          type: 'select',
          options: [
            'Пенициллин',
            'Ампициллин',
            'Цефалоспорины',
            'Лидокаин',
            'Новокаин',
            'Йод',
            'Пыльца',
            'Домашняя пыль',
            'Шерсть животных',
            'Арахис',
            'Цитрусовые',
            'Латекс',
            'Другое'
          ]
        },
        {
          name: 'reaction',
          label: 'Реакция',
          type: 'select',
          options: ['Крапивница', 'Анафилактический шок', 'Зуд', 'Отек Квинке', 'Сыпь', 'Другое']
        },
        { name: 'date', label: 'Дата', type: 'date' },
        { name: 'comment', label: 'Комментарий', type: 'textarea' }
      ]
    },
    DELETE_LIST_allergies: { title: 'Удалить аллергию', text: 'Удалить эту запись?' },
    ADD_LIST_currentMeds: {
      title: 'Добавить лекарство',
      fields: [
        { name: 'name', label: 'Препарат' },
        { name: 'dose', label: 'Дозировка' },
        { name: 'form', label: 'Форма выпуска' },
        { name: 'regimen', label: 'Режим приема' }
      ]
    },
    EDIT_LIST_currentMeds: {
      title: 'Редактировать лекарство',
      fields: [
        { name: 'name', label: 'Препарат' },
        { name: 'dose', label: 'Дозировка' },
        { name: 'form', label: 'Форма выпуска' },
        { name: 'regimen', label: 'Режим приема' }
      ]
    },
    DELETE_LIST_currentMeds: { title: 'Удалить лекарство', text: 'Удалить эту запись?' },
    ADD_LIST_operations: {
      title: 'Добавить операцию',
      fields: [
        { name: 'name', label: 'Название операции' },
        { name: 'date', label: 'Дата операции', type: 'date' },
        { name: 'diagnosis', label: 'Диагноз' },
        { name: 'description', label: 'Описание операции' },
        { name: 'complications', label: 'Осложнения' },
        { name: 'implants', label: 'Импланты / протезы' },
        { name: 'result', label: 'Результат' }
      ]
    },
    EDIT_LIST_operations: {
      title: 'Редактировать операцию',
      fields: [
        { name: 'name', label: 'Название операции' },
        { name: 'date', label: 'Дата операции', type: 'date' },
        { name: 'diagnosis', label: 'Диагноз' },
        { name: 'description', label: 'Описание операции' },
        { name: 'complications', label: 'Осложнения' },
        { name: 'implants', label: 'Импланты / протезы' },
        { name: 'result', label: 'Результат' }
      ]
    },
    DELETE_LIST_operations: { title: 'Удалить операцию', text: 'Удалить эту запись?' },
    ADD_LIST_medicalProblems: {
      title: 'Добавить заболевание',
      fields: [
        { name: 'name', label: 'Название заболевания' },
        { name: 'diagnosisDate', label: 'Дата постановки диагноза', type: 'date' },
        { name: 'diseaseStatus', label: 'Статус заболевания' },
        { name: 'severity', label: 'Степень тяжести' },
        { name: 'description', label: 'Описание / особенности течения' },
        { name: 'complications', label: 'Осложнения' }
      ]
    },
    EDIT_LIST_medicalProblems: {
      title: 'Редактировать заболевание',
      fields: [
        { name: 'name', label: 'Название заболевания' },
        { name: 'diagnosisDate', label: 'Дата постановки диагноза', type: 'date' },
        { name: 'diseaseStatus', label: 'Статус заболевания' },
        { name: 'severity', label: 'Степень тяжести' },
        { name: 'description', label: 'Описание / особенности течения' },
        { name: 'complications', label: 'Осложнения' }
      ]
    },
    DELETE_LIST_medicalProblems: { title: 'Удалить заболевание', text: 'Удалить эту запись?' },
    ADD_LIST_prescriptions: {
      title: 'Новое назначение',
      fields: [
        { name: 'drug', label: 'Препарат' },
        { name: 'dose', label: 'Дозировка' },
        { name: 'form', label: 'Форма выпуска' },
        { name: 'route', label: 'Путь введения' },
        { name: 'regimen', label: 'Режим приема' },
        { name: 'dateStart', label: 'Дата начала', type: 'datetime-local' },
        { name: 'dateEnd', label: 'Дата окончания', type: 'date' },
        { name: 'doctor', label: 'Врач' },
        { name: 'comment', label: 'Комментарий' }
      ]
    },
    EDIT_LIST_prescriptions: {
      title: 'Редактировать назначение',
      fields: [
        { name: 'drug', label: 'Препарат' },
        { name: 'dose', label: 'Дозировка' },
        { name: 'form', label: 'Форма выпуска' },
        { name: 'route', label: 'Путь введения' },
        { name: 'regimen', label: 'Режим приема' },
        { name: 'dateStart', label: 'Дата начала', type: 'datetime-local' },
        { name: 'dateEnd', label: 'Дата окончания', type: 'date' },
        { name: 'doctor', label: 'Врач' },
        { name: 'comment', label: 'Комментарий' }
      ]
    },
    DELETE_LIST_prescriptions: { title: 'Удалить назначение', text: 'Удалить это назначение?' },
    ADD_LIST_labs: {
      title: 'Назначить анализ',
      fields: [
        { name: 'type', label: 'Тип анализа' },
        { name: 'reason', label: 'Причина анализа' },
        { name: 'date', label: 'Дата', type: 'date' },
        { name: 'doctor', label: 'Врач' }
      ]
    },
    ADD_LIST_vaccines: {
      title: 'Внести вакцину',
      fields: [
        { name: 'name', label: 'Вакцина' },
        { name: 'disease', label: 'От чего' },
        { name: 'date', label: 'Дата вакцинации', type: 'date' },
        { name: 'validity', label: 'Срок действия' },
        { name: 'manufacturer', label: 'Производитель' },
        { name: 'series', label: 'Серия' }
      ]
    },
    ADD_LIST_documents: {
      title: 'Загрузить документ',
      fields: [
        { name: 'name', label: 'Название документа' },
        { name: 'date', label: 'Дата', type: 'date' }
      ]
    }
  }

  const renderField = (f: ModalField) => {
    const parseDose = (str: string) => {
      if (!str) return { num: '', unit: '' }
      const match = str.trim().match(/^([\d.,]+)\s*(.*)$/)
      if (match) {
        return { num: match[1], unit: match[2] || '' }
      }
      return { num: str, unit: '' }
    }
    const isOptional = f.optional || f.name === 'causeOfDeath'
    const labelText = f.label || FIELD_LABELS[f.name] || f.name
    const labelNode = (
      <Label>
        {labelText}
        {isOptional && (
          <span
            style={{
              fontStyle: 'italic',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 'normal',
              marginLeft: '6px'
            }}
          >
            (необязательно)
          </span>
        )}
      </Label>
    )

    let val = formData[f.name] || ''
    if (f.type === 'date' && val && typeof val === 'string') {
      val = val.substring(0, 10)
    } else if (f.type === 'datetime-local' && val) {
      val = toLocalDateTimeLocalString(val)
    }

    if (f.name === 'name' && modalConfig.type.includes('vaccine')) {
      return (
        <FormGroup key={f.name}>
          {labelNode}
          <CreatableSelect
            options={VACCINE_SELECT_OPTIONS}
            styles={selectStyles}
            components={selectComponents}
            placeholder="Выберите вакцину..."
            isClearable
            formatCreateLabel={(v) => `Ввести вручную: "${v}"`}
            value={formData[f.name] ? { value: formData[f.name], label: formData[f.name] } : null}
            onChange={(opt: any) => {
              const found = VACCINE_OPTIONS.find((v) => v.label === opt?.value)
              setFormData((p: any) => ({
                ...p,
                name: opt?.value || '',
                disease: found?.disease || p.disease,
                validity: found?.validity || p.validity
              }))
            }}
          />
        </FormGroup>
      )
    }

    if (f.name === 'drug' && (modalConfig.type === 'ADD_LIST_prescriptions' || modalConfig.type === 'EDIT_LIST_prescriptions')) {
      const opts = medicines.map((m) => ({ value: m.id, label: m.name, unit: m.unit }))
      const selectValue = opts.find((o) => o.label === formData.drug || o.value === formData.medicineId) || null
      return (
        <FormGroup key={f.name}>
          {labelNode}
          <Select
            options={opts}
            styles={selectStyles}
            components={selectComponents}
            placeholder="Выберите препарат..."
            value={selectValue}
            onChange={(opt: any) => {
              setFormData((p: any) => {
                const parsed = parseDose(p.dose || '')
                const newUnit = opt ? opt.unit : ''
                const newDose = parsed.num ? `${parsed.num} ${newUnit}`.trim() : ''
                return {
                  ...p,
                  drug: opt ? opt.label : '',
                  medicineId: opt ? opt.value : '',
                  form: newUnit,
                  dose: newDose
                }
              })
            }}
          />
        </FormGroup>
      )
    }

    if (f.name === 'dose' && (modalConfig.type === 'ADD_LIST_prescriptions' || modalConfig.type === 'EDIT_LIST_prescriptions')) {
      const parsed = parseDose(formData.dose || '')
      const currentUnit = formData.form || parsed.unit || ''
      return (
        <FormGroup key={f.name}>
          {labelNode}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <CustomInput
                type="number"
                step="0.1"
                min="0"
                placeholder="Введите дозировку (число)..."
                value={parsed.num}
                onChange={(e) => {
                  const num = e.target.value
                  setFormData((p: any) => ({
                    ...p,
                    dose: currentUnit ? `${num} ${currentUnit}`.trim() : num
                  }))
                }}
              />
            </div>
            {currentUnit && (
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {currentUnit}
              </span>
            )}
          </div>
        </FormGroup>
      )
    }

    if (f.name === 'form' && (modalConfig.type === 'ADD_LIST_prescriptions' || modalConfig.type === 'EDIT_LIST_prescriptions')) {
      return (
        <FormGroup key={f.name}>
          {labelNode}
          <CustomInput
            value={formData[f.name] || ''}
            disabled
            placeholder="Определяется автоматически..."
          />
        </FormGroup>
      )
    }

    if (f.type === 'select' || f.options || SELECT_FIELDS[f.name]) {
      const sel = SELECT_FIELDS[f.name]
      const opts = f.options ? f.options.map((o) => ({ value: o, label: o })) : sel?.options || []
      const currentVal = formData[f.name]
      const selectValue =
        opts.find((o: any) => o.value === currentVal) ||
        (currentVal ? { value: currentVal, label: currentVal } : null)
      return (
        <FormGroup key={f.name}>
          {labelNode}
          <CreatableSelect
            options={opts}
            styles={selectStyles}
            components={selectComponents}
            placeholder={sel?.placeholder || `Выберите или введите ${labelText.toLowerCase()}...`}
            isClearable
            formatCreateLabel={(inputValue) => `Ввести вручную: "${inputValue}"`}
            value={selectValue}
            onChange={(opt: any) => setFormData((p: any) => ({ ...p, [f.name]: opt?.value || '' }))}
          />
        </FormGroup>
      )
    }

    if (PHONE_FIELDS.has(f.name)) {
      const phoneErr = phoneErrors[f.name]
      const rawVal: string = formData[f.name] || ''

      return (
        <FormGroup key={f.name}>
          {labelNode}
          <PatternFormat
            format={getPhoneFormat(rawVal)}
            mask="_"
            allowEmptyFormatting
            value={rawVal}
            onValueChange={(v) => {
              const val = v.value ? v.formattedValue : ''
              setFormData((p: any) => ({ ...p, [f.name]: val }))
              validatePhoneWithZod(f.name, val)
            }}
            customInput={Input}
            style={phoneErr ? { borderColor: '#ef4444' } : {}}
          />
          {phoneErr && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
                color: '#ef4444',
                fontSize: 12
              }}
            >
              <AlertCircle size={13} />
              {phoneErr}
            </div>
          )}
        </FormGroup>
      )
    }

    if (TEXTAREA_FIELDS.has(f.name) || f.type === 'textarea') {
      return (
        <FormGroup key={f.name}>
          {labelNode}
          <textarea
            value={formData[f.name] || ''}
            onChange={(e) => setFormData((p: any) => ({ ...p, [f.name]: e.target.value }))}
            rows={3}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </FormGroup>
      )
    }

    if (f.type === 'number') {
      const step = f.step ?? (f.name === 'temp' ? 0.1 : 1)
      const min = f.min ?? undefined
      const max = f.max ?? undefined

      const err = (() => {
         const v = formData[f.name]
         if (v === '' || v === undefined || v === null) return undefined
         const num = Number(v)
         if (isNaN(num)) return 'Введите число'
         if (min !== undefined && num < min) return `Диапазон: от ${min}`
         if (max !== undefined && num > max) return `Диапазон: до ${max}`
         return undefined
      })()

      return (
        <FormGroup key={f.name}>
          {labelNode}
          <CustomInput
            value={val}
            onChange={(e) => {
              let raw = e.target.value
              setFormData((p: any) => ({ ...p, [f.name]: raw }))
            }}
            type="number"
            step={step}
            min={min}
            max={max}
            placeholder={
              f.name === 'temp' ? '36.6' :
              f.name === 'hr' ? '80' :
              f.name === 'resp' ? '16' :
              f.name === 'spo2' ? '98' :
              `${labelText}...`
            }
            error={err}
          />
        </FormGroup>
      )
    }

    if (f.name === 'bp') {
      const [sysStr, diaStr] = val.split('/')
      const sys = parseInt(sysStr, 10) || ''
      const dia = parseInt(diaStr, 10) || ''

      const updateBp = (newSys: string | number, newDia: string | number) => {
        setFormData((p: any) => ({ ...p, [f.name]: `${newSys}/${newDia}` }))
      }

      const getBpError = (bpVal: string | number, min: number, max: number) => {
        if (bpVal === '' || bpVal === undefined || bpVal === null) return undefined
        const num = Number(bpVal)
        if (isNaN(num)) return 'Введите число'
        if (num < min) return `Диапазон: от ${min}`
        if (num > max) return `Диапазон: до ${max}`
        return undefined
      }

      const sysErr = getBpError(sys, 40, 250)
      const diaErr = getBpError(dia, 20, 150)

      return (
        <FormGroup key={f.name}>
          {labelNode}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Систолическое</span>
              <CustomInput
                value={sys}
                onChange={(e) => {
                  const raw = e.target.value
                  if (raw === '') updateBp('', dia)
                  else updateBp(raw, dia)
                }}
                type="number"
                placeholder="120"
                error={sysErr}
                step={1}
                min={40}
                max={250}
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Диастолическое</span>
              <CustomInput
                value={dia}
                onChange={(e) => {
                  const raw = e.target.value
                  if (raw === '') updateBp(sys, '')
                  else updateBp(sys, raw)
                }}
                type="number"
                placeholder="80"
                error={diaErr}
                step={1}
                min={20}
                max={150}
              />
            </div>
          </div>
        </FormGroup>
      )
    }

    return (
      <FormGroup key={f.name}>
        {labelNode}
        <Input
          value={val}
          onChange={(e) => setFormData((p: any) => ({ ...p, [f.name]: e.target.value }))}
          type={f.type || (EMAIL_FIELDS.has(f.name) ? 'email' : 'text')}
          placeholder={`${labelText}...`}
        />
      </FormGroup>
    )
  }

  const renderModal = () => {
    if (!modalConfig.isOpen) return null
    const def = modalDefs[modalConfig.type] || { title: 'Просмотр', text: 'Детали отсутствуют' }
    const isDelete = modalConfig.type.startsWith('DELETE_')
    const isView = modalConfig.type.startsWith('VIEW_')
    const isDocUpload = modalConfig.type === 'ADD_LIST_documents'
    const isDocView = modalConfig.type === 'VIEW_DOCUMENT'
    const isPatientPreview = modalConfig.type === 'PREVIEW_PATIENT'

    const VIEW_LABELS: Record<string, string> = {
      dateTime: 'Дата и время',
      type: 'Тип',
      doctor: 'Врач',
      doctorName: 'Имя врача',
      conclusion: 'Заключение',
      complaints: 'Жалобы',
      objective: 'Объективные данные',
      recommendations: 'Рекомендации',
      date: 'Дата',
      name: 'Название',
      statusText: 'Статус',
      lab: 'Лаборатория',
      reason: 'Причина',
      disease: 'От чего',
      validity: 'Срок',
      manufacturer: 'Производитель',
      series: 'Серия',
      url: 'Файл',
      laboratoryEmployeeName: 'Лаборант',
      resultData: 'Результат',
      comments: 'Комментарий'
    }

    return createPortal(
      <ModalOverlay onClick={closeModal}>
        <ModalContent
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: isPatientPreview
              ? 640
              : isDocView || (modalConfig.type === 'VIEW_LAB' && modalConfig.data?.pdfDocumentPath)
                ? 900
                : 520
          }}
        >
          <ModalHeader>
            <h2>{def.title || (isPatientPreview ? 'Быстрый просмотр' : 'Просмотр')}</h2>
            <CloseButton onClick={closeModal}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            {isPatientPreview &&
              modalConfig.data &&
              (() => {
                const p = modalConfig.data
                return (
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg,#dbeafe,#ede9fe)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          fontWeight: 800,
                          color: '#2563eb'
                        }}
                      >
                        {getInitials(p.firstName, p.lastName)}
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                          {p.lastName} {p.firstName} {p.middleName}
                        </div>
                        <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                          {formatDateHuman(p.dateOfBirth)} · {p.age} лет · {p.gender}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: 10
                      }}
                    >
                      {[
                        ['Медкарта', p.medcardNum],
                        ['История болезни', p.historyNum || '—'],
                        ['Врач', p.doctor],
                        ['Палата', getPatientRoom(p)],
                        ['Статус', p.statusText],
                        ['Диагноз', p.activeProblems?.[0] || '—']
                      ].map(([l, v]) => (
                        <div
                          key={l}
                          style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: '#94a3b8',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              marginBottom: 4
                            }}
                          >
                            {l}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            {isDelete && <p style={{ fontSize: 15, color: '#334155' }}>{def.text}</p>}
            {isView && !isPatientPreview && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: "column",
                  gap: 16
                }}
              >
                <div
                  style={{
                    flex:
                      modalConfig.type === 'VIEW_LAB' && modalConfig.data?.pdfDocumentPath
                        ? '1 1 350px'
                        : 'none',
                    display: 'grid',
                    gap: 12
                  }}
                >
                  {Object.entries(modalConfig.data || {})
                    .filter(([k, v]) => {
                      const lowerKey = k.toLowerCase()
                      return (
                        lowerKey !== 'id' &&
                        lowerKey !== 'filepath' &&
                        lowerKey !== 'url' &&
                        lowerKey !== 'patientid' &&
                        lowerKey !== 'index' &&
                        lowerKey !== 'formdata' &&
                        !lowerKey.endsWith('id') &&
                        !lowerKey.includes('path') &&
                        !lowerKey.includes('created') &&
                        !lowerKey.includes('updated') &&
                        v !== null &&
                        v !== undefined &&
                        v !== ''
                      )
                    })
                    .map(([k, v]) => {
                      let displayValue = String(v)
                      const lowerKey = k.toLowerCase()
                      if (
                        lowerKey === 'date' ||
                        lowerKey === 'datetime' ||
                        lowerKey.includes('date') ||
                        lowerKey.includes('time')
                      ) {
                        const strVal = String(v)
                        if (
                          strVal.includes('T') &&
                          !strVal.endsWith('T00:00:00') &&
                          !strVal.endsWith('T00:00:00.000')
                        ) {
                          displayValue = formatDateHumanWithTime(strVal)
                        } else {
                          displayValue = formatDateHuman(strVal)
                        }
                      }
                      return (
                        <div
                          key={k}
                          style={{
                            display: 'flex',
                            gap: 8,
                            padding: '8px 12px',
                            background: '#f8fafc',
                            borderRadius: 8
                          }}
                        >
                          <strong style={{ color: '#475569', minWidth: 120 }}>
                            {VIEW_LABELS[k] || FIELD_LABELS[k] || k}:
                          </strong>
                          <span>{displayValue}</span>
                        </div>
                      )
                    })}
                </div>
                {modalConfig.type === 'VIEW_LAB' && modalConfig.data?.pdfDocumentPath && (
                  <div
                    style={{
                      flex: '1 1 500px',
                      borderLeft: '1px solid #e2e8f0',
                      paddingLeft: 16
                    }}
                  >
                    <iframe
                      src={`${process.env.REACT_APP_API_URL ?? ''}/api/files/download/${encodeURIComponent(modalConfig.data.pdfDocumentPath)}`}
                      title="Результат анализа"
                      style={{ width: '100%', height: 500, border: 'none', borderRadius: 8 }}
                    />
                  </div>
                )}
              </div>
            )}
            {isDocView && modalConfig.data?.url && (
              <iframe
                src={modalConfig.data.url}
                title="Документ"
                style={{ width: '100%', height: 600, border: 'none', borderRadius: 8 }}
              />
            )}
            {isDocUpload && (
              <>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDocDragOver(true)
                  }}
                  onDragLeave={() => setDocDragOver(false)}
                  onDrop={handleDocDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${docDragOver ? '#2563eb' : '#cbd5e1'}`,
                    borderRadius: 16,
                    padding: 32,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: docDragOver ? '#eff6ff' : '#f8fafc',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Upload size={32} style={{ color: '#94a3b8', marginBottom: 8 }} />
                  <div style={{ fontWeight: 600, color: '#374151' }}>
                    {docUploading
                      ? 'Загрузка файла в хранилище...'
                      : docFile
                        ? docFile.name
                        : 'Перетащите PDF сюда или нажмите для выбора'}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    Только PDF файлы
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) {
                        handleDocumentUpload(f)
                      }
                    }}
                  />
                </div>
                {def.fields?.map((f) => renderField(f))}
              </>
            )}
            {!isDelete &&
              !isView &&
              !isDocUpload &&
              !isPatientPreview &&
              def.fields?.map((f) => renderField(f))}
          </ModalBody>
          <ModalFooter>
            <ActionButton $variant="ghost" onClick={closeModal}>
              Закрыть
            </ActionButton>
            {!isView && !isPatientPreview && (
              <ActionButton
                $variant={isDelete ? 'danger' : 'primary'}
                onClick={handleSave}
                disabled={docUploading}
              >
                {isDelete ? 'Удалить' : 'Сохранить'}
              </ActionButton>
            )}
            {isPatientPreview && (
              <ActionButton
                $variant="primary"
                onClick={() => {
                  closeModal()
                  if (modalConfig.data?.id) onSelectPatientFromPreview?.(modalConfig.data.id)
                }}
              >
                Открыть карту
              </ActionButton>
            )}
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>,
      document.body
    )
  }

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
  const getStatusColor = (statusText?: string) => {
    if (!statusText) return { bg: '#f1f5f9', text: '#475569' }
    const text = statusText.toLowerCase()
    if (text.includes('зелен') || text.includes('зелен') || text.includes('норма'))
      return { bg: '#dcfce7', text: '#166534' }
    if (text.includes('желт') || text.includes('желт') || text.includes('вниман'))
      return { bg: '#fef08a', text: '#854d0e' }
    if (text.includes('красн') || text.includes('критич')) return { bg: '#fee2e2', text: '#991b1b' }
    return { bg: '#f1f5f9', text: '#475569' }
  }

  const renderTabContent = () => {
    if (!localPatient) return null

    switch (activeTab) {
      case 'Обзор':
        return (
          <GridRow $cols={3}>
            <SectionCard>
              <h3>Основная информация</h3>
              <InfoItem>
                <span className="label">ФИО</span>
                <span className="value">
                  {localPatient.lastName} {localPatient.firstName} {localPatient.middleName}
                </span>
              </InfoItem>
              <InfoItem style={{ marginTop: 8 }}>
                <span className="label">Возраст / Пол</span>
                <span className="value">
                  {localPatient.age} {pluralize(localPatient.age, ['год', 'года', 'лет'])},{' '}
                  {localPatient.gender}
                </span>
              </InfoItem>
              <InfoItem style={{ marginTop: 8 }}>
                <span className="label">Контакты</span>
                <span className="value">{localPatient.contacts?.phone || 'Не указано'}</span>
              </InfoItem>
            </SectionCard>
            <SectionCard>
              <h3>Активные проблемы</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#1e293b' }}>
                {localPatient.activeProblems?.map((prob: string, i: number) => (
                  <li key={i}>{i + 1}. {prob}</li>
                )) || <span style={{ color: '#94a3b8' }}>Нет активных проблем</span>}
              </ul>
            </SectionCard>
            <SectionCard>
              <h3>Активные назначения</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#1e293b' }}>
                {localPatient.prescriptions?.slice(0, 3).map((pr: any, i: number) => (
                  <li key={i}>
                    <strong>{pr.drug}</strong> — {pr.dose} ({pr.regimen})
                  </li>
                )) || <span style={{ color: '#94a3b8' }}>Нет активных назначений</span>}
              </ul>
            </SectionCard>
            <SectionCard>
              <h3>Последние показатели</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <InfoItem>
                  <span className="label">Температура</span>
                  <span className="value">{localPatient.vitals?.temp || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">АД</span>
                  <span className="value">{localPatient.vitals?.bp || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">ЧСС</span>
                  <span className="value">{localPatient.vitals?.hr || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">SpO2</span>
                  <span className="value">{localPatient.vitals?.spo2 || '—'}</span>
                </InfoItem>
              </div>
            </SectionCard>
            <SectionCard $span={2}>
              <h3>Последние анализы</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {localPatient.labs?.slice(0, 3).map((lab: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: '#f8fafc',
                      borderRadius: 8,
                      gap: 8
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flex: '1 1 auto',
                        minWidth: 0
                      }}
                    >
                      <AlertCircle
                        size={16}
                        color={getStatusColor(lab.statusText).text}
                        style={{ flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {lab.type}
                      </span>
                      <span style={{ color: '#64748b', fontSize: 12, flexShrink: 0 }}>
                        ( {formatDateHuman(lab.date)})
                      </span>
                    </div>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: getStatusColor(lab.statusText).bg,
                        color: getStatusColor(lab.statusText).text
                      }}
                    >
                      {lab.statusText || 'Статус не указан'}
                    </span>
                  </div>
                )) || <span style={{ color: '#94a3b8' }}>Нет данных об анализах</span>}
              </div>
            </SectionCard>
          </GridRow>
        )
      case 'Персональные данные':
        return (
          <GridRow $cols={2}>
            <SectionCard>
              <h3>
                1. Основные данные{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() =>
                    openModal('EDIT_BASIC', {
                      lastName: localPatient.lastName,
                      firstName: localPatient.firstName,
                      middleName: localPatient.middleName,
                      dateOfBirth: localPatient.dateOfBirth,
                      gender: localPatient.gender,
                      maritalStatus: localPatient.maritalStatus
                    })
                  }
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">ФИО</span>
                  <span className="value">
                    {localPatient.lastName} {localPatient.firstName} {localPatient.middleName}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Дата рождения</span>
                  <span className="value">{formatDateHuman(localPatient.dateOfBirth)}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Пол</span>
                  <span className="value">{localPatient.gender}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Сем. положение</span>
                  <span className="value">{localPatient.maritalStatus || 'Не указано'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard>
              <h3>
                2. Паспорт{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() => openModal('EDIT_NESTED_passport', localPatient.passport)}
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Серия и номер</span>
                  <span className="value">
                    {localPatient.passport?.seriesNumber || 'Не указано'}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Кем выдан</span>
                  <span className="value">{localPatient.passport?.issuedBy || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Дата выдачи</span>
                  <span className="value">
                    {formatDateHuman(localPatient.passport?.dateIssued) || 'Не указано'}
                  </span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard>
              <h3>
                3. Контакты{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() => openModal('EDIT_NESTED_contacts', localPatient.contacts)}
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Страна</span>
                  <span className="value">
                    {localPatient.contacts?.country || 'Приднестровская Молдавская Республика'}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Область/Город</span>
                  <span className="value">
                    {localPatient.contacts?.region || 'Не указано'},{' '}
                    {localPatient.contacts?.city || 'Не указано'}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Адрес (Индекс)</span>
                  <span className="value">
                    {localPatient.contacts?.address || 'Не указано'} (
                    {localPatient.contacts?.zip || '000000'})
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Мобильный телефон</span>
                  <span className="value">
                    {localPatient.contacts?.phoneMobile ||
                      localPatient.contacts?.phone ||
                      'Не указано'}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Домашний телефон</span>
                  <span className="value">{localPatient.contacts?.phoneHome || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Email</span>
                  <span className="value">{localPatient.contacts?.email || 'Не указано'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard>
              <h3>
                4. Прочее{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() => openModal('EDIT_NESTED_other', localPatient.other)}
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Язык</span>
                  <span className="value">{localPatient.other?.language || 'Русский'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Национальность</span>
                  <span className="value">{localPatient.other?.nationality || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Дата смерти</span>
                  <span className="value">
                    {formatDateHuman(localPatient.other?.dateOfDeath) || '—'}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Причина смерти</span>
                  <span className="value">{localPatient.other?.causeOfDeath || '—'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard>
              <h3>
                5. Родственники{' '}
                <ActionButton onClick={() => openModal('ADD_LIST_relatives')}>
                  <Plus size={14} /> Добавить
                </ActionButton>
              </h3>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>ФИО</th>
                      <th>Кем приходится</th>
                      <th>Телефон</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPatient.relatives?.map((rel: any, i: number) => (
                      <tr key={i}>
                        <td>{rel.name}</td>
                        <td>{rel.relation}</td>
                        <td>{rel.phone}</td>
                        <td>
                          <ActionButton
                            $variant="ghost"
                            onClick={() => openModal('EDIT_LIST_relatives', { ...rel, index: i })}
                          >
                            <Edit size={14} />
                          </ActionButton>
                          <ActionButton
                            $variant="danger"
                            onClick={() => openModal('DELETE_LIST_relatives', { index: i })}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8' }}>
                          Нет данных
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableWrapper>
            </SectionCard>
            <SectionCard>
              <h3>
                6. Работа{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() => openModal('EDIT_NESTED_work', localPatient.work)}
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Профессия</span>
                  <span className="value">{localPatient.work?.profession || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Организация</span>
                  <span className="value">{localPatient.work?.organization || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Адрес работы</span>
                  <span className="value">{localPatient.work?.address || 'Не указано'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
          </GridRow>
        )
      case 'Медицинская информация':
        return (
          <ContentArea>
            <SectionCard>
              <h3>
                Аллергии{' '}
                <ActionButton onClick={() => openModal('ADD_LIST_allergies')}>
                  <Plus size={14} /> Добавить
                </ActionButton>
              </h3>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Реакция</th>
                      <th>Дата выявления</th>
                      <th>Комментарий</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPatient.allergies?.map((alg: any, i: number) => (
                      <tr key={i}>
                        <td>{alg.name}</td>
                        <td>{alg.reaction}</td>
                        <td>{formatDateHuman(alg.date)}</td>
                        <td>{alg.comment || '—'}</td>
                        <td>
                          <ActionButton
                            $variant="ghost"
                            onClick={() => openModal('EDIT_LIST_allergies', { ...alg, index: i })}
                          >
                            <Edit size={14} />
                          </ActionButton>
                          <ActionButton
                            $variant="danger"
                            onClick={() => openModal('DELETE_LIST_allergies', { index: i })}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>
                          Аллергии не зафиксированы
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableWrapper>
            </SectionCard>
            <SectionCard>
              <h3>
                Текущие лекарства{' '}
                <ActionButton onClick={() => openModal('ADD_LIST_currentMeds')}>
                  <Plus size={14} /> Добавить
                </ActionButton>
              </h3>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Препарат</th>
                      <th>Дозировка</th>
                      <th>Форма</th>
                      <th>Режим приема</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPatient.currentMeds?.map((med: any, i: number) => (
                      <tr key={i}>
                        <td>
                          <strong>{med.name}</strong>
                        </td>
                        <td>{med.dose}</td>
                        <td>{med.form}</td>
                        <td>{med.regimen}</td>
                        <td>
                          <ActionButton
                            $variant="ghost"
                            onClick={() => openModal('EDIT_LIST_currentMeds', { ...med, index: i })}
                          >
                            <Edit size={14} />
                          </ActionButton>
                          <ActionButton
                            $variant="danger"
                            onClick={() => openModal('DELETE_LIST_currentMeds', { index: i })}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>
                          Нет текущих лекарств
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableWrapper>
            </SectionCard>
            <GridRow>
              <SectionCard>
                <h3>
                  Операции{' '}
                  <ActionButton onClick={() => openModal('ADD_LIST_operations')}>
                    <Plus size={14} /> Добавить
                  </ActionButton>
                </h3>
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <th>Операция</th>
                        <th>Дата</th>
                        <th>Диагноз</th>
                        <th>Результат</th>
                        <th>Осложнения</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(localPatient.operations?.length > 0 ? localPatient.operations : []).map(
                        (op: any, i: number) => (
                          <tr key={i}>
                            <td>
                              <strong>{typeof op === 'string' ? op : op.name}</strong>
                            </td>
                            <td>
                              {typeof op === 'object' ? formatDateHuman(op.date) || '—' : '—'}
                            </td>
                            <td>{typeof op === 'object' ? op.diagnosis || '—' : '—'}</td>
                            <td>{typeof op === 'object' ? op.result || '—' : '—'}</td>
                            <td>{typeof op === 'object' ? op.complications || 'Нет' : '—'}</td>
                            <td>
                              <ActionButton
                                $variant="ghost"
                                onClick={() =>
                                  openModal('EDIT_LIST_operations', { ...op, index: i })
                                }
                              >
                                <Edit size={14} />
                              </ActionButton>
                              <ActionButton
                                $variant="danger"
                                onClick={() => openModal('DELETE_LIST_operations', { index: i })}
                              >
                                <Trash2 size={14} />
                              </ActionButton>
                            </td>
                          </tr>
                        )
                      )}
                      {!localPatient.operations?.length && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                            Нет данных
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </TableWrapper>
              </SectionCard>

              <SectionCard>
                <h3>
                  Медицинские проблемы{' '}
                  <ActionButton onClick={() => openModal('ADD_LIST_medicalProblems')}>
                    <Plus size={14} /> Добавить
                  </ActionButton>
                </h3>
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <th>Заболевание</th>
                        <th>Статус</th>
                        <th>Степень</th>
                        <th>Дата постановки</th>
                        <th>Осложнения</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(localPatient.medicalProblems?.length > 0
                        ? localPatient.medicalProblems
                        : []
                      ).map((prob: any, i: number) => (
                        <tr key={i}>
                          <td>
                            <strong>{typeof prob === 'string' ? prob : prob.name}</strong>
                          </td>
                          <td>{typeof prob === 'object' ? prob.diseaseStatus || '—' : '—'}</td>
                          <td>{typeof prob === 'object' ? prob.severity || '—' : '—'}</td>
                          <td>
                            {typeof prob === 'object'
                              ? formatDateHuman(prob.diagnosisDate) || '—'
                              : '—'}
                          </td>
                          <td>{typeof prob === 'object' ? prob.complications || 'Нет' : '—'}</td>
                          <td>
                            <ActionButton
                              $variant="ghost"
                              onClick={() =>
                                openModal('EDIT_LIST_medicalProblems', { ...prob, index: i })
                              }
                            >
                              <Edit size={14} />
                            </ActionButton>
                            <ActionButton
                              $variant="danger"
                              onClick={() => openModal('DELETE_LIST_medicalProblems', { index: i })}
                            >
                              <Trash2 size={14} />
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                      {!localPatient.medicalProblems?.length && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                            Нет данных
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </TableWrapper>
              </SectionCard>
            </GridRow>
          </ContentArea>
        )
      case 'Назначения':
        return (
          <SectionCard>
            <h3>
              Текущие назначения{' '}
              <ActionButton onClick={() => openModal('ADD_LIST_prescriptions')}>
                <Plus size={14} /> Новое назначение
              </ActionButton>
            </h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Начало</th>
                    <th>Окончание</th>
                    <th>Препарат</th>
                    <th>Дозировка</th>
                    <th>Форма</th>
                    <th>Путь</th>
                    <th>Режим</th>
                    <th>Комментарий</th>
                    <th>Врач</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.prescriptions?.map((pr: any, i: number) => (
                    <tr key={i}>
                      <td>{formatDateHumanWithTime(pr.dateStart) || '01.10.2023'}</td>
                      <td>{formatDateHuman(pr.dateEnd) || '10.10.2023'}</td>
                      <td>
                        <strong>{pr.drug}</strong>
                      </td>
                      <td>{pr.dose}</td>
                      <td>{pr.form}</td>
                      <td>{pr.route}</td>
                      <td>{pr.regimen}</td>
                      <td>{pr.comment || '—'}</td>
                      <td>{pr.doctorName || pr.doctor || '—'}</td>
                      <td>
                        <ActionButton
                          $variant="ghost"
                          title="Добавить в текущие лекарства"
                          onClick={() => {
                            handleQuickAction('ADD_MED_FROM_PRESCRIPTION', pr)
                            toast.success('Назначение добавлено')
                          }}
                        >
                          <CheckSquare size={14} />
                        </ActionButton>
                        <ActionButton
                          $variant="ghost"
                          onClick={() => openModal('EDIT_LIST_prescriptions', { ...pr, index: i })}
                        >
                          <Edit size={14} />
                        </ActionButton>
                        <ActionButton
                          $variant="danger"
                          onClick={() => openModal('DELETE_LIST_prescriptions', { index: i })}
                        >
                          <Trash2 size={14} />
                        </ActionButton>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет данных
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      case 'Анализы':
        return (
          <SectionCard>
            <h3>
              Результаты анализов{' '}
              <ActionButton onClick={() => openModal('ADD_LIST_labs')}>
                <Plus size={14} /> Назначить
              </ActionButton>
            </h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Тип анализа</th>
                    <th>Причина анализа</th>
                    <th>Врач</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.labs?.map((lab: any, i: number) => (
                    <tr key={i}>
                      <td>{formatDateHuman(lab.date)}</td>
                      <td>{lab.type}</td>
                      <td>{lab.reason || '—'}</td>
                      <td>{lab.doctorName || lab.doctor || '—'}</td>
                      <td>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: getStatusColor(lab.statusText).bg,
                            color: getStatusColor(lab.statusText).text
                          }}
                        >
                          {lab.statusText || 'Не указан'}
                        </span>
                      </td>
                      <td>
                        <ActionButton
                          $variant="ghost"
                          onClick={() => openModal('VIEW_LAB', lab)}
                        >
                          <Eye size={14} />
                        </ActionButton>
                        {lab.pdfDocumentPath && (
                          <ActionButton
                            $variant="ghost"
                            onClick={() => downloadFileFromServer(`${lab.type}.pdf`, lab.pdfDocumentPath)}
                          >
                            <Download size={14} />
                          </ActionButton>
                        )}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет данных
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      case 'Показатели': {
        const patientSigns: any[] = localPatient.vitalsHistory || []
        const chartData = buildChartData(patientSigns)
        const latest = patientSigns[patientSigns.length - 1]
        const previous = patientSigns[patientSigns.length - 2]

        const TREND_META: {
          field: string
          label: string
          goodDir: 'up' | 'down' | 'stable' | 'any'
        }[] = [
          { field: 'temperature', label: 'Темп.', goodDir: 'any' },
          { field: 'pulse', label: 'Пульс', goodDir: 'any' },
          { field: 'bloodPressureSystolic', label: 'АД с.', goodDir: 'any' },
          { field: 'bloodPressureDiastolic', label: 'АД д.', goodDir: 'any' },
          { field: 'respiratoryRate', label: 'ЧД', goodDir: 'any' },
          { field: 'spo2', label: 'SpO₂ (%)', goodDir: 'up' }
        ]

        const getTrend = (field: string): 'up' | 'down' | 'stable' => {
          if (!latest || !previous) return 'stable'
          const diff = (latest[field] as number) - (previous[field] as number)
          return diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable'
        }

        const VITAL_ITEMS = [
          {
            key: 'temp',
            icon: <Thermometer size={16} color="#f97316" />,
            label: 'Температура',
            value: localPatient.vitals?.temp || (latest ? `${latest.temperature} °C` : '—'),
            range: `${NORMAL_RANGES.temperature.min}–${NORMAL_RANGES.temperature.max} °C`
          },
          {
            key: 'bp',
            icon: <Activity size={16} color="#2563eb" />,
            label: 'АД',
            value:
              localPatient.vitals?.bp ||
              (latest ? `${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}` : '—'),
            range: '100–130 / 60–90'
          },
          {
            key: 'hr',
            icon: <Heart size={16} color="#db2777" />,
            label: 'ЧСС',
            value: localPatient.vitals?.hr || (latest ? `${latest.pulse} уд/мин` : '—'),
            range: `${NORMAL_RANGES.pulse.min}–${NORMAL_RANGES.pulse.max}`
          },
          {
            key: 'spo2',
            icon: <Droplet size={16} color="#2563eb" />,
            label: 'SpO2',
            value: localPatient.vitals?.spo2 || (latest ? `${latest.spo2}%` : '—'),
            range: `${NORMAL_RANGES.spo2.min}–${NORMAL_RANGES.spo2.max}%`
          },
          {
            key: 'resp',
            icon: <Activity size={16} color="#10b981" />,
            label: 'ЧД',
            value: localPatient.vitals?.resp || (latest ? `${latest.respiratoryRate} д/мин` : '—'),
            range: `${NORMAL_RANGES.respiratoryRate.min}–${NORMAL_RANGES.respiratoryRate.max}`
          }
        ]

        return (
          <ContentArea>
            <SectionCard>
              <h3>
                Последние значения{' '}
                <ActionButton onClick={() => openModal('EDIT_NESTED_vitals', localPatient.vitals)}>
                  <Plus size={14} /> Внести
                </ActionButton>
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
                  gap: 16
                }}
              >
                {VITAL_ITEMS.map((item) => (
                  <div
                    key={item.key}
                    style={{
                      background: '#f8fafc',
                      borderRadius: 14,
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        color: '#64748b',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Норма: {item.range}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <OpenSheetBtn
                  onClick={() => {
                    handleBack()
                  }}
                >
                  <FileLineChart size={20} />
                  <span>Открыть температурный лист</span>
                </OpenSheetBtn>
              </div>
            </SectionCard>
            {chartData.length >= 2 ? (
              <>
                <SectionCard style={{ padding: 0 }}>
                  <CardHeader>
                    <CardTitle>Температура, Пульс, АД</CardTitle>
                    <CardSubtitle>
                      График изменения температуры и жизненно важных функций
                    </CardSubtitle>
                  </CardHeader>
                  {patientSigns.length >= 2 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        padding: '12px 20px',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>
                        Динамика:
                      </span>

                      {TREND_META.filter(
                        (meta) =>
                          meta.field === 'temperature' ||
                          meta.field === 'pulse' ||
                          meta.field === 'bloodPressureSystolic' ||
                          meta.field === 'bloodPressureDiastolic'
                      ).map((meta) => {
                        const dir = getTrend(meta.field)
                        const currentValue = latest?.[meta.field] as number | undefined
                        const range = NORMAL_RANGES[meta.field]
                        const goodDir = meta.goodDir

                        const isOutOfRange =
                          currentValue !== undefined &&
                          (currentValue < range.min || currentValue > range.max)

                        const isGood =
                          !isOutOfRange &&
                          (goodDir === 'any' || dir === goodDir || dir === 'stable')

                        const color = dir === 'stable' ? '#94a3b8' : isGood ? '#16a34a' : '#dc2626'
                        const bgColor = isGood ? '#16a34a14' : '#dc262614'
                        const borderColor = isGood ? '#16a34a33' : '#dc262633'

                        const Icon =
                          dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : MinusIcon
                        return (
                          <div
                            key={meta.field}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              backgroundColor: bgColor,
                              border: `1px solid ${borderColor}`,
                              fontSize: '12px',
                              fontWeight: 500,
                              color
                            }}
                          >
                            <Icon size={13} />
                            <span>{meta.label}</span>
                          </div>
                        )
                      })}
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          alignSelf: 'center',
                          marginLeft: 'auto'
                        }}
                      >
                        ← vs предыдущий замер
                      </span>
                    </div>
                  )}
                  <div style={{ padding: '0 20px 20px 20px' }}>
                    <ResponsiveContainer width="100%" height={420}>
                      <ComposedChart
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 6, left: 6 }}
                      >
                        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis dataKey="name" />

                        <YAxis
                          yAxisId="vitals"
                          domain={[30, 250]}
                          width={52}
                          tickCount={12}
                          label={{
                            value: 'Пульс / АД',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 0
                          }}
                        />
                        <YAxis
                          yAxisId="temp"
                          orientation="right"
                          domain={[VITAL_RULES.temperature.min, VITAL_RULES.temperature.max]}
                          tickCount={10}
                          width={52}
                          label={{
                            value: 'Температура, °C',
                            angle: 90,
                            position: 'insideRight',
                            offset: -10
                          }}
                        />

                        <Tooltip
                          isAnimationActive={false}
                          formatter={(value, name, entry) => {
                            const row = entry.payload as any
                            const dataKey = entry.dataKey as string

                            const formatAlert = (text: string, alertText?: string) =>
                              alertText ? (
                                <span style={{ color: '#dc2626', fontWeight: 600 }}>
                                  {text} ({alertText})
                                </span>
                              ) : (
                                text
                              )

                            const tempHigh =
                              row.temperature != null &&
                              row.temperature > NORMAL_RANGES.temperature.max
                            const tempLow =
                              row.temperature != null &&
                              row.temperature < NORMAL_RANGES.temperature.min
                            const tempAlert = tempHigh
                              ? '⚠ ↑ выше нормы'
                              : tempLow
                                ? '⚠ ↓ ниже нормы'
                                : ''
                            const tempValue =
                              row.temperature != null
                                ? `${Number(row.temperature).toFixed(1)} °C`
                                : '—'

                            const pulseHigh =
                              row.pulse != null && row.pulse > NORMAL_RANGES.pulse.max
                            const pulseLow =
                              row.pulse != null && row.pulse < NORMAL_RANGES.pulse.min
                            const pulseAlert = pulseHigh
                              ? '↑ выше нормы'
                              : pulseLow
                                ? '↓ ниже нормы'
                                : ''
                            const pulseValue = row.pulse != null ? `${row.pulse} уд/мин` : '—'

                            const bpsHigh =
                              row.bloodPressureSystolic != null &&
                              row.bloodPressureSystolic > NORMAL_RANGES.bloodPressureSystolic.max
                            const bpsLow =
                              row.bloodPressureSystolic != null &&
                              row.bloodPressureSystolic < NORMAL_RANGES.bloodPressureSystolic.min
                            const bpdHigh =
                              row.bloodPressureDiastolic != null &&
                              row.bloodPressureDiastolic > NORMAL_RANGES.bloodPressureDiastolic.max
                            const bpdLow =
                              row.bloodPressureDiastolic != null &&
                              row.bloodPressureDiastolic < NORMAL_RANGES.bloodPressureDiastolic.min

                            const bpAlerts: string[] = []
                            if (bpsHigh) bpAlerts.push('↑ сист.')
                            if (bpsLow) bpAlerts.push('↓ сист.')
                            if (bpdHigh) bpAlerts.push('↑ диаст.')
                            if (bpdLow) bpAlerts.push('↓ диаст.')
                            const bpAlertText =
                              bpAlerts.length > 0 ? `⚠ ${bpAlerts.join(', ')}` : ''
                            const bpValue =
                              row.bloodPressureSystolic != null &&
                              row.bloodPressureDiastolic != null
                                ? `${row.bloodPressureSystolic}/${row.bloodPressureDiastolic} мм рт. ст.`
                                : '—'

                            const pulseRangeValue = row.pulseRange ?? 0
                            const bpNormalValue = row.bpNormal ?? 0

                            if (dataKey === 'temperature') {
                              return [formatAlert(tempValue, tempAlert), 'Температура']
                            }

                            if (dataKey === 'pulseBase' || dataKey === 'bpBase') {
                              return null
                            }

                            if (dataKey === 'pulseRange' || dataKey === 'pulseUpper') {
                              const segmentValue = typeof value === 'number' ? value : Number(value)
                              if (!Number.isFinite(segmentValue) || segmentValue <= 0) {
                                return null
                              }
                              const shouldShowPulse =
                                dataKey === 'pulseRange' ||
                                (dataKey === 'pulseUpper' && pulseRangeValue === 0)
                              if (!shouldShowPulse) {
                                return null
                              }
                              return [formatAlert(pulseValue, pulseAlert), 'Пульс']
                            }

                            if (dataKey === 'bpNormal') {
                              const val = typeof value === 'number' ? value : Number(value)
                              if (!Number.isFinite(val) || val <= 0) {
                                return null
                              }
                              return [formatAlert(bpValue, bpAlertText), 'АД']
                            }

                            if (dataKey === 'bpLow' || dataKey === 'bpHigh') {
                              if (bpNormalValue !== 0) {
                                return null
                              }
                              return [formatAlert(bpValue, bpAlertText), 'АД']
                            }

                            return [value, name]
                          }}
                        />
                        <Legend verticalAlign="bottom" align="center" />

                        <ReferenceArea
                          yAxisId="temp"
                          y1={NORMAL_RANGES.temperature.min}
                          y2={NORMAL_RANGES.temperature.max}
                          fill="#dcfce7"
                          fillOpacity={0.35}
                          strokeOpacity={0}
                        />

                        <ReferenceLine
                          yAxisId="temp"
                          y={37.2}
                          stroke="#16a34a"
                          strokeDasharray="5 4"
                          strokeOpacity={0.55}
                          strokeWidth={1.5}
                          label={{
                            value: `${NORMAL_RANGES.temperature.max}°`,
                            position: 'left',
                            fontSize: 10,
                            fill: '#16a34a',
                            dy: -12,
                            dx: 4
                          }}
                        />
                        <ReferenceLine
                          yAxisId="temp"
                          y={36.0}
                          stroke="#16a34a"
                          strokeDasharray="5 4"
                          strokeOpacity={0.4}
                          strokeWidth={1.5}
                          label={{
                            value: `${NORMAL_RANGES.temperature.min}.0°`,
                            position: 'left',
                            fontSize: 10,
                            fill: '#16a34a',
                            dy: -4,
                            dx: 4
                          }}
                        />

                        <ReferenceLine
                          yAxisId="vitals"
                          y={NORMAL_RANGES.bloodPressureSystolic.max}
                          stroke="#f97316"
                          strokeDasharray="6 4"
                          strokeOpacity={0.45}
                          strokeWidth={1.5}
                          label={{
                            value: `АД ${NORMAL_RANGES.bloodPressureSystolic.max}`,
                            position: 'left',
                            fontSize: 10,
                            fill: '#f97316',
                            dy: -7,
                            dx: 3
                          }}
                        />
                        <ReferenceLine
                          yAxisId="vitals"
                          y={NORMAL_RANGES.bloodPressureDiastolic.min}
                          stroke="#f97316"
                          strokeDasharray="4 4"
                          strokeOpacity={0.35}
                          strokeWidth={1.5}
                          label={{
                            value: `АД ${NORMAL_RANGES.bloodPressureDiastolic.min}`,
                            position: 'left',
                            fontSize: 10,
                            fill: '#f97316',
                            dy: 2,
                            dx: 3
                          }}
                        />

                        <ReferenceLine
                          yAxisId="vitals"
                          y={NORMAL_RANGES.pulse.max}
                          stroke="#db2777"
                          strokeDasharray="4 3"
                          strokeOpacity={0.35}
                          strokeWidth={1.5}
                          label={{
                            value: `Пульс ${NORMAL_RANGES.pulse.max}`,
                            position: 'right',
                            fontSize: 10,
                            fill: '#db2777'
                          }}
                        />
                        <ReferenceLine
                          yAxisId="vitals"
                          y={NORMAL_RANGES.pulse.min}
                          stroke="#db2777"
                          strokeDasharray="4 3"
                          strokeOpacity={0.25}
                          strokeWidth={1.5}
                          label={{
                            value: `Пульс ${NORMAL_RANGES.pulse.min}`,
                            position: 'right',
                            fontSize: 10,
                            fill: '#db2777',
                            dy: -5
                          }}
                        />

                        <Bar
                          yAxisId="vitals"
                          dataKey="pulseBase"
                          stackId="pulse"
                          fill="transparent"
                          legendType="none"
                        />

                        <Bar
                          yAxisId="vitals"
                          dataKey="pulseRange"
                          stackId="pulse"
                          name="Пульс"
                          fill="#db2777"
                          barSize={14}
                          radius={[4, 4, 0, 0]}
                        />

                        <Bar
                          yAxisId="vitals"
                          dataKey="pulseUpper"
                          stackId="pulse"
                          name="Пульс (плохой)"
                          fill="#ff0026"
                          barSize={14}
                          radius={[4, 4, 4, 4]}
                          legendType="none"
                        />

                        <Bar
                          yAxisId="vitals"
                          dataKey="bpBase"
                          stackId="bp"
                          fill="transparent"
                          legendType="none"
                        />

                        <Bar
                          yAxisId="vitals"
                          dataKey="bpLow"
                          stackId="bp"
                          name="АД (выше нормы)"
                          fill="#000c8b"
                          legendType="none"
                          barSize={14}
                          radius={[4, 4, 4, 4]}
                        />

                        <Bar
                          yAxisId="vitals"
                          dataKey="bpNormal"
                          stackId="bp"
                          name="АД (нижн.-верхн.)"
                          fill="#2563eb"
                          barSize={14}
                          radius={[4, 4, 4, 4]}
                        />

                        <Bar
                          yAxisId="vitals"
                          dataKey="bpHigh"
                          stackId="bp"
                          name="АД (ниже нормы)"
                          fill="#000c8b"
                          legendType="none"
                          barSize={14}
                          radius={[4, 4, 4, 4]}
                        />

                        <Line
                          yAxisId="temp"
                          type="monotone"
                          dataKey="temperature"
                          name="Температура"
                          stroke="#f97316"
                          strokeWidth={3}
                          dot={<CustomTempDot />}
                          activeDot={<CustomTempActiveDot />}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </SectionCard>
                <SectionCard style={{ padding: 0 }}>
                  <CardHeader>
                    <CardTitle>SpO2 и Частота дыхания</CardTitle>
                    <CardSubtitle>
                      График изменения насыщения кислородом и частоты дыхания
                    </CardSubtitle>
                  </CardHeader>
                  {patientSigns.length >= 2 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        padding: '12px 20px',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>
                        Динамика:
                      </span>

                      {TREND_META.filter(
                        (meta) => meta.field === 'spo2' || meta.field === 'respiratoryRate'
                      ).map((meta) => {
                        const dir = getTrend(meta.field)
                        const currentValue = latest?.[meta.field] as number | undefined
                        const range = NORMAL_RANGES[meta.field]
                        const goodDir = meta.goodDir

                        const isOutOfRange =
                          currentValue !== undefined &&
                          (currentValue < range.min || currentValue > range.max)

                        const isGood =
                          !isOutOfRange &&
                          (goodDir === 'any' || dir === goodDir || dir === 'stable')

                        const color = dir === 'stable' ? '#94a3b8' : isGood ? '#16a34a' : '#dc2626'
                        const bgColor = isGood ? '#16a34a14' : '#dc262614'
                        const borderColor = isGood ? '#16a34a33' : '#dc262633'

                        const Icon =
                          dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : MinusIcon
                        return (
                          <div
                            key={meta.field}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              backgroundColor: bgColor,
                              border: `1px solid ${borderColor}`,
                              fontSize: '12px',
                              fontWeight: 500,
                              color
                            }}
                          >
                            <Icon size={13} />
                            <span>{meta.label}</span>
                          </div>
                        )
                      })}
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          alignSelf: 'center',
                          marginLeft: 'auto'
                        }}
                      >
                        ← vs предыдущий замер
                      </span>
                    </div>
                  )}
                  <div style={{ padding: '0 20px 20px 20px' }}>
                    <ResponsiveContainer width="100%" height={420}>
                      <ComposedChart
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 6, left: 6 }}
                      >
                        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis dataKey="name" />

                        <Tooltip
                          isAnimationActive={false}
                          formatter={(value, name, entry) => {
                            const row = entry.payload as any
                            const dataKey = entry.dataKey as string

                            const formatAlert = (text: string, alertText?: string) =>
                              alertText ? (
                                <span style={{ color: '#dc2626', fontWeight: 600 }}>
                                  {text} ({alertText})
                                </span>
                              ) : (
                                text
                              )

                            const spo2High = row.spo2 != null && row.spo2 > NORMAL_RANGES.spo2.max
                            const spo2Low = row.spo2 != null && row.spo2 < NORMAL_RANGES.spo2.min
                            const spo2Alert = spo2High
                              ? '⚠ ↑ выше нормы'
                              : spo2Low
                                ? '⚠ ↓ ниже нормы'
                                : ''
                            const spo2Value =
                              row.spo2 != null ? `${Number(row.spo2).toFixed(1)} %` : '—'

                            const respiratoryRateHigh =
                              row.respiratoryRate != null &&
                              row.respiratoryRate > NORMAL_RANGES.respiratoryRate.max
                            const respiratoryRateLow =
                              row.respiratoryRate != null &&
                              row.respiratoryRate < NORMAL_RANGES.respiratoryRate.min
                            const respiratoryRateAlert = respiratoryRateHigh
                              ? '⚠ ↑ выше нормы'
                              : respiratoryRateLow
                                ? '⚠ ↓ ниже нормы'
                                : ''
                            const respiratoryRateValue =
                              row.respiratoryRate != null ? `${row.respiratoryRate} дых/мин` : '—'

                            if (dataKey === 'spo2') {
                              return [formatAlert(spo2Value, spo2Alert), 'SpO₂ (%)']
                            }
                            if (dataKey === 'respiratoryRate') {
                              return [
                                formatAlert(respiratoryRateValue, respiratoryRateAlert),
                                'Частота дыхания'
                              ]
                            }
                            return [value, name]
                          }}
                        />
                        <Legend verticalAlign="bottom" align="center" />

                        <YAxis
                          yAxisId="spo2"
                          domain={[VITAL_RULES.spo2.min, VITAL_RULES.spo2.max]}
                          width={52}
                          tickCount={8}
                          label={{
                            value: 'SpO₂ (%)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 10,
                            dy: 50
                          }}
                        />

                        <YAxis
                          yAxisId="resp"
                          orientation="right"
                          domain={[
                            VITAL_RULES.respiratoryRate.min,
                            VITAL_RULES.respiratoryRate.max
                          ]}
                          width={52}
                          tickCount={8}
                          label={{
                            value: 'Частота дыхания, дых/мин',
                            angle: 90,
                            position: 'insideRight',
                            offset: 0,
                            dy: 90
                          }}
                        />

                        <ReferenceArea
                          yAxisId="spo2"
                          y1={NORMAL_RANGES.spo2.min}
                          y2={NORMAL_RANGES.spo2.max}
                          fill="#dcfce7"
                          fillOpacity={0.3}
                          strokeOpacity={0}
                        />

                        <ReferenceLine
                          yAxisId="spo2"
                          y={NORMAL_RANGES.spo2.max}
                          stroke="#2563eb"
                          strokeDasharray="5 4"
                          strokeOpacity={0.55}
                          strokeWidth={1.4}
                          label={{
                            value: `SpO₂ ${NORMAL_RANGES.spo2.max}%`,
                            position: 'center',
                            fontSize: 10,
                            fill: '#2563eb',
                            dy: -6
                          }}
                        />
                        <ReferenceLine
                          yAxisId="spo2"
                          y={NORMAL_RANGES.spo2.min}
                          stroke="#2563eb"
                          strokeDasharray="5 4"
                          strokeOpacity={0.45}
                          strokeWidth={1.4}
                          label={{
                            value: `SpO₂ ${NORMAL_RANGES.spo2.min}%`,
                            position: 'left',
                            fontSize: 10,
                            fill: '#2563eb',
                            dy: 12
                          }}
                        />

                        <ReferenceArea
                          yAxisId="resp"
                          y1={NORMAL_RANGES.respiratoryRate.min}
                          y2={NORMAL_RANGES.respiratoryRate.max}
                          fill="#dcfce7"
                          fillOpacity={0.22}
                          strokeOpacity={0}
                        />
                        <ReferenceLine
                          yAxisId="resp"
                          y={NORMAL_RANGES.respiratoryRate.max}
                          stroke="#10b981"
                          strokeDasharray="5 4"
                          strokeOpacity={0.55}
                          strokeWidth={1.4}
                          label={{
                            value: `ЧД ${NORMAL_RANGES.respiratoryRate.max}`,
                            position: 'right',
                            fontSize: 10,
                            fill: '#10b981',
                            dy: 5
                          }}
                        />
                        <ReferenceLine
                          yAxisId="resp"
                          y={NORMAL_RANGES.respiratoryRate.min}
                          stroke="#10b981"
                          strokeDasharray="5 4"
                          strokeOpacity={0.45}
                          strokeWidth={1.4}
                          label={{
                            value: `ЧД ${NORMAL_RANGES.respiratoryRate.min}`,
                            position: 'right',
                            fontSize: 10,
                            fill: '#10b981',
                            dy: 12
                          }}
                        />

                        <Line
                          yAxisId="spo2"
                          type="monotone"
                          dataKey="spo2"
                          name="SpO₂ (%)"
                          stroke="#2563eb"
                          strokeWidth={3}
                          dot={<CustomTempDot />}
                        />

                        <Line
                          yAxisId="resp"
                          type="monotone"
                          dataKey="respiratoryRate"
                          name="Частота дыхания"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={<CustomTempDot />}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </SectionCard>
              </>
            ) : (
              <SectionCard style={{ minHeight: 200 }}>
                <h3>Графики показателей</h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 150,
                    color: '#94a3b8',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <Activity size={32} />
                  <p style={{ margin: 0 }}>
                    Недостаточно данных для графика. Внесите минимум 2 замера.
                  </p>
                </div>
              </SectionCard>
            )}
          </ContentArea>
        )
      }

      case 'История': {
        const VISIT_TYPE_CONFIG: Record<
          string,
          { color: string; bg: string; icon: React.ReactNode }
        > = {
          Осмотр: { color: '#2563eb', bg: '#dbeafe', icon: <Stethoscope size={18} /> },
          'Первичный осмотр': { color: '#2563eb', bg: '#dbeafe', icon: <Stethoscope size={18} /> },
          'Ежедневный обход': { color: '#0ea5e9', bg: '#e0f2fe', icon: <Stethoscope size={18} /> },
          'Ежедневный осмотр': { color: '#0ea5e9', bg: '#e0f2fe', icon: <Stethoscope size={18} /> },
          'Primary Inspection': {
            color: '#2563eb',
            bg: '#dbeafe',
            icon: <Stethoscope size={18} />
          },
          'Daily Round': { color: '#0ea5e9', bg: '#e0f2fe', icon: <Stethoscope size={18} /> },
          Консультация: { color: '#7c3aed', bg: '#ede9fe', icon: <User size={18} /> },
          Процедура: { color: '#059669', bg: '#d1fae5', icon: <Syringe size={18} /> },
          Операция: { color: '#dc2626', bg: '#fee2e2', icon: <Clipboard size={18} /> },
          Анализы: { color: '#d97706', bg: '#fef3c7', icon: <TestTube size={18} /> },
          Назначение: { color: '#7c3aed', bg: '#ede9fe', icon: <Pill size={18} /> },
          Вакцинация: { color: '#059669', bg: '#d1fae5', icon: <Syringe size={18} /> },
          Выписка: { color: '#0891b2', bg: '#cffafe', icon: <FileText size={18} /> }
        }
        const getVisitConfig = (type: string) =>
          VISIT_TYPE_CONFIG[type] || {
            color: '#64748b',
            bg: '#f1f5f9',
            icon: <Calendar size={18} />
          }

        const history = localPatient.history || []
        return (
          <SectionCard>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} color="#2563eb" />
              История обращений и записей
              <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 500, color: '#64748b' }}>
                {history.length} запис{history.length === 1 ? 'ь' : history.length < 5 ? 'и' : 'ей'}
              </span>
            </h3>

            {history.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  justifyContent: 'center',
                  padding: '48px 0',
                  color: '#94a3b8'
                }}
              >
                <Clock size={20} style={{ opacity: 0.4 }} />
                <p style={{ margin: 0 }}>История обращений пуста</p>
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: 4 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 30,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: 'linear-gradient(to bottom, #dbeafe, #e0e7ff, #f1f5f9)',
                    borderRadius: 2
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {history.map((h: any, i: number) => {
                    const cfg = getVisitConfig(h.type)
                    const isExpanded = expandedHistory === i
                    return (
                      <div key={i} style={{ display: 'flex', gap: 0, position: 'relative' }}>
                        <div
                          style={{
                            flexShrink: 0,
                            width: 62,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            paddingTop: 20,
                            zIndex: 1
                          }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: cfg.bg,
                              border: `2px solid ${cfg.color}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: cfg.color,
                              boxShadow: `0 2px 8px ${cfg.color}30`
                            }}
                          >
                            {cfg.icon}
                          </div>
                          {i < history.length - 1 && (
                            <div
                              style={{
                                width: 2,
                                flex: 1,
                                minHeight: 20,
                                background: 'transparent'
                              }}
                            />
                          )}
                        </div>

                        <div style={{ flex: 1, paddingBottom: 16, paddingTop: 12 }}>
                          <div
                            onClick={() => setExpandedHistory(isExpanded ? null : i)}
                            style={{
                              background: isExpanded ? '#f8faff' : '#ffffff',
                              border: `1px solid ${isExpanded ? cfg.color + '50' : '#e5e7eb'}`,
                              borderRadius: 14,
                              padding: '14px 18px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: isExpanded
                                ? `0 4px 16px ${cfg.color}15`
                                : '0 1px 4px rgba(0,0,0,0.04)'
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                flexWrap: 'wrap'
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    flexWrap: 'wrap'
                                  }}
                                >
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                      padding: '2px 10px',
                                      borderRadius: 20,
                                      background: cfg.bg,
                                      color: cfg.color,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.04em'
                                    }}
                                  >
                                    {h.type || 'Запись'}
                                  </span>
                                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                                    <Calendar
                                      size={12}
                                      style={{ display: 'inline', marginRight: 3 }}
                                    />
                                    {formatDateHumanWithTime(h.dateTime)}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    color: '#1e293b',
                                    marginTop: 6,
                                    fontSize: 14
                                  }}
                                >
                                  {h.conclusion || 'Заключение не указано'}
                                </div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                                  <User size={12} style={{ display: 'inline', marginRight: 4 }} />
                                  {h.doctorName ||
                                    extractDoctorFromFormData(h.formData) ||
                                    h.doctor ||
                                    'Врач не указан'}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  flexShrink: 0
                                }}
                              >
                                <ActionButton
                                  $variant="ghost"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation()
                                    openModal('VIEW_HISTORY', h)
                                  }}
                                  title="Просмотр"
                                >
                                  <Eye size={14} />
                                </ActionButton>
                                <div
                                  style={{
                                    color: isExpanded ? cfg.color : '#94a3b8',
                                    transition: 'transform 0.2s ease',
                                    transform: isExpanded ? 'rotate(180deg)' : 'none'
                                  }}
                                >
                                  <ChevronDown size={18} />
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div
                                style={{
                                  marginTop: 16,
                                  paddingTop: 16,
                                  borderTop: `1px solid ${cfg.color}25`,
                                  display: 'grid',
                                  gap: 12
                                }}
                              >
                                {[
                                  {
                                    label: 'Жалобы',
                                    value: h.complaints,
                                    icon: <AlertCircle size={14} color="#f97316" />
                                  },
                                  {
                                    label: 'Объективные данные',
                                    value: h.objective,
                                    icon: <Stethoscope size={14} color="#2563eb" />
                                  },
                                  {
                                    label: 'Заключение',
                                    value: h.conclusion,
                                    icon: <FileText size={14} color="#059669" />
                                  },
                                  {
                                    label: 'Назначения / Рекомендации',
                                    value: h.recommendations,
                                    icon: <Pill size={14} color="#7c3aed" />
                                  }
                                ].map((item) =>
                                  item.value ? (
                                    <div
                                      key={item.label}
                                      style={{
                                        display: 'flex',
                                        gap: 10,
                                        alignItems: 'flex-start',
                                        background: '#f8fafc',
                                        borderRadius: 10,
                                        padding: '10px 14px'
                                      }}
                                    >
                                      <div style={{ marginTop: 1, flexShrink: 0 }}>{item.icon}</div>
                                      <div>
                                        <div
                                          style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: '#64748b',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em',
                                            marginBottom: 3
                                          }}
                                        >
                                          {item.label}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: 14,
                                            color: '#1e293b',
                                            lineHeight: 1.5
                                          }}
                                        >
                                          {item.value}
                                        </div>
                                      </div>
                                    </div>
                                  ) : null
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </SectionCard>
        )
      }
      case 'Вакцинация':
        return (
          <SectionCard>
            <h3>
              Карта вакцинации{' '}
              <ActionButton onClick={() => openModal('ADD_LIST_vaccines')}>
                <Plus size={14} /> Внести
              </ActionButton>
            </h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Вакцина</th>
                    <th>От чего</th>
                    <th>Дата</th>
                    <th>Срок действия</th>
                    <th>Производитель</th>
                    <th>Серия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.vaccines?.map((v: any, i: number) => (
                    <tr key={i}>
                      <td>{v.name}</td>
                      <td>{v.disease}</td>
                      <td>{formatDateHuman(v.date)}</td>
                      <td>{v.validity || 'Бессрочно'}</td>
                      <td>{v.manufacturer}</td>
                      <td>{v.series}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет данных
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      case 'Документы':
        return (
          <SectionCard>
            <h3>
              Медицинские документы{' '}
              <ActionButton onClick={() => openModal('ADD_LIST_documents')}>
                <Plus size={14} /> Загрузить
              </ActionButton>
            </h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Документ</th>
                    <th>Дата добавления</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.documents?.map((d: any, i: number) => (
                    <tr key={i}>
                      <td>
                        <FileText size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />{' '}
                        {d.name}
                      </td>
                      <td>{formatDateHuman(d.date)}</td>
                      <td>
                        <ActionButton
                          $variant="ghost"
                          onClick={() => {
                            const docWithUrl = {
                              ...d,
                              url:
                                d.url ||
                                (d.filePath
                                  ? `${process.env.REACT_APP_API_URL ?? ''}/api/files/download/${encodeURIComponent(d.filePath)}`
                                  : '')
                            }
                            openModal('VIEW_DOCUMENT', docWithUrl)
                          }}
                        >
                          <Eye size={14} />
                        </ActionButton>
                        <ActionButton
                          $variant="ghost"
                          onClick={() => {
                            if (d.filePath) {
                              downloadFileFromServer(d.name, d.filePath)
                            } else if (d.url) {
                              window.open(d.url, '_blank')
                            } else {
                              alert('Файл недоступен для скачивания')
                            }
                          }}
                        >
                          <Download size={14} />
                        </ActionButton>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет документов
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      default:
        return null
    }
  }

  if (!patientId || !localPatient) return null

  return (
    <>
      <Helmet>
        <title>
          Карточка пациента - {localPatient.lastName} {localPatient.firstName}
        </title>
      </Helmet>

      <PatientCardContainer>
        <PatientHeader>
          <Avatar>
            <User size={40} />
          </Avatar>
          <HeaderMain>
            <PatientName>
              {localPatient.lastName} {localPatient.firstName} {localPatient.middleName}
            </PatientName>
            <Demographics>
              <span>
                Дата рождения: {formatDateHuman(localPatient.dateOfBirth)} ({localPatient.age}{' '}
                {pluralize(localPatient.age, ['год', 'года', 'лет'])})
              </span>
              <span>•</span>
              <span>Пол: {localPatient.gender}</span>
            </Demographics>

            <HeaderInfoGrid>
              <InfoItem>
                <span className="label">Номер медкарты</span>
                <span className="value">{localPatient.medcardNum}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">История болезни</span>
                <span className="value">{localPatient.historyNum || 'Не присвоен'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Статус</span>
                <Select
                  options={STATUS_OPTIONS}
                  styles={{
                    ...selectStyles,
                    control: (base: any, state: any) => ({
                      ...base,
                      minHeight: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: state.isFocused ? '#ffffff' : '#f8fafc',
                      color: '#0f172a',
                      minWidth: '140px'
                    }),
                    singleValue: (base: any) => ({
                      ...base,
                      color: '#0f172a'
                    })
                  }}
                  components={selectComponents}
                  value={
                    STATUS_OPTIONS.find((o) => o.value === localPatient.status) ||
                    STATUS_OPTIONS.find((o) => o.label === localPatient.statusText) || {
                      value: localPatient.status,
                      label: localPatient.statusText
                    }
                  }
                  onChange={async (opt: any) => {
                    const newStatusValue = opt?.value || 'hospitalized'
                    const foundOption = STATUS_OPTIONS.find((o) => o.value === newStatusValue)
                    const newStatusText = foundOption ? foundOption.label : newStatusValue

                    const updatedData = {
                      ...localPatient,
                      status: newStatusValue,
                      statusText: newStatusText
                    }
                    setLocalPatient(updatedData as any)
                    try {
                      const { updatePatientCard } = await import('../../api/patientsApi')
                      await updatePatientCard(localPatient.id, updatedData as any)
                    } catch (e) {
                      console.error(e)
                    }
                  }}
                />
              </InfoItem>
            </HeaderInfoGrid>

            <HeaderInfoGrid style={{ marginTop: 0 }}>
              <InfoItem>
                <span className="label">Лечащий врач</span>
                <span className="value">{localPatient.doctor}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Отделение</span>
                <span className="value">{localPatient.department}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Учреждение</span>
                <span className="value">{localPatient.institution || 'ГУ БЦГБ'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Обновлено</span>
                <span className="value" style={{ color: '#64748b' }}>
                  {formatDateHumanWithTime(localPatient.lastUpdated) ||
                    new Date().toLocaleDateString('ru-RU')}
                </span>
              </InfoItem>
            </HeaderInfoGrid>
          </HeaderMain>
          {localPatient && (
            <div
              style={{
                marginLeft: 'auto',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                alignItems: 'stretch'
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                {localPatient.status?.toLowerCase() === 'hospitalized' && onNavigateToDischarge && (
                  <button
                    id="btn-discharge"
                    onClick={() => onNavigateToDischarge(localPatient.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      boxShadow: '0 4px 14px rgba(5,150,105,0.35)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.transform = 'translateY(-1px)'
                      b.style.boxShadow = '0 6px 20px rgba(5,150,105,0.45)'
                    }}
                    onMouseLeave={(e) => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.transform = 'translateY(0)'
                      b.style.boxShadow = '0 4px 14px rgba(5,150,105,0.35)'
                    }}
                  >
                    <FileText size={16} />
                    Выписать
                  </button>
                )}
                {onNavigateToWardRound && (
                  <button
                    id="btn-ward-round"
                    onClick={() => onNavigateToWardRound(localPatient.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      boxShadow: '0 4px 14px rgba(29,78,216,0.35)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.transform = 'translateY(-1px)'
                      b.style.boxShadow = '0 6px 20px rgba(29,78,216,0.45)'
                    }}
                    onMouseLeave={(e) => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.transform = 'translateY(0)'
                      b.style.boxShadow = '0 4px 14px rgba(29,78,216,0.35)'
                    }}
                  >
                    <Stethoscope size={16} />
                    Провести осмотр
                  </button>
                )}
              </div>
              <button
                onClick={() => openModal('DELETE_PATIENT')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: '1px solid #ef4444',
                  background: '#ffffff',
                  color: '#ef4444',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement
                  b.style.background = '#fef2f2'
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement
                  b.style.background = '#ffffff'
                }}
              >
                <Trash2 size={16} />
                Удалить пациента
              </button>
            </div>
          )}
        </PatientHeader>

        <TabsContainer>
          {Object.values(TabsEnum).map((tab) => (
            <TabButton key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </TabButton>
          ))}
        </TabsContainer>

        {renderTabContent()}
      </PatientCardContainer>

      {renderModal()}
    </>
  )
}

const PatientCardPageWrapper: React.FC<PatientCardPageProps> = ({
  patientId: externalPatientId,
  initialSearchQuery = '',
  initialTab,
  onSelectPatient: externalOnSelect,
  onNavigateToTemperatureSheet,
  onNavigateToWardRound,
  onNavigateToDischarge
}) => {
  const { addPatient } = usePatientData()
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(externalPatientId)
  const [previewPatient, setPreviewPatient] = useState<any | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addFormData, setAddFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    dateOfBirth: '',
    gender: 'Мужской',
    medcardNum: '',
    historyNum: '',
    status: 'hospitalized'
  })
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldScrollRef = useRef(!!externalPatientId)

  useEffect(() => {
    if (externalPatientId && externalPatientId !== selectedPatientId) {
      shouldScrollRef.current = true
    }
    setSelectedPatientId(externalPatientId)
  }, [externalPatientId, selectedPatientId])

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id)
    externalOnSelect?.(id)
    shouldScrollRef.current = true
  }

  const handleBackToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      setSelectedPatientId(undefined)
      externalOnSelect?.('')
    }, 150)
  }
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

  const handleAddPatientSubmit = async () => {
    if (!addFormData.lastName.trim() || !addFormData.firstName.trim() || !addFormData.dateOfBirth) {
      toast.warning('Заполните все обязательные поля (Фамилия, Имя, Дата рождения)')
      return
    }

    try {
      const foundStatus = STATUS_OPTIONS.find((o) => o.value === addFormData.status)
      const payload = {
        ...addFormData,
        statusText: foundStatus ? foundStatus.label : 'Госпитализован',
        contacts: { country: 'Приднестровская Молдавская Республика' },
        other: { language: 'Русский', nationality: 'Русский' }
      }
      const newPatient = await addPatient(payload)
      toast.success('Пациент успешно добавлен')
      setIsAddModalOpen(false)
      setAddFormData({
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gender: 'Мужской',
        medcardNum: '',
        historyNum: '',
        status: 'hospitalized'
      })
      handleSelectPatient(newPatient.id)
    } catch (err) {
      showApiError(err, 'Ошибка при добавлении пациента')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Helmet>
        <title>Пациенты</title>
      </Helmet>

      <PatientSearchPanel
        onSelectPatient={handleSelectPatient}
        onDoubleClickPatient={(p) => setPreviewPatient(p)}
        onAddPatientClick={() => setIsAddModalOpen(true)}
        cardRef={cardRef}
        initialQuery={initialSearchQuery}
      />

      {selectedPatientId && (
        <div ref={cardRef}>
          <button
            onClick={handleBackToSearch}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid rgba(191,219,254,0.8)',
              background: '#ffffff',
              color: '#374151',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = '#eff6ff'
              b.style.color = '#1e40af'
              b.style.borderColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = '#ffffff'
              b.style.color = '#374151'
              b.style.borderColor = 'rgba(191,219,254,0.8)'
            }}
          >
            <ChevronLeft size={16} />
            Вернуться к поиску
          </button>
          <PatientCard
            patientId={selectedPatientId}
            initialTab={initialTab}
            onSelectPatientFromPreview={handleSelectPatient}
            onNavigateToTemperatureSheet={onNavigateToTemperatureSheet}
            onNavigateToWardRound={onNavigateToWardRound}
            onNavigateToDischarge={onNavigateToDischarge}
            onLoaded={() => {
              if (shouldScrollRef.current) {
                shouldScrollRef.current = false
                setTimeout(() => {
                  const element = cardRef.current
                  if (!element) return
                  const y = element.getBoundingClientRect().top + window.pageYOffset - 20
                  window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                  })
                }, 100)
              }
            }}
          />
        </div>
      )}

      {previewPatient &&
        (() => {
          const p = previewPatient
          return createPortal(
            <ModalOverlay onClick={() => setPreviewPatient(null)}>
              <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
                <ModalHeader>
                  <h2>Быстрый просмотр</h2>
                  <CloseButton onClick={() => setPreviewPatient(null)}>
                    <X size={20} />
                  </CloseButton>
                </ModalHeader>
                <ModalBody>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg,#dbeafe,#ede9fe)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        fontWeight: 800,
                        color: '#2563eb',
                        flexShrink: 0
                      }}
                    >
                      {getInitials(p.firstName, p.lastName)}
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>
                        {p.lastName} {p.firstName} {p.middleName}
                      </div>
                      <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                        {formatDateHuman(p.dateOfBirth)} · {p.age}{' '}
                        {pluralize(p.age, ['год', 'года', 'лет'])} · {p.gender}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: 10
                    }}
                  >
                    {(
                      [
                        ['Медкарта', p.medcardNum],
                        ['История болезни', p.historyNum || '—'],
                        ['Врач', p.doctor],
                        ['Палата', getPatientRoom(p)],
                        ['Статус', p.statusText],
                        ['Диагноз', p.activeProblems?.[0] || '—']
                      ] as [string, string][]
                    ).map(([l, v]) => (
                      <div
                        key={l}
                        style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: '#94a3b8',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            marginBottom: 4
                          }}
                        >
                          {l}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ActionButton $variant="ghost" onClick={() => setPreviewPatient(null)}>
                    Закрыть
                  </ActionButton>
                  <ActionButton
                    $variant="primary"
                    onClick={() => {
                      setPreviewPatient(null)
                      handleSelectPatient(p.id)
                    }}
                  >
                    Открыть карту
                  </ActionButton>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>,
            document.body
          )
        })()}

      {isAddModalOpen &&
        createPortal(
          <ModalOverlay onClick={() => setIsAddModalOpen(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
              <ModalHeader>
                <h2>Добавить пациента</h2>
                <CloseButton onClick={() => setIsAddModalOpen(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                <div style={{ display: 'grid', gap: 12 }}>
                  <FormGroup>
                    <Label>Фамилия *</Label>
                    <Input
                      value={addFormData.lastName}
                      onChange={(e) => setAddFormData((p) => ({ ...p, lastName: e.target.value }))}
                      placeholder="Фамилия..."
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Имя *</Label>
                    <Input
                      value={addFormData.firstName}
                      onChange={(e) => setAddFormData((p) => ({ ...p, firstName: e.target.value }))}
                      placeholder="Имя..."
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Отчество</Label>
                    <Input
                      value={addFormData.middleName}
                      onChange={(e) =>
                        setAddFormData((p) => ({ ...p, middleName: e.target.value }))
                      }
                      placeholder="Отчество..."
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Дата рождения *</Label>
                    <Input
                      type="date"
                      value={addFormData.dateOfBirth}
                      onChange={(e) =>
                        setAddFormData((p) => ({ ...p, dateOfBirth: e.target.value }))
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Пол</Label>
                    <Select
                      options={GENDER_OPTIONS}
                      styles={selectStyles}
                      components={selectComponents}
                      value={
                        GENDER_OPTIONS.find((o) => o.value === addFormData.gender) ||
                        GENDER_OPTIONS[0]
                      }
                      onChange={(opt: any) =>
                        setAddFormData((p) => ({ ...p, gender: opt?.value || 'Мужской' }))
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Статус</Label>
                    <Select
                      options={STATUS_OPTIONS}
                      styles={selectStyles}
                      components={selectComponents}
                      value={
                        STATUS_OPTIONS.find((o) => o.value === addFormData.status) ||
                        STATUS_OPTIONS.find((o) => o.value === 'hospitalized')
                      }
                      onChange={(opt: any) =>
                        setAddFormData((p) => ({ ...p, status: opt?.value || 'hospitalized' }))
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Номер медкарты (необязательно)</Label>
                    <Input
                      value={addFormData.medcardNum}
                      onChange={(e) =>
                        setAddFormData((p) => ({ ...p, medcardNum: e.target.value }))
                      }
                      placeholder="Оставьте пустым для автогенерации..."
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>История болезни (необязательно)</Label>
                    <Input
                      value={addFormData.historyNum}
                      onChange={(e) =>
                        setAddFormData((p) => ({ ...p, historyNum: e.target.value }))
                      }
                      placeholder="История болезни..."
                    />
                  </FormGroup>
                </div>
              </ModalBody>
              <ModalFooter>
                <ActionButton $variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                  Отмена
                </ActionButton>
                <ActionButton $variant="primary" onClick={handleAddPatientSubmit}>
                  Добавить
                </ActionButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>,
          document.body
        )}
    </div>
  )
}

export { PatientSearchPanel, PatientCard }
export default PatientCardPageWrapper
