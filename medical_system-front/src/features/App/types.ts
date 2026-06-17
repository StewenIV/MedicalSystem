
export type UserRole =
  | 'Doctor'
  | 'Nurse'
  | 'HeadNurse'
  | 'ChiefDoctor'
  | 'LaboratoryEmployee'
  | 'Patient'
  | null

export interface I_AppStore {
  isLogged: boolean
  isAppLoading: boolean
  userRole: UserRole
  userId: string | null
  userLogin: string | null
  displayName: string | null
  patientId: string | null
}
