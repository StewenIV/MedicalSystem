import { apiFetch } from './bedsApi'
import { BedDto } from './bedsApi'

export enum RoomType {
  Normal = 'Ordinary',
  ICU = 'Reanimation',
  Isolation = 'Isolator'
}

export enum RoomGender {
  Male = 'Male',
  Female = 'Female'
}

export interface RoomListItemDto {
  id: string
  number: string
  floor: number
  type: RoomType
  gender: RoomGender
  priority: number
  bedsCount: number
  occupiedBedsCount: number
  freeBedsCount: number
}

export interface RoomDetailsDto {
  id: string
  number: string
  floor: number
  type: RoomType
  gender: RoomGender
  priority: number
  beds: BedDto[]
}

export interface SearchPatientDto {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  gender: string | number
  age: number
  dateOfBirth?: string
  phoneNumber?: string
  phone?: string
  phoneHome?: string
  numberCard?: string
  medicalRecordNumber?: string
}

export interface DoctorSelectItemDto {
  id: string
  fullName: string
  position?: string
  department?: string
}

export const fetchAdminRooms = (
  floor?: number,
  type?: string,
  search?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{ items: RoomListItemDto[]; totalCount: number; totalPages: number }> => {
  const params = new URLSearchParams()
  if (floor !== undefined) params.append('floorFilter', floor.toString())
  if (type) params.append('typeFilter', type)
  if (search) params.append('search', search)
  params.append('page', page.toString())
  params.append('pageSize', pageSize.toString())
  return apiFetch<{ items: RoomListItemDto[]; totalCount: number; totalPages: number }>(
    `/api/rooms-admin?${params.toString()}`
  )
}

export const fetchAdminRoomById = (id: string): Promise<RoomDetailsDto> => {
  return apiFetch<RoomDetailsDto>(`/api/rooms-admin/${id}`)
}

export const createRoom = (payload: any): Promise<RoomDetailsDto> => {
  return apiFetch<RoomDetailsDto>(`/api/rooms-admin`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const updateRoom = (id: string, payload: any): Promise<RoomDetailsDto> => {
  return apiFetch<RoomDetailsDto>(`/api/rooms-admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export const updateRoomPriority = (id: string, priority: number): Promise<void> => {
  return apiFetch<void>(`/api/rooms-admin/${id}/priority`, {
    method: 'PUT',
    body: JSON.stringify(priority)
  })
}

export const deleteRoom = (id: string): Promise<void> => {
  return apiFetch<void>(`/api/rooms-admin/${id}`, {
    method: 'DELETE'
  })
}

export const getAvailableFloors = (): Promise<number[]> => {
  return apiFetch<number[]>(`/api/rooms-admin/available-floors`)
}

export const getRoomsByFloor = (floor: number): Promise<{ id: string; number: string }[]> => {
  return apiFetch<{ id: string; number: string }[]>(`/api/rooms-admin/by-floor/${floor}`)
}

export const fetchAdminBedsByRoom = (roomId: string, onlyFree: boolean = false): Promise<BedDto[]> => {
  return apiFetch<BedDto[]>(`/api/beds-admin/by-room/${roomId}?onlyFree=${onlyFree}`)
}

export const addBed = (payload: { roomId: string; bedNumber: number; status?: string }): Promise<BedDto> => {
  return apiFetch<BedDto>(`/api/beds-admin`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const deleteBed = (id: string): Promise<void> => {
  return apiFetch<void>(`/api/beds-admin/${id}`, {
    method: 'DELETE'
  })
}

export const assignPatient = (payload: any): Promise<void> => {
  return apiFetch<void>(`/api/beds-admin/assign`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const transferPatient = (payload: any): Promise<void> => {
  return apiFetch<void>(`/api/beds-admin/transfer`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const freeAdminBed = (bedId: string, payload: any): Promise<void> => {
  return apiFetch<void>(`/api/beds-admin/${bedId}/free`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const updateBedNote = (bedId: string, note: string): Promise<void> => {
  return apiFetch<void>(`/api/beds-admin/${bedId}/note`, {
    method: 'PUT',
    body: JSON.stringify({ note })
  })
}

export const searchPatients = (query: string, signal?: AbortSignal): Promise<SearchPatientDto[]> => {
  return apiFetch<{ items: SearchPatientDto[] }>(`/api/search/patients?query=${encodeURIComponent(query)}`, { signal })
    .then(res => res.items || [])
}

export const searchDoctors = (query: string, signal?: AbortSignal): Promise<DoctorSelectItemDto[]> => {
  return apiFetch<DoctorSelectItemDto[]>(`/api/search/doctors?query=${encodeURIComponent(query)}`, { signal })
}
