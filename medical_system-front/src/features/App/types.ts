export type UserRole =
  | 'admin'
  | 'chief_doctor'
  | 'doctor'
  | 'head_nurse'
  | 'nurse'
  | 'patient'
  | 'laboratory'
  | null

export interface I_AppStore {
  isLogged: boolean
  isAppLoading: boolean
  userRole: UserRole
}
