import { apiFetch } from './bedsApi'
import type { GeneralFormData, ContactsFormData, OtherFormData, WorkFormData, RelativeFormData, TrustedPersonFormData, ChangePasswordFormData } from '../lib/validators/patientCabinet'

export interface PatientNotificationDto {
  id: string
  type: 'medical' | 'consultation' | 'system'
  severity?: 'critical' | 'warning' | 'info'
  title: string
  text: string
  details?: string
  time: string
  read: boolean
}

export interface PatientDocumentDto {
  id: string
  name: string
  documentType?: string
  content?: string
  doctorName?: string
  date?: string
  filePath?: string
}

export interface PatientExamDto {
  id: string
  name: string
  date: string
  resultDate: string
  type: 'lab' | 'imaging' | 'functional' | 'other'
  status: 'ready' | 'processing'
  doctor?: string
  details?: string
  parameters?: { name: string; value: string; norm: string; unit: string }[]
}


export const updatePatientGeneralInfo = (dto: GeneralFormData): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/profile/general', {
    method: 'PUT',
    body: JSON.stringify({
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName ?? '',
      dateOfBirth: dto.dateOfBirth,
      gender: Number(dto.gender),
      maritalStatus: dto.maritalStatus ?? '',
    }),
  })

export const updatePatientContacts = (dto: ContactsFormData): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/profile/contacts', {
    method: 'PUT',
    body: JSON.stringify({
      phoneMobile: dto.phoneMobile ?? '',
      phoneHome: dto.phoneHome ?? '',
      email: dto.email ?? '',
      address: dto.address ?? '',
      city: dto.city ?? '',
      region: dto.region ?? '',
      zip: dto.zip ?? '',
      country: dto.country ?? '',
    }),
  })

export const updatePatientOtherInfo = (dto: OtherFormData): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/profile/other', {
    method: 'PUT',
    body: JSON.stringify({
      language: dto.language ?? '',
      nationality: dto.nationality ?? '',
    }),
  })

export const updatePatientWorkInfo = (dto: WorkFormData): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/profile/work', {
    method: 'PUT',
    body: JSON.stringify({
      profession: dto.profession ?? '',
      organization: dto.organization ?? '',
      address: dto.address ?? '',
    }),
  })

export const addPatientRelative = (dto: RelativeFormData): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/relatives', {
    method: 'POST',
    body: JSON.stringify({
      name: dto.name,
      relation: dto.relation ?? '',
      phone: dto.phone ?? '',
    }),
  })

export const updatePatientRelative = (id: string, dto: RelativeFormData): Promise<{ message: string }> =>
  apiFetch(`/api/patient-cabinet/relatives/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: dto.name,
      relation: dto.relation ?? '',
      phone: dto.phone ?? '',
    }),
  })

export const deletePatientRelative = (id: string): Promise<{ message: string }> =>
  apiFetch(`/api/patient-cabinet/relatives/${id}`, { method: 'DELETE' })

// Keep for backward compatibility if still used
export const updateTrustedPerson = (dto: TrustedPersonFormData): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/profile/trusted', {
    method: 'PUT',
    body: JSON.stringify({
      name: dto.name,
      relation: dto.relation ?? '',
      phone: dto.phone ?? '',
    }),
  })

export const changePatientPassword = (dto: ChangePasswordFormData): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/profile/change-password', {
    method: 'POST',
    body: JSON.stringify({
      oldPassword: dto.oldPassword,
      newPassword: dto.newPassword,
      confirmPassword: dto.confirmPassword,
    }),
  })

export const fetchPatientNotifications = (): Promise<PatientNotificationDto[]> =>
  apiFetch('/api/patient-cabinet/notifications')

export const markPatientNotificationRead = (id: string): Promise<{ message: string }> =>
  apiFetch(`/api/patient-cabinet/notifications/${id}/mark-read`, { method: 'POST' })

export const markAllPatientNotificationsRead = (): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/notifications/mark-all-read', { method: 'POST' })

export const fetchPatientDocuments = (): Promise<PatientDocumentDto[]> =>
  apiFetch('/api/patient-cabinet/documents')

export const fetchPatientExams = (): Promise<PatientExamDto[]> =>
  apiFetch('/api/patient-cabinet/exams')

export const fetchPatientProfile = (): Promise<any> =>
  apiFetch('/api/patient-cabinet/profile')

export const deleteAccount = (): Promise<{ message: string }> =>
  apiFetch('/api/patient-cabinet/account', { method: 'DELETE' })
