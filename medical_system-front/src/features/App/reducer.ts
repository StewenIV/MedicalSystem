import { createSlice, Dispatch } from '@reduxjs/toolkit'

import { T_AppThunk, T_Reducer } from 'store/type'
import { I_AppStore, UserRole } from './types'

const initialState: I_AppStore = {
  isLogged: false,
  isAppLoading: false,
  userRole: null
}

export const isLoggedReducer: T_Reducer<I_AppStore, boolean> = (
  state,
  action
) => {
  state.isLogged = action.payload
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

const appslice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    isLogged: isLoggedReducer,
    isAppLoading: isAppLoadingReducer,
    userRole: userRoleReducer
  }
})

//action creators
const {
  isLogged: setIsLoggedAction,
  isAppLoading: setIsAppLoadingAction,
  userRole: setUserRoleAction
} = appslice.actions

//сам action
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

export default appslice.reducer
