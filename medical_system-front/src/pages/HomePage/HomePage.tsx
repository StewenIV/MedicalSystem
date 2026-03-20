import { useState } from 'react'
import { Helmet } from 'react-helmet'

import {
  Bell,
  Search,
  LogOut,
  Clock,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Hospital,
  UserPlus,
  ClipboardList,
  Stethoscope,
  X,
  AlertCircle,
  CheckCircle2,
  Thermometer
} from 'lucide-react'

import {
  HomePageContainer,
  Header,
  HeaderInner,
  FlexBetween,
  Flex,
  ContentLayout,
  Sidebar,
  SidebarNav,
  Main,
  LogoBox,
  NavButton,
  IconButton,
  SearchWrapper,
  Card,
  CardHeader,
  CardBody,
  Grid,
  Column,
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
  NotificationMessage,
  NotificationDetails,
  NotificationPatient,
  SeverityBadge,
  NotificationBadge,
  EmptyNotifications
} from './styled'

import Input from 'components/Input'

import { mockTodayAppointments } from 'data/mockData'
import TemperaturePage from 'pages/TemperatureSheet'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('dashboard')
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'lab-result' as const,
      severity: 'critical' as const,
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
      type: 'appointment-reminder' as const,
      patientName: 'Иванова Мария Александровна',
      patientId: 'P001',
      message: 'Приём начнётся через 1 час',
      time: '14:00',
      read: false
    },
    {
      id: '3',
      type: 'lab-result' as const,
      severity: 'warning' as const,
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
      type: 'appointment-reminder' as const,
      patientName: 'Петров Иван Сергеевич',
      patientId: 'P002',
      message: 'Приём начнётся через 1 час',
      time: '16:00',
      read: false
    }
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id)
    if (notification.patientId) {
      setNotificationsOpen(false)
      onNavigate('patient-card', notification.patientId)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatDate = () => {
    const today = new Date()

    const newDate = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(today)

    return newDate.charAt(0).toUpperCase() + newDate.slice(1)
  }

  return (
    <>
      <Helmet>
        <title>Главная страница</title>
        <meta
          name="description"
          content="Страница регистрации нового пациента"
        />
      </Helmet>

      <HomePageContainer>
        <Header>
          <HeaderInner>
            <FlexBetween>
              <Flex>
                <LogoBox>
                  <Stethoscope size={32} color="#4A90E2" />
                </LogoBox>
                <div>
                  <h1>ЕМИС MedFlow</h1>
                  <p> Панель врача </p>
                </div>
              </Flex>

              <Flex>
                <SearchWrapper>
                  <Input
                    type="search"
                    placeholder="Поиск пациента..."
                    icon={<Search size={16} />}
                  />
                </SearchWrapper>

                <div>
                  <Clock size={16} />
                  <span style={{ marginLeft: 4 }}>{formatDate()}</span>
                </div>

                <IconButton onClick={() => setNotificationsOpen(true)}>
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <NotificationBadge>{unreadCount}</NotificationBadge>
                  )}
                </IconButton>

                <IconButton onClick={onLogout}>
                  <LogOut size={20} />
                </IconButton>
              </Flex>
            </FlexBetween>
          </HeaderInner>
        </Header>

        <ContentLayout>
          <Sidebar>
            <SidebarNav>
              <NavButton
                $active={activeSection === 'dashboard'}
                onClick={() => setActiveSection('dashboard')}
              >
                <LayoutDashboard size={18} />
                Дашборд
              </NavButton>
              <NavButton
                $active={activeSection === 'patients'}
                onClick={() => setActiveSection('patients')}
              >
                <Users size={18} />
                Пациенты
              </NavButton>
              <NavButton
                $active={activeSection === 'temperature-sheet'}
                onClick={() => setActiveSection('temperature-sheet')}
              >
                <Thermometer size={18} />
                Температурный лист
              </NavButton>
              <NavButton
                $active={activeSection === 'schedule'}
                onClick={() => setActiveSection('schedule')}
              >
                <Calendar size={18} />
                Расписание
              </NavButton>
              <NavButton
                $active={activeSection === 'documents'}
                onClick={() => setActiveSection('documents')}
              >
                <FileText size={18} />
                Документы
              </NavButton>
              <NavButton
                $active={activeSection === 'reports'}
                onClick={() => setActiveSection('reports')}
              >
                <BarChart3 size={18} />
                Отчеты
              </NavButton>
              <NavButton
                $active={activeSection === 'settings'}
                onClick={() => setActiveSection('settings')}
              >
                <Settings size={18} />
                Управление
              </NavButton>
            </SidebarNav>
          </Sidebar>

          <Main>
            {activeSection === 'dashboard' && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 700 }}>Добрый день!</h2>

                <Grid>
                  <Card>
                    <CardHeader>Сегодняшние приёмы</CardHeader>
                    <CardBody>
                      {mockTodayAppointments.map((a) => (
                        <AppointmentRow
                          key={a.id}
                          $clickable={a.status !== 'Свободно'}
                          onClick={() => {
                            if (a.status !== 'Свободно') {
                              onNavigate('patient-card', a.patientId)
                            }
                          }}
                        >
                          <div>
                            <strong>{a.time}</strong> -{' '}
                            {a.patientName || 'Свободно'}
                          </div>

                          <Flex style={{ gap: 12 }}>
                            <StatusBadge status={a.status}>
                              {a.status}
                            </StatusBadge>
                            {a.status !== 'Свободно' && (
                              <ChevronRight size={18} />
                            )}
                          </Flex>
                        </AppointmentRow>
                      ))}
                    </CardBody>
                  </Card>

                  <Column>
                    <Card>
                      <CardHeader>Календарь</CardHeader>
                      <CardBody>19 20 21 22 23 24 25</CardBody>
                    </Card>
                  </Column>
                </Grid>
              </>
            )}

            {activeSection === 'temperature-sheet' && (
              <TemperaturePage
                onNavigate={onNavigate}
                onLogout={onLogout}
                userRole={userRole}
              />
            )}

            {activeSection === 'patients' && (
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>Пациенты</h2>
            )}

            {activeSection === 'schedule' && (
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>Расписание</h2>
            )}

            {activeSection === 'documents' && (
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>Документы</h2>
            )}

            {activeSection === 'reports' && (
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>Отчеты</h2>
            )}

            {activeSection === 'settings' && (
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>Управление</h2>
            )}
          </Main>
        </ContentLayout>

        {isNotificationsOpen && (
          <>
            <Backdrop onClick={() => setNotificationsOpen(false)} />
            <NotificationPanel>
              <CardHeader>
                <FlexBetween style={{ width: '100%' }}>
                  <div>
                    Уведомления
                    {unreadCount > 0 && (
                      <span
                        style={{
                          marginLeft: 8,
                          color: '#9ca3af',
                          fontSize: 14
                        }}
                      >
                        ({unreadCount} новых)
                      </span>
                    )}
                  </div>
                  <IconButton onClick={() => setNotificationsOpen(false)}>
                    <X size={18} />
                  </IconButton>
                </FlexBetween>
              </CardHeader>

              <CardBody
                style={{ maxHeight: 'calc(80vh - 80px)', overflowY: 'auto' }}
              >
                {notifications.length === 0 ? (
                  <EmptyNotifications>
                    <Bell size={48} />
                    <p>Нет новых уведомлений</p>
                  </EmptyNotifications>
                ) : (
                  notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      read={n.read}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <NotificationContent>
                        <NotificationIconWrapper
                          severity={
                            n.type === 'lab-result' ? n.severity : 'info'
                          }
                        >
                          {n.type === 'lab-result' ? (
                            <AlertCircle size={20} />
                          ) : (
                            <Clock size={20} />
                          )}
                        </NotificationIconWrapper>

                        <NotificationBody>
                          <NotificationHeader>
                            <div style={{ flex: 1 }}>
                              {n.type === 'lab-result' && n.severity && (
                                <SeverityBadge severity={n.severity}>
                                  {n.severity === 'critical'
                                    ? 'Критично'
                                    : 'Внимание'}
                                </SeverityBadge>
                              )}
                              <NotificationTitle>{n.message}</NotificationTitle>
                            </div>
                            <NotificationTime>{n.time}</NotificationTime>
                          </NotificationHeader>

                          <NotificationPatient>
                            <strong>{n.patientName}</strong>
                            <span>ID: {n.patientId}</span>
                            {n.dateOfBirth && (
                              <span>Дата рождения: {n.dateOfBirth}</span>
                            )}
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
      </HomePageContainer>
    </>
  )
}

export default HomePage
