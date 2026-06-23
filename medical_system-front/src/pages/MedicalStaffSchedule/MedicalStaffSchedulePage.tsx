import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
  Briefcase,
  Clock,
  CalendarDays,
  Sun,
  Moon,
  Coffee,
  X,
  Check,
  Edit3,
  LayoutGrid,
  ClipboardList
} from 'lucide-react'
import Select, { components, DropdownIndicatorProps, StylesConfig } from 'react-select'
import {
  PageContainer,
  Header,
  HeaderLeft,
  HeaderTitle,
  HeaderSubtitle,
  HeaderRight,
  MonthYearSelector,
  MonthDisplay,
  NavigationButton,
  Toolbar,
  ToolbarLeft,
  ToolbarRight,
  FilterLabel,
  ExportButton,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatSub,
  TableWrapper,
  TableScrollWrapper,
  Table,
  TheadGlass,
  NameColumnHeader,
  DayTh,
  StickyNameColumn,
  EmployeeCardRow,
  RowSpacer,
  EmployeeInfo,
  EmployeeName,
  Position,
  DayHeader,
  ShiftCell,
  ShiftBadge,
  EmptyCell,
  LegendBar,
  LegendItem,
  NoDataState,
  ShiftModal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  ModalBody,
  ModalTypeGrid,
  ModalTypeBtn,
  ModalHoursRow,
  ModalHoursLabel,
  ModalHoursInput,
  ModalFooter,
  ModalCancelBtn,
  ModalSaveBtn,
  MobileEmployeeCard,
  MobileCardHeader,
  MobileCardName,
  MobileCardPosition,
  MobileScrollRow,
  MobileDayChip,
  MobileDayNum,
  MobileDayLabel,
  ViewModeContainer,
  ViewModeBtn,
  DaysSlider,
  SliderDayBtn,
  RosterColumnsGrid,
  RosterColumn,
  RosterColumnHeader,
  RosterColumnTitle,
  RosterBadgeCount,
  RosterEmployeeCard,
  RosterEmployeeInfo,
  RosterEmployeeName,
  RosterEmployeePosition,
  RosterHoursBadge
} from './styled'
import { fetchMonthSchedule, updateShift, ServerStaffScheduleDto, ServerShiftDto } from 'api/scheduleApi'

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

function AnimatedScheduleStatCard({
  targetValue,
  color,
  bg,
  icon,
  label,
  sub
}: {
  targetValue: number;
  color: string;
  bg: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
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

export interface Shift {
  day: number
  type: 'day' | 'night' | 'day-off'
  hours: number
}

interface MedicalStaffSchedulePageProps {
  onNavigate?: (screen: string) => void
  onLogout?: () => void
  userRole?: 'doctor' | 'nurse' | 'patient' | null
}

interface SelectOption {
  value: string
  label: string
}

type ShiftType = 'day' | 'night' | 'day-off' | 'empty'

interface EditTarget {
  employeeId: string
  employeeName: string
  day: number
  currentType: ShiftType
  currentHours: number
}

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '40px',
    minWidth: '180px',
    borderRadius: '12px',
    borderColor: state.isFocused ? '#2563eb' : 'rgba(191,219,254,0.8)',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(37,99,235,0.10)' : 'none',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': { borderColor: state.isFocused ? '#2563eb' : '#9ca3af' }
  }),
  valueContainer: (base) => ({ ...base, padding: '0 8px 0 12px' }),
  placeholder: (base) => ({ ...base, color: '#94a3b8', fontSize: '13.5px' }),
  input: (base) => ({ ...base, color: '#111827', fontSize: '13.5px' }),
  singleValue: (base) => ({ ...base, color: '#111827', fontSize: '13.5px' }),
  indicatorsContainer: (base) => ({ ...base, paddingRight: '5px' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#2563eb' : '#64748b',
    padding: '2px',
    margin: '0 4px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: state.selectProps.menuIsOpen ? '#eaf1ff' : '#f8fafc',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { color: '#2563eb', backgroundColor: '#eaf1ff', borderColor: '#c7d2fe' },
    svg: { width: '14px', height: '14px' }
  }),
  menu: (base) => ({
    ...base,
    marginTop: '6px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 30px rgba(15,23,42,0.1)',
    overflow: 'hidden',
    zIndex: 20
  }),
  menuList: (base) => ({ ...base, padding: '6px' }),
  option: (base, state) => ({
    ...base,
    borderRadius: '8px',
    fontSize: '13.5px',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#1f2937',
    transition: 'all 0.15s ease',
    ':active': { backgroundColor: state.isSelected ? '#2563eb' : '#dbeafe' }
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 })
}

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, false>) => (
  <components.DropdownIndicator {...props} />
)
const selectComponents = { DropdownIndicator, IndicatorSeparator: () => null }

const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

interface EmployeeRowProps {
  employee: ServerStaffScheduleDto
  daysArray: number[]
  displayMonth: number
  displayYear: number
  monthNames: string[]
  monthlySchedule: ServerShiftDto[] | null
  openEditModal: (employeeId: string, employeeName: string, day: number, currentType: ShiftType, currentHours: number) => void
}

const EmployeeRow: React.FC<EmployeeRowProps> = React.memo(({
  employee,
  daysArray,
  displayMonth,
  displayYear,
  monthNames,
  monthlySchedule,
  openEditModal
}) => {
  return (
    <EmployeeCardRow>
      <StickyNameColumn>
        <EmployeeInfo>
          <EmployeeName>{employee.staffName}</EmployeeName>
          <Position>{employee.staffPosition}</Position>
        </EmployeeInfo>
      </StickyNameColumn>
      {daysArray.map((day) => {
        const date = new Date(displayYear, displayMonth, day)
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        
        let shift: ServerShiftDto | undefined = undefined
        if (monthlySchedule) {
          shift = monthlySchedule.find((s) => s.day === day)
        } else {
          shift = employee.schedule.find((s) => s.day === day)
        }
        
        const type = shift ? shift.type : 'empty'

        return (
          <ShiftCell
            key={`${employee.staffId}-${day}`}
            $type={type as any}
            $isWeekend={isWeekend}
            onClick={() => openEditModal(employee.staffId, employee.staffName, day, type as ShiftType, shift ? shift.hours : 0)}
            title={`Изменить смену: ${employee.staffName}, ${day} ${monthNames[displayMonth]}`}
          >
            {type === 'empty' ? (
              <EmptyCell>·</EmptyCell>
            ) : (
              <ShiftBadge $type={type as 'day' | 'night' | 'day-off'}>
                {type === 'day' && (
                  <span className="badge-icon">
                    <Sun size={11} strokeWidth={2.5} /> Д
                  </span>
                )}
                {type === 'night' && (
                  <span className="badge-icon">
                    <Moon size={11} strokeWidth={2.5} /> Н
                  </span>
                )}
                {type === 'day-off' && (
                  <span className="badge-icon">
                    <Coffee size={11} strokeWidth={2.5} /> В
                  </span>
                )}
                {type !== 'day-off' && (
                  <span className="badge-hrs">{shift?.hours}ч</span>
                )}
              </ShiftBadge>
            )}
          </ShiftCell>
        )
      })}
    </EmployeeCardRow>
  )
})

interface MobileEmployeeCardComponentProps {
  employee: ServerStaffScheduleDto
  daysArray: number[]
  displayMonth: number
  displayYear: number
  monthNames: string[]
  daysOfWeek: string[]
  shiftLabels: Record<ShiftType, string>
  monthlySchedule: ServerShiftDto[] | null
  isCurrentMonth: boolean
  currentDay: number
  openEditModal: (employeeId: string, employeeName: string, day: number, currentType: ShiftType, currentHours: number) => void
}

const MobileEmployeeCardComponent: React.FC<MobileEmployeeCardComponentProps> = React.memo(({
  employee,
  daysArray,
  displayMonth,
  displayYear,
  monthNames,
  daysOfWeek,
  shiftLabels,
  monthlySchedule,
  isCurrentMonth,
  currentDay,
  openEditModal
}) => {
  return (
    <MobileEmployeeCard>
      <MobileCardHeader>
        <MobileCardName>{employee.staffName}</MobileCardName>
        <MobileCardPosition>{employee.staffPosition}</MobileCardPosition>
      </MobileCardHeader>
      <MobileScrollRow>
        {daysArray.map((day) => {
          const date = new Date(displayYear, displayMonth, day)
          const dayOfWeek = date.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          const isToday = isCurrentMonth && day === currentDay
          
          let shift: ServerShiftDto | undefined = undefined
          if (monthlySchedule) {
            shift = monthlySchedule.find((s) => s.day === day)
          } else {
            shift = employee.schedule.find((s) => s.day === day)
          }
          
          const type = shift ? shift.type : 'empty'

          return (
            <MobileDayChip
              key={day}
              $type={type as ShiftType}
              $isWeekend={isWeekend}
              $isToday={isToday}
              onClick={() => openEditModal(employee.staffId, employee.staffName, day, type as ShiftType, shift ? shift.hours : 0)}
              title={`${day} ${monthNames[displayMonth]}: ${shiftLabels[type as ShiftType] || ''}`}
            >
              <MobileDayLabel $isWeekend={isWeekend} $isToday={isToday}>
                {daysOfWeek[dayOfWeek]}
              </MobileDayLabel>
              <MobileDayNum $isWeekend={isWeekend} $isToday={isToday}>{day}</MobileDayNum>
              <span className="mobile-shift-icon">
                {type === 'day' && <Sun size={10} />}
                {type === 'night' && <Moon size={10} />}
                {type === 'day-off' && <Coffee size={10} />}
                {type === 'empty' && '·'}
              </span>
            </MobileDayChip>
          )
        })}
      </MobileScrollRow>
    </MobileEmployeeCard>
  )
})

const defaultHours: Record<string, number> = {
  day: 8,
  night: 24,
  'day-off': 0,
  empty: 0
}

const shiftLabels = {
  day: 'Дневная',
  night: 'Ночная',
  'day-off': 'Выходной',
  empty: 'Нет смены'
}

const MedicalStaffSchedulePage: React.FC<MedicalStaffSchedulePageProps> = ({
  onNavigate = () => { },
  onLogout = () => { },
  userRole = null
}) => {
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth())
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear())
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  
  const [schedule, setSchedule] = useState<ServerStaffScheduleDto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [viewMode, setViewMode] = useState<'grid' | 'roster'>('grid')
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate())

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [modalType, setModalType] = useState<ShiftType>('day')
  const [modalHours, setModalHours] = useState<number | string>(8)

  const daysInMonth = useCallback((month: number, year: number) => new Date(year, month + 1, 0).getDate(), [])

  const loadSchedule = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMonthSchedule(displayYear, displayMonth + 1)
      setSchedule(data)
    } catch (err: any) {
      console.error('Ошибка при загрузке графика:', err)
      setError(err.message || 'Не удалось загрузить график работы сотрудников.')
    } finally {
      setLoading(false)
    }
  }, [displayYear, displayMonth])

  useEffect(() => {
    loadSchedule()
  }, [loadSchedule])

  const positions = useMemo(() => {
    return Array.from(new Set(schedule.map((e) => e.staffPosition))).sort()
  }, [schedule])

  const filteredSchedule = useMemo(() => {
    return schedule.filter((employee) => {
      if (selectedPosition && selectedPosition !== 'all') {
        return employee.staffPosition === selectedPosition
      }
      return true
    })
  }, [schedule, selectedPosition])

  const daysArray = useMemo(() => {
    const days = daysInMonth(displayMonth, displayYear)
    return Array.from({ length: days }, (_, i) => i + 1)
  }, [displayMonth, displayYear, daysInMonth])

  const monthlySchedules = useMemo(() => {
    const map: Record<string, ServerShiftDto[] | null> = {}
    filteredSchedule.forEach(employee => {
      map[employee.staffId] = employee.schedule
    })
    return map
  }, [filteredSchedule])

  const getShiftInfo = useCallback((employee: ServerStaffScheduleDto, day: number): ServerShiftDto | undefined => {
    const monthlySchedule = monthlySchedules[employee.staffId]
    if (monthlySchedule) return monthlySchedule.find((s) => s.day === day)
    return employee.schedule.find((s) => s.day === day)
  }, [monthlySchedules])

  const handlePreviousMonth = useCallback(() => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(prev => prev - 1)
    } else {
      setDisplayMonth(prev => prev - 1)
    }
  }, [displayMonth])

  const handleNextMonth = useCallback(() => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(prev => prev + 1)
    } else {
      setDisplayMonth(prev => prev + 1)
    }
  }, [displayMonth])

  const stats = useMemo(() => {
    let totalShifts = 0, totalNightShifts = 0, totalHours = 0
    filteredSchedule.forEach(employee => {
      daysArray.forEach(day => {
        const shift = getShiftInfo(employee, day)
        if (shift && shift.type !== 'day-off') {
          totalShifts++
          totalHours += shift.hours
          if (shift.type === 'night') totalNightShifts++
        }
      })
    })
    return { totalShifts, totalNightShifts, totalHours }
  }, [filteredSchedule, daysArray, getShiftInfo])

  const [isExporting, setIsExporting] = useState(false)
  const exportContainerRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    if (!exportContainerRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(exportContainerRef.current, { scale: 2, useCORS: true, logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`График_${monthNames[displayMonth]}_${displayYear}.pdf`)
    } catch (error) {
      console.error('Ошибка при экспорте PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const openEditModal = useCallback((employeeId: string, employeeName: string, day: number, currentType: ShiftType, currentHours: number) => {
    setEditTarget({
      employeeId,
      employeeName,
      day,
      currentType,
      currentHours
    })
    setModalType(currentType)
    setModalHours(currentType === 'empty' ? 8 : currentHours)
  }, [])

  const closeModal = useCallback(() => {
    setEditTarget(null)
  }, [])

  const handleTypeChange = useCallback((type: ShiftType) => {
    setModalType(type)
    if (type === 'day-off' || type === 'empty') {
      setModalHours(0)
    } else {
      setModalHours(defaultHours[type])
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (!editTarget) return
    const { employeeId, day } = editTarget

    const monthStr = String(displayMonth + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateStr = `${displayYear}-${monthStr}-${dayStr}`

    try {
      await updateShift({
        staffId: employeeId,
        date: dateStr,
        type: modalType,
        hours: modalType === 'day-off' ? 0 : Number(modalHours)
      })

      setSchedule(prevSchedule => {
        return prevSchedule.map(employee => {
          if (employee.staffId !== employeeId) return employee

          const existingShifts = employee.schedule || []
          let updatedSchedule: ServerShiftDto[]

          if (modalType === 'empty') {
            updatedSchedule = existingShifts.filter(s => s.day !== day)
          } else {
            const shiftIndex = existingShifts.findIndex(s => s.day === day)
            const newShift: ServerShiftDto = {
              day,
              type: modalType as 'day' | 'night' | 'day-off',
              hours: modalType === 'day-off' ? 0 : Number(modalHours)
            }

            if (shiftIndex >= 0) {
              updatedSchedule = [...existingShifts]
              updatedSchedule[shiftIndex] = newShift
            } else {
              updatedSchedule = [...existingShifts, newShift]
            }
          }

          return {
            ...employee,
            schedule: updatedSchedule
          }
        })
      })

      closeModal()
      toast.success('Смена успешно обновлена')
    } catch (err: any) {
      console.error('Ошибка при обновлении смены:', err)
      toast.error('Не удалось обновить смену: ' + (err.message || err))
    }
  }, [editTarget, modalType, modalHours, displayMonth, displayYear, closeModal])

  const today = new Date()
  const isCurrentMonth = today.getMonth() === displayMonth && today.getFullYear() === displayYear
  const currentDay = today.getDate()

  const activeDay = useMemo(() => {
    const maxDays = daysInMonth(displayMonth, displayYear)
    return selectedDay > maxDays ? maxDays : selectedDay
  }, [selectedDay, displayMonth, displayYear, daysInMonth])

  const rosterData = useMemo(() => {
    const dayShift: typeof filteredSchedule = []
    const nightShift: typeof filteredSchedule = []
    const offShift: typeof filteredSchedule = []

    filteredSchedule.forEach(employee => {
      const shift = getShiftInfo(employee, activeDay)
      const type = shift ? shift.type : 'empty'
      if (type === 'day') {
        dayShift.push(employee)
      } else if (type === 'night') {
        nightShift.push(employee)
      } else {
        offShift.push(employee)
      }
    })

    return { dayShift, nightShift, offShift }
  }, [filteredSchedule, activeDay, getShiftInfo])

  const shiftTypeOptions: { type: ShiftType; label: string; icon: React.ReactNode }[] = [
    { type: 'day', label: 'Дневная', icon: <Sun size={16} /> },
    { type: 'night', label: 'Ночная', icon: <Moon size={16} /> },
    { type: 'day-off', label: 'Выходной', icon: <Coffee size={16} /> },
    { type: 'empty', label: 'Нет смены', icon: <X size={16} /> }
  ]

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <HeaderTitle>График работы медперсонала</HeaderTitle>
          <HeaderSubtitle>Управление расписанием и сменами сотрудников</HeaderSubtitle>
        </HeaderLeft>
        <HeaderRight>
          <ViewModeContainer>
            <ViewModeBtn
              $active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              title="Табличный вид"
            >
              <LayoutGrid size={15} />
              Сетка
            </ViewModeBtn>
            <ViewModeBtn
              $active={viewMode === 'roster'}
              onClick={() => setViewMode('roster')}
              title="Смены по дням"
            >
              <ClipboardList size={15} />
              Смены по дням
            </ViewModeBtn>
          </ViewModeContainer>

          <MonthYearSelector>
            <NavigationButton onClick={handlePreviousMonth} title="Предыдущий месяц">
              <ChevronLeft size={18} />
            </NavigationButton>
            <MonthDisplay>{monthNames[displayMonth]} {displayYear}</MonthDisplay>
            <NavigationButton onClick={handleNextMonth} title="Следующий месяц">
              <ChevronRight size={18} />
            </NavigationButton>
          </MonthYearSelector>
        </HeaderRight>
      </Header>

      <StatsGrid>
        <AnimatedScheduleStatCard
          targetValue={filteredSchedule.length}
          color="#3b82f6"
          bg="#eff6ff"
          icon={<Users size={20} />}
          label="Сотрудников"
          sub="В выбранной выборке"
        />
        <AnimatedScheduleStatCard
          targetValue={stats.totalShifts}
          color="#10b981"
          bg="#ecfdf5"
          icon={<CalendarDays size={20} />}
          label="Всего смен"
          sub={`За ${monthNames[displayMonth].toLowerCase()}`}
        />
        <AnimatedScheduleStatCard
          targetValue={stats.totalNightShifts}
          color="#8b5cf6"
          bg="#f5f3ff"
          icon={<Moon size={20} />}
          label="Ночных дежурств"
          sub={`${Math.round((stats.totalNightShifts / Math.max(stats.totalShifts, 1)) * 100)}% от всех смен`}
        />
        <AnimatedScheduleStatCard
          targetValue={stats.totalHours}
          color="#f59e0b"
          bg="#fffbeb"
          icon={<Clock size={20} />}
          label="Отработанных часов"
          sub="Суммарно по всем"
        />
      </StatsGrid>

      <Toolbar>
        <ToolbarLeft>
          <FilterLabel>
            <Briefcase size={15} />
            Должность
          </FilterLabel>
          <div style={{ minWidth: '200px' }}>
            <Select
              inputId="position-filter"
              placeholder="Все должности"
              options={positions.map(p => ({ value: p, label: p }))}
              styles={selectStyles}
              components={selectComponents}
              isClearable
              isSearchable={false}
              value={selectedPosition ? { value: selectedPosition, label: selectedPosition } : null}
              onChange={(opt) => setSelectedPosition(opt ? (opt as SelectOption).value : null)}
              menuPortalTarget={document.body}
            />
          </div>
        </ToolbarLeft>
        <ToolbarRight>
          <ExportButton onClick={handleExport} disabled={isExporting}>
            <Download size={15} />
            {isExporting ? 'Создание PDF...' : 'Скачать PDF'}
          </ExportButton>
        </ToolbarRight>
      </Toolbar>

      {loading ? (
        <NoDataState style={{ minHeight: '300px' }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>⌛ Загрузка...</div>
          <div>Загрузка графика работы сотрудников...</div>
        </NoDataState>
      ) : error ? (
        <NoDataState style={{ minHeight: '300px', borderColor: '#f87171' }}>
          <div style={{ color: '#ef4444', fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
          <div style={{ color: '#ef4444', fontWeight: 600 }}>Не удалось загрузить данные</div>
          <div style={{ color: '#ef4444' }}>{error}</div>
        </NoDataState>
      ) : viewMode === 'grid' ? (
        <>
          <TableWrapper className="desktop-table">
            <TableScrollWrapper>
              <Table>
                <TheadGlass as="thead">
                  <tr>
                    <NameColumnHeader>Сотрудник</NameColumnHeader>
                    {daysArray.map((day) => {
                      const date = new Date(displayYear, displayMonth, day)
                      const dayOfWeek = date.getDay()
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                      const isToday = isCurrentMonth && day === currentDay

                      return (
                        <DayTh key={day} $isWeekend={isWeekend}>
                          <DayHeader $isWeekend={isWeekend} $isToday={isToday}>
                            <span className="day-short">{daysOfWeek[dayOfWeek]}</span>
                            <span className="day-num">{day}</span>
                          </DayHeader>
                        </DayTh>
                      )
                    })}
                  </tr>
                </TheadGlass>

                <tbody>
                  {filteredSchedule.length > 0 ? (
                    filteredSchedule.map((employee, idx) => (
                      <React.Fragment key={employee.staffId}>
                        {idx > 0 && (
                          <RowSpacer>
                            <td colSpan={daysArray.length + 1} />
                          </RowSpacer>
                        )}
                        <EmployeeRow
                          employee={employee}
                          daysArray={daysArray}
                          displayMonth={displayMonth}
                          displayYear={displayYear}
                          monthNames={monthNames}
                          monthlySchedule={employee.schedule}
                          openEditModal={openEditModal}
                        />
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={daysArray.length + 1}>
                        <NoDataState>
                          <Users size={48} />
                          <div>Сотрудники не найдены по заданным критериям</div>
                        </NoDataState>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableScrollWrapper>

            <LegendBar>
              <LegendItem $type="day">Дневная смена (8ч)</LegendItem>
              <LegendItem $type="night">Ночная смена (12ч)</LegendItem>
              <LegendItem $type="day-off">Выходной день</LegendItem>
              <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Edit3 size={12} /> Нажмите на ячейку для редактирования
              </span>
            </LegendBar>
          </TableWrapper>

          <div className="mobile-schedule">
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((employee) => (
                <MobileEmployeeCardComponent
                  key={employee.staffId}
                  employee={employee}
                  daysArray={daysArray}
                  displayMonth={displayMonth}
                  displayYear={displayYear}
                  monthNames={monthNames}
                  daysOfWeek={daysOfWeek}
                  shiftLabels={shiftLabels}
                  monthlySchedule={employee.schedule}
                  isCurrentMonth={isCurrentMonth}
                  currentDay={currentDay}
                  openEditModal={openEditModal}
                />
              ))
            ) : (
              <NoDataState>
                <Users size={40} />
                <div>Сотрудники не найдены</div>
              </NoDataState>
            )}
          </div>
        </>
      ) : (
        <>
          <DaysSlider>
            {daysArray.map((day) => {
              const date = new Date(displayYear, displayMonth, day)
              const dayOfWeek = date.getDay()
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
              const isToday = isCurrentMonth && day === currentDay
              const active = day === activeDay

              return (
                <SliderDayBtn
                  key={day}
                  $active={active}
                  $isWeekend={isWeekend}
                  $isToday={isToday}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="slider-weekday">{daysOfWeek[dayOfWeek]}</span>
                  <span className="slider-num">{day}</span>
                </SliderDayBtn>
              )
            })}
          </DaysSlider>

          <RosterColumnsGrid>
            <RosterColumn $type="day">
              <RosterColumnHeader>
                <RosterColumnTitle>
                  <Sun size={16} color="#3b82f6" />
                  Дневная смена
                </RosterColumnTitle>
                <RosterBadgeCount $bg="#eff6ff" $color="#1d4ed8">
                  {rosterData.dayShift.length}
                </RosterBadgeCount>
              </RosterColumnHeader>
              {rosterData.dayShift.length > 0 ? (
                rosterData.dayShift.map((employee) => {
                  const shift = getShiftInfo(employee, activeDay)
                  return (
                    <RosterEmployeeCard
                      key={employee.staffId}
                      onClick={() => openEditModal(employee.staffId, employee.staffName, activeDay, 'day', shift?.hours || 8)}
                    >
                      <RosterEmployeeInfo>
                        <RosterEmployeeName>{employee.staffName}</RosterEmployeeName>
                        <RosterEmployeePosition>{employee.staffPosition}</RosterEmployeePosition>
                      </RosterEmployeeInfo>
                      <RosterHoursBadge $type="day">
                        {shift?.hours || 8}ч
                      </RosterHoursBadge>
                    </RosterEmployeeCard>
                  )
                })
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                  Нет сотрудников
                </div>
              )}
            </RosterColumn>

            <RosterColumn $type="night">
              <RosterColumnHeader>
                <RosterColumnTitle>
                  <Moon size={16} color="#8b5cf6" />
                  Ночная смена
                </RosterColumnTitle>
                <RosterBadgeCount $bg="#f5f3ff" $color="#5b21b6">
                  {rosterData.nightShift.length}
                </RosterBadgeCount>
              </RosterColumnHeader>
              {rosterData.nightShift.length > 0 ? (
                rosterData.nightShift.map((employee) => {
                  const shift = getShiftInfo(employee, activeDay)
                  return (
                    <RosterEmployeeCard
                      key={employee.staffId}
                      onClick={() => openEditModal(employee.staffId, employee.staffName, activeDay, 'night', shift?.hours || 12)}
                    >
                      <RosterEmployeeInfo>
                        <RosterEmployeeName>{employee.staffName}</RosterEmployeeName>
                        <RosterEmployeePosition>{employee.staffPosition}</RosterEmployeePosition>
                      </RosterEmployeeInfo>
                      <RosterHoursBadge $type="night">
                        {shift?.hours || 12}ч
                      </RosterHoursBadge>
                    </RosterEmployeeCard>
                  )
                })
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                  Нет сотрудников
                </div>
              )}
            </RosterColumn>

            <RosterColumn $type="day-off">
              <RosterColumnHeader>
                <RosterColumnTitle>
                  <Coffee size={16} color="#ef4444" />
                  Выходной / Нет смены
                </RosterColumnTitle>
                <RosterBadgeCount $bg="#fff1f2" $color="#b91c1c">
                  {rosterData.offShift.length}
                </RosterBadgeCount>
              </RosterColumnHeader>
              {rosterData.offShift.length > 0 ? (
                rosterData.offShift.map((employee) => {
                  const shift = getShiftInfo(employee, activeDay)
                  const type = shift ? shift.type : 'empty'
                  return (
                    <RosterEmployeeCard
                      key={employee.staffId}
                      onClick={() => openEditModal(employee.staffId, employee.staffName, activeDay, type as ShiftType, shift?.hours || 0)}
                    >
                      <RosterEmployeeInfo>
                        <RosterEmployeeName>{employee.staffName}</RosterEmployeeName>
                        <RosterEmployeePosition>{employee.staffPosition}</RosterEmployeePosition>
                      </RosterEmployeeInfo>
                      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
                        {type === 'day-off' ? 'Выходной' : 'Нет смены'}
                      </div>
                    </RosterEmployeeCard>
                  )
                })
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                  Нет сотрудников
                </div>
              )}
            </RosterColumn>
          </RosterColumnsGrid>
        </>
      )}

      {editTarget && (
        <ModalOverlay onClick={closeModal}>
          <ShiftModal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalTitle>Редактировать смену</ModalTitle>
                <ModalSubtitle>
                  {editTarget.employeeName} · {editTarget.day} {monthNames[displayMonth]} {displayYear}
                </ModalSubtitle>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: '4px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <X size={20} />
              </button>
            </ModalHeader>

            <ModalBody>
              <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Тип смены
              </div>
              <ModalTypeGrid>
                {shiftTypeOptions.map(({ type, label, icon }) => (
                  <ModalTypeBtn
                    key={type}
                    $type={type}
                    $active={modalType === type}
                    onClick={() => handleTypeChange(type)}
                  >
                    {icon}
                    {label}
                  </ModalTypeBtn>
                ))}
              </ModalTypeGrid>

              {(modalType === 'day' || modalType === 'night') && (
                <ModalHoursRow>
                  <ModalHoursLabel>Часов в смене</ModalHoursLabel>
                  <ModalHoursInput
                    type="number"
                    min={1}
                    max={24}
                    value={modalHours}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === '') {
                        setModalHours('');
                        return;
                      }

                      const num = Number(value);

                      if (num >= 1 && num <= 24) {
                        setModalHours(num);
                      }
                    }}
                    onBlur={() => {

                      if (modalHours === '') {
                        setModalHours(8);
                      }
                    }} />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>ч</span>
                </ModalHoursRow>
              )}
            </ModalBody>

            <ModalFooter>
              <ModalCancelBtn onClick={closeModal}>
                <X size={14} /> Отмена
              </ModalCancelBtn>
              <ModalSaveBtn onClick={handleSave}>
                <Check size={14} /> Сохранить
              </ModalSaveBtn>
            </ModalFooter>
          </ShiftModal>
        </ModalOverlay>
      )}

      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div
          ref={exportContainerRef}
          style={{
            width: 'max-content',
            padding: '40px',
            background: 'white',
            color: '#0f172a',
            fontFamily: "'DM Sans', system-ui, sans-serif"
          }}
        >
          <div style={{ marginBottom: '32px', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '800', margin: '0 0 8px 0', color: '#0f172a' }}>
              График работы медперсонала
            </h1>
            <div style={{ fontSize: '18px', color: '#64748b', fontWeight: '600' }}>
              {monthNames[displayMonth]} {displayYear}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '36px' }}>
            {[
              { label: 'Сотрудников', value: filteredSchedule.length, color: '#3b82f6' },
              { label: 'Всего смен', value: stats.totalShifts, color: '#10b981' },
              { label: 'Ночных дежурств', value: stats.totalNightShifts, color: '#8b5cf6' },
              { label: 'Часов', value: stats.totalHours, color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} style={{ padding: '18px 22px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', minWidth: '160px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontSize: '30px', fontWeight: '800', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 18px', border: '1px solid #cbd5e1', background: '#f8fafc', textAlign: 'left', fontWeight: '700', color: '#475569', minWidth: '260px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  СОТРУДНИК
                </th>
                {daysArray.map((day) => {
                  const date = new Date(displayYear, displayMonth, day)
                  const dayOfWeek = date.getDay()
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                  return (
                    <th key={day} style={{ padding: '10px 6px', border: '1px solid #cbd5e1', background: isWeekend ? '#fef2f2' : '#f8fafc', textAlign: 'center', minWidth: '50px' }}>
                      <div style={{ color: isWeekend ? '#ef4444' : '#1e293b', fontSize: '14px', fontWeight: '800' }}>{day}</div>
                      <div style={{ fontSize: '9px', color: isWeekend ? '#f87171' : '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginTop: '3px' }}>{daysOfWeek[dayOfWeek]}</div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.map((employee) => (
                <tr key={employee.staffId}>
                  <td style={{ padding: '14px 18px', border: '1px solid #cbd5e1', background: 'white' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', marginBottom: '3px' }}>{employee.staffName}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>{employee.staffPosition}</div>
                  </td>
                  {daysArray.map((day) => {
                    const shift = getShiftInfo(employee, day)
                    const type = shift ? shift.type : 'empty'
                    const map: Record<string, { bg: string; label: string; color: string }> = {
                      day: { bg: '#eff6ff', label: 'Д', color: '#1d4ed8' },
                      night: { bg: '#f5f3ff', label: 'Н', color: '#6d28d9' },
                      'day-off': { bg: '#fff1f2', label: 'В', color: '#b91c1c' },
                    }
                    const info = map[type]
                    return (
                      <td key={day} style={{ padding: '8px', border: '1px solid #cbd5e1', background: info ? info.bg : 'white', textAlign: 'center', verticalAlign: 'middle' }}>
                        {info ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ color: info.color, fontWeight: '800', fontSize: '13px' }}>{info.label}</span>
                            {type !== 'day-off' && shift && (
                              <span style={{ color: info.color, fontSize: '9px', fontWeight: '700', marginTop: '1px', opacity: 0.8 }}>{shift.hours}ч</span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#e2e8f0', fontSize: '14px' }}>·</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}

export default MedicalStaffSchedulePage