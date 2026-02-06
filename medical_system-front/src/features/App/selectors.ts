import { T_RootState } from 'store/type'

export const selectIsLogged = (state: T_RootState) => state.app.isLogged
export const selectIsAppLoading = (state: T_RootState) => state.app.isAppLoading
export const selectUserRole = (state: T_RootState) => state.app.userRole
