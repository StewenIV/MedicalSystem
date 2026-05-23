import React, { useState, useMemo, useRef, useCallback } from 'react'
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
  Edit3
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
  MobileDayLabel
} from './styled'
import { mockMedicalStaffSchedule, getStaffScheduleForMonth, Shift } from 'data/mockData'

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

type ScheduleOverrides = Record<string, Record<number, Shift | null>>

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

const defaultHours: Record<string, number> = {
  day: 8,
  night: 12,
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
  const [overrides, setOverrides] = useState<ScheduleOverrides>({})

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [modalType, setModalType] = useState<ShiftType>('day')
  const [modalHours, setModalHours] = useState<number | string>(8)

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()

  const positions = useMemo(() => {
    return Array.from(new Set(mockMedicalStaffSchedule.map((e) => e.position))).sort()
  }, [])

  const filteredSchedule = useMemo(() => {
    return mockMedicalStaffSchedule.filter((employee) => {
      if (selectedPosition && selectedPosition !== 'all') {
        return employee.position === selectedPosition
      }
      return true
    })
  }, [selectedPosition])

  const getDaysArray = () => {
    const days = daysInMonth(displayMonth, displayYear)
    return Array.from({ length: days }, (_, i) => i + 1)
  }
  const daysArray = getDaysArray()

  const getShiftInfo = useCallback((employee: (typeof mockMedicalStaffSchedule)[0], day: number): Shift | undefined => {
    const empOverrides = overrides[employee.id]
    if (empOverrides && empOverrides[day] !== undefined) {
      return empOverrides[day] ?? undefined
    }
    const monthlySchedule = getStaffScheduleForMonth(employee.id, displayMonth, displayYear)
    if (monthlySchedule) return monthlySchedule.find((s) => s.day === day)
    return employee.schedule.find((s) => s.day === day)
  }, [overrides, displayMonth, displayYear])

  const handlePreviousMonth = () => {
    if (displayMonth === 0) { setDisplayMonth(11); setDisplayYear(displayYear - 1) }
    else setDisplayMonth(displayMonth - 1)
  }

  const handleNextMonth = () => {
    if (displayMonth === 11) { setDisplayMonth(0); setDisplayYear(displayYear + 1) }
    else setDisplayMonth(displayMonth + 1)
  }

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
  }, [filteredSchedule, displayMonth, displayYear, daysArray, getShiftInfo])

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

  const openEditModal = (employee: (typeof mockMedicalStaffSchedule)[0], day: number) => {
    const shift = getShiftInfo(employee, day)
    const currentType: ShiftType = shift ? (shift.type as ShiftType) : 'empty'
    const currentHours = shift ? shift.hours : 0
    setEditTarget({
      employeeId: employee.id,
      employeeName: employee.name,
      day,
      currentType,
      currentHours
    })
    setModalType(currentType)
    setModalHours(currentType === 'empty' ? 8 : currentHours)
  }

  const closeModal = () => {
    setEditTarget(null)
  }

  const handleTypeChange = (type: ShiftType) => {
    setModalType(type)
    if (type === 'day-off' || type === 'empty') {
      setModalHours(0)
    } else {
      setModalHours(defaultHours[type])
    }
  }

  const handleSave = () => {
    if (!editTarget) return
    const { employeeId, day } = editTarget

    setOverrides(prev => {
      const empOverrides = { ...(prev[employeeId] || {}) }
      if (modalType === 'empty') {
        empOverrides[day] = null
      } else {
        empOverrides[day] = {
          day,
          type: modalType as 'day' | 'night' | 'day-off',
          hours: modalType === 'day-off' ? 0 : modalHours as number
        }
      }
      return { ...prev, [employeeId]: empOverrides }
    })
    closeModal()
  }

  const today = new Date()
  const isCurrentMonth = today.getMonth() === displayMonth && today.getFullYear() === displayYear
  const currentDay = today.getDate()

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
        <StatCard $color="#3b82f6">
          <StatIcon $bg="#eff6ff"><Users size={20} /></StatIcon>
          <StatLabel>Сотрудников</StatLabel>
          <StatValue>{filteredSchedule.length}</StatValue>
          <StatSub>В выбранной выборке</StatSub>
        </StatCard>
        <StatCard $color="#10b981">
          <StatIcon $bg="#ecfdf5"><CalendarDays size={20} /></StatIcon>
          <StatLabel>Всего смен</StatLabel>
          <StatValue>{stats.totalShifts}</StatValue>
          <StatSub>За {monthNames[displayMonth].toLowerCase()}</StatSub>
        </StatCard>
        <StatCard $color="#8b5cf6">
          <StatIcon $bg="#f5f3ff"><Moon size={20} /></StatIcon>
          <StatLabel>Ночных дежурств</StatLabel>
          <StatValue>{stats.totalNightShifts}</StatValue>
          <StatSub>{Math.round((stats.totalNightShifts / Math.max(stats.totalShifts, 1)) * 100)}% от всех смен</StatSub>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatIcon $bg="#fffbeb"><Clock size={20} /></StatIcon>
          <StatLabel>Отработанных часов</StatLabel>
          <StatValue>{stats.totalHours}</StatValue>
          <StatSub>Суммарно по всем</StatSub>
        </StatCard>
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
                  <React.Fragment key={employee.id}>
                    {idx > 0 && (
                      <RowSpacer>
                        <td colSpan={daysArray.length + 1} />
                      </RowSpacer>
                    )}
                    <EmployeeCardRow>
                      <StickyNameColumn>
                        <EmployeeInfo>
                          <EmployeeName>{employee.name}</EmployeeName>
                          <Position>{employee.position}</Position>
                        </EmployeeInfo>
                      </StickyNameColumn>
                      {daysArray.map((day) => {
                        const date = new Date(displayYear, displayMonth, day)
                        const dayOfWeek = date.getDay()
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                        const shift = getShiftInfo(employee, day)
                        const type = shift ? shift.type : 'empty'

                        return (
                          <ShiftCell
                            key={`${employee.id}-${day}`}
                            $type={type as any}
                            $isWeekend={isWeekend}
                            onClick={() => openEditModal(employee, day)}
                            title={`Изменить смену: ${employee.name}, ${day} ${monthNames[displayMonth]}`}
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
            <MobileEmployeeCard key={employee.id}>
              <MobileCardHeader>
                <MobileCardName>{employee.name}</MobileCardName>
                <MobileCardPosition>{employee.position}</MobileCardPosition>
              </MobileCardHeader>
              <MobileScrollRow>
                {daysArray.map((day) => {
                  const date = new Date(displayYear, displayMonth, day)
                  const dayOfWeek = date.getDay()
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                  const isToday = isCurrentMonth && day === currentDay
                  const shift = getShiftInfo(employee, day)
                  const type = shift ? shift.type : 'empty'

                  return (
                    <MobileDayChip
                      key={day}
                      $type={type as ShiftType}
                      $isWeekend={isWeekend}
                      $isToday={isToday}
                      onClick={() => openEditModal(employee, day)}
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
          ))
        ) : (
          <NoDataState>
            <Users size={40} />
            <div>Сотрудники не найдены</div>
          </NoDataState>
        )}
      </div>

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
                        setModalHours(1);
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
                <tr key={employee.id}>
                  <td style={{ padding: '14px 18px', border: '1px solid #cbd5e1', background: 'white' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', marginBottom: '3px' }}>{employee.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>{employee.position}</div>
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