import { apiFetch } from './bedsApi'

export interface ServerVitalSignDto {
  id: string
  recordedAt: string
  temperature: number | null
  bloodPressureSystolic: number | null
  bloodPressureDiastolic: number | null
  pulse: number | null
  spO2: number | null
  respiratoryRate: number | null
  bloodPressure: string
}

export interface ServerWarningDto {
  fieldName: string
  value: string | null
  direction: string
}

export interface ServerTrendDto {
  fieldName: string
  direction: string
}

export interface ServerPatientDto {
  id: string
  fullName: string
  roomAndBed: string | null
}

export interface CreateVitalSignPayload {
  temperature?: number | null
  bloodPressureSystolic?: number | null
  bloodPressureDiastolic?: number | null
  pulse?: number | null
  spO2?: number | null
  respiratoryRate?: number | null
}

export const fetchHospitalizedPatients = (): Promise<ServerPatientDto[]> =>
  apiFetch('/api/patients/hospitalized')

export const fetchVitals = (patientId: string): Promise<ServerVitalSignDto[]> =>
  apiFetch(`/api/patients/${patientId}/vitals`)

export const fetchWarnings = (patientId: string): Promise<ServerWarningDto[]> =>
  apiFetch(`/api/patients/${patientId}/vitals/warnings`)

export const fetchTrends = (patientId: string): Promise<ServerTrendDto[]> =>
  apiFetch(`/api/patients/${patientId}/vitals/trends`)

export const postVitalSign = (patientId: string, body: CreateVitalSignPayload): Promise<void> =>
  apiFetch(`/api/patients/${patientId}/vitals`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
