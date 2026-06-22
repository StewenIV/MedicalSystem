import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { formatLocalDateTime } from 'utils/dateUtils'

import {
  Bell,
  Search,
  LogOut,
  Clock,
  ChevronRight,
  X,
  AlertCircle,
  Thermometer
} from 'lucide-react'

import {
  HomePageContainer,
  Header,
  HeaderInner,
  FlexBetween,
  Flex,
  Main,
  IconButton,
  SearchWrapper,
  SearchIconButton,
  DateLabel,
  Card,
  CardHeader,
  CardBody,
  Grid,
  SectionTitle,
  AppointmentRow,
  StatusBadge,
  Backdrop,
  NotificationPanel,
  NotificationItem,
  NotificationContent,
  NotificationIconWrapper,
  NotificationBody,
  NotificationHeader,
  NotificationTitle,
  NotificationTime,
  NotificationDetails,
  NotificationPatient,
  SeverityBadge,
  NotificationBadge,
  EmptyNotifications,
  FlexRight,
  Separator,
  AccountInfo,
  AccountText,
  AccountName,
  AccountRole,
  AccountAvatar,
  PatientInfoWrapper,
  PatientInfoItem,
  PatientInfoDot,
  PatientInfoLabel,
  SearchDropdown,
  SearchDropdownItem,
  SearchDropdownItemName,
  SearchDropdownItemInfo,
  SearchDropdownItemBadge
} from './styled'

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader
} from '@/components/ui/sidebar'

import { AppSidebar } from '@/components/Sidebar/sidebar'

import Input from 'components/Input'
import { mockTodayAppointments } from 'data/mockData'
import TemperaturePage from 'pages/TemperatureSheet'
import { HospitalWorkplace } from 'pages/HospitalBedsPage'
import { WardAdmin } from 'pages/BedsAdminPage'
import { default as PatientCard } from 'pages/PatientCard'
import MedicalStaffSchedulePage from 'pages/MedicalStaffSchedule'
import MedicinesPage from 'pages/MedicinesPage'
import { WardRoundPage, WardRoundsHub, PrimaryInspectionPage } from 'pages/WardRound'
import { PatientDataProvider, usePatientData } from 'context/PatientDataContext'
import LaboratoryPage from 'pages/LaboratoryPage'
import PatientCabinetPage from 'pages/PatientCabinetPage'
import { selectDisplayName, selectUserRole } from 'features/App/selectors'
import { UserRole } from 'features/App/types'
import { usePatientNotifications } from 'context/PatientNotificationsContext'
import { fetchPatientProfile } from 'api/patientCabinetApi'

interface DoctorDashboardProps {
  onNavigate?: (screen: string, patientId?: string) => void
  onLogout?: () => void
  userRole?: 'doctor' | 'nurse' | 'patient' | null
}

const HomePageContent: React.FC<DoctorDashboardProps> = ({
  onNavigate = () => {},
  onLogout = () => {},
  userRole = 'nurse'
}) => {
  const { patients } = usePatientData()
  const displayName = useSelector(selectDisplayName)
  const reduxRole = useSelector(selectUserRole)
  const patientNotifCtx = usePatientNotifications()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerSearchQuery, setHeaderSearchQuery] = useState('')
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchWrapperRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredPatients = React.useMemo(() => {
    const q = headerSearchQuery.toLowerCase().trim()
    if (!q) return []
    return patients.filter((p) => {
      const fullName = `${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase()
      return (
        fullName.includes(q) ||
        p.medcardNum?.toLowerCase().includes(q) ||
        p.historyNum?.toLowerCase().includes(q)
      )
    })
  }, [headerSearchQuery, patients])

  const handleDropdownPatientClick = (patientId: string) => {
    setSelectedPatientId(patientId)
    setActiveSection('patients')
    setHeaderSearchQuery('')
    setShowDropdown(false)
    setSearchOpen(false)
  }
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (reduxRole === 'Patient') return 'patient-dashboard'
    if (reduxRole === 'LaboratoryEmployee') return 'laboratory'
    return 'dashboard'
  })

  React.useEffect(() => {
    if (reduxRole === 'Patient') {
      setActiveSection('patient-dashboard')
    } else if (reduxRole === 'LaboratoryEmployee') {
      setActiveSection('laboratory')
    }
  }, [reduxRole])
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>()
  const [selectedPatientInitialTab, setSelectedPatientInitialTab] = useState<string | undefined>()
  const [selectedLabResultId, setSelectedLabResultId] = useState<string | undefined>()
  const [wardRoundPatientId, setWardRoundPatientId] = useState<string | undefined>()
  const [wardRoundType, setWardRoundType] = useState<'hub' | 'primary' | 'daily'>('hub')
  const [patientProfile, setPatientProfile] = useState<any>(null)

  React.useEffect(() => {
    if (reduxRole === 'Patient') {
      fetchPatientProfile()
        .then((data) => setPatientProfile(data))
        .catch(console.error)
    }
  }, [reduxRole])

  const markRead = (id: string) => patientNotifCtx.markRead(id)

  const openPatientCard = (patientId?: string, tab?: string) => {
    setActiveSection('patients')
    setSelectedPatientId(patientId)
    setSelectedPatientInitialTab(tab)
  }

  const openWardRound = (patientId?: string) => {
    setWardRoundPatientId(patientId)
    setWardRoundType(patientId ? 'daily' : 'hub')
    setActiveSection('ward-round')
  }

  const openPrimary = (patientId: string) => {
    setWardRoundPatientId(patientId)
    setWardRoundType('primary')
    setActiveSection('ward-round')
  }

  const openDaily = (patientId: string) => {
    setWardRoundPatientId(patientId)
    setWardRoundType('daily')
    setActiveSection('ward-round')
  }

  const openWardRoundHub = () => {
    setWardRoundPatientId(undefined)
    setWardRoundType('hub')
    setActiveSection('ward-round')
  }

  const handleHeaderSearch = () => {
    if (headerSearchQuery.trim()) {
      setSearchQuery(headerSearchQuery.trim())
      setActiveSection('patients')
      setSelectedPatientId(undefined)
      setSearchOpen(false)
    }
  }

  const handleNotifClick = (n: any) => {
    markRead(n.id)
    setNotificationsOpen(false)
    if (reduxRole === 'LaboratoryEmployee') {
      setActiveSection('laboratory')
      if (n.details) {
        setSelectedLabResultId(n.details)
        window.dispatchEvent(new CustomEvent('laboratory:open-result', { detail: n.details }))
      }
    } else {
      if (n.patientId) {
        const isLabNotif =
          n.rawType?.toLowerCase() === 'labresult' ||
          n.title?.toLowerCase().includes('анализ') ||
          n.text?.toLowerCase().includes('анализ')
        openPatientCard(n.patientId, isLabNotif ? 'Анализы' : undefined)
      }
    }
  }

  const handlePatientNotifClick = (id: string) => {
    patientNotifCtx.markRead(id)
    setNotificationsOpen(false)
    setActiveSection('patient-notifications')
  }

  const unreadCount = patientNotifCtx.unreadCount

  const getInitials = (first?: string, last?: string) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase()
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

  const formatDate = () => {
    const s = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date())
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <>
      <Helmet>
        <title>Главная страница</title>
        <meta name="description" content="Панель врача" />
      </Helmet>

        <HomePageContainer>
          <SidebarProvider
            style={
              {
                '--sidebar-width': '20rem',
                '--sidebar-width-mobile': '20rem'
              } as React.CSSProperties
            }
          >
            <AppSidebar
              activeSection={activeSection}
              onSectionChange={(s) => {
                if (s === 'ward-round') {
                  openWardRoundHub()
                } else {
                  setActiveSection(s)
                }
              }}
            />

            <SidebarInset className="overflow-x-hidden min-w-0">
              <Header>
                <HeaderInner>
                  <Flex style={{ alignItems: 'center' }}>
                    <SidebarTrigger className="rounded-lg" />
                    {reduxRole === 'Patient' && (
                      <PatientInfoWrapper>
                        <PatientInfoItem>
                          <PatientInfoDot $color="#3b82f6" />
                          <PatientInfoLabel>Лечащий врач:</PatientInfoLabel>{' '}
                          <span>{patientProfile?.doctorName || 'Загрузка...'}</span>
                        </PatientInfoItem>
                        <PatientInfoItem>
                          <PatientInfoDot $color="#8b5cf6" />
                          <PatientInfoLabel>Палата:</PatientInfoLabel>{' '}
                          <span>
                            {patientProfile
                              ? patientProfile.roomNumber
                                ? `${patientProfile.roomNumber} (Койка ${patientProfile.bedNumber || 1})`
                                : 'Не назначена'
                              : 'Загрузка...'}
                          </span>
                        </PatientInfoItem>
                      </PatientInfoWrapper>
                    )}
                  </Flex>

                  {reduxRole !== 'Patient' && reduxRole !== 'LaboratoryEmployee' && (
                    <>
                      <SearchWrapper $open={searchOpen} ref={searchWrapperRef}>
                        <Input
                          type="search"
                          placeholder="Поиск по ФИО, № медкарты или № истории болезни"
                          icon={<Search size={16} />}
                          value={headerSearchQuery}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setHeaderSearchQuery(e.target.value)
                            setShowDropdown(true)
                          }}
                          onFocus={() => setShowDropdown(true)}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') handleHeaderSearch()
                          }}
                        />
                        {showDropdown && headerSearchQuery && filteredPatients.length > 0 && (
                          <SearchDropdown>
                            {filteredPatients.map((p) => (
                              <SearchDropdownItem
                                key={p.id}
                                onClick={() => handleDropdownPatientClick(p.id)}
                              >
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    backgroundColor: '#eff6ff',
                                    color: '#2563eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    flexShrink: 0
                                  }}>
                                    {getInitials(p.firstName, p.lastName)}
                                  </div>
                                  <div>
                                    <SearchDropdownItemName>
                                      {p.lastName} {p.firstName} {p.middleName}
                                    </SearchDropdownItemName>
                                    <SearchDropdownItemInfo>
                                      {p.age} {pluralize(p.age, ['год', 'года', 'лет'])}, {(p.gender as any) === 'Male' || (p.gender as any) === '0' || (p.gender as any) === 0 || (p.gender as any) === 'Мужской' ? 'М' : 'Ж'} 
                                      {' • '} Карта: {p.medcardNum || '—'} 
                                      {' • '} Врач: {p.doctor || '—'}
                                      {' • '} Палата: {(p as any).roomNumber || '—'}
                                    </SearchDropdownItemInfo>
                                  </div>
                                </div>
                                <SearchDropdownItemBadge>
                                  {p.statusText || 'Пациент'}
                                </SearchDropdownItemBadge>
                              </SearchDropdownItem>
                            ))}
                          </SearchDropdown>
                        )}
                      </SearchWrapper>

                      <SearchIconButton
                        onClick={() => {
                          if (searchOpen && headerSearchQuery.trim()) {
                            handleHeaderSearch()
                          } else {
                            setSearchOpen((prev) => !prev)
                          }
                        }}
                      >
                        <Search size={18} />
                      </SearchIconButton>
                    </>
                  )}

                  <FlexRight>
                    <DateLabel>
                      <Clock size={15} />
                      <span>{formatDate()}</span>
                    </DateLabel>

                    {reduxRole !== 'Patient' && (
                      <IconButton onClick={() => setNotificationsOpen(true)}>
                        <Bell size={20} />
                        {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
                      </IconButton>
                    )}

                    <Separator />

                    <AccountInfo>
                      <AccountText>
                        <AccountName>{displayName || 'Пользователь'}</AccountName>
                        <AccountRole>
                          {reduxRole === 'Doctor'
                            ? 'Врач'
                            : reduxRole === 'Nurse'
                              ? 'Медицинская сестра'
                              : reduxRole === 'HeadNurse'
                                ? 'Старшая медицинская сестра'
                                : reduxRole === 'ChiefDoctor'
                                  ? 'Главный врач'
                                  : reduxRole === 'LaboratoryEmployee'
                                    ? 'Лаборатория'
                                    : reduxRole === 'Patient'
                                      ? 'Пациент'
                                      : 'Сотрудник'}
                        </AccountRole>
                      </AccountText>
                      <AccountAvatar>
                        {(displayName || 'П')
                          .split(' ')
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')
                          .toUpperCase()}
                      </AccountAvatar>
                    </AccountInfo>

                    <IconButton onClick={onLogout}>
                      <LogOut size={20} />
                    </IconButton>
                  </FlexRight>
                </HeaderInner>
              </Header>

              <Main>
                {activeSection === 'dashboard' && (
                  <>
                    <SectionTitle style={{ marginTop: 24 }}>Добрый день!</SectionTitle>

                    <Grid>
                      <Card>
                        <CardHeader>Сегодняшние приёмы</CardHeader>
                        <CardBody>
                          {mockTodayAppointments.map((a) => (
                            <AppointmentRow
                              key={a.id}
                              $clickable={a.status !== 'Свободно'}
                              onClick={() => {
                                if (a.status !== 'Свободно') openPatientCard(a.patientId)
                              }}
                            >
                              <div>
                                <strong>{a.time}</strong>
                                {' — '}
                                {a.patientName || 'Свободно'}
                              </div>
                              <Flex style={{ gap: 12 }}>
                                <StatusBadge status={a.status}>{a.status}</StatusBadge>
                                {a.status !== 'Свободно' && <ChevronRight size={16} />}
                              </Flex>
                            </AppointmentRow>
                          ))}
                        </CardBody>
                      </Card>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <Card>
                          <CardHeader>Календарь</CardHeader>
                          <CardBody>19 20 21 22 23 24 25</CardBody>
                        </Card>
                      </div>
                    </Grid>
                  </>
                )}

                {activeSection === 'temperature-sheet' && (
                  <TemperaturePage
                    onNavigate={onNavigate}
                    onLogout={onLogout}
                    userRole={userRole}
                    patientId={selectedPatientId}
                  />
                )}

                {activeSection === 'HospitalWorkplace' && (
                  <HospitalWorkplace
                    onNavigate={onNavigate}
                    onLogout={onLogout}
                    userRole={userRole}
                  />
                )}

                {activeSection === 'beds-admin' && <WardAdmin />}

                {(activeSection === 'patients' || activeSection === 'patient-card') && (
                  <PatientCard
                    patientId={selectedPatientId}
                    initialSearchQuery={searchQuery}
                    initialTab={selectedPatientInitialTab}
                    onSelectPatient={(id) => {
                      setSelectedPatientId(id || undefined)
                      setSelectedPatientInitialTab(undefined)
                    }}
                    onNavigateToTemperatureSheet={(id: string) => {
                      setActiveSection('temperature-sheet')
                      setSelectedPatientId(id || undefined)
                    }}
                    onNavigateToWardRound={(id) => openWardRound(id || undefined)}
                  />
                )}

                {activeSection === 'ward-round' && (
                  <>
                    {wardRoundType === 'hub' && (
                      <WardRoundsHub
                        onStartPrimary={openPrimary}
                        onStartDaily={openDaily}
                        onOpenPatient={(id) => {
                          setSelectedPatientId(id)
                          setActiveSection('patients')
                        }}
                      />
                    )}
                    {wardRoundType === 'primary' && wardRoundPatientId && (
                      <PrimaryInspectionPage
                        patientId={wardRoundPatientId}
                        onClose={openWardRoundHub}
                        onNavigateToTemperatureSheet={(id: string) => {
                          setActiveSection('temperature-sheet')
                          setSelectedPatientId(id)
                        }}
                      />
                    )}
                    {wardRoundType === 'daily' && wardRoundPatientId && (
                      <WardRoundPage
                        patientId={wardRoundPatientId}
                        onClose={openWardRoundHub}
                        onNavigateToTemperatureSheet={(id: string) => {
                          setActiveSection('temperature-sheet')
                          setSelectedPatientId(id)
                        }}
                      />
                    )}
                  </>
                )}

                {activeSection === 'medical-staff-schedule' && (
                  <MedicalStaffSchedulePage
                    onNavigate={onNavigate}
                    onLogout={onLogout}
                    userRole={userRole}
                  />
                )}

                {activeSection === 'medicines' && <MedicinesPage />}

                {activeSection === 'schedule' && (
                  <SectionTitle style={{ marginTop: 24 }}>Расписание</SectionTitle>
                )}
                {activeSection === 'documents' && (
                  <SectionTitle style={{ marginTop: 24 }}>Документы</SectionTitle>
                )}
                {activeSection === 'reports' && (
                  <SectionTitle style={{ marginTop: 24 }}>Отчёты</SectionTitle>
                )}
                {activeSection === 'settings' && (
                  <SectionTitle style={{ marginTop: 24 }}>Управление</SectionTitle>
                )}
                {(activeSection === 'patient-dashboard' ||
                  activeSection === 'patient-exams' ||
                  activeSection === 'patient-docs' ||
                  activeSection === 'patient-notifications' ||
                  activeSection === 'patient-profile') && (
                  <PatientCabinetPage
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                )}
                {activeSection === 'laboratory' && (
                  <LaboratoryPage
                    initialLabResultId={selectedLabResultId}
                    onClearInitialId={() => setSelectedLabResultId(undefined)}
                  />
                )}
              </Main>
            </SidebarInset>

            {isNotificationsOpen && (
              <>
                <Backdrop onClick={() => setNotificationsOpen(false)} />
                <NotificationPanel>
                  <CardHeader>
                    <FlexBetween style={{ width: '100%' }}>
                      <div>
                        Уведомления
                        {unreadCount > 0 && (
                          <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: 13 }}>
                            ({unreadCount} новых)
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => patientNotifCtx.markAllRead()}
                            style={{
                              background: 'none',
                              border: '1px solid #cbd5e1',
                              borderRadius: 8,
                              padding: '4px 10px',
                              fontSize: 12,
                              cursor: 'pointer',
                              color: '#475569'
                            }}
                          >
                            Прочитать все
                          </button>
                        )}
                        <IconButton onClick={() => setNotificationsOpen(false)}>
                          <X size={17} />
                        </IconButton>
                      </div>
                    </FlexBetween>
                  </CardHeader>

                  <CardBody style={{ maxHeight: 'calc(80vh - 80px)', overflowY: 'auto' }}>
                    {patientNotifCtx.loading ? (
                      <EmptyNotifications>
                        <p>Загрузка...</p>
                      </EmptyNotifications>
                    ) : patientNotifCtx.notifications.length === 0 ? (
                      <EmptyNotifications>
                        <Bell size={44} />
                        <p>Нет уведомлений</p>
                      </EmptyNotifications>
                    ) : (
                      patientNotifCtx.notifications.map((n) => (
                        <NotificationItem
                          key={n.id}
                          read={n.read}
                          onClick={() => {
                            if (reduxRole === 'Patient') {
                              handlePatientNotifClick(n.id)
                            } else {
                              handleNotifClick(n)
                            }
                          }}
                        >
                          <NotificationContent>
                            <NotificationIconWrapper
                              severity={
                                n.severity === 'critical'
                                  ? 'critical'
                                  : n.severity === 'warning'
                                    ? 'warning'
                                    : 'info'
                              }
                            >
                              {n.type === 'medical' ? (
                                <AlertCircle size={18} />
                              ) : (
                                <Clock size={18} />
                              )}
                            </NotificationIconWrapper>
                            <NotificationBody>
                              <NotificationHeader>
                                <div style={{ flex: 1 }}>
                                  {n.severity && n.severity !== 'info' && (
                                    <SeverityBadge severity={n.severity as 'critical' | 'warning'}>
                                      {n.severity === 'critical' ? 'Критично' : 'Внимание'}
                                    </SeverityBadge>
                                  )}
                                  <NotificationTitle>{n.title}</NotificationTitle>
                                </div>
                                <NotificationTime>
                                  {formatLocalDateTime(n.time, {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </NotificationTime>
                              </NotificationHeader>
                              {n.text && <NotificationDetails>{n.text}</NotificationDetails>}
                            </NotificationBody>
                          </NotificationContent>
                        </NotificationItem>
                      ))
                    )}
                  </CardBody>
                </NotificationPanel>
              </>
            )}
          </SidebarProvider>
        </HomePageContainer>
      </>
  )
}

const HomePage: React.FC<DoctorDashboardProps> = (props) => {
  return (
    <PatientDataProvider>
      <HomePageContent {...props} />
    </PatientDataProvider>
  )
}

export default HomePage
