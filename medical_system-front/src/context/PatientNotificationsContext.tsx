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
  fetchPatientNotifications,
  markPatientNotificationRead,
  markAllPatientNotificationsRead,
  type PatientNotificationDto,
} from 'api/patientCabinetApi'

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

  const isPatient = role === 'Patient'

  const load = useCallback(async () => {
    if (!isPatient || !userId) return
    setLoading(true)
    try {
      const data = await fetchPatientNotifications()
      setNotifications(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [isPatient, userId])

  useEffect(() => {
    load()
  }, [load])

  const markRead = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      try {
        await markPatientNotificationRead(id)
      } catch {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)))
      }
    },
    []
  )

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await markAllPatientNotificationsRead()
    } catch {
      await load()
    }
  }, [load])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

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
