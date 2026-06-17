import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

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
  PatientInfoLabel
} from './styled'

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader
} from '@/components/ui/sidebar'

import { AppSidebar } from '@/components/Sidebar/sidebar'

import Input from 'components/Input'
import { mockTodayAppointments, mockNotifications, type Notification } from 'data/mockData'
import TemperaturePage from 'pages/TemperatureSheet'
import { HospitalWorkplace } from 'pages/HospitalBedsPage'
import { WardAdmin } from 'pages/BedsAdminPage'
import { default as PatientCard } from 'pages/PatientCard'
import MedicalStaffSchedulePage from 'pages/MedicalStaffSchedule'
import MedicinesPage from 'pages/MedicinesPage'
import { WardRoundPage, WardRoundsHub, PrimaryInspectionPage } from 'pages/WardRound'
import { PatientDataProvider } from 'context/PatientDataContext'
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

const HomePage: React.FC<DoctorDashboardProps> = ({
  onNavigate = () => {},
  onLogout = () => {},
  userRole = 'nurse'
}) => {
  const displayName = useSelector(selectDisplayName)
  const reduxRole = useSelector(selectUserRole)
  const patientNotifCtx = usePatientNotifications()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerSearchQuery, setHeaderSearchQuery] = useState('')
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
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

  // Уведомления медперсонала (локальный стейт)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  React.useEffect(() => {
    if (reduxRole !== 'Patient') {
      setNotifications(mockNotifications)
    }
  }, [reduxRole])

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const openPatientCard = (patientId?: string) => {
    setActiveSection('patients')
    setSelectedPatientId(patientId)
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

  const handleNotifClick = (n: Notification) => {
    markRead(n.id)
    setNotificationsOpen(false)
    openPatientCard(n.patientId)
  }

  const handlePatientNotifClick = (id: string) => {
    patientNotifCtx.markRead(id)
    setNotificationsOpen(false)
    setActiveSection('patient-notifications')
  }

    const unreadCount = reduxRole === 'Patient'
    ? patientNotifCtx.unreadCount
    : notifications.filter((n) => !n.read).length

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
    <PatientDataProvider>
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
          <AppSidebar activeSection={activeSection} onSectionChange={(s) => {
            if (s === 'ward-round') {
              openWardRoundHub()
            } else {
              setActiveSection(s)
            }
          }} />

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
                    <SearchWrapper $open={searchOpen}>
                      <Input
                        type="search"
                        placeholder="Поиск пациента..."
                        icon={<Search size={16} />}
                        value={headerSearchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setHeaderSearchQuery(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') handleHeaderSearch()
                        }}
                      />
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

                  {reduxRole !== 'LaboratoryEmployee' && (
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
                        {reduxRole === 'Doctor' ? 'Врач'
                          : reduxRole === 'Nurse' ? 'Медицинская сестра'
                          : reduxRole === 'HeadNurse' ? 'Старшая медицинская сестра'
                          : reduxRole === 'ChiefDoctor' ? 'Главный врач'
                          : reduxRole === 'LaboratoryEmployee' ? 'Лаборатория'
                          : reduxRole === 'Patient' ? 'Пациент'
                          : 'Сотрудник'}
                      </AccountRole>
                    </AccountText>
                    <AccountAvatar>
                      {(displayName || 'П').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
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
                <TemperaturePage onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} patientId={selectedPatientId} />
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
                  onSelectPatient={(id) => {
                    setSelectedPatientId(id || undefined)
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
                      onOpenPatient={(id) => { setSelectedPatientId(id); setActiveSection('patients') }}
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
                <PatientCabinetPage activeSection={activeSection} onSectionChange={setActiveSection} />
              )}
              {activeSection === 'laboratory' && <LaboratoryPage />}
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
                    <IconButton onClick={() => setNotificationsOpen(false)}>
                      <X size={17} />
                    </IconButton>
                  </FlexBetween>
                </CardHeader>

                <CardBody style={{ maxHeight: 'calc(80vh - 80px)', overflowY: 'auto' }}>
                          {reduxRole === 'Patient' ? (
                    patientNotifCtx.notifications.length === 0 ? (
                      <EmptyNotifications>
                        <Bell size={44} />
                        <p>Нет новых уведомлений</p>
                      </EmptyNotifications>
                    ) : (
                      patientNotifCtx.notifications.map((n) => (
                        <NotificationItem
                          key={n.id}
                          read={n.read}
                          onClick={() => handlePatientNotifClick(n.id)}
                        >
                          <NotificationContent>
                            <NotificationIconWrapper
                              severity={n.severity === 'critical' ? 'critical' : n.severity === 'warning' ? 'warning' : 'info'}
                            >
                              {n.type === 'medical' ? <AlertCircle size={18} /> : <Clock size={18} />}
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
                                <NotificationTime>{n.time}</NotificationTime>
                              </NotificationHeader>
                              {n.details && (
                                <NotificationDetails>
                                  <strong>Детали:</strong> {n.details}
                                </NotificationDetails>
                              )}
                            </NotificationBody>
                          </NotificationContent>
                        </NotificationItem>
                      ))
                    )
                  ) : (
                    notifications.length === 0 ? (
                    <EmptyNotifications>
                      <Bell size={44} />
                      <p>Нет новых уведомлений</p>
                    </EmptyNotifications>
                  ) : (
                    notifications.map((n) => (
                      <NotificationItem
                        key={n.id}
                        read={n.read}
                        onClick={() => handleNotifClick(n)}
                      >
                        <NotificationContent>
                          <NotificationIconWrapper
                            severity={n.type === 'lab-result' && n.severity ? n.severity : 'info'}
                          >
                            {n.type === 'lab-result' ? (
                              <AlertCircle size={18} />
                            ) : (
                              <Clock size={18} />
                            )}
                          </NotificationIconWrapper>

                          <NotificationBody>
                            <NotificationHeader>
                              <div style={{ flex: 1 }}>
                                {n.type === 'lab-result' && n.severity && (
                                  <SeverityBadge severity={n.severity as 'critical' | 'warning'}>
                                    {n.severity === 'critical' ? 'Критично' : 'Внимание'}
                                  </SeverityBadge>
                                )}
                                <NotificationTitle>{n.message}</NotificationTitle>
                              </div>
                              <NotificationTime>{n.time}</NotificationTime>
                            </NotificationHeader>

                             {(reduxRole as string) !== 'Patient' && (
                              <NotificationPatient>
                                <strong>{n.patientName}</strong>
                                <span>ID: {n.patientId}</span>
                                {n.dateOfBirth && <span>Дата рождения: {n.dateOfBirth}</span>}
                                {n.doctor && <span>Лечащий врач: {n.doctor}</span>}
                              </NotificationPatient>
                            )}

                            {n.details && (
                              <NotificationDetails>
                                <strong>Детали:</strong> {n.details}
                              </NotificationDetails>
                            )}
                          </NotificationBody>
                        </NotificationContent>
                      </NotificationItem>
                    ))
                  ))}
                </CardBody>
              </NotificationPanel>
            </>
          )}
        </SidebarProvider>
      </HomePageContainer>
    </>
    </PatientDataProvider>
  )
}


export default HomePage
