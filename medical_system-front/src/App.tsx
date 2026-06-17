import { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PublicRoutes from 'routes/PublicRoutes'
import PrivateRoutes from 'routes/PrivateRoutes'
import { selectIsLogged } from 'features/App/selectors'
import { setIsLogged, setUserInfo } from 'features/App/reducer'
import { useAppDispatch } from 'store'
import { ToastContainer } from 'react-toastify'
import { GlobalStyles } from 'App.styled'
import { TooltipProvider } from '@/components/ui/tooltip'
import { decodeJwt, isTokenValid } from 'api/authApi'
import { UserRole } from 'features/App/types'
import { PatientNotificationsProvider } from 'context/PatientNotificationsContext'

const TOKEN_KEY = 'token'

const App = () => {
  const isLogged = useSelector(selectIsLogged)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isTokenValid()) {
      const token = localStorage.getItem(TOKEN_KEY)!
      const claims = decodeJwt(token)
      if (claims) {
        dispatch(setUserInfo({
          userId: claims.sub ?? '',
          userLogin: claims.login ?? '',
          displayName: claims.displayName ?? null,
          role: (claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? claims.role) as UserRole,
          patientId: claims.patientId ?? null
        }))
      }
    } else {
      localStorage.removeItem(TOKEN_KEY)
      dispatch(setIsLogged(false))
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(setIsLogged(false))
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [dispatch])

  return (
    <TooltipProvider>
      <ToastContainer />
      <GlobalStyles />
      <Suspense fallback={<div>Loading...</div>}>
        {isLogged
          ? (
            <PatientNotificationsProvider>
              <PrivateRoutes />
            </PatientNotificationsProvider>
          )
          : <PublicRoutes />}
      </Suspense>
    </TooltipProvider>
  )
}
export default App
