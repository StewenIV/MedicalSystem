import { useState } from 'react'
import {
  Calendar,
  Users,
  FileText,
  Settings,
  Bell,
  Search,
  LogOut,
  Clock,
  ChevronRight,
  LayoutDashboard,
  Stethoscope,
  ClipboardList,
  BarChart3,
  Hospital,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react'
import {
  mockTodayAppointments,
  mockPatients,
  getPatientFullName
} from 'data/mockData'

interface DoctorDashboardProps {
  onNavigate?: (screen: string, patientId?: string) => void
  onLogout?: () => void
  userRole?:
    | 'admin'
    | 'chief-doctor'
    | 'doctor'
    | 'head-nurse'
    | 'nurse'
    | 'patient'
    | 'laboratory'
    | null
}

const HomePage: React.FC<DoctorDashboardProps> = ({
  onNavigate = () => console.log('Navigation'),
  onLogout = () => console.log('Logout'),
  userRole = 'doctor'
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
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

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    handleMarkAsRead(notification.id)
    if (notification.patientId) {
      setNotificationsOpen(false)
      onNavigate('patient-card', notification.patientId)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 hover:bg-red-100'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
      case 'normal':
        return 'bg-green-50 border-green-200 hover:bg-green-100'
      default:
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    }
  }

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'normal':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      default:
        return <Bell className="w-5 h-5 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-50 text-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Ожидается'
      case 'in-progress':
        return 'На приеме'
      case 'completed':
        return 'Завершен'
      case 'free':
        return 'Свободно'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ЕМИС MedFlow
                </h1>
                <p className="text-xs text-gray-500">
                  {userRole === 'admin' && 'Панель администратора'}
                  {userRole === 'chief-doctor' && 'Главный врач'}
                  {userRole === 'doctor' && 'Городская поликлиника №1'}
                  {userRole === 'head-nurse' && 'Старшая медсестра'}
                  {userRole === 'nurse' && 'Медсестра'}
                </p>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск пациента..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Понедельник, 19 января 2026</span>
              </div>

              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {userRole === 'admin' && 'Администратор'}
                    {userRole === 'chief-doctor' && 'Доктор Петров'}
                    {userRole === 'doctor' && 'Доктор Кузнецова'}
                    {userRole === 'head-nurse' && 'Медсестра Иванова'}
                    {userRole === 'nurse' && 'Медсестра Соколова'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userRole === 'admin' && 'Системный администратор'}
                    {userRole === 'chief-doctor' && 'Главный врач'}
                    {userRole === 'doctor' && 'Врач-терапевт'}
                    {userRole === 'head-nurse' && 'Старшая медсестра'}
                    {userRole === 'nurse' && 'Медицинская сестра'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {userRole === 'admin' && 'А'}
                  {userRole === 'chief-doctor' && 'ГВ'}
                  {userRole === 'doctor' && 'АК'}
                  {userRole === 'head-nurse' && 'СМ'}
                  {userRole === 'nurse' && 'ЕС'}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Дашборд</span>
            </button>

            {(userRole === 'doctor' ||
              userRole === 'admin' ||
              userRole === 'chief-doctor') && (
              <>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5" />
                  <span>Мои пациенты</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5" />
                  <span>Расписание</span>
                </button>
                <button
                  onClick={() => onNavigate('appointment')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Запись на прием</span>
                </button>
              </>
            )}

            {(userRole === 'nurse' || userRole === 'head-nurse') && (
              <button
                onClick={() => onNavigate('nurse')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <ClipboardList className="w-5 h-5" />
                <span>Температурный лист</span>
              </button>
            )}

            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <ClipboardList className="w-5 h-5" />
              <span>Назначения</span>
            </button>

            <button
              onClick={() => onNavigate('hospital')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Hospital className="w-5 h-5" />
              <span>Стационар</span>
            </button>

            {(userRole === 'head-nurse' || userRole === 'admin') && (
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>График дежурств</span>
              </button>
            )}

            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5" />
              <span>Документы</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <BarChart3 className="w-5 h-5" />
              <span>Отчеты</span>
            </button>

            {(userRole === 'admin' || userRole === 'chief-doctor') && (
              <button
                onClick={() => onNavigate('facility')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                <span>Управление</span>
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Добрый день,{' '}
              {userRole === 'doctor'
                ? 'доктор Кузнецова'
                : userRole === 'nurse'
                  ? 'медсестра Соколова'
                  : 'уважаемый коллега'}
              !
            </h2>
            <p className="text-gray-600 mt-1">
              {userRole === 'doctor' && 'У вас 3 пациента на сегодня'}
              {userRole === 'nurse' && 'У вас 8 процедур на сегодня'}
              {userRole === 'admin' && 'Система работает в штатном режиме'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Сегодняшние приемы
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockTodayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => {
                      if (appointment.patientId) {
                        onNavigate('patient-card', appointment.patientId)
                      }
                    }}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      appointment.status !== 'free' ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-16 text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {appointment.time}
                          </div>
                        </div>
                        {appointment.status === 'free' ? (
                          <div className="flex-1">
                            <p className="text-gray-400 italic">Свободно</p>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {appointment.patientName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.reason}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                        {appointment.status !== 'free' && (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Requires Attention */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Требуют внимания
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      ИП
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Петров И.С.
                      </p>
                      <p className="text-xs text-gray-600">Новые анализы</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      МИ
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Иванова М.А.
                      </p>
                      <p className="text-xs text-gray-600">
                        Результаты обследования
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Week Calendar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Календарь на неделю
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[19, 20, 21, 22, 23, 24, 25].map((date, index) => (
                      <div
                        key={date}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                          index === 0
                            ? 'bg-blue-600 text-white font-semibold'
                            : index >= 5
                              ? 'text-gray-400'
                              : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                        }`}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notifications Dropdown */}
      {notificationsOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setNotificationsOpen(false)}
          ></div>

          {/* Dropdown Panel */}
          <div className="fixed top-20 right-6 bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-[80vh] overflow-hidden z-50">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Уведомления
              </h3>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="divide-y divide-gray-200 overflow-y-auto max-h-[calc(80vh-60px)]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Нет новых уведомлений</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-colors cursor-pointer ${
                      notification.read
                        ? 'bg-gray-50 opacity-60'
                        : getSeverityColor(notification.severity)
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getSeverityIcon(notification.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-700 mb-1">
                          {notification.patientName}
                        </p>
                        {notification.details && (
                          <p className="text-xs text-gray-600 mb-2 bg-white/50 px-2 py-1 rounded">
                            {notification.details}
                          </p>
                        )}
                        {notification.dateOfBirth && (
                          <p className="text-xs text-gray-500">
                            Д.р.: {notification.dateOfBirth}
                          </p>
                        )}
                        {notification.doctor && (
                          <p className="text-xs text-gray-500">
                            Врач: {notification.doctor}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {notification.time}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Отметить прочитанным
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setNotifications([])}
                  className="w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  Очистить все уведомления
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage