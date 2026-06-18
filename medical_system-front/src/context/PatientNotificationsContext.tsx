import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { selectUserId, selectUserRole } from 'features/App/selectors'
import {
  type PatientNotificationDto,
} from 'api/patientCabinetApi'
import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  mapNotification,
} from 'api/notificationsApi'
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr'
import { toast } from 'react-toastify'

interface PatientNotificationsContextValue {
  notifications: PatientNotificationDto[]
  unreadCount: number
  loading: boolean
  markRead: (id: string) => void
  markAllRead: () => void
  reload: () => void
}

const PatientNotificationsContext = createContext<PatientNotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markRead: () => {},
  markAllRead: () => {},
  reload: () => {},
})

export const usePatientNotifications = () => useContext(PatientNotificationsContext)

export const PatientNotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userId = useSelector(selectUserId)
  const role = useSelector(selectUserRole)
  const [notifications, setNotifications] = useState<PatientNotificationDto[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await fetchMyNotifications()
      setNotifications(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  useEffect(() => {
    if (role === 'Patient') {
      localStorage.setItem('patient_unread_notif_count', String(unreadCount))
      window.dispatchEvent(new Event('patient_notif_update'))
    }
  }, [unreadCount, role])

  useEffect(() => {
    if (!userId) return
    const token = localStorage.getItem('token')
    if (!token) return

    const baseUrl = process.env.REACT_APP_API_URL ?? ''
    const hubUrl = `${baseUrl}/hubs/notifications`

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    connection.on('ReceiveNotification', (n: any) => {
      const notification = mapNotification(n)
      setNotifications((prev) => {
        if (prev.some((p) => p.id === notification.id)) return prev
        return [notification, ...prev]
      })
      const severityStr = notification.severity === 'critical' ? '🚨 ' : ''
      toast.info(`${severityStr}${notification.title}${notification.text ? '\n' + notification.text : ''}`, {
        autoClose: 6000,
      })
    })

    connection.start().catch((err) => console.error('SignalR connection error:', err))

    return () => {
      connection.stop()
    }
  }, [userId])

  const markRead = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      try {
        await markNotificationRead(id)
      } catch {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)))
      }
    },
    []
  )

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await markAllNotificationsRead()
    } catch {
      await load()
    }
  }, [load])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      markRead,
      markAllRead,
      reload: load,
    }),
    [notifications, unreadCount, loading, markRead, markAllRead, load]
  )

  return (
    <PatientNotificationsContext.Provider value={value}>
      {children}
    </PatientNotificationsContext.Provider>
  )
}
