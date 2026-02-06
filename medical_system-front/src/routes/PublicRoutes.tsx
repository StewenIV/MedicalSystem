import { lazy } from 'react'
import { Route, Navigate, Routes, useLocation } from 'react-router-dom'
import { checkPathMatch, paths } from './helpers'

const AuthPage = lazy(() => import('pages/AuthPage'))
const RegistrationPage = lazy(() => import('pages/RegistrationPage'))
const WelcomeScreen = lazy(() => import('pages/WelcomeScreen'))

const PublicRoutes: React.FC = () => {
  const location = useLocation()

  const isMatch = checkPathMatch(location.pathname, paths)

  return (
    <Routes>
      <Route path={paths.auth} element={<AuthPage />} />
      <Route path={paths.registration} element={<RegistrationPage />} />
      <Route path={paths.WelcomeScreen} element={<WelcomeScreen />} />
      <Route
        path="*"
        element={
          <Navigate to={isMatch ? location.pathname : paths.auth} replace />
        }
      />
    </Routes>
  )
}

export default PublicRoutes
