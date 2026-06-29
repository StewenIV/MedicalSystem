import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { formatLocalDate, formatLocalDateTime, formatLocalTime } from 'utils/dateUtils'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  FlaskConical,
  Search,
  RotateCcw,
  Eye,
  Download,
  Activity,
  ArrowUpDown,
  CheckCircle2,
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  ClipboardList,
  Check,
  AlertCircle
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

import { selectDisplayName } from 'features/App/selectors'
import { usePatientNotifications } from 'context/PatientNotificationsContext'
import { uploadFile, downloadFileFromServer } from 'api/filesApi'
import {
  fetchLabResults,
  fetchLabResultById,
  updateLabStatus,
  submitLabResults,
  LabResultListItemDto,
  LabResultDetailsDto
} from 'api/labResultsApi'

import * as S from './styled'

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`



interface ParamDef {
  key: string
  name: string
  unit: string
  isText?: boolean
  options?: string[]
  getNorm: (gender: string) => { min: number; max: number; text: string }
  interpret: (
    val: string,
    gender: string
  ) => { severity: 'normal' | 'warning' | 'critical'; text: string }
}

const PARAM_DEFS: Record<string, ParamDef[]> = {
  ОАК: [
    {
      key: 'hemoglobin',
      name: 'Гемоглобин',
      unit: 'г/л',
      getNorm: (g) =>
        g === 'Женский'
          ? { min: 120, max: 150, text: '120 - 150' }
          : { min: 130, max: 170, text: '130 - 170' },
      interpret: (val, g) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        const norm =
          g === 'Женский'
            ? { min: 120, max: 150, cMin: 80, cMax: 180 }
            : { min: 130, max: 170, cMin: 90, cMax: 190 }
        if (num < norm.cMin) return { severity: 'critical', text: 'Критически понижен' }
        if (num > norm.cMax) return { severity: 'critical', text: 'Критически повышен' }
        if (num < norm.min) return { severity: 'warning', text: 'Понижен' }
        if (num > norm.max) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'erythrocytes',
      name: 'Эритроциты',
      unit: '10¹²/л',
      getNorm: (g) =>
        g === 'Женский'
          ? { min: 3.7, max: 4.7, text: '3.7 - 4.7' }
          : { min: 4.0, max: 5.1, text: '4.0 - 5.1' },
      interpret: (val, g) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        const norm =
          g === 'Женский'
            ? { min: 3.7, max: 4.7, cMin: 2.5, cMax: 6.0 }
            : { min: 4.0, max: 5.1, cMin: 2.8, cMax: 6.5 }
        if (num < norm.cMin) return { severity: 'critical', text: 'Критически понижен' }
        if (num > norm.cMax) return { severity: 'critical', text: 'Критически повышен' }
        if (num < norm.min) return { severity: 'warning', text: 'Понижен' }
        if (num > norm.max) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'leukocytes',
      name: 'Лейкоциты',
      unit: '10⁹/л',
      getNorm: () => ({ min: 4.0, max: 9.0, text: '4.0 - 9.0' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 2.0) return { severity: 'critical', text: 'Критически понижен' }
        if (num > 15.0) return { severity: 'critical', text: 'Критически повышен' }
        if (num < 4.0) return { severity: 'warning', text: 'Понижен' }
        if (num > 9.0) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'thrombocytes',
      name: 'Тромбоциты',
      unit: '10⁹/л',
      getNorm: () => ({ min: 180, max: 320, text: '180 - 320' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 80) return { severity: 'critical', text: 'Критически понижен' }
        if (num > 500) return { severity: 'critical', text: 'Критически повышен' }
        if (num < 180) return { severity: 'warning', text: 'Понижен' }
        if (num > 320) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'esr',
      name: 'СОЭ',
      unit: 'мм/ч',
      getNorm: (g) =>
        g === 'Женский' ? { min: 2, max: 15, text: '2 - 15' } : { min: 2, max: 10, text: '2 - 10' },
      interpret: (val, g) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        const norm =
          g === 'Женский'
            ? { min: 2, max: 15, cMin: 0, cMax: 45 }
            : { min: 2, max: 10, cMin: 0, cMax: 40 }
        if (num > norm.cMax) return { severity: 'critical', text: 'Критически повышен' }
        if (num < norm.min) return { severity: 'warning', text: 'Понижен' }
        if (num > norm.max) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    }
  ],
  'Биохимия крови': [
    {
      key: 'glucose',
      name: 'Глюкоза',
      unit: 'ммоль/л',
      getNorm: () => ({ min: 3.3, max: 5.5, text: '3.3 - 5.5' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 2.5) return { severity: 'critical', text: 'Критически понижен' }
        if (num > 10.0) return { severity: 'critical', text: 'Критически повышен' }
        if (num < 3.3) return { severity: 'warning', text: 'Понижен' }
        if (num > 5.5) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'bilirubin',
      name: 'Билирубин общий',
      unit: 'мкмоль/л',
      getNorm: () => ({ min: 8.5, max: 20.5, text: '8.5 - 20.5' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num > 45.0) return { severity: 'critical', text: 'Критически повышен' }
        if (num < 8.5) return { severity: 'warning', text: 'Понижен' }
        if (num > 20.5) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'alt',
      name: 'АЛТ',
      unit: 'Ед/л',
      getNorm: (g) =>
        g === 'Женский' ? { min: 0, max: 31, text: '< 31' } : { min: 0, max: 41, text: '< 41' },
      interpret: (val, g) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        const limit = g === 'Женский' ? 31 : 41
        if (num > limit * 3) return { severity: 'critical', text: 'Критически повышен' }
        if (num > limit) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'ast',
      name: 'АСТ',
      unit: 'Ед/л',
      getNorm: (g) =>
        g === 'Женский' ? { min: 0, max: 31, text: '< 31' } : { min: 0, max: 37, text: '< 37' },
      interpret: (val, g) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        const limit = g === 'Женский' ? 31 : 37
        if (num > limit * 3) return { severity: 'critical', text: 'Критически повышен' }
        if (num > limit) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'creatinine',
      name: 'Креатинин',
      unit: 'мкмоль/л',
      getNorm: (g) =>
        g === 'Женский'
          ? { min: 53, max: 97, text: '53 - 97' }
          : { min: 62, max: 115, text: '62 - 115' },
      interpret: (val, g) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        const norm =
          g === 'Женский' ? { min: 53, max: 97, cMax: 300 } : { min: 62, max: 115, cMax: 350 }
        if (num > norm.cMax) return { severity: 'critical', text: 'Критически повышен' }
        if (num < norm.min) return { severity: 'warning', text: 'Понижен' }
        if (num > norm.max) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'urea',
      name: 'Мочевина',
      unit: 'ммоль/л',
      getNorm: () => ({ min: 2.5, max: 7.2, text: '2.5 - 7.2' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num > 18.0) return { severity: 'critical', text: 'Критически повышен' }
        if (num < 2.5) return { severity: 'warning', text: 'Понижен' }
        if (num > 7.2) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    }
  ],
  'Общий анализ мочи': [
    {
      key: 'density',
      name: 'Удельный вес',
      unit: '',
      getNorm: () => ({ min: 1.01, max: 1.025, text: '1.010 - 1.025' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 1.005) return { severity: 'critical', text: 'Критически понижен' }
        if (num > 1.035) return { severity: 'critical', text: 'Критически повышен' }
        if (num < 1.01) return { severity: 'warning', text: 'Понижен' }
        if (num > 1.025) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'ph',
      name: 'pH',
      unit: '',
      getNorm: () => ({ min: 5.0, max: 7.0, text: '5.0 - 7.0' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 4.5) return { severity: 'critical', text: 'Критически кислая' }
        if (num > 8.0) return { severity: 'critical', text: 'Критически щелочная' }
        if (num < 5.0) return { severity: 'warning', text: 'Кислая' }
        if (num > 7.0) return { severity: 'warning', text: 'Щелочная' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'protein',
      name: 'Белок',
      unit: 'г/л',
      getNorm: () => ({ min: 0, max: 0.14, text: '< 0.14' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num > 1.0) return { severity: 'critical', text: 'Выраженная протеинурия' }
        if (num > 0.14) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'glucose',
      name: 'Глюкоза',
      unit: 'ммоль/л',
      getNorm: () => ({ min: 0, max: 0.8, text: '< 0.8' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num > 5.0) return { severity: 'critical', text: 'Выраженная глюкозурия' }
        if (num > 0.8) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'leukocytes',
      name: 'Лейкоциты',
      unit: 'в п/з',
      getNorm: (g) =>
        g === 'Женский' ? { min: 0, max: 5, text: '< 5' } : { min: 0, max: 3, text: '< 3' },
      interpret: (val, g) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        const limit = g === 'Женский' ? 5 : 3
        if (num > 20) return { severity: 'critical', text: 'Выраженная лейкоцитурия' }
        if (num > limit) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'erythrocytes',
      name: 'Эритроциты',
      unit: 'в п/з',
      getNorm: (g) =>
        g === 'Женский' ? { min: 0, max: 3, text: '< 3' } : { min: 0, max: 1, text: '< 1' },
      interpret: (val, g) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        const limit = g === 'Женский' ? 3 : 1
        if (num > 10) return { severity: 'critical', text: 'Выраженная гематурия' }
        if (num > limit) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    }
  ],
  Коагулограмма: [
    {
      key: 'inr',
      name: 'МНО',
      unit: '',
      getNorm: () => ({ min: 0.8, max: 1.2, text: '0.8 - 1.2' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 0.5) return { severity: 'critical', text: 'Критически понижен' }
        if (num > 2.5) return { severity: 'critical', text: 'Критически повышен' }
        if (num < 0.8) return { severity: 'warning', text: 'Понижен' }
        if (num > 1.2) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'aptt',
      name: 'АЧТВ',
      unit: 'сек',
      getNorm: () => ({ min: 25, max: 35, text: '25 - 35' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 15) return { severity: 'critical', text: 'Критически укорочено' }
        if (num > 55) return { severity: 'critical', text: 'Критически удлинено' }
        if (num < 25) return { severity: 'warning', text: 'Укорочено' }
        if (num > 35) return { severity: 'warning', text: 'Удлинено' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'fibrinogen',
      name: 'Фибриноген',
      unit: 'г/л',
      getNorm: () => ({ min: 2.0, max: 4.0, text: '2.0 - 4.0' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 1.0) return { severity: 'critical', text: 'Критически понижен' }
        if (num > 7.0) return { severity: 'critical', text: 'Критически повышен' }
        if (num < 2.0) return { severity: 'warning', text: 'Понижен' }
        if (num > 4.0) return { severity: 'warning', text: 'Повышен' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'pt',
      name: 'Протромбиновое время',
      unit: 'сек',
      getNorm: () => ({ min: 11, max: 15, text: '11 - 15' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num < 8) return { severity: 'critical', text: 'Критически укорочено' }
        if (num > 25) return { severity: 'critical', text: 'Критически удлинено' }
        if (num < 11) return { severity: 'warning', text: 'Укорочено' }
        if (num > 15) return { severity: 'warning', text: 'Удлинено' }
        return { severity: 'normal', text: 'В норме' }
      }
    }
  ],
  Мокрота: [
    {
      key: 'character',
      name: 'Характер',
      unit: '',
      isText: true,
      options: ['слизистая', 'слизисто-гнойная', 'гнойная'],
      getNorm: () => ({ min: 0, max: 0, text: 'слизистая' }),
      interpret: (val) => {
        if (!val) return { severity: 'normal', text: '—' }
        if (val === 'гнойная') return { severity: 'critical', text: 'Гнойная мокрота!' }
        if (val === 'слизисто-гнойная') return { severity: 'warning', text: 'Требует контроля' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'leukocytes',
      name: 'Лейкоциты',
      unit: 'в п/з',
      getNorm: () => ({ min: 0, max: 10, text: '< 10' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num > 50) return { severity: 'critical', text: 'Выраженный лейкоцитоз' }
        if (num > 10) return { severity: 'warning', text: 'Повышено' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'erythrocytes',
      name: 'Эритроциты',
      unit: 'в п/з',
      getNorm: () => ({ min: 0, max: 2, text: '< 2' }),
      interpret: (val) => {
        const num = parseFloat(val)
        if (isNaN(num)) return { severity: 'normal', text: '—' }
        if (num > 15) return { severity: 'critical', text: 'Выраженное содержание' }
        if (num > 2) return { severity: 'warning', text: 'Повышено' }
        return { severity: 'normal', text: 'В норме' }
      }
    },
    {
      key: 'tb',
      name: 'БК (микобактерии)',
      unit: '',
      isText: true,
      options: ['отрицательно', 'положительно'],
      getNorm: () => ({ min: 0, max: 0, text: 'отрицательно' }),
      interpret: (val) => {
        if (!val) return { severity: 'normal', text: '—' }
        if (val === 'положительно') return { severity: 'critical', text: 'ОБНАРУЖЕНО БК!' }
        return { severity: 'normal', text: 'В норме' }
      }
    }
  ]
}

const getTestTypeKey = (type: string): string => {
  const t = (type || '').toLowerCase()
  if (t === 'оак' || t.includes('крови общий') || t.includes('общий анализ крови')) return 'ОАК'
  if (
    t === 'оам' ||
    t.includes('мочи общий') ||
    t.includes('общий анализ мочи') ||
    t.includes('оа мочи')
  )
    return 'Общий анализ мочи'
  if (t.includes('биохим') || t.includes('бх') || t.includes('биохимический'))
    return 'Биохимия крови'
  if (t.includes('коагул')) return 'Коагулограмма'
  if (t.includes('мокрот')) return 'Мокрота'
  return 'ОАК' 
}



interface LaboratoryPageProps {
  initialLabResultId?: string
  onClearInitialId?: () => void
}

const LaboratoryPage: React.FC<LaboratoryPageProps> = ({
  initialLabResultId,
  onClearInitialId
}) => {
  const displayName = useSelector(selectDisplayName)
  const notifCtx = usePatientNotifications()

  
  const [items, setItems] = useState<LabResultListItemDto[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState('date')
  const [sortDesc, setSortDesc] = useState(true)

  
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 })

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [activeResult, setActiveResult] = useState<LabResultDetailsDto | null>(null)

  
  const [formResults, setFormResults] = useState<Record<string, string>>({})
  const [formComments, setFormComments] = useState('')
  const [saving, setSaving] = useState(false)

  
  const printContainerRef = useRef<HTMLDivElement>(null)

  
  const fetchStats = useCallback(async () => {
    try {
      const data = await fetchLabResults({ pageSize: 1000 })
      const s = { total: data.totalCount, pending: 0, inProgress: 0, completed: 0 }
      data.items.forEach((item) => {
        if (item.statusText === 'Завершено') s.completed++
        else if (item.statusText === 'В работе') s.inProgress++
        else s.pending++
      })
      setStats(s)
    } catch (err) {
      console.error('Failed to load stats', err)
    }
  }, [])

  
  const fetchTableData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        search: search.trim() || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
        page,
        pageSize,
        sortBy,
        sortDesc
      }
      const response = await fetchLabResults(params)
      setItems(response.items)
      setTotalCount(response.totalCount)
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при загрузке списка направлений')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, typeFilter, page, pageSize, sortBy, sortDesc])

  
  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  useEffect(() => {
    fetchStats()
  }, [items, fetchStats])

  
  useEffect(() => {
    fetchTableData()
    fetchStats()
  }, [notifCtx.notifications, fetchTableData, fetchStats])

  
  useEffect(() => {
    if (initialLabResultId) {
      handleOpenResultById(initialLabResultId)
      if (onClearInitialId) onClearInitialId()
    }
  }, [initialLabResultId])

  
  useEffect(() => {
    const handleOpenResultEvent = (e: any) => {
      const id = e.detail
      if (id) {
        handleOpenResultById(id)
      }
    }
    window.addEventListener('laboratory:open-result', handleOpenResultEvent)
    return () => {
      window.removeEventListener('laboratory:open-result', handleOpenResultEvent)
    }
  }, [])

  const handleOpenResultById = async (id: string) => {
    try {
      const details = await fetchLabResultById(id)
      setActiveResult(details)

      
      if (details.statusText === 'Назначено') {
        await updateLabStatus(details.id, 'В работе')
        details.statusText = 'В работе'
        toast.info('Направление переведено в статус "В работе"')
        fetchTableData()
      }

      if (details.statusText === 'Завершено') {
        setIsViewOpen(true)
      } else {
        
        const initVals: Record<string, string> = {}
        const testKey = getTestTypeKey(details.type)
        const defs = PARAM_DEFS[testKey] || []

        let existingResults: Record<string, string> = {}
        if (details.resultData) {
          try {
            existingResults = JSON.parse(details.resultData)
          } catch {}
        }

        defs.forEach((p) => {
          initVals[p.key] = existingResults[p.key] ?? (p.isText ? (p.options?.[0] ?? '') : '')
        })

        setFormResults(initVals)
        setFormComments(details.comments || '')
        setIsFormOpen(true)
      }
    } catch (err: any) {
      toast.error(err.message || 'Не удалось открыть детальную информацию')
    }
  }

  
  const handleStartWork = async (id: string) => {
    try {
      await updateLabStatus(id, 'В работе')
      toast.success('Статус исследования изменен на "В работе"')
      fetchTableData()
    } catch (err: any) {
      toast.error(err.message || 'Не удалось обновить статус')
    }
  }

  
  const handleOpenFillForm = async (item: LabResultListItemDto) => {
    await handleOpenResultById(item.id)
  }

  
  const handleOpenView = async (item: LabResultListItemDto) => {
    try {
      const details = await fetchLabResultById(item.id)
      setActiveResult(details)
      setIsViewOpen(true)
    } catch (err: any) {
      toast.error(err.message || 'Не удалось открыть результаты')
    }
  }

  
  const handleResultChange = (key: string, value: string) => {
    setFormResults((prev) => ({ ...prev, [key]: value }))
  }

  
  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setTypeFilter('all')
    setPage(1)
  }

  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc)
    } else {
      setSortBy(column)
      setSortDesc(true)
    }
    setPage(1)
  }

  
  const activeParamDefs = useMemo(() => {
    if (!activeResult) return []
    const key = getTestTypeKey(activeResult.type)
    return PARAM_DEFS[key] || []
  }, [activeResult])

  
  const handleSubmitResults = async () => {
    if (!activeResult) return

    
    let hasEmpty = false
    activeParamDefs.forEach((p) => {
      if (!formResults[p.key]) hasEmpty = true
    })

    if (hasEmpty) {
      toast.warning('Заполните все показатели перед отправкой результатов')
      return
    }

    setSaving(true)
    toast.info('Формирование бланка и сохранение результатов...')

    try {
      
      
      await new Promise((resolve) => setTimeout(resolve, 300))

      const printNode = printContainerRef.current
      if (!printNode) {
        throw new Error('Печатная форма не найдена в DOM')
      }

      const canvas = await html2canvas(printNode, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
      const pw = pdf.internal.pageSize.getWidth()
      const ph = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pw / canvas.width, ph / canvas.height)

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        (pw - canvas.width * ratio) / 2,
        20,
        canvas.width * ratio,
        canvas.height * ratio
      )

      const pdfBlob = pdf.output('blob')
      const pdfFile = new File([pdfBlob], `LabResult_${activeResult.id}.pdf`, {
        type: 'application/pdf'
      })

      
      const uploadRes = await uploadFile(pdfFile)

      
      await submitLabResults(activeResult.id, {
        resultData: JSON.stringify(formResults),
        comments: formComments,
        pdfDocumentPath: uploadRes.objectName 
      })

      toast.success('Результаты успешно внесены и отправлены лечащему врачу!')
      setIsFormOpen(false)
      setActiveResult(null)
      fetchTableData()
    } catch (err: any) {
      toast.error(err.message || 'Произошла ошибка при сохранении результатов')
    } finally {
      setSaving(false)
    }
  }

  
  const handleDownloadPdf = (item: LabResultListItemDto) => {
    if (item.pdfDocumentPath) {
      downloadFileFromServer(`Анализ_${item.type}_${item.patientName}.pdf`, item.pdfDocumentPath)
    } else {
      toast.warning('PDF-документ этого исследования отсутствует')
    }
  }

  return (
    <>
      <Helmet>
        <title>Лаборатория — Клинико-диагностические исследования</title>
      </Helmet>

      <S.PageContainer>
        <S.CardHeader>
          <S.HeaderFlex>
            <div>
              <S.CardTitle>Клинико-диагностическая лаборатория</S.CardTitle>
              <S.HeaderSubtitle>
                Панель управления лабораторными исследованиями ГУ БЦГБ
              </S.HeaderSubtitle>
            </div>
            <S.EmployeeBadge>
              <FlaskConical size={16} color="#2563eb" />
              <S.EmployeeName>{'Сотрудник лаборатории'}</S.EmployeeName>
            </S.EmployeeBadge>
          </S.HeaderFlex>
        </S.CardHeader>

        <S.StatsGrid>
          <S.StatCard $color="#2563eb" $bg="#eff6ff">
            <S.StatHeader>
              <S.StatLabel>Всего исследований</S.StatLabel>
              <S.StatIcon $bg="#eff6ff" $color="#2563eb">
                <ClipboardList size={18} />
              </S.StatIcon>
            </S.StatHeader>
            <S.StatValue>{stats.total}</S.StatValue>
            <S.StatSub>За все время</S.StatSub>
          </S.StatCard>

          <S.StatCard $color="#d97706" $bg="#fffbeb">
            <S.StatHeader>
              <S.StatLabel>Новые направления</S.StatLabel>
              <S.StatIcon $bg="#fffbeb" $color="#d97706">
                <AlertCircle size={18} />
              </S.StatIcon>
            </S.StatHeader>
            <S.StatValue>{stats.pending}</S.StatValue>
            <S.StatSub>Ожидают работы</S.StatSub>
          </S.StatCard>

          <S.StatCard $color="#3b82f6" $bg="#eff6ff">
            <S.StatHeader>
              <S.StatLabel>В работе</S.StatLabel>
              <S.StatIcon $bg="#eff6ff" $color="#3b82f6">
                <Activity size={18} />
              </S.StatIcon>
            </S.StatHeader>
            <S.StatValue>{stats.inProgress}</S.StatValue>
            <S.StatSub>Выполняются сейчас</S.StatSub>
          </S.StatCard>

          <S.StatCard $color="#059669" $bg="#ecfdf5">
            <S.StatHeader>
              <S.StatLabel>Завершено</S.StatLabel>
              <S.StatIcon $bg="#ecfdf5" $color="#059669">
                <CheckCircle2 size={18} />
              </S.StatIcon>
            </S.StatHeader>
            <S.StatValue>{stats.completed}</S.StatValue>
            <S.StatSub>Результаты отправлены</S.StatSub>
          </S.StatCard>
        </S.StatsGrid>

        <S.SectionCard>
          <S.FilterBar>
            <S.SearchInputWrapper>
              <Search size={16} />
              <S.SearchInput
                type="text"
                placeholder="Поиск по ФИО, типу исследования, врачу..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </S.SearchInputWrapper>

            <S.DropdownSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="all">Все статусы</option>
              <option value="Назначено">Назначено</option>
              <option value="В работе">В работе</option>
              <option value="Завершено">Завершено</option>
            </S.DropdownSelect>

            <S.DropdownSelect
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="all">Все виды</option>
              <option value="ОАК">ОАК</option>
              <option value="ОАМ">ОАМ</option>
              <option value="Биохимия крови">Биохимия</option>
              <option value="Коагулограмма">Коагулограмма</option>
              <option value="Мокрота">Мокрота</option>
            </S.DropdownSelect>

            {(search || statusFilter !== 'all' || typeFilter !== 'all') && (
              <S.ResetButton onClick={handleResetFilters}>
                <RotateCcw size={14} /> Сбросить
              </S.ResetButton>
            )}
          </S.FilterBar>

          <S.TableWrapper>
            {loading ? (
              <S.EmptyState>
                <S.LoadingSpinner size={32} />
                <p>Загрузка данных...</p>
              </S.EmptyState>
            ) : items.length === 0 ? (
              <S.EmptyState>
                <FlaskConical size={40} />
                <p>Направления на исследования отсутствуют</p>
              </S.EmptyState>
            ) : (
              <S.Table>
                <thead>
                  <tr>
                    <S.TableTh className="sortable" onClick={() => handleSort('patientName')}>
                      Пациент{' '}
                      {sortBy === 'patientName' && (
                        <ArrowUpDown size={12} style={{ marginLeft: 4 }} />
                      )}
                    </S.TableTh>
                    <S.TableTh>Палата</S.TableTh>
                    <S.TableTh className="sortable" onClick={() => handleSort('doctorName')}>
                      Врач{' '}
                      {sortBy === 'doctorName' && (
                        <ArrowUpDown size={12} style={{ marginLeft: 4 }} />
                      )}
                    </S.TableTh>
                    <S.TableTh className="sortable" onClick={() => handleSort('type')}>
                      Тип исследования{' '}
                      {sortBy === 'type' && <ArrowUpDown size={12} style={{ marginLeft: 4 }} />}
                    </S.TableTh>
                    <S.TableTh className="sortable" onClick={() => handleSort('date')}>
                      Назначено{' '}
                      {sortBy === 'date' && <ArrowUpDown size={12} style={{ marginLeft: 4 }} />}
                    </S.TableTh>
                    <S.TableTh className="sortable" onClick={() => handleSort('status')}>
                      Статус{' '}
                      {sortBy === 'status' && <ArrowUpDown size={12} style={{ marginLeft: 4 }} />}
                    </S.TableTh>
                    <S.TableTh>Действия</S.TableTh>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <S.TableRow key={item.id}>
                      <S.TableTd style={{ fontWeight: 600 }}>{item.patientName}</S.TableTd>
                      <S.TableTd>
                        {item.roomNumber === '—' ? '—' : `Пал. ${item.roomNumber}`}
                      </S.TableTd>
                      <S.TableTd>{item.doctorName}</S.TableTd>
                      <S.TableTd style={{ color: '#2563eb', fontWeight: 550 }}>
                        {item.type}
                      </S.TableTd>
                      <S.TableTd>
                        {formatLocalDateTime(item.date)}
                      </S.TableTd>
                      <S.TableTd>
                        <S.StatusPill $status={item.statusText}>{item.statusText}</S.StatusPill>
                      </S.TableTd>
                      <S.TableTd>
                        <S.ActionButtonsContainer>
                          {item.statusText === 'Назначено' && (
                            <>
                              <S.ActionButton
                                title="В работу"
                                onClick={() => handleStartWork(item.id)}
                              >
                                <Play size={13} />
                              </S.ActionButton>
                              <S.ActionButton
                                $variant="primary"
                                onClick={() => handleOpenFillForm(item)}
                              >
                                Заполнить
                              </S.ActionButton>
                            </>
                          )}
                          {item.statusText === 'В работе' && (
                            <S.ActionButton
                              $variant="primary"
                              onClick={() => handleOpenFillForm(item)}
                            >
                              Заполнить
                            </S.ActionButton>
                          )}
                          {item.statusText === 'Завершено' && (
                            <>
                              <S.ActionButton
                                $variant="ghost"
                                title="Открыть результаты"
                                onClick={() => handleOpenView(item)}
                              >
                                <Eye size={13} />
                              </S.ActionButton>
                              <S.ActionButton
                                $variant="ghost"
                                title="Скачать PDF"
                                onClick={() => handleDownloadPdf(item)}
                              >
                                <Download size={13} />
                              </S.ActionButton>
                            </>
                          )}
                        </S.ActionButtonsContainer>
                      </S.TableTd>
                    </S.TableRow>
                  ))}
                </tbody>
              </S.Table>
            )}
          </S.TableWrapper>

          {totalCount > 0 && (
            <S.PaginationRow>
              <S.PaginationControls>
                <S.PaginationInfo>
                  Показано {items.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, totalCount)} из {totalCount}
                </S.PaginationInfo>
                <S.PageSizeWrapper>
                  <S.PageSizeLabel>По</S.PageSizeLabel>
                  <S.PageSizeSelect
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setPage(1)
                    }}
                  >
                    {[5, 10, 20, 50].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </S.PageSizeSelect>
                </S.PageSizeWrapper>
              </S.PaginationControls>
              <S.PaginationBtns>
                <S.PageBtn onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronLeft size={14} />
                  <ChevronLeft size={14} />
                </S.PageBtn>
                <S.PageBtn onClick={() => setPage(page - 1)} disabled={page === 1}>
                  <ChevronLeft size={14} />
                </S.PageBtn>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let p = i + 1
                  if (totalPages > 5) {
                    const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                    p = start + i
                  }
                  return (
                    <S.PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>
                      {p}
                    </S.PageBtn>
                  )
                })}
                <S.PageBtn onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                  <ChevronRight size={14} />
                </S.PageBtn>
                <S.PageBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  <ChevronRight size={14} />
                  <ChevronRight size={14} />
                </S.PageBtn>
              </S.PaginationBtns>
            </S.PaginationRow>
          )}
        </S.SectionCard>
      </S.PageContainer>

      {isFormOpen && activeResult && (
        <S.ModalOverlay onClick={() => setIsFormOpen(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h2>Оформление результатов исследования</h2>
              <S.CloseButton onClick={() => setIsFormOpen(false)}>
                <X size={18} />
              </S.CloseButton>
            </S.ModalHeader>
            <S.ModalBody>
              <S.PatientInfoBlock>
                <S.InfoItem>
                  <span className="label">Пациент</span>
                  <span className="value">{activeResult.patientName}</span>
                </S.InfoItem>
                <S.InfoItem>
                  <span className="label">Параметры</span>
                  <span className="value">
                    {activeResult.patientAge} лет, {activeResult.patientGender}
                  </span>
                </S.InfoItem>
                <S.InfoItem>
                  <span className="label">Палата</span>
                  <span className="value">
                    {activeResult.roomNumber === '—' ? '—' : `Пал. ${activeResult.roomNumber}`}
                  </span>
                </S.InfoItem>
                <S.InfoItem>
                  <span className="label">Назначил</span>
                  <span className="value">{activeResult.doctorName}</span>
                </S.InfoItem>
              </S.PatientInfoBlock>

              <S.ResultSummaryGrid>
                <S.SummaryItem>
                  <strong>Исследование:</strong> {activeResult.type}
                </S.SummaryItem>
                <S.SummaryItem>
                  <strong>Дата назначения:</strong>{' '}
                  {formatLocalDateTime(activeResult.date)}
                </S.SummaryItem>
                <S.SummaryItemFull>
                  <strong>Диагноз:</strong> {activeResult.diagnosis}
                </S.SummaryItemFull>
                {activeResult.reason && (
                  <S.SummaryItemFull>
                    <strong>Примечание врача:</strong> {activeResult.reason}
                  </S.SummaryItemFull>
                )}
              </S.ResultSummaryGrid>

              <S.SectionTitle>Результаты исследования</S.SectionTitle>
              <S.ResultsGrid>
                {activeParamDefs.map((p) => {
                  const val = formResults[p.key] || ''
                  const interpretation = p.interpret(val, activeResult.patientGender)
                  const norm = p.getNorm(activeResult.patientGender)

                  return (
                    <S.ResultFieldCard key={p.key}>
                      <S.FieldHeader>
                        <S.FieldLabel>{p.name}</S.FieldLabel>
                        <S.ReferenceBadge title="Нормативные референсные значения">
                          Норма: {norm.text} {p.unit}
                        </S.ReferenceBadge>
                      </S.FieldHeader>
                      <S.InputWrapper>
                        {p.isText ? (
                          <S.ResultDropdownSelect
                            value={val}
                            onChange={(e) => handleResultChange(p.key, e.target.value)}
                          >
                            {p.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </S.ResultDropdownSelect>
                        ) : (
                          <>
                            <S.InputField
                              type="number"
                              step="any"
                              placeholder="0.00"
                              value={val}
                              onChange={(e) => handleResultChange(p.key, e.target.value)}
                            />
                            {p.unit && <S.UnitLabel>{p.unit}</S.UnitLabel>}
                          </>
                        )}
                      </S.InputWrapper>
                      {val && (
                        <S.InterpretationLabel $severity={interpretation.severity}>
                          {interpretation.text}
                        </S.InterpretationLabel>
                      )}
                    </S.ResultFieldCard>
                  )
                })}
              </S.ResultsGrid>

              <S.CommentsGroup>
                <S.CommentsLabel>Заключение лаборатории / Комментарии</S.CommentsLabel>
                <S.CommentsTextarea
                  placeholder="Введите клиническое заключение или дополнительные примечания лаборанта..."
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
                />
              </S.CommentsGroup>
            </S.ModalBody>

            <S.ModalFooter>
              <S.ActionButton
                $variant="ghost"
                onClick={() => setIsFormOpen(false)}
                disabled={saving}
              >
                Отмена
              </S.ActionButton>
              <S.ActionButton $variant="primary" onClick={handleSubmitResults} disabled={saving}>
                {saving ? 'Сохранение...' : 'Подтвердить и отправить врачу'}
              </S.ActionButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {isViewOpen && activeResult && (
        <S.ModalOverlay onClick={() => setIsViewOpen(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h2>Результаты лабораторного исследования</h2>
              <S.CloseButton onClick={() => setIsViewOpen(false)}>
                <X size={18} />
              </S.CloseButton>
            </S.ModalHeader>
            <S.ModalBody style={activeResult.pdfDocumentPath ? { padding: 0 } : undefined}>
              {activeResult.pdfDocumentPath ? (
                <iframe
                  src={`${process.env.REACT_APP_API_URL ?? ''}/api/files/download/${encodeURIComponent(activeResult.pdfDocumentPath)}`}
                  title="Результат анализа PDF"
                  style={{ width: '100%', height: '70vh', minHeight: '600px', border: 'none', display: 'block' }}
                />
              ) : (
                <>
                  <S.PatientInfoBlock>
                    <S.InfoItem>
                      <span className="label">Пациент</span>
                      <span className="value">{activeResult.patientName}</span>
                    </S.InfoItem>
                    <S.InfoItem>
                      <span className="label">Палата</span>
                      <span className="value">
                        {activeResult.roomNumber === '—' ? '—' : `Пал. ${activeResult.roomNumber}`}
                      </span>
                    </S.InfoItem>
                    <S.InfoItem>
                      <span className="label">Лечащий врач</span>
                      <span className="value">{activeResult.doctorName}</span>
                    </S.InfoItem>
                    <S.InfoItem>
                      <span className="label">Выполнил лаборант</span>
                      <span className="value">{activeResult.laboratoryEmployeeName}</span>
                    </S.InfoItem>
                  </S.PatientInfoBlock>

                  <S.ResultSummaryGrid>
                    <S.SummaryItem>
                      <strong>Исследование:</strong> {activeResult.type}
                    </S.SummaryItem>
                    <S.SummaryItem>
                      <strong>Дата выполнения:</strong>{' '}
                      {formatLocalDateTime(activeResult.dateUpdated)}
                    </S.SummaryItem>
                    <S.SummaryItemFull>
                      <strong>Диагноз:</strong> {activeResult.diagnosis}
                    </S.SummaryItemFull>
                  </S.ResultSummaryGrid>

                  <S.SectionTitle>Результаты показателей</S.SectionTitle>
                  <S.TableWrapper>
                    <S.Table>
                      <thead>
                        <tr>
                          <S.TableTh>Показатель</S.TableTh>
                          <S.TableTh>Результат</S.TableTh>
                          <S.TableTh>Нормальные значения</S.TableTh>
                          <S.TableTh>Интерпретация</S.TableTh>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          let parsedResults: Record<string, string> = {}
                          if (activeResult.resultData) {
                            try {
                              parsedResults = JSON.parse(activeResult.resultData)
                            } catch {}
                          }

                          return activeParamDefs.map((p) => {
                            const val = parsedResults[p.key] || '—'
                            const interpretation = p.interpret(val, activeResult.patientGender)
                            const norm = p.getNorm(activeResult.patientGender)

                            return (
                              <S.TableRow key={p.key}>
                                <S.TableTd style={{ fontWeight: 600 }}>{p.name}</S.TableTd>
                                <S.TableTd style={{ fontWeight: 700 }}>
                                  {val} {p.unit}
                                </S.TableTd>
                                <S.TableTd>
                                  {norm.text} {p.unit}
                                </S.TableTd>
                                <S.TableTd>
                                  {val !== '—' ? (
                                    <S.InterpretationLabel $severity={interpretation.severity}>
                                      {interpretation.text}
                                    </S.InterpretationLabel>
                                  ) : (
                                    '—'
                                  )}
                                </S.TableTd>
                              </S.TableRow>
                            )
                          })
                        })()}
                      </tbody>
                    </S.Table>
                  </S.TableWrapper>

                  {activeResult.comments && (
                    <S.ConclusionBlock>
                      <S.ConclusionTitle>Заключение лаборатории:</S.ConclusionTitle>
                      <S.ConclusionText>{activeResult.comments}</S.ConclusionText>
                    </S.ConclusionBlock>
                  )}
                </>
              )}
            </S.ModalBody>
            <S.ModalFooter>
              {activeResult.pdfDocumentPath && (
                <S.ActionButton $variant="primary" onClick={() => handleDownloadPdf(activeResult)}>
                  <Download size={14} /> Скачать PDF-бланк
                </S.ActionButton>
              )}
              <S.ActionButton $variant="ghost" onClick={() => setIsViewOpen(false)}>
                Закрыть
              </S.ActionButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      <S.PrintWrapper>
        {activeResult && (
          <S.PrintContainer ref={printContainerRef}>
            <S.PrintHeaderFlex>
              <div>
                <S.PrintHospitalName>
                  ГУ БЕНДЕРСКАЯ ЦЕНТРАЛЬНАЯ ГОРОДСКАЯ БОЛЬНИЦА
                </S.PrintHospitalName>
                <S.PrintDepartmentName>Клинико-диагностическая лаборатория</S.PrintDepartmentName>
                <S.PrintAddress>Адрес: ПМР, г. Бендеры, ул. Бендерского Восстания, 146</S.PrintAddress>
              </div>
              <S.PrintDateInfo>
                <div>
                  <strong>Дата формирования:</strong> {formatLocalDate(new Date())}
                </div>
                <div>
                  <strong>Время:</strong>{' '}
                  {formatLocalTime(new Date())}
                </div>
              </S.PrintDateInfo>
            </S.PrintHeaderFlex>

            <S.PrintTitleContainer>
              <S.PrintTitle>Результаты лабораторных исследований</S.PrintTitle>
              <S.PrintSubtitle>{activeResult.type}</S.PrintSubtitle>
            </S.PrintTitleContainer>

            <S.PrintPatientCard>
              <div>
                <strong>Пациент (ФИО):</strong> {activeResult.patientName}
              </div>
              <div>
                <strong>Палата / Койка:</strong>{' '}
                {activeResult.roomNumber === '—' ? '—' : `Пал. ${activeResult.roomNumber}`}
                {activeResult.bedNumber ? `, Койка ${activeResult.bedNumber}` : ''}
              </div>
              <div>
                <strong>Возраст:</strong> {activeResult.patientAge} лет
              </div>
              <div>
                <strong>Направивший врач:</strong> {activeResult.doctorName}
              </div>
              <div>
                <strong>Пол:</strong> {activeResult.patientGender}
              </div>
              <div>
                <strong>Диагноз врача:</strong> {activeResult.diagnosis}
              </div>
              <S.SummaryItemFull>
                <strong>Дата назначения:</strong>{' '}
                {formatLocalDateTime(activeResult.date)}
              </S.SummaryItemFull>
              {activeResult.reason && (
                <S.SummaryItemFull>
                  <strong>Примечание врача:</strong> {activeResult.reason}
                </S.SummaryItemFull>
              )}
            </S.PrintPatientCard>

            <S.PrintTable>
              <thead>
                <tr>
                  <S.PrintTh>Показатель</S.PrintTh>
                  <S.PrintTh>Результат</S.PrintTh>
                  <S.PrintTh>Референс</S.PrintTh>
                  <S.PrintTh>Интерпретация</S.PrintTh>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let vals: Record<string, string> = {}
                  try {
                    vals = JSON.parse(JSON.stringify(formResults))
                  } catch {}

                  return activeParamDefs.map((p) => {
                    const val = vals[p.key] || '—'
                    const norm = p.getNorm(activeResult.patientGender)
                    const interp = p.interpret(val, activeResult.patientGender)

                    let color = '#16a34a' 
                    if (interp.severity === 'warning') color = '#d97706'
                    else if (interp.severity === 'critical') color = '#dc2626'

                    return (
                      <S.PrintTableRow key={p.key}>
                        <S.PrintTd style={{ fontWeight: 650 }}>{p.name}</S.PrintTd>
                        <S.PrintTd style={{ fontWeight: 700 }}>
                          {val} {p.unit}
                        </S.PrintTd>
                        <S.PrintTd style={{ color: '#64748b' }}>
                          {norm.text} {p.unit}
                        </S.PrintTd>
                        <S.PrintTd style={{ fontWeight: 600, color }}>
                          {val !== '—' ? interp.text : '—'}
                        </S.PrintTd>
                      </S.PrintTableRow>
                    )
                  })
                })()}
              </tbody>
            </S.PrintTable>

            <S.PrintConclusionBlock>
              <strong>Заключение клинико-диагностической лаборатории:</strong>
              <S.PrintConclusionText>
                {formComments ||
                  'Результаты исследования в пределах нормы. Рекомендуется консультация лечащего врача.'}
              </S.PrintConclusionText>
            </S.PrintConclusionBlock>

            <S.PrintSignaturesFlex>
              <div>
                <strong>Выполнил (лаборант):</strong> {displayName || 'Сотрудник КДЛ'}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>
                  <strong>Дата выполнения:</strong> {formatLocalDate(new Date())}
                </div>
                <S.PrintSignatureLine>Подпись / М.П. ___________________</S.PrintSignatureLine>
              </div>
            </S.PrintSignaturesFlex>
          </S.PrintContainer>
        )}
      </S.PrintWrapper>
    </>
  )
}

export default LaboratoryPage
