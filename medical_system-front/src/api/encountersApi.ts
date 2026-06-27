import { apiFetch } from './bedsApi'
import { SavedInspection } from 'pages/WardRound/types'
import { parseBackendDateTime } from 'utils/dateUtils'

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

export const extractDoctorFromFormData = (formDataStr?: string | null): string | null => {
  if (!formDataStr) return null
  try {
    const parsed = JSON.parse(formDataStr)
    return parsed.doctorDisplayName || parsed.doctor || null
  } catch {
    return null
  }
}

export const mapServerEncounterToSavedInspection = (e: ServerEncounterDto): SavedInspection => {
  const dt = parseBackendDateTime(e.dateTime) || new Date()
  
  const dateStr = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
  const timeStr = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`


  const doctorName = e.doctorName || extractDoctorFromFormData((e as any).formData)

  let uiType: 'primary' | 'daily' | 'discharge' = 'daily'
  const typeLower = e.type?.toLowerCase() || ''
  if (typeLower.includes('первич') || typeLower.includes('primary')) {
    uiType = 'primary'
  } else if (typeLower.includes('выписк') || typeLower.includes('discharge')) {
    uiType = 'discharge'
  }

  return {
    id: e.id,
    type: uiType,
    date: dateStr,
    time: timeStr,
    doctor: doctorName ?? '',
    doctorDisplayName: doctorName ?? '',
    generatedText: e.conclusion ?? '',
    complaints: e.complaints ?? undefined,
    objective: e.objective ?? undefined,
    recommendations: e.recommendations ?? undefined,
    formData: e.formData ?? undefined,
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
