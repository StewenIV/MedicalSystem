import { T_RootState } from 'store/type'

export const selectIsLogged = (state: T_RootState) => state.app.isLogged
export const selectIsAppLoading = (state: T_RootState) => state.app.isAppLoading
export const selectUserRole = (state: T_RootState) => state.app.userRole
export const selectUserId = (state: T_RootState) => state.app.userId
export const selectUserLogin = (state: T_RootState) => state.app.userLogin
export const selectDisplayName = (state: T_RootState) => state.app.displayName
export const selectPatientId = (state: T_RootState) => state.app.patientId
