const BASE_URL = process.env.REACT_APP_API_URL ?? ''

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    let errorMsg = `Ошибка сервера (${res.status})`
    try {
      const errorText = await res.text()
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText)

          // Формат FluentValidation: { message: "...", errors: ["...", "..."] }
          if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMsg = errorData.errors.join('\n')
          } else if (errorData.message) {
            errorMsg = errorData.message
          } else if (errorData.detail) {
            errorMsg = errorData.detail
          } else if (errorData.title) {
            // ASP.NET validation problem details: { title, errors: { field: ["msg"] } }
            const problemErrors = errorData.errors
            if (problemErrors && typeof problemErrors === 'object') {
              const msgs = Object.values(problemErrors).flat() as string[]
              errorMsg = msgs.length > 0 ? msgs.join('\n') : errorData.title
            } else {
              errorMsg = errorData.title
            }
          } else if (typeof errorData === 'string') {
            errorMsg = errorData
          } else {
            errorMsg = errorText
          }
        } catch {
          errorMsg = errorText
        }
      }
    } catch {
      // fallback to default error message if reading text fails
    }
    throw new Error(errorMsg)
  }
  const text = await res.text()
  if (!text) return {} as T
  return JSON.parse(text) as T
}


export interface BedDto {
  id: string
  roomNumber: string
  bedNumber: number
  status: 'stable' | 'attention' | 'urgent' | 'free'
  patientId?: string
  patientName?: string
  patientLastName?: string
  patientMiddleName?: string
  patientAge?: number
  diagnosis?: string
  doctorName?: string
  doctorRole?: string
  admissionDate?: string
  bedNote?: string
  attentionNote?: string
}

export interface RoomDto {
  id: string
  name: string
  floor: number
  gender: 'male' | 'female' | 'free'
  urgency: 'urgent' | 'attention' | 'normal'
  beds: BedDto[]
}

export interface BedsListResponse {
  beds: BedDto[]
  stats: BedStatsDto
}

export interface BedStatsDto {
  total: number
  occupied: number
  free: number
  occupancyPct: number
  todayAdmissions?: number
  todayDischarges?: number
  occupancyDelta: number
  freeDeltaPct: number
}

export interface RoomsConfigDto {
  [roomNumber: string]: { gender: 'male' | 'female' | 'free' }
}

export interface FloorsDto {
  floors: number[]
}

export interface AlertsDto {
  urgent: BedDto[]
  attention: BedDto[]
}

export interface BedPrescriptionDto {
  id: string
  name: string
  dose: string
  time: string
  done: boolean
}

export interface BedMedicationDto {
  name: string
  qty: string
}

export interface BedActionDto {
  who: string
  action: string
  time: string
  amount: string
}

export interface PatientDetailDto {
  doctorNote: string
  prescriptions: BedPrescriptionDto[]
  meds: BedMedicationDto[]
  log: BedActionDto[]
}

export interface AdmitPayload {
  patientId: string
  diagnosis: string
  doctorId?: string
  admissionDate?: string
}

export const fetchBeds = (floor?: number): Promise<BedsListResponse> =>
  apiFetch(`/api/beds${floor != null ? `?floor=${floor}` : ''}`)

export const fetchRooms = (floor?: number): Promise<{ rooms: RoomDto[] }> =>
  apiFetch(`/api/beds/rooms${floor != null ? `?floor=${floor}` : ''}`)

export const fetchRoomsConfig = (): Promise<RoomsConfigDto> =>
  apiFetch<{ rooms: RoomsConfigDto }>('/api/beds/rooms/config').then(res => res.rooms)

export const fetchFloors = (): Promise<FloorsDto> =>
  apiFetch('/api/beds/floors')

export const fetchAlerts = (): Promise<AlertsDto> =>
  apiFetch('/api/beds/alerts')

export const fetchBedById = (bedId: string): Promise<BedDto> =>
  apiFetch(`/api/beds/${bedId}`)

export const fetchPatientDetails = (patientId: string): Promise<PatientDetailDto> =>
  apiFetch(`/api/beds/patient/${patientId}/details`)

export const togglePrescription = (
  patientId: string,
  prescriptionId: string,
  done: boolean
): Promise<BedPrescriptionDto> =>
  apiFetch(`/api/beds/patient/${patientId}/prescriptions/${prescriptionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isDone: done }),
  })

export const fetchBedStats = (): Promise<BedStatsDto> =>
  apiFetch('/api/beds/stats')

export const updateBedStatus = (
  bedId: string,
  status: BedDto['status'],
  attentionNote?: string
): Promise<BedDto> =>
  apiFetch(`/api/beds/${bedId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, attentionNote }),
  })

export const admitPatient = (bedId: string, payload: AdmitPayload): Promise<BedDto> =>
  apiFetch(`/api/beds/${bedId}/admit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const dischargePatient = (bedId: string, dischargeNote?: string): Promise<{ id: string; status: string }> =>
  apiFetch(`/api/beds/${bedId}/discharge`, {
    method: 'POST',
    body: JSON.stringify({ dischargeNote }),
  })
