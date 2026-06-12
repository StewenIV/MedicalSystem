import { apiFetch } from './bedsApi'
import { Medicine } from 'data/mockData'

export const fetchAllMedicines = (): Promise<Medicine[]> => {
  return apiFetch<Medicine[]>('/api/medicines')
}

export interface CreateMedicineDto {
  name: string
  description: string
  category: string
  unit: string
  initialBalance: number
  minBalance: number
}

export const createMedicine = (dto: CreateMedicineDto): Promise<any> => {
  return apiFetch('/api/medicines', {
    method: 'POST',
    body: JSON.stringify(dto)
  })
}

export interface UpdateMedicineDto {
  name: string
  description: string
  category: string
  unit: string
  currentBalance: number
  minBalance: number
}

export const updateMedicine = (id: string, dto: UpdateMedicineDto): Promise<any> => {
  return apiFetch(`/api/medicines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto)
  })
}

export const deleteMedicine = (id: string): Promise<any> => {
  return apiFetch(`/api/medicines/${id}`, {
    method: 'DELETE'
  })
}

export interface RecordReceiptDto {
  date: string
  quantity: number
  supplier: string
  comment: string
}

export const recordReceipt = (id: string, dto: RecordReceiptDto): Promise<any> => {
  return apiFetch(`/api/medicines/${id}/receipt`, {
    method: 'POST',
    body: JSON.stringify(dto)
  })
}

export interface RecordWriteoffDto {
  date: string
  quantity: number
  reason: string
  patientId?: string
  patientName?: string
  comment: string
}

export const recordWriteoff = (id: string, dto: RecordWriteoffDto): Promise<any> => {
  return apiFetch(`/api/medicines/${id}/writeoff`, {
    method: 'POST',
    body: JSON.stringify(dto)
  })
}
