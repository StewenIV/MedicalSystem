const BASE_URL = process.env.REACT_APP_API_URL ?? ''

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

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    let errorMsg = `Ошибка сервера (${res.status})`;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      } else if (errorData.detail) {
        errorMsg = errorData.detail;
      } else if (errorData.title) {
        errorMsg = errorData.title;
      } else if (typeof errorData === 'string') {
        errorMsg = errorData;
      } else {
        errorMsg = JSON.stringify(errorData);
      }
    } catch {
      try {
        const errorText = await res.text();
        if (errorText) errorMsg = errorText;
      } catch {}
    }
    throw new Error(errorMsg);
  }
  
  const text = await res.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
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
