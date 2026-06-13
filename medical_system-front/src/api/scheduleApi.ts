import { apiFetch } from './bedsApi'

export interface ServerShiftDto {
  day: number
  type: 'day' | 'night' | 'day-off'
  hours: number
}

export interface ServerStaffScheduleDto {
  staffId: string
  staffName: string
  staffPosition: string
  staffDepartment: string
  schedule: ServerShiftDto[]
}

export interface UpdateShiftPayload {
  staffId: string
  date: string 
  type: 'day' | 'night' | 'day-off' | 'empty'
  hours: number
}

export const fetchMonthSchedule = (year: number, month: number): Promise<ServerStaffScheduleDto[]> =>
  apiFetch(`/api/schedule?year=${year}&month=${month}`)

export const updateShift = (payload: UpdateShiftPayload): Promise<void> =>
  apiFetch(`/api/schedule/shift`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
