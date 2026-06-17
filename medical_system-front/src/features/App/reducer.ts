import { createSlice, Dispatch } from '@reduxjs/toolkit'

import { T_AppThunk, T_Reducer } from 'store/type'
import { I_AppStore, UserRole } from './types'

const TOKEN_KEY = 'token'

const initialState: I_AppStore = {
  isLogged: false,
  isAppLoading: false,
  userRole: null,
  userId: null,
  userLogin: null,
  displayName: null,
  patientId: null
}

export const isLoggedReducer: T_Reducer<I_AppStore, boolean> = (
  state,
  action
) => {
  state.isLogged = action.payload
  if (!action.payload) {
    localStorage.removeItem(TOKEN_KEY)
    state.userRole = null
    state.userId = null
    state.userLogin = null
    state.displayName = null
    state.patientId = null
  }
}

export const isAppLoadingReducer: T_Reducer<I_AppStore, boolean> = (
  state,
  action
) => {
  state.isAppLoading = action.payload
}

export const userRoleReducer: T_Reducer<I_AppStore, UserRole> = (
  state,
  action
) => {
  state.userRole = action.payload
}

export const userInfoReducer: T_Reducer<
  I_AppStore,
  { userId: string; userLogin: string; displayName: string | null; role: UserRole; patientId: string | null }
> = (state, action) => {
  state.userId = action.payload.userId
  state.userLogin = action.payload.userLogin
  state.displayName = action.payload.displayName
  state.userRole = action.payload.role
  state.patientId = action.payload.patientId
  state.isLogged = true
}

const appslice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    isLogged: isLoggedReducer,
    isAppLoading: isAppLoadingReducer,
    userRole: userRoleReducer,
    userInfo: userInfoReducer
  }
})

const {
  isLogged: setIsLoggedAction,
  isAppLoading: setIsAppLoadingAction,
  userRole: setUserRoleAction,
  userInfo: setUserInfoAction
} = appslice.actions

export const setIsLogged =
  (isLogged: boolean): T_AppThunk =>
  (dispatch: Dispatch) => {
    dispatch(setIsLoggedAction(isLogged))
  }

export const setIsAppLoading =
  (isApploading: boolean): T_AppThunk =>
  (dispatch: Dispatch) => {
    dispatch(setIsAppLoadingAction(isApploading))
  }

export const setUserRole =
  (role: UserRole): T_AppThunk =>
  (dispatch: Dispatch) => {
    dispatch(setUserRoleAction(role))
  }

export const setUserInfo =
  (info: { userId: string; userLogin: string; displayName: string | null; role: UserRole; patientId: string | null }): T_AppThunk =>
  (dispatch: Dispatch) => {
    dispatch(setUserInfoAction(info))
  }

export default appslice.reducer
