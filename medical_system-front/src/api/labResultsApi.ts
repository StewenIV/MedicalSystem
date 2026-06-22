import { apiFetch } from './bedsApi'

export interface LabResultListItemDto {
  id: string
  patientId: string
  patientName: string
  patientAge: number
  patientGender: string
  roomNumber: string
  bedNumber?: number
  doctorId?: string
  doctorName: string
  type: string
  date?: string
  statusText: string
  reason?: string
  comments?: string
  pdfDocumentPath?: string
  dateUpdated?: string
  laboratoryEmployeeName: string
}

export interface LabResultDetailsDto extends LabResultListItemDto {
  diagnosis: string
  resultData?: string
}

export interface LabResultsPagedResponse {
  items: LabResultListItemDto[]
  totalCount: number
}

export interface FetchLabResultsParams {
  search?: string
  status?: string
  type?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortDesc?: boolean
}

export const fetchLabResults = (params: FetchLabResultsParams): Promise<LabResultsPagedResponse> => {
  const queryParams = new URLSearchParams()
  if (params.search) queryParams.append('search', params.search)
  if (params.status) queryParams.append('status', params.status)
  if (params.type) queryParams.append('type', params.type)
  if (params.page != null) queryParams.append('page', String(params.page))
  if (params.pageSize != null) queryParams.append('pageSize', String(params.pageSize))
  if (params.sortBy) queryParams.append('sortBy', params.sortBy)
  if (params.sortDesc != null) queryParams.append('sortDesc', String(params.sortDesc))

  return apiFetch<LabResultsPagedResponse>(`/api/labresults?${queryParams.toString()}`)
}

export const fetchLabResultById = (id: string): Promise<LabResultDetailsDto> => {
  return apiFetch<LabResultDetailsDto>(`/api/labresults/${id}`)
}

export const updateLabStatus = (id: string, statusText: string): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>(`/api/labresults/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ statusText }),
  })
}

export interface SubmitResultsPayload {
  resultData: string
  comments?: string
  pdfDocumentPath: string
}

export const submitLabResults = (id: string, payload: SubmitResultsPayload): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>(`/api/labresults/${id}/results`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
