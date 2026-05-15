import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import {
  PageContainer,
  Header,
  HeaderTitle,
  MonthYearSelector,
  MonthDisplay,
  NavigationButton,
  TableContainer,
  Table,
  FilterContainer,
  FilterLabel,
  FilterSelect,
  StatsContainer,
  StatCard,
  StickyNameColumn,
  NameColumnHeader,
  ExportButton,
  EmployeeInfo,
  EmployeeName,
  Position,
  ShiftCell,
  DayOffBadge
} from './styled'
import { mockMedicalStaffSchedule } from 'data/mockData'

interface MedicalStaffSchedulePageProps {
  onNavigate?: (screen: string) => void
  onLogout?: () => void
  userRole?: 'doctor' | 'nurse' | 'patient' | null
}

const MedicalStaffSchedulePage: React.FC<MedicalStaffSchedulePageProps> = ({
  onNavigate = () => {},
  onLogout = () => {},
  userRole = null
}) => {
  const currentDate = new Date()
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth())
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear())
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ]

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const filteredSchedule = useMemo(() => {
    return mockMedicalStaffSchedule.filter((employee) => {
      if (selectedPosition && selectedPosition !== 'all') {
        return employee.position === selectedPosition
      }
      return true
    })
  }, [selectedPosition])

  const positions = useMemo(() => {
    const uniquePositions = Array.from(
      new Set(mockMedicalStaffSchedule.map((e) => e.position))
    ).sort()
    return uniquePositions
  }, [])

  const getDaysArray = () => {
    const days = daysInMonth(displayMonth, displayYear)
    return Array.from({ length: days }, (_, i) => i + 1)
  }

  const getShiftInfo = (employee: typeof mockMedicalStaffSchedule[0], day: number) => {
    const shift = employee.schedule.find((s) => s.day === day)
    return shift
  }

  const handlePreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    } else {
      setDisplayMonth(displayMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    } else {
      setDisplayMonth(displayMonth + 1)
    }
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting schedule...')
  }

  const totalWorkingDays = useMemo(() => {
    return filteredSchedule.reduce((acc, employee) => {
      return acc + employee.schedule.filter((s) => s.type !== 'day-off').length
    }, 0)
  }, [filteredSchedule])

  const daysArray = getDaysArray()

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>График работы медперсонала</HeaderTitle>
        <MonthYearSelector>
          <NavigationButton onClick={handlePreviousMonth}>
            <ChevronLeft size={20} />
          </NavigationButton>
          <MonthDisplay>
            {monthNames[displayMonth]} {displayYear}
          </MonthDisplay>
          <NavigationButton onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </NavigationButton>
        </MonthYearSelector>
      </Header>

      <FilterContainer>
        <FilterLabel>
          Должность:
          <FilterSelect
            value={selectedPosition || 'all'}
            onChange={(e) => setSelectedPosition(e.target.value === 'all' ? null : e.target.value)}
          >
            <option value="all">Все должности</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </FilterSelect>
        </FilterLabel>
        <ExportButton onClick={handleExport}>
          <Download size={18} />
          Скачать график
        </ExportButton>
      </FilterContainer>

      <StatsContainer>
        <StatCard>
          <h3>Всего сотрудников</h3>
          <p>{filteredSchedule.length}</p>
        </StatCard>
        <StatCard>
          <h3>Дней работы</h3>
          <p>{totalWorkingDays}</p>
        </StatCard>
        <StatCard>
          <h3>Уникальные должности</h3>
          <p>{positions.length}</p>
        </StatCard>
      </StatsContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <NameColumnHeader>ФИО / Должность</NameColumnHeader>
              {daysArray.map((day) => (
                <th key={day} title={`${day} ${monthNames[displayMonth]}`}>
                  <div style={{ fontSize: '12px' }}>День {day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.map((employee) => (
              <tr key={employee.id}>
                <StickyNameColumn>
                  <EmployeeInfo>
                    <EmployeeName>{employee.name}</EmployeeName>
                    <Position>{employee.position}</Position>
                  </EmployeeInfo>
                </StickyNameColumn>
                {daysArray.map((day) => {
                  const shift = getShiftInfo(employee, day)
                  const isDayOff = shift?.type === 'day-off'
                  const isDay = shift?.type === 'day'

                  return (
                    <ShiftCell key={`${employee.id}-${day}`} isDayOff={isDayOff} isDay={isDay}>
                      {isDayOff ? (
                        <DayOffBadge>Выходной</DayOffBadge>
                      ) : shift ? (
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {shift.type === 'night' ? 'Ночь' : 'День'}
                          </div>
                          <div style={{ fontSize: '11px', opacity: 0.8 }}>
                            {shift.hours}ч
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e0' }}>—</span>
                      )}
                    </ShiftCell>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  )
}

export default MedicalStaffSchedulePage
