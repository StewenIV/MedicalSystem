import { apiFetch } from './bedsApi'
import { PatientNotificationDto } from './patientCabinetApi'

const MEDICAL_TYPES = new Set(['labresult', 'vitalsalert', 'appointmentreminder', 'consultation'])

export function mapNotification(n: any): PatientNotificationDto {
  const typeStr: string = (n.type ?? '').toLowerCase()
  return {
    id: n.id,
    type: MEDICAL_TYPES.has(typeStr) ? 'medical' : typeStr === 'referral' ? 'consultation' : 'system',
    severity: (n.severity ?? 'info').toLowerCase() as PatientNotificationDto['severity'],
    title: n.title ?? '',
    text: n.message ?? n.text ?? '',
    time: n.createdAt ?? n.time ?? new Date().toISOString(),
    read: n.isRead ?? n.read ?? false,
  }
}

export const fetchMyNotifications = async (): Promise<PatientNotificationDto[]> => {
  const data = (await apiFetch('/api/notifications')) as any[]
  return data.map(mapNotification)
}

export const markNotificationRead = (id: string): Promise<{ message: string }> =>
  apiFetch(`/api/notifications/${id}/mark-read`, { method: 'POST' })

export const markAllNotificationsRead = (): Promise<{ message: string }> =>
  apiFetch('/api/notifications/mark-all-read', { method: 'POST' })

