const BASE_URL = process.env.REACT_APP_API_URL ?? ''
const TOKEN_KEY = 'token'

function translateErrorToRussian(msg: string): string {
  if (!msg) return 'Произошла неизвестная ошибка'

  const lower = msg.toLowerCase()

  if (msg.includes("An error occurred while saving the entity changes. See the inner exception for details.")) {
    return "Произошла ошибка при сохранении изменений в базе данных. Пожалуйста, проверьте корректность вводимых данных или обратитесь к администратору."
  }

  if (lower.includes("duplicate key") || lower.includes("unique index") || lower.includes("ix_") || lower.includes("already exists")) {
    return "Запись с такими данными уже существует."
  }

  if (lower.includes("foreign key") || lower.includes("violates foreign key constraint") || lower.includes("fk_")) {
    return "Невозможно выполнить операцию: запись связана с другими данными в системе."
  }

  if (lower.includes("object reference not set") || lower.includes("nullreferenceexception")) {
    return "Внутренняя ошибка сервера (пустая ссылка)."
  }

  if (lower.includes("failed to fetch") || lower.includes("network error") || lower.includes("networkerror")) {
    return "Не удалось подключиться к серверу. Пожалуйста, проверьте интернет-соединение или убедитесь, что сервер запущен."
  }

  if (lower.includes("unauthorized") || lower.includes("token is expired") || lower.includes("invalid token")) {
    return "Сессия истекла. Войдите в систему снова."
  }

  if (lower.includes("forbidden") || lower.includes("access denied") || lower.includes("not authorized")) {
    return "Доступ запрещен. У вас нет прав на выполнение этого действия."
  }

  if (lower.includes("value cannot be null") || lower.includes("is required")) {
    return "Обязательное поле не заполнено."
  }

  return msg
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers
    },
    ...init,
  })

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    throw new Error('Сессия истекла. Войдите снова.')
  }

  if (!res.ok) {
    let errorMsg = `Ошибка сервера (${res.status})`
    try {
      const errorText = await res.text()
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText)

          if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMsg = errorData.errors.join('\n')
          } else if (errorData.message) {
            errorMsg = errorData.message
          } else if (errorData.detail) {
            errorMsg = errorData.detail
          } else if (errorData.title) {
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
    }
    throw new Error(translateErrorToRussian(errorMsg))
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
  apiFetch<PatientDetailDto>(`/api/beds/patient/${patientId}/details`).then((data) => {
    if (data && data.prescriptions) {
      data.prescriptions.sort((a, b) => a.time.localeCompare(b.time))
    }
    return data
  })

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
