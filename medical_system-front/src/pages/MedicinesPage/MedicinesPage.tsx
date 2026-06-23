import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { formatLocalDate, formatLocalDateTime, toBackendDateString } from 'utils/dateUtils'
import {
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit3,
  Trash2,
  RefreshCw,
  Download,
  FileText,
  User,
  Calendar,
  Pill,
  Filter,
  Archive,
  RotateCcw,
  Info,
  TrendingDown,
  TrendingUp,
  Activity,
  Check
} from 'lucide-react'

import {
  PageContainer,
  Header,
  HeaderLeft,
  HeaderTitle,
  HeaderSubtitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatSub,
  ControlBar,
  ControlLeft,
  ControlCenter,
  ControlRight,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterInput,
  FilterDateInput,
  FilterToggle,
  AddButton,
  ExportButton,
  TableWrapper,
  TableScrollWrapper,
  Table,
  Th,
  Td,
  Tr,
  DrugName,
  DrugCategory,
  BalanceCell,
  BalanceValue,
  BalanceUnit,
  BalanceBar,
  BalanceFill,
  StatusBadge,
  OperationBadge,
  DateCell,
  NullCell,
  PaginationBar,
  PaginationInfo,
  PaginationControls,
  PageBtn,
  PageSizeSelect,
  NoData,
  DrawerOverlay,
  DrawerPanel,
  DrawerHeader,
  DrawerTitle,
  DrawerSubtitle,
  DrawerCloseBtn,
  TabBar,
  TabBtn,
  DrawerContent,
  OverviewSection,
  SectionTitle,
  InfoGrid,
  InfoCard,
  InfoCardLabel,
  InfoCardValue,
  InfoCardSub,
  DescriptionBox,
  DrawerBalanceBar,
  DrawerBalanceFill,
  WarningAlert,
  ActionButtonRow,
  EditBtn,
  DeleteBtn,
  FormGrid,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextArea,
  AutoFillInfo,
  ErrorAlert,
  SaveButton,
  CancelButton,
  PatientSearchWrapper,
  PatientDropdown,
  PatientOption,
  PatientOptionName,
  PatientOptionInfo,
  HistorySearch,
  HistoryTable,
  HTh,
  HTd,
  HTr,
  HistoryPagination,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ConfirmDeleteText,
  DangerButton,
  ArchiveButton,
  CloseBtn,
  DrawerFormFooter
} from './styled'

import {
  Medicine,
  MedicineOperationLog,
  MedicineStatus,
  OperationType,
  WriteOffReason,
  MedicineCategory,
  MedicineUnit,
  computeMedicineStatus
} from 'data/mockData'

import {
  fetchAllMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  recordReceipt,
  recordWriteoff
} from 'api/medicinesApi'

import { fetchAllPatients } from 'api/patientsApi'
import { toast } from 'react-toastify'

const CURRENT_USER = { id: 'STAFF-01', name: 'Иванова И.И.' }

const CATEGORIES: MedicineCategory[] = [
  'Антибиотики',
  'Анальгетики',
  'Гормоны',
  'Кардио',
  'Антисептики',
  'Прочее'
]
const UNITS: MedicineUnit[] = ['мл', 'мг', 'табл.', 'амп.', 'фл.', 'ед.']

const OP_LABELS: Record<OperationType, string> = {
  receipt: 'Поступление',
  writeoff: 'Списание',
  adjustment: 'Корректировка'
}

const REASON_LABELS: Record<WriteOffReason, string> = {
  patient: 'Назначение пациенту',
  iv: 'Внутривенная процедура',
  im: 'Внутримышечная процедура',
  drip: 'Капельница',
  adjustment: 'Корректировка',
  other: 'Другое'
}

const STATUS_LABELS: Record<MedicineStatus, string> = {
  norm: 'Норма',
  low: 'Мало',
  empty: 'Отсутствует'
}

const formatDate = (date: string | null) => {
  return formatLocalDate(date)
}

const formatDateTime = (date: string) => {
  return formatLocalDateTime(date)
}

const genId = () => `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

function useCounter(target: number, duration = 1000) {
  const [value, setValue] = useState(0)
  const raf = useRef<number | null>(null)

  const animate = (start: number, end: number, dur: number) => {
    if (raf.current) cancelAnimationFrame(raf.current)
    let startTs: number | null = null

    const step = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / dur, 1)
      setValue(Math.floor(progress * (end - start) + start))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    animate(0, target, duration)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [target])

  return { value, replay: () => animate(0, target, Math.round(duration * 0.8)) }
}

function AnimatedMedStatCard({
  targetValue,
  color,
  bg,
  icon,
  label,
  sub
}: {
  targetValue: number
  color: string
  bg: string
  icon: React.ReactNode
  label: string
  sub: string
}) {
  const { value, replay } = useCounter(targetValue, 1000)
  return (
    <StatCard $color={color} onMouseEnter={replay}>
      <StatIcon $bg={bg} $color={color}>
        {icon}
      </StatIcon>
      <StatLabel>{label}</StatLabel>
      <StatValue>{value}</StatValue>
      <StatSub>{sub}</StatSub>
    </StatCard>
  )
}

const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [patients, setPatients] = useState<any[]>([])

  const loadData = useCallback(async () => {
    try {
      const [medsData, patientsData] = await Promise.all([fetchAllMedicines(), fetchAllPatients()])
      const normalized = medsData.map((m) => {
        const opLog = (m.operationLog || []).map((log) => {
          let logType: any = 'adjustment'
          if (log.type) {
            const lower = log.type.toLowerCase()
            if (lower === 'получено' || lower === 'receipt' || lower === 'поступление')
              logType = 'receipt'
            else if (lower === 'списано' || lower === 'writeoff' || lower === 'списание')
              logType = 'writeoff'
            else if (
              lower === 'откорректировано' ||
              lower === 'adjustment' ||
              lower === 'корректировка'
            )
              logType = 'adjustment'
          }
          return {
            ...log,
            type: logType
          }
        })

        let lastOp: any = undefined
        if (opLog.length > 0) {
          lastOp = opLog[0].type
        } else if (m.lastOperation) {
          const lower = m.lastOperation.toLowerCase()
          if (lower === 'получено' || lower === 'receipt' || lower === 'поступление')
            lastOp = 'receipt'
          else if (lower === 'списано' || lower === 'writeoff' || lower === 'списание')
            lastOp = 'writeoff'
          else if (
            lower === 'откорректировано' ||
            lower === 'adjustment' ||
            lower === 'корректировка'
          )
            lastOp = 'adjustment'
        }

        return {
          ...m,
          status: computeMedicineStatus(m.currentBalance, m.minBalance),
          lastOperation: lastOp,
          operationLog: opLog
        }
      })
      setMedicines(normalized)
      setPatients(patientsData)
    } catch (e) {
      console.error('Failed to load medicines or patients', e)
    }
  }, [])
  useEffect(() => {
    loadData()
  }, [loadData])

  const [search, setSearch] = useState('')

  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterOnlyActive, setFilterOnlyActive] = useState(false)
  const [filterOnlyCompleted, setFilterOnlyCompleted] = useState(false)
  const [filterHideEmpty, setFilterHideEmpty] = useState(false)
  const [filterWarnings, setFilterWarnings] = useState(false)

  const [filterReceiptDateFrom, setFilterReceiptDateFrom] = useState('')
  const [filterReceiptDateTo, setFilterReceiptDateTo] = useState('')
  const [filterWriteOffDateFrom, setFilterWriteOffDateFrom] = useState('')
  const [filterWriteOffDateTo, setFilterWriteOffDateTo] = useState('')
  const [filterOpType, setFilterOpType] = useState<string>('')
  const [filterBalanceLessThan, setFilterBalanceLessThan] = useState('')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [drawerMedicineId, setDrawerMedicineId] = useState<string | null>(null)
  const [drawerTab, setDrawerTab] = useState<'overview' | 'receipt' | 'writeoff' | 'history'>(
    'overview'
  )

  const [receiptForm, setReceiptForm] = useState({
    name: '',
    date: toBackendDateString(new Date()),
    quantity: '',
    unit: '' as MedicineUnit | '',
    supplier: '',
    comment: ''
  })
  const [writeoffForm, setWriteoffForm] = useState({
    date: toBackendDateString(new Date()),
    quantity: '',
    reason: 'patient' as WriteOffReason,
    patientQuery: '',
    selectedPatientId: '',
    selectedPatientName: '',
    comment: ''
  })

  const [writeoffError, setWriteoffError] = useState('')
  const [patientDropdown, setPatientDropdown] = useState(false)

  const [historySearch, setHistorySearch] = useState('')
  const [historyFilterType, setHistoryFilterType] = useState<string>('')
  const [historyPage, setHistoryPage] = useState(1)
  const historyPageSize = 10

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    category: 'Прочее' as MedicineCategory,
    unit: 'табл.' as MedicineUnit,
    initialBalance: '',
    minBalance: ''
  })
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '' as MedicineCategory,
    unit: '' as MedicineUnit,
    minBalance: '',
    currentBalance: ''
  })

  const historyExportRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const selectedMedicine = useMemo(
    () => (drawerMedicineId ? medicines.find((m) => m.id === drawerMedicineId) || null : null),
    [drawerMedicineId, medicines]
  )

  const resetFilters = useCallback(() => {
    setSearch('')
    setFilterCategory('')
    setFilterOnlyActive(false)
    setFilterOnlyCompleted(false)
    setFilterHideEmpty(false)
    setFilterWarnings(false)
    setFilterReceiptDateFrom('')
    setFilterReceiptDateTo('')
    setFilterWriteOffDateFrom('')
    setFilterWriteOffDateTo('')
    setFilterOpType('')
    setFilterBalanceLessThan('')
    setPage(1)
  }, [])
  const hasActiveFilters = useMemo(
    () =>
      search !== '' ||
      filterCategory !== '' ||
      filterOnlyActive ||
      filterOnlyCompleted ||
      filterHideEmpty ||
      filterWarnings ||
      filterReceiptDateFrom !== '' ||
      filterReceiptDateTo !== '' ||
      filterWriteOffDateFrom !== '' ||
      filterWriteOffDateTo !== '' ||
      filterOpType !== '' ||
      filterBalanceLessThan !== '',
    [
      search,
      filterCategory,
      filterOnlyActive,
      filterOnlyCompleted,
      filterHideEmpty,
      filterWarnings,
      filterReceiptDateFrom,
      filterReceiptDateTo,
      filterWriteOffDateFrom,
      filterWriteOffDateTo,
      filterOpType,
      filterBalanceLessThan
    ]
  )

  const filteredMedicines = useMemo(() => {
    const q = search.toLowerCase().trim()
    return medicines.filter((m) => {
      if (m.isArchived) return false

      if (q) {
        const match =
          (m.name || '').toLowerCase().includes(q) ||
          (m.unit || '').toLowerCase().includes(q) ||
          (m.lastReceiptFrom || '').toLowerCase().includes(q) ||
          (m.lastChangedBy || '').toLowerCase().includes(q) ||
          (STATUS_LABELS[m.status] || '').toLowerCase().includes(q) ||
          (m.operationLog || []).some((l) => (l.performedBy || '').toLowerCase().includes(q))
        if (!match) return false
      }

      if (filterCategory && m.category !== filterCategory) return false

      if (filterOnlyActive && m.status === 'empty') return false
      if (filterOnlyCompleted && m.status !== 'empty') return false

      if (filterHideEmpty && m.currentBalance === 0) return false

      if (filterReceiptDateFrom && m.lastReceiptDate && m.lastReceiptDate < filterReceiptDateFrom)
        return false
      if (filterReceiptDateTo && m.lastReceiptDate && m.lastReceiptDate > filterReceiptDateTo)
        return false

      if (
        filterWriteOffDateFrom &&
        m.lastWriteOffDate &&
        m.lastWriteOffDate < filterWriteOffDateFrom
      )
        return false

      if (filterWriteOffDateTo && m.lastWriteOffDate && m.lastWriteOffDate > filterWriteOffDateTo)
        return false

      if (filterOpType && m.lastOperation !== filterOpType) return false

      if (filterBalanceLessThan !== '' && !isNaN(Number(filterBalanceLessThan))) {
        if (m.currentBalance >= Number(filterBalanceLessThan)) return false
      }

      if (filterWarnings && m.status === 'norm') return false

      return true
    })
  }, [
    medicines,
    search,
    filterCategory,
    filterOnlyActive,
    filterOnlyCompleted,
    filterHideEmpty,
    filterReceiptDateFrom,
    filterReceiptDateTo,
    filterWriteOffDateFrom,
    filterWriteOffDateTo,
    filterOpType,
    filterBalanceLessThan,
    filterWarnings
  ])

  const totalPages = Math.max(1, Math.ceil(filteredMedicines.length / pageSize))
  const paginatedMedicines = filteredMedicines.slice((page - 1) * pageSize, page * pageSize)

  const stats = useMemo(() => {
    const active = medicines.filter((m) => !m.isArchived)
    const low = active.filter((m) => m.status === 'low').length
    const empty = active.filter((m) => m.status === 'empty').length
    const today = toBackendDateString(new Date())
    const todayOps = active.reduce(
      (acc, m) => acc + m.operationLog.filter((l) => l.date.startsWith(today)).length,
      0
    )
    return { total: active.length, low, empty, todayOps }
  }, [medicines])

  const openDrawer = useCallback((med: Medicine) => {
    setDrawerMedicineId(med.id)
    setDrawerTab('overview')
    setHistorySearch('')
    setHistoryFilterType('')
    setHistoryPage(1)
    setWriteoffError('')
    setReceiptForm((prev) => ({ ...prev, name: med.name, unit: med.unit }))
    setWriteoffForm((prev) => ({
      ...prev,
      date: toBackendDateString(new Date()),
      quantity: '',
      reason: 'patient',
      patientQuery: '',
      selectedPatientId: '',
      selectedPatientName: '',
      comment: ''
    }))
  }, [])

  const closeDrawer = () => setDrawerMedicineId(null)

  const handleReceiptSave = async () => {
    if (!selectedMedicine) return
    const qty = Number(receiptForm.quantity)
    if (!qty || qty <= 0) return

    try {
      await recordReceipt(selectedMedicine.id, {
        date: receiptForm.date,
        quantity: qty,
        supplier: receiptForm.supplier,
        comment: receiptForm.comment
      })
      await loadData()
      setReceiptForm((prev) => ({ ...prev, quantity: '', supplier: '', comment: '' }))
      setDrawerTab('overview')
      toast.success('Поступление успешно записано!')
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || 'Ошибка при записи поступления')
    }
  }

  const handleWriteoffSave = async () => {
    if (!selectedMedicine) return
    const qty = Number(writeoffForm.quantity)
    if (!qty || qty <= 0) return

    if (qty > selectedMedicine.currentBalance) {
      setWriteoffError('Недостаточно препарата на складе')
      toast.error('Недостаточно препарата на складе')
      return
    }
    setWriteoffError('')

    try {
      await recordWriteoff(selectedMedicine.id, {
        date: writeoffForm.date,
        quantity: qty,
        reason: writeoffForm.reason,
        patientId: writeoffForm.selectedPatientId || undefined,
        patientName: writeoffForm.selectedPatientName || undefined,
        comment: writeoffForm.comment
      })
      await loadData()
      setWriteoffForm((prev) => ({
        ...prev,
        quantity: '',
        patientQuery: '',
        selectedPatientId: '',
        selectedPatientName: '',
        comment: '',
        date: toBackendDateString(new Date())
      }))
      setDrawerTab('overview')
      toast.success('Списание успешно записано!')
    } catch (e: any) {
      setWriteoffError(e.message || 'Ошибка списания')
      toast.error(e.message || 'Ошибка при записи списания')
    }
  }

  const handleEditSave = async () => {
    if (!selectedMedicine) return
    const newBalance = Number(editForm.currentBalance)
    const newMin = Number(editForm.minBalance)

    try {
      await updateMedicine(selectedMedicine.id, {
        name: editForm.name,
        description: editForm.description,
        category: editForm.category,
        unit: editForm.unit,
        currentBalance: newBalance,
        minBalance: newMin
      })
      await loadData()
      setShowEditModal(false)
      toast.success('Препарат успешно изменен!')
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || 'Ошибка при изменении препарата')
    }
  }

  const handleAddSave = async () => {
    if (!addForm.name.trim()) return
    const balance = Number(addForm.initialBalance) || 0
    const minBal = Number(addForm.minBalance) || 0

    try {
      await createMedicine({
        name: addForm.name.trim(),
        description: addForm.description.trim(),
        category: addForm.category,
        unit: addForm.unit,
        initialBalance: balance,
        minBalance: minBal
      })
      await loadData()
      setShowAddModal(false)
      setAddForm({
        name: '',
        description: '',
        category: 'Прочее',
        unit: 'табл.',
        initialBalance: '',
        minBalance: ''
      })
      toast.success('Препарат добавлен!')
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || 'Ошибка при добавлении препарата')
    }
  }

  const handleDelete = async () => {
    if (!selectedMedicine) return
    try {
      await deleteMedicine(selectedMedicine.id)
      await loadData()
      setShowDeleteConfirm(false)
      closeDrawer()
      toast.success('Препарат успешно удален!')
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || 'Ошибка при удалении препарата')
    }
  }

  const filteredHistory = useMemo(() => {
    if (!selectedMedicine) return []
    const sorted = [...selectedMedicine.operationLog].sort((a, b) => b.date.localeCompare(a.date))
    return sorted.filter((l) => {
      if (historyFilterType && l.type !== historyFilterType) return false
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase()
        return (
          (l.performedBy || '').toLowerCase().includes(q) ||
          (l.comment || '').toLowerCase().includes(q) ||
          (l.patientName || '').toLowerCase().includes(q) ||
          (OP_LABELS[l.type] || '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedMedicine, historySearch, historyFilterType])

  const historyTotalPages = Math.max(1, Math.ceil(filteredHistory.length / historyPageSize))
  const paginatedHistory = filteredHistory.slice(
    (historyPage - 1) * historyPageSize,
    historyPage * historyPageSize
  )

  const filteredPatients = useMemo(() => {
    if (!writeoffForm.patientQuery.trim()) return []
    const q = writeoffForm.patientQuery.toLowerCase()
    return patients
      .filter(
        (p) =>
          `${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase().includes(q) ||
          p.medcardNum.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [patients, writeoffForm.patientQuery])

  const handleHistoryExport = async () => {
    if (!historyExportRef.current) return
    setIsExporting(true)

    const scrollContainers: { el: HTMLElement; overflow: string; overflowX: string }[] = []
    let node: HTMLElement | null = historyExportRef.current.parentElement
    while (node) {
      const style = window.getComputedStyle(node)
      if (
        style.overflow === 'auto' ||
        style.overflow === 'hidden' ||
        style.overflow === 'scroll' ||
        style.overflowX === 'auto' ||
        style.overflowX === 'hidden' ||
        style.overflowX === 'scroll'
      ) {
        scrollContainers.push({
          el: node,
          overflow: node.style.overflow,
          overflowX: node.style.overflowX
        })
        node.style.overflow = 'visible'
        node.style.overflowX = 'visible'
      }
      node = node.parentElement
    }

    const refEl = historyExportRef.current
    const prevWidth = refEl.style.width
    const prevOverflow = refEl.style.overflow
    refEl.style.width = refEl.scrollWidth + 'px'
    refEl.style.overflow = 'visible'

    try {
      const canvas = await html2canvas(refEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: refEl.scrollWidth,
        height: refEl.scrollHeight,
        windowWidth: refEl.scrollWidth
      })

      const imgData = canvas.toDataURL('image/png')

      const A4_W = 297
      const A4_H = 210
      const imgW = canvas.width
      const imgH = canvas.height
      const ratio = imgW / imgH

      let pdfW = A4_W
      let pdfH = A4_W / ratio
      if (pdfH > A4_H) {
        pdfH = A4_H
        pdfW = A4_H * ratio
      }

      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({
        orientation: ratio >= 1 ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const offsetX = (pdf.internal.pageSize.getWidth() - pdfW) / 2
      const offsetY = (pdf.internal.pageSize.getHeight() - pdfH) / 2

      pdf.addImage(imgData, 'PNG', offsetX, offsetY, pdfW, pdfH)
      pdf.save(`История_${selectedMedicine?.name}_${formatLocalDate(new Date())}.pdf`)
    } catch (e) {
      console.error('PDF export error', e)
    } finally {
      refEl.style.width = prevWidth
      refEl.style.overflow = prevOverflow
      scrollContainers.forEach(({ el, overflow, overflowX }) => {
        el.style.overflow = overflow
        el.style.overflowX = overflowX
      })
      setIsExporting(false)
    }
  }

  const openEditModal = () => {
    if (!selectedMedicine) return
    setEditForm({
      name: selectedMedicine.name,
      description: selectedMedicine.description,
      category: selectedMedicine.category,
      unit: selectedMedicine.unit,
      minBalance: String(selectedMedicine.minBalance),
      currentBalance: String(selectedMedicine.currentBalance)
    })
    setShowEditModal(true)
  }

  const StatusIcon = ({ status }: { status: MedicineStatus }) => {
    if (status === 'empty') return <AlertCircle size={11} />
    if (status === 'low') return <AlertTriangle size={11} />
    return <CheckCircle size={11} />
  }

  const OpIcon = ({ type }: { type: OperationType | null | undefined }) => {
    if (type === 'receipt') return <TrendingUp size={11} />
    if (type === 'writeoff') return <TrendingDown size={11} />
    if (type === 'adjustment') return <RefreshCw size={11} />
    return null
  }

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <HeaderTitle>Учет медикаментов</HeaderTitle>
          <HeaderSubtitle>
            Контроль движения препаратов отделения · поступление, списание, остатки
          </HeaderSubtitle>
        </HeaderLeft>
      </Header>

      <StatsGrid>
        <AnimatedMedStatCard
          targetValue={stats.total}
          color="#2563eb"
          bg="#eff6ff"
          icon={<Package size={20} />}
          label="Препаратов"
          sub="В активном учете"
        />
        <AnimatedMedStatCard
          targetValue={stats.low}
          color="#f59e0b"
          bg="#fffbeb"
          icon={<AlertTriangle size={20} />}
          label="Мало остатка"
          sub="Требуют внимания"
        />
        <AnimatedMedStatCard
          targetValue={stats.empty}
          color="#ef4444"
          bg="#fef2f2"
          icon={<AlertCircle size={20} />}
          label="Отсутствует"
          sub="Требует пополнения"
        />
        <AnimatedMedStatCard
          targetValue={stats.todayOps}
          color="#10b981"
          bg="#ecfdf5"
          icon={<Activity size={20} />}
          label="Операций сегодня"
          sub="Все типы операций"
        />
      </StatsGrid>

      <ControlBar>
        <ControlLeft>
          <SearchWrapper>
            <SearchIcon>
              <Search size={15} />
            </SearchIcon>
            <SearchInput
              id="medicines-search"
              placeholder="Поиск препарата, сотрудника, поставщика..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </SearchWrapper>
        </ControlLeft>

        <ControlCenter>
          <FilterGroup>
            <FilterLabel>
              <Filter size={12} /> Катег.
            </FilterLabel>
            <FilterSelect
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Все</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Тип</FilterLabel>
            <FilterSelect
              value={filterOpType}
              onChange={(e) => {
                setFilterOpType(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Все</option>
              <option value="receipt">Поступление</option>
              <option value="writeoff">Списание</option>
              <option value="adjustment">Корректировка</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Остаток &lt;</FilterLabel>
            <FilterInput
              type="number"
              min={0}
              placeholder="—"
              value={filterBalanceLessThan}
              onChange={(e) => {
                setFilterBalanceLessThan(e.target.value)
                setPage(1)
              }}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Поступление</FilterLabel>
            <FilterDateInput
              type="date"
              value={filterReceiptDateFrom}
              onChange={(e) => {
                setFilterReceiptDateFrom(e.target.value)
                setPage(1)
              }}
              title="От"
            />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>
            <FilterDateInput
              type="date"
              value={filterReceiptDateTo}
              onChange={(e) => {
                setFilterReceiptDateTo(e.target.value)
                setPage(1)
              }}
              title="До"
            />
          </FilterGroup>

          <FilterToggle
            $active={filterWarnings}
            onClick={() => {
              setFilterWarnings((p) => !p)
              setPage(1)
            }}
          >
            <AlertTriangle size={13} />
            Предупреждения
          </FilterToggle>

          <FilterToggle
            $active={filterHideEmpty}
            onClick={() => {
              setFilterHideEmpty((p) => !p)
              setPage(1)
            }}
          >
            Скрыть нулевые
          </FilterToggle>

          <FilterToggle
            $active={filterOnlyActive}
            onClick={() => {
              setFilterOnlyActive((p) => !p)
              setFilterOnlyCompleted(false)
              setPage(1)
            }}
          >
            Только активные
          </FilterToggle>

          <FilterToggle
            $active={filterOnlyCompleted}
            onClick={() => {
              setFilterOnlyCompleted((p) => !p)
              setFilterOnlyActive(false)
              setPage(1)
            }}
          >
            Только завершенные
          </FilterToggle>
        </ControlCenter>

        <ControlRight>
          <AddButton
            id="add-medicine-btn"
            onClick={() => {
              setShowAddModal(true)
            }}
          >
            <Plus size={16} />
            Добавить препарат
          </AddButton>
          {hasActiveFilters && (
            <ExportButton onClick={resetFilters} title="Сбросить все фильтры">
              <RefreshCw size={15} />
              Сбросить фильтры
            </ExportButton>
          )}
        </ControlRight>
      </ControlBar>

      <TableWrapper>
        <TableScrollWrapper>
          <Table>
            <thead>
              <tr>
                <Th $minWidth="200px">Препарат</Th>
                <Th $minWidth="130px">Остаток</Th>
                <Th $minWidth="120px">Дата поступления</Th>
                <Th $minWidth="120px">Дата списания</Th>
                <Th $minWidth="160px">От кого принято</Th>
                <Th $minWidth="130px">Последняя операция</Th>
                <Th $minWidth="130px">Кто изменил</Th>
                <Th $minWidth="130px">Дата обновления</Th>
                <Th $minWidth="120px" $align="center">
                  Статус
                </Th>
              </tr>
            </thead>
            <tbody>
              {paginatedMedicines.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <NoData>
                      <Package size={48} strokeWidth={1.2} />
                      <div>Препараты не найдены по заданным критериям</div>
                    </NoData>
                  </td>
                </tr>
              ) : (
                paginatedMedicines.map((med) => {
                  const pct =
                    med.minBalance > 0
                      ? (med.currentBalance / (med.minBalance * 2)) * 100
                      : med.currentBalance > 0
                        ? 100
                        : 0

                  return (
                    <Tr
                      key={med.id}
                      $status={med.status}
                      onClick={() => openDrawer(med)}
                      title={`Открыть ${med.name}`}
                    >
                      <Td>
                        <DrugName>{med.name}</DrugName>
                        <DrugCategory>{med.category}</DrugCategory>
                      </Td>
                      <Td>
                        <BalanceCell>
                          <div>
                            <BalanceValue $status={med.status}>
                              {med.currentBalance.toLocaleString('ru-RU')}
                            </BalanceValue>
                            <BalanceUnit>{med.unit}</BalanceUnit>
                          </div>
                          <BalanceBar>
                            <BalanceFill $pct={pct} $status={med.status} />
                          </BalanceBar>
                        </BalanceCell>
                      </Td>
                      <Td>
                        {med.lastReceiptDate ? (
                          <DateCell>{formatDate(med.lastReceiptDate)}</DateCell>
                        ) : (
                          <NullCell>—</NullCell>
                        )}
                      </Td>
                      <Td>
                        {med.lastWriteOffDate ? (
                          <DateCell>{formatDate(med.lastWriteOffDate)}</DateCell>
                        ) : (
                          <NullCell>—</NullCell>
                        )}
                      </Td>
                      <Td>
                        {med.lastReceiptFrom ? (
                          <span style={{ fontSize: 12.5, color: '#475569' }}>
                            {med.lastReceiptFrom}
                          </span>
                        ) : (
                          <NullCell>—</NullCell>
                        )}
                      </Td>
                      <Td>
                        {med.lastOperation ? (
                          <OperationBadge $type={med.lastOperation}>
                            <OpIcon type={med.lastOperation} />
                            {OP_LABELS[med.lastOperation]}
                          </OperationBadge>
                        ) : (
                          <NullCell>—</NullCell>
                        )}
                      </Td>
                      <Td>
                        {med.lastChangedBy ? (
                          <span style={{ fontSize: 12.5, color: '#475569' }}>
                            {med.lastChangedBy}
                          </span>
                        ) : (
                          <NullCell>—</NullCell>
                        )}
                      </Td>
                      <Td>
                        {med.lastUpdated ? (
                          <DateCell>{formatDateTime(med.lastUpdated)}</DateCell>
                        ) : (
                          <NullCell>—</NullCell>
                        )}
                      </Td>
                      <Td $align="center">
                        <StatusBadge $status={med.status}>
                          <StatusIcon status={med.status} />
                          {STATUS_LABELS[med.status]}
                        </StatusBadge>
                      </Td>
                    </Tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </TableScrollWrapper>

        <PaginationBar>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PaginationInfo>
              Показано {filteredMedicines.length === 0 ? 0 : (page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filteredMedicines.length)} из {filteredMedicines.length}
            </PaginationInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>По</span>
              <PageSizeSelect
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
              >
                {[10, 25, 50, 100].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </PageSizeSelect>
            </div>
          </div>
          <PaginationControls>
            <PageBtn onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronLeft size={14} />
              <ChevronLeft size={14} />
            </PageBtn>
            <PageBtn onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
              <ChevronLeft size={14} />
            </PageBtn>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p = i + 1
              if (totalPages > 5) {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                p = start + i
              }
              return (
                <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>
                  {p}
                </PageBtn>
              )
            })}
            <PageBtn onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
              <ChevronRight size={14} />
            </PageBtn>
            <PageBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              <ChevronRight size={14} />
              <ChevronRight size={14} />
            </PageBtn>
          </PaginationControls>
        </PaginationBar>
      </TableWrapper>

      {selectedMedicine && (
        <>
          <DrawerOverlay onClick={closeDrawer} />
          <DrawerPanel onClick={(e) => e.stopPropagation()}>
            <DrawerHeader>
              <div style={{ flex: 1, minWidth: 0 }}>
                <DrawerTitle>{selectedMedicine.name}</DrawerTitle>
                <DrawerSubtitle>
                  {selectedMedicine.category} · {selectedMedicine.unit}
                </DrawerSubtitle>
                <div style={{ marginTop: 8 }}>
                  <StatusBadge $status={selectedMedicine.status}>
                    <StatusIcon status={selectedMedicine.status} />
                    {STATUS_LABELS[selectedMedicine.status]}
                  </StatusBadge>
                </div>
              </div>
              <DrawerCloseBtn onClick={closeDrawer} title="Закрыть">
                <X size={18} />
              </DrawerCloseBtn>
            </DrawerHeader>

            <TabBar>
              <TabBtn $active={drawerTab === 'overview'} onClick={() => setDrawerTab('overview')}>
                <Info size={14} /> Обзор
              </TabBtn>
              <TabBtn $active={drawerTab === 'receipt'} onClick={() => setDrawerTab('receipt')}>
                <TrendingUp size={14} /> Поступление
              </TabBtn>
              <TabBtn $active={drawerTab === 'writeoff'} onClick={() => setDrawerTab('writeoff')}>
                <TrendingDown size={14} /> Списание
              </TabBtn>
              <TabBtn $active={drawerTab === 'history'} onClick={() => setDrawerTab('history')}>
                <FileText size={14} /> История
                {selectedMedicine.operationLog.length > 0 && (
                  <span
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '99px',
                      padding: '1px 7px',
                      fontSize: 10.5,
                      fontWeight: 700
                    }}
                  >
                    {selectedMedicine.operationLog.length}
                  </span>
                )}
              </TabBtn>
            </TabBar>

            <DrawerContent>
              {drawerTab === 'overview' && (
                <>
                  {selectedMedicine.status === 'empty' && (
                    <WarningAlert $level="error">
                      <AlertCircle size={18} />
                      <span>Требуется пополнение — остаток равен нулю</span>
                    </WarningAlert>
                  )}
                  {selectedMedicine.status === 'low' && (
                    <WarningAlert $level="warning">
                      <AlertTriangle size={18} />
                      <span>
                        Осталось мало препарата — ниже допустимого минимума (
                        {selectedMedicine.minBalance} {selectedMedicine.unit})
                      </span>
                    </WarningAlert>
                  )}

                  <OverviewSection>
                    <SectionTitle>Описание</SectionTitle>
                    <DescriptionBox>
                      {selectedMedicine.description || 'Описание не указано'}
                    </DescriptionBox>
                  </OverviewSection>

                  <OverviewSection>
                    <SectionTitle>Остаток</SectionTitle>
                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: 14,
                        padding: '16px 18px',
                        border: '1px solid #f1f5f9'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: 28,
                              fontWeight: 800,
                              color:
                                selectedMedicine.status === 'empty'
                                  ? '#dc2626'
                                  : selectedMedicine.status === 'low'
                                    ? '#d97706'
                                    : '#0f172a',
                              letterSpacing: '-0.03em'
                            }}
                          >
                            {selectedMedicine.currentBalance.toLocaleString('ru-RU')}
                          </span>
                          <span style={{ fontSize: 14, color: '#94a3b8', marginLeft: 6 }}>
                            {selectedMedicine.unit}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>
                          Мин: {selectedMedicine.minBalance} {selectedMedicine.unit}
                        </div>
                      </div>
                      <DrawerBalanceBar>
                        <DrawerBalanceFill
                          $pct={
                            selectedMedicine.minBalance > 0
                              ? (selectedMedicine.currentBalance /
                                  (selectedMedicine.minBalance * 2)) *
                                100
                              : selectedMedicine.currentBalance > 0
                                ? 100
                                : 0
                          }
                          $status={selectedMedicine.status}
                        />
                      </DrawerBalanceBar>
                    </div>
                  </OverviewSection>

                  <OverviewSection>
                    <SectionTitle>Статистика</SectionTitle>
                    <InfoGrid>
                      <InfoCard>
                        <InfoCardLabel>
                          <TrendingUp size={11} style={{ display: 'inline', marginRight: 4 }} />
                          Всего поступило
                        </InfoCardLabel>
                        <InfoCardValue>
                          {selectedMedicine.totalReceived.toLocaleString('ru-RU')}
                        </InfoCardValue>
                        <InfoCardSub>{selectedMedicine.unit}</InfoCardSub>
                      </InfoCard>
                      <InfoCard>
                        <InfoCardLabel>
                          <TrendingDown size={11} style={{ display: 'inline', marginRight: 4 }} />
                          Всего списано
                        </InfoCardLabel>
                        <InfoCardValue>
                          {selectedMedicine.totalWrittenOff.toLocaleString('ru-RU')}
                        </InfoCardValue>
                        <InfoCardSub>{selectedMedicine.unit}</InfoCardSub>
                      </InfoCard>
                      <InfoCard>
                        <InfoCardLabel>
                          <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                          Последнее поступление
                        </InfoCardLabel>
                        <InfoCardValue style={{ fontSize: 15 }}>
                          {formatDate(selectedMedicine.lastReceiptDate) || '—'}
                        </InfoCardValue>
                        <InfoCardSub>{selectedMedicine.lastReceiptFrom || '—'}</InfoCardSub>
                      </InfoCard>
                      <InfoCard>
                        <InfoCardLabel>
                          <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                          Последнее списание
                        </InfoCardLabel>
                        <InfoCardValue style={{ fontSize: 15 }}>
                          {formatDate(selectedMedicine.lastWriteOffDate) || '—'}
                        </InfoCardValue>
                        <InfoCardSub>{selectedMedicine.lastChangedBy || '—'}</InfoCardSub>
                      </InfoCard>
                    </InfoGrid>
                  </OverviewSection>

                  <ActionButtonRow>
                    <EditBtn onClick={openEditModal}>
                      <Edit3 size={14} />
                      Редактировать
                    </EditBtn>
                    <DeleteBtn onClick={() => setShowDeleteConfirm(true)}>
                      <Trash2 size={14} />
                      Удалить
                    </DeleteBtn>
                  </ActionButtonRow>
                </>
              )}

              {drawerTab === 'receipt' && (
                <>
                  <AutoFillInfo>
                    <CheckCircle size={16} />
                    Сотрудник и дата создания подставляются автоматически
                  </AutoFillInfo>

                  <FormGrid $cols={2}>
                    <FormField style={{ gridColumn: '1 / -1' }}>
                      <FormLabel>Название препарата</FormLabel>
                      <FormInput value={receiptForm.name} disabled />
                    </FormField>
                    <FormField>
                      <FormLabel>Дата поступления *</FormLabel>
                      <FormInput
                        type="date"
                        value={receiptForm.date}
                        onChange={(e) => setReceiptForm((p) => ({ ...p, date: e.target.value }))}
                      />
                    </FormField>
                    <FormField>
                      <FormLabel>Количество *</FormLabel>
                      <FormInput
                        id="receipt-quantity"
                        type="number"
                        min={1}
                        placeholder="0"
                        value={receiptForm.quantity}
                        onChange={(e) =>
                          setReceiptForm((p) => ({ ...p, quantity: e.target.value }))
                        }
                      />
                    </FormField>
                    <FormField>
                      <FormLabel>Единица измерения</FormLabel>
                      <FormInput value={selectedMedicine.unit} disabled />
                    </FormField>
                    <FormField>
                      <FormLabel>Принято от *</FormLabel>
                      <FormInput
                        id="receipt-supplier"
                        placeholder="Поставщик или организация..."
                        value={receiptForm.supplier}
                        onChange={(e) =>
                          setReceiptForm((p) => ({ ...p, supplier: e.target.value }))
                        }
                      />
                    </FormField>
                    <FormField style={{ gridColumn: '1 / -1' }}>
                      <FormLabel>Комментарий</FormLabel>
                      <FormTextArea
                        placeholder="Дополнительная информация..."
                        value={receiptForm.comment}
                        onChange={(e) => setReceiptForm((p) => ({ ...p, comment: e.target.value }))}
                        rows={3}
                      />
                    </FormField>
                  </FormGrid>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '12px 16px',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div
                      style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}
                    >
                      ПОСЛЕ СОХРАНЕНИЯ ОСТАТОК СТАНЕТ
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: '#16a34a',
                        letterSpacing: '-0.03em'
                      }}
                    >
                      {(
                        selectedMedicine.currentBalance + (Number(receiptForm.quantity) || 0)
                      ).toLocaleString('ru-RU')}
                      <span style={{ fontSize: 14, color: '#94a3b8', marginLeft: 6 }}>
                        {selectedMedicine.unit}
                      </span>
                    </div>
                  </div>

                  <DrawerFormFooter>
                    <SaveButton
                      id="receipt-save-btn"
                      onClick={handleReceiptSave}
                      disabled={!receiptForm.quantity || Number(receiptForm.quantity) <= 0}
                    >
                      <Check size={16} /> Сохранить поступление
                    </SaveButton>
                    <CancelButton onClick={() => setDrawerTab('overview')}>
                      <X size={14} /> Отмена
                    </CancelButton>
                  </DrawerFormFooter>
                </>
              )}

              {drawerTab === 'writeoff' && (
                <>
                  <AutoFillInfo>
                    <User size={16} />
                    Исполнитель: {CURRENT_USER.name} · Время подставляется автоматически
                  </AutoFillInfo>

                  {writeoffError && (
                    <ErrorAlert>
                      <AlertCircle size={16} />
                      {writeoffError}
                    </ErrorAlert>
                  )}

                  <FormGrid $cols={2}>
                    <FormField>
                      <FormLabel>Дата списания *</FormLabel>
                      <FormInput
                        type="date"
                        value={writeoffForm.date}
                        onChange={(e) => setWriteoffForm((p) => ({ ...p, date: e.target.value }))}
                      />
                    </FormField>
                    <FormField>
                      <FormLabel>Количество *</FormLabel>
                      <FormInput
                        id="writeoff-quantity"
                        type="number"
                        min={1}
                        max={selectedMedicine.currentBalance}
                        placeholder="0"
                        value={writeoffForm.quantity}
                        onChange={(e) => {
                          setWriteoffError('')
                          setWriteoffForm((p) => ({ ...p, quantity: e.target.value }))
                        }}
                      />
                    </FormField>
                    <FormField style={{ gridColumn: '1 / -1' }}>
                      <FormLabel>Причина списания *</FormLabel>
                      <FormSelect
                        value={writeoffForm.reason}
                        onChange={(e) =>
                          setWriteoffForm((p) => ({
                            ...p,
                            reason: e.target.value as WriteOffReason
                          }))
                        }
                      >
                        {Object.entries(REASON_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </FormSelect>
                    </FormField>

                    {writeoffForm.reason === 'patient' && (
                      <FormField style={{ gridColumn: '1 / -1' }}>
                        <FormLabel>Пациент</FormLabel>
                        <PatientSearchWrapper>
                          <FormInput
                            id="writeoff-patient-search"
                            placeholder="Поиск по ФИО или номеру карты..."
                            value={writeoffForm.selectedPatientName || writeoffForm.patientQuery}
                            onChange={(e) => {
                              setWriteoffForm((p) => ({
                                ...p,
                                patientQuery: e.target.value,
                                selectedPatientId: '',
                                selectedPatientName: ''
                              }))
                              setPatientDropdown(true)
                            }}
                            onFocus={() => setPatientDropdown(true)}
                          />
                          {writeoffForm.selectedPatientId && (
                            <button
                              onClick={() =>
                                setWriteoffForm((p) => ({
                                  ...p,
                                  selectedPatientId: '',
                                  selectedPatientName: '',
                                  patientQuery: ''
                                }))
                              }
                              style={{
                                position: 'absolute',
                                right: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#94a3b8'
                              }}
                            >
                              <X size={15} />
                            </button>
                          )}
                          {patientDropdown &&
                            filteredPatients.length > 0 &&
                            !writeoffForm.selectedPatientId && (
                              <PatientDropdown>
                                {filteredPatients.map((p) => (
                                  <PatientOption
                                    key={p.id}
                                    onClick={() => {
                                      setWriteoffForm((prev) => ({
                                        ...prev,
                                        selectedPatientId: p.id,
                                        selectedPatientName: `${p.lastName} ${p.firstName} ${p.middleName}`,
                                        patientQuery: ''
                                      }))
                                      setPatientDropdown(false)
                                    }}
                                  >
                                    <PatientOptionName>
                                      {p.lastName} {p.firstName} {p.middleName}
                                    </PatientOptionName>
                                    <PatientOptionInfo>
                                      {p.medcardNum} · {p.activeProblems?.join(', ').slice(0, 50)}
                                    </PatientOptionInfo>
                                  </PatientOption>
                                ))}
                              </PatientDropdown>
                            )}
                        </PatientSearchWrapper>
                      </FormField>
                    )}

                    <FormField style={{ gridColumn: '1 / -1' }}>
                      <FormLabel>Комментарий</FormLabel>
                      <FormTextArea
                        placeholder="Дополнительные сведения..."
                        value={writeoffForm.comment}
                        onChange={(e) =>
                          setWriteoffForm((p) => ({ ...p, comment: e.target.value }))
                        }
                        rows={3}
                      />
                    </FormField>
                  </FormGrid>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '12px 16px',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div
                      style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}
                    >
                      ПОСЛЕ СПИСАНИЯ ОСТАТОК СТАНЕТ
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color:
                          selectedMedicine.currentBalance - (Number(writeoffForm.quantity) || 0) < 0
                            ? '#dc2626'
                            : selectedMedicine.currentBalance -
                                  (Number(writeoffForm.quantity) || 0) <=
                                selectedMedicine.minBalance
                              ? '#d97706'
                              : '#0f172a'
                      }}
                    >
                      {Math.max(
                        0,
                        selectedMedicine.currentBalance - (Number(writeoffForm.quantity) || 0)
                      ).toLocaleString('ru-RU')}
                      <span style={{ fontSize: 14, color: '#94a3b8', marginLeft: 6 }}>
                        {selectedMedicine.unit}
                      </span>
                    </div>
                  </div>

                  <DrawerFormFooter>
                    <SaveButton
                      id="writeoff-save-btn"
                      onClick={handleWriteoffSave}
                      disabled={!writeoffForm.quantity || Number(writeoffForm.quantity) <= 0}
                    >
                      <TrendingDown size={16} /> Провести списание
                    </SaveButton>
                    <CancelButton
                      onClick={() => {
                        setDrawerTab('overview')
                        setWriteoffError('')
                      }}
                    >
                      <X size={14} /> Отмена
                    </CancelButton>
                  </DrawerFormFooter>
                </>
              )}

              {drawerTab === 'history' && (
                <>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <SearchWrapper style={{ flex: 1, minWidth: 180 }}>
                      <SearchIcon>
                        <Search size={13} />
                      </SearchIcon>
                      <SearchInput
                        placeholder="Поиск по истории..."
                        value={historySearch}
                        onChange={(e) => {
                          setHistorySearch(e.target.value)
                          setHistoryPage(1)
                        }}
                        style={{ fontSize: 12.5, height: 36 }}
                      />
                    </SearchWrapper>
                    <FilterSelect
                      value={historyFilterType}
                      onChange={(e) => {
                        setHistoryFilterType(e.target.value)
                        setHistoryPage(1)
                      }}
                      style={{ height: 36 }}
                    >
                      <option value="">Все типы</option>
                      <option value="receipt">Поступление</option>
                      <option value="writeoff">Списание</option>
                      <option value="adjustment">Корректировка</option>
                    </FilterSelect>
                    <ExportButton
                      id="history-pdf-btn"
                      onClick={handleHistoryExport}
                      disabled={isExporting}
                    >
                      <Download size={14} />
                      {isExporting ? 'PDF...' : 'PDF'}
                    </ExportButton>
                  </div>

                  <div ref={historyExportRef}>
                    <HistoryTable>
                      <thead>
                        <tr>
                          <HTh>Дата</HTh>
                          <HTh>Тип</HTh>
                          <HTh $align="right">Кол-во</HTh>
                          <HTh $align="right">Остаток</HTh>
                          <HTh>Кто выполнил</HTh>
                          <HTh>Комментарий / Пациент</HTh>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedHistory.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              style={{
                                textAlign: 'center',
                                padding: '24px 12px',
                                color: '#94a3b8',
                                fontSize: 13
                              }}
                            >
                              История пуста
                            </td>
                          </tr>
                        ) : (
                          paginatedHistory.map((log) => (
                            <HTr key={log.id} $type={log.type}>
                              <HTd style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                                {formatDateTime(log.date)}
                              </HTd>
                              <HTd>
                                <OperationBadge $type={log.type}>
                                  <OpIcon type={log.type} />
                                  {OP_LABELS[log.type]}
                                </OperationBadge>
                              </HTd>
                              <HTd $align="right">
                                <span
                                  style={{
                                    fontWeight: 700,
                                    fontSize: 13,
                                    color:
                                      log.type === 'receipt'
                                        ? '#16a34a'
                                        : log.type === 'writeoff'
                                          ? '#dc2626'
                                          : '#2563eb'
                                  }}
                                >
                                  {log.type === 'writeoff' ? '−' : '+'}
                                  {log.quantity.toLocaleString('ru-RU')}
                                </span>
                              </HTd>
                              <HTd $align="right">
                                <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                                  {log.balanceAfter.toLocaleString('ru-RU')}
                                </span>
                              </HTd>
                              <HTd style={{ fontSize: 12 }}>{log.performedBy}</HTd>
                              <HTd style={{ fontSize: 12, maxWidth: 160 }}>
                                <div
                                  style={{
                                    color: '#475569',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {log.comment}
                                </div>
                                {log.patientName && (
                                  <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
                                    <User size={10} style={{ display: 'inline', marginRight: 3 }} />
                                    {log.patientName}
                                  </div>
                                )}
                                {log.supplier && (
                                  <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
                                    {log.supplier}
                                  </div>
                                )}
                              </HTd>
                            </HTr>
                          ))
                        )}
                      </tbody>
                    </HistoryTable>
                  </div>

                  <HistoryPagination>
                    <PaginationInfo style={{ fontSize: 12 }}>
                      {filteredHistory.length === 0 ? '0' : (historyPage - 1) * historyPageSize + 1}
                      –{Math.min(historyPage * historyPageSize, filteredHistory.length)} из{' '}
                      {filteredHistory.length}
                    </PaginationInfo>
                    <PaginationControls>
                      <PageBtn
                        onClick={() => setHistoryPage((p) => p - 1)}
                        disabled={historyPage === 1}
                        style={{ width: 30, height: 30 }}
                      >
                        <ChevronLeft size={13} />
                      </PageBtn>
                      {Array.from({ length: Math.min(historyTotalPages, 5) }, (_, i) => i + 1).map(
                        (p) => (
                          <PageBtn
                            key={p}
                            $active={p === historyPage}
                            onClick={() => setHistoryPage(p)}
                            style={{ width: 30, height: 30, fontSize: 12 }}
                          >
                            {p}
                          </PageBtn>
                        )
                      )}
                      <PageBtn
                        onClick={() => setHistoryPage((p) => p + 1)}
                        disabled={historyPage === historyTotalPages}
                        style={{ width: 30, height: 30 }}
                      >
                        <ChevronRight size={13} />
                      </PageBtn>
                    </PaginationControls>
                  </HistoryPagination>
                </>
              )}
            </DrawerContent>
          </DrawerPanel>
        </>
      )}

      {showAddModal && (
        <ModalOverlay onClick={() => setShowAddModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalTitle>Добавить препарат</ModalTitle>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
                  Новый препарат в базу учета
                </p>
              </div>
              <CloseBtn onClick={() => setShowAddModal(false)}>
                <X size={17} />
              </CloseBtn>
            </ModalHeader>
            <ModalBody>
              <FormGrid $cols={1}>
                <FormField>
                  <FormLabel>Название препарата *</FormLabel>
                  <FormInput
                    id="add-name"
                    placeholder="Напр. Амоксициллин 500 мг"
                    value={addForm.name}
                    onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </FormField>
                <FormField>
                  <FormLabel>Описание</FormLabel>
                  <FormTextArea
                    placeholder="Краткое описание, показания..."
                    value={addForm.description}
                    onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                  />
                </FormField>
              </FormGrid>
              <FormGrid $cols={2}>
                <FormField>
                  <FormLabel>Категория *</FormLabel>
                  <FormSelect
                    value={addForm.category}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, category: e.target.value as MedicineCategory }))
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel>Единица измерения *</FormLabel>
                  <FormSelect
                    value={addForm.unit}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, unit: e.target.value as MedicineUnit }))
                    }
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel>Начальное количество</FormLabel>
                  <FormInput
                    id="add-initial-balance"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={addForm.initialBalance}
                    onChange={(e) => setAddForm((p) => ({ ...p, initialBalance: e.target.value }))}
                  />
                </FormField>
                <FormField>
                  <FormLabel>Минимальный остаток</FormLabel>
                  <FormInput
                    id="add-min-balance"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={addForm.minBalance}
                    onChange={(e) => setAddForm((p) => ({ ...p, minBalance: e.target.value }))}
                  />
                </FormField>
              </FormGrid>
              <AutoFillInfo>
                <CheckCircle size={15} />
                Дата создания и ответственный сотрудник ({CURRENT_USER.name}) подставятся
                автоматически
              </AutoFillInfo>
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={() => setShowAddModal(false)}>
                <X size={14} /> Отмена
              </CancelButton>
              <SaveButton id="add-save-btn" onClick={handleAddSave} disabled={!addForm.name.trim()}>
                <Plus size={16} /> Добавить
              </SaveButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}

      {showEditModal && selectedMedicine && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalTitle>Редактировать препарат</ModalTitle>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
                  {selectedMedicine.name}
                </p>
              </div>
              <CloseBtn onClick={() => setShowEditModal(false)}>
                <X size={17} />
              </CloseBtn>
            </ModalHeader>
            <ModalBody>
              <FormGrid $cols={1}>
                <FormField>
                  <FormLabel>Название *</FormLabel>
                  <FormInput
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </FormField>
                <FormField>
                  <FormLabel>Описание</FormLabel>
                  <FormTextArea
                    value={editForm.description}
                    onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                  />
                </FormField>
              </FormGrid>
              <FormGrid $cols={2}>
                <FormField>
                  <FormLabel>Категория</FormLabel>
                  <FormSelect
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, category: e.target.value as MedicineCategory }))
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel>Единица измерения</FormLabel>
                  <FormSelect
                    value={editForm.unit}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, unit: e.target.value as MedicineUnit }))
                    }
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel>Текущий остаток</FormLabel>
                  <FormInput
                    id="edit-balance"
                    type="number"
                    min={0}
                    value={editForm.currentBalance}
                    onChange={(e) => setEditForm((p) => ({ ...p, currentBalance: e.target.value }))}
                  />
                </FormField>
                <FormField>
                  <FormLabel>Минимальный остаток</FormLabel>
                  <FormInput
                    id="edit-min-balance"
                    type="number"
                    min={0}
                    value={editForm.minBalance}
                    onChange={(e) => setEditForm((p) => ({ ...p, minBalance: e.target.value }))}
                  />
                </FormField>
              </FormGrid>
              {Number(editForm.currentBalance) !== selectedMedicine.currentBalance && (
                <AutoFillInfo>
                  <RefreshCw size={15} />
                  Изменение остатка создаст запись «Корректировка» в журнале операций
                </AutoFillInfo>
              )}
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={() => setShowEditModal(false)}>
                <X size={14} /> Отмена
              </CancelButton>
              <SaveButton id="edit-save-btn" onClick={handleEditSave}>
                <Check size={16} /> Сохранить
              </SaveButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}

      {showDeleteConfirm && selectedMedicine && (
        <ModalOverlay onClick={() => setShowDeleteConfirm(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalTitle>Удаление препарата</ModalTitle>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
                  {selectedMedicine.name}
                </p>
              </div>
              <CloseBtn onClick={() => setShowDeleteConfirm(false)}>
                <X size={17} />
              </CloseBtn>
            </ModalHeader>
            <ModalBody>
              {selectedMedicine.operationLog.length === 0 ? (
                <ConfirmDeleteText>
                  У препарата нет истории операций. Вы можете <strong>удалить его полностью</strong>{' '}
                  из базы без возможности восстановления.
                </ConfirmDeleteText>
              ) : (
                <>
                  <ConfirmDeleteText>
                    Препарат имеет <strong>{selectedMedicine.operationLog.length} записей</strong> в
                    журнале операций. Полное удаление невозможно.
                  </ConfirmDeleteText>
                  <ConfirmDeleteText>
                    Вы можете перевести препарат в статус <strong>«Архивный»</strong> — он исчезнет
                    из активного учета, но история операций сохранится.
                  </ConfirmDeleteText>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={() => setShowDeleteConfirm(false)}>
                <X size={14} /> Отмена
              </CancelButton>
              {selectedMedicine.operationLog.length === 0 ? (
                <DangerButton id="confirm-delete-btn" onClick={handleDelete}>
                  <Trash2 size={15} /> Удалить полностью
                </DangerButton>
              ) : (
                <ArchiveButton id="confirm-archive-btn" onClick={handleDelete}>
                  <Archive size={15} /> Перевести в архив
                </ArchiveButton>
              )}
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </PageContainer>
  )
}

export default MedicinesPage
