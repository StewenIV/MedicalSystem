import { apiFetch } from './bedsApi'

export interface StaffMemberDto {
  id: string
  name: string
  position: string
  userId?: string
  login?: string
  role?: string
}

export interface CreateStaffDto {
  name: string
  position: string
  login: string
  password?: string
  role: string
}

export interface UpdateStaffDto {
  name: string
  position: string
  login: string
  password?: string
  role: string
}

export const fetchStaffMembers = (): Promise<StaffMemberDto[]> => {
  return apiFetch<StaffMemberDto[]>('/api/staff-admin')
}

export const createStaffMember = (payload: CreateStaffDto): Promise<StaffMemberDto> => {
  return apiFetch<StaffMemberDto>('/api/staff-admin', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const updateStaffMember = (id: string, payload: UpdateStaffDto): Promise<StaffMemberDto> => {
  return apiFetch<StaffMemberDto>(`/api/staff-admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export const deleteStaffMember = (id: string): Promise<void> => {
  return apiFetch<void>(`/api/staff-admin/${id}`, {
    method: 'DELETE'
  })
}
