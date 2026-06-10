import { apiFetch } from './bedsApi'
import { SavedInspection } from 'pages/WardRound/types'

export interface ServerEncounterDto {
  id: string
  patientId: string
  doctorId: string | null
  doctorName: string | null
  dateTime: string
  type: string
  complaints: string | null
  objective: string | null
  conclusion: string | null
  recommendations: string | null
  formData?: string | null
}

export interface CreateEncounterPayload {
  dateTime: string
  type: string
  conclusion: string
  complaints?: string | null
  objective?: string | null
  recommendations?: string | null
  formData?: string | null
}

export const mapServerEncounterToSavedInspection = (e: ServerEncounterDto): SavedInspection => {
  const dt = new Date(e.dateTime)
  
  const dateStr = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
  const timeStr = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`

  return {
    id: e.id,
    type: e.type === 'Primary Inspection' ? 'primary' : 'daily',
    date: dateStr,
    time: timeStr,
    doctor: e.doctorName ?? 'Врач',
    generatedText: e.conclusion ?? '',
    complaints: e.complaints ?? undefined,
    objective: e.objective ?? undefined,
    recommendations: e.recommendations ?? undefined,
    formData: (e as any).formData ?? undefined,
  }
}

export const fetchPatientEncounters = async (patientId: string): Promise<SavedInspection[]> => {
  const data = await apiFetch<ServerEncounterDto[]>(`/api/patients/${patientId}/encounters`)
  return data.map(mapServerEncounterToSavedInspection)
}

export const fetchTodayEncounters = async (): Promise<Record<string, SavedInspection[]>> => {
  const data = await apiFetch<ServerEncounterDto[]>('/api/encounters/today')
  const grouped: Record<string, SavedInspection[]> = {}
  data.forEach(e => {
    if (!grouped[e.patientId]) {
      grouped[e.patientId] = []
    }
    grouped[e.patientId].push(mapServerEncounterToSavedInspection(e))
  })
  return grouped
}

export const createEncounter = async (patientId: string, payload: CreateEncounterPayload): Promise<SavedInspection> => {
  const data = await apiFetch<ServerEncounterDto>(`/api/patients/${patientId}/encounters`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapServerEncounterToSavedInspection(data)
}

export const updateEncounter = async (patientId: string, encounterId: string, payload: CreateEncounterPayload): Promise<SavedInspection> => {
  const data = await apiFetch<ServerEncounterDto>(`/api/patients/${patientId}/encounters/${encounterId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return mapServerEncounterToSavedInspection(data)
}
