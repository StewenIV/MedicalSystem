import { apiFetch } from './bedsApi'

export interface PatientCardDto {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  status: string;
  statusText: string;
  medcardNum: string;
  historyNum?: string;
  maritalStatus?: string;
  institution?: string;
  lastUpdated: string;
  
  doctorName?: string;
  departmentName?: string;
  roomNumber?: string;
  bedNumber?: number;

  passport?: PassportInfoDto;
  contacts?: ContactsInfoDto;
  work?: WorkInfoDto;
  other?: OtherInfoDto;
  
  vitals?: VitalsDto;

  relatives: RelativeDto[];
  allergies: AllergyDto[];
  currentMeds: MedicationDto[];
  operations: OperationDto[];
  medicalProblems: MedicalProblemDto[];
  prescriptions: PrescriptionDto[];
  labs: LabDto[];
  vaccines: VaccineDto[];
  documents: DocumentDto[];
  history: HistoryEntryDto[];
}

export interface PassportInfoDto {
  seriesNumber?: string;
  issuedBy?: string;
  dateIssued?: string;
}

export interface ContactsInfoDto {
  country?: string;
  region?: string;
  city?: string;
  address?: string;
  zip?: string;
  phoneMobile?: string;
  phoneHome?: string;
  email?: string;
}

export interface WorkInfoDto {
  profession?: string;
  organization?: string;
  address?: string;
}

export interface OtherInfoDto {
  language?: string;
  nationality?: string;
  dateOfDeath?: string;
  causeOfDeath?: string;
}

export interface VitalsDto {
  temp?: string;
  bp?: string;
  hr?: string;
  resp?: string;
  spo2?: string;
}

export interface RelativeDto {
  id: string;
  name: string;
  relation?: string;
  phone?: string;
}

export interface AllergyDto {
  id: string;
  name: string;
  reaction?: string;
  date?: string;
  comment?: string;
}

export interface MedicationDto {
  id: string;
  name: string;
  dose?: string;
  form?: string;
  regimen?: string;
}

export interface OperationDto {
  id: string;
  name: string;
  date?: string;
  diagnosis?: string;
  description?: string;
  complications?: string;
  implants?: string;
  result?: string;
}

export interface MedicalProblemDto {
  id: string;
  name: string;
  diagnosisDate?: string;
  diseaseStatus?: string;
  severity?: string;
  description?: string;
  complications?: string;
  isActive: boolean;
}

export interface PrescriptionDto {
  id: string;
  drug: string;
  dose?: string;
  form?: string;
  route?: string;
  regimen?: string;
  dateStart?: string;
  dateEnd?: string;
  doctorName?: string;
  comment?: string;
}

export interface LabDto {
  id: string;
  date?: string;
  type: string;
  reason?: string;
  doctorName?: string;
  statusText?: string;
}

export interface VaccineDto {
  id: string;
  name: string;
  disease?: string;
  date?: string;
  validity?: string;
  manufacturer?: string;
  series?: string;
}

export interface DocumentDto {
  id: string;
  name: string;
  date?: string;
  filePath?: string;
}

export interface HistoryEntryDto {
  id: string;
  dateTime: string;
  type?: string;
  doctorName?: string;
  complaints?: string;
  objective?: string;
  conclusion?: string;
  recommendations?: string;
}

export const fetchPatientCard = (id: string): Promise<PatientCardDto> => {
  return apiFetch<PatientCardDto>(`/api/patients/${id}`);
}

export const fetchAllPatients = (): Promise<PatientCardDto[]> => {
  return apiFetch<PatientCardDto[]>(`/api/patients`);
}

export const fetchPatientVitals = (id: string): Promise<any[]> => {
  return apiFetch<any[]>(`/api/patients/${id}/vitals`);
}

export const updatePatientCard = (id: string, dto: PatientCardDto): Promise<void> => {
  return apiFetch<void>(`/api/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto)
  });
}

export const addPatient = (dto: Partial<PatientCardDto>): Promise<PatientCardDto> => {
  return apiFetch<PatientCardDto>(`/api/patients`, {
    method: 'POST',
    body: JSON.stringify(dto)
  });
}

export const deletePatient = (id: string): Promise<void> => {
  return apiFetch<void>(`/api/patients/${id}`, {
    method: 'DELETE'
  });
}
