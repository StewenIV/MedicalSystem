'use client'

import { useState } from 'react'
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
  AccountAvatar
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

type NotificationType = 'lab-result' | 'appointment-reminder'
type SeverityType = 'critical' | 'warning'

interface Notification {
  id: string
  type: NotificationType
  severity?: SeverityType
  patientName: string
  patientId: string
  dateOfBirth?: string
  doctor?: string
  message: string
  details?: string
  time: string
  read: boolean
}

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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('dashboard')

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'lab-result',
      severity: 'critical',
      patientName: 'Петров Иван Сергеевич',
      patientId: 'P002',
      dateOfBirth: '15.03.1985',
      doctor: 'Кузнецова А.В.',
      message: 'Критические результаты анализа крови',
      details: 'Лейкоциты: 15.2 (норма 4-9)',
      time: '10 мин назад',
      read: false
    },
    {
      id: '2',
      type: 'appointment-reminder',
      patientName: 'Иванова Мария Александровна',
      patientId: 'P001',
      message: 'Приём начнётся через 1 час',
      time: '14:00',
      read: false
    },
    {
      id: '3',
      type: 'lab-result',
      severity: 'warning',
      patientName: 'Смирнов Алексей Дмитриевич',
      patientId: 'P003',
      dateOfBirth: '22.07.1978',
      doctor: 'Кузнецова А.В.',
      message: 'Результаты биохимического анализа',
      details: 'Глюкоза: 6.8 ммоль/л (повышена)',
      time: '2 часа назад',
      read: false
    },
    {
      id: '4',
      type: 'appointment-reminder',
      patientName: 'Петров Иван Сергеевич',
      patientId: 'P002',
      message: 'Приём начнётся через 1 час',
      time: '16:00',
      read: false
    }
  ])

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const handleNotifClick = (n: Notification) => {
    markRead(n.id)
    setNotificationsOpen(false)
    onNavigate('patient-card', n.patientId)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

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
          <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <SidebarInset>
            <Header>
              <HeaderInner>
                <Flex>
                  <SidebarTrigger className="rounded-lg" />
                </Flex>

                <SearchWrapper $open={searchOpen}>
                  <Input
                    type="search"
                    placeholder="Поиск пациента..."
                    icon={<Search size={16} />}
                  />
                </SearchWrapper>

                <SearchIconButton onClick={() => setSearchOpen((prev) => !prev)}>
                  <Search size={18} />
                </SearchIconButton>

                <FlexRight>
                  <DateLabel>
                    <Clock size={15} />
                    <span>{formatDate()}</span>
                  </DateLabel>

                  <IconButton onClick={() => setNotificationsOpen(true)}>
                    <Bell size={20} />
                    {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
                  </IconButton>

                  <Separator />

                  <AccountInfo>
                    <AccountText>
                      <AccountName>Иванова Иван Иванович</AccountName>
                      <AccountRole>Медицинская сестра</AccountRole>
                    </AccountText>
                    <AccountAvatar>ИИ</AccountAvatar>
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
                              if (a.status !== 'Свободно') onNavigate('patient-card', a.patientId)
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
                <TemperaturePage onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
              )}

              {activeSection === 'HospitalWorkplace' && (
                <HospitalWorkplace
                  onNavigate={onNavigate}
                  onLogout={onLogout}
                  userRole={userRole}
                />
              )}

              {activeSection === 'patients' && (
                <SectionTitle style={{ marginTop: 24 }}>Пациенты</SectionTitle>
              )}
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
                  {notifications.length === 0 ? (
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
                            severity={n.type === 'lab-result' ? n.severity : 'info'}
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
                                  <SeverityBadge severity={n.severity}>
                                    {n.severity === 'critical' ? 'Критично' : 'Внимание'}
                                  </SeverityBadge>
                                )}
                                <NotificationTitle>{n.message}</NotificationTitle>
                              </div>
                              <NotificationTime>{n.time}</NotificationTime>
                            </NotificationHeader>

                            <NotificationPatient>
                              <strong>{n.patientName}</strong>
                              <span>ID: {n.patientId}</span>
                              {n.dateOfBirth && <span>Дата рождения: {n.dateOfBirth}</span>}
                              {n.doctor && <span>Лечащий врач: {n.doctor}</span>}
                            </NotificationPatient>

                            {n.details && (
                              <NotificationDetails>
                                <strong>Детали:</strong> {n.details}
                              </NotificationDetails>
                            )}
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

export default HomePage
