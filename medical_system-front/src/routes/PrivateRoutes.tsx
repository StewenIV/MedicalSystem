import { lazy } from 'react'
import {
  Route,
  Navigate,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { checkPathMatch, paths } from './helpers'
import { setIsLogged, setUserRole } from 'features/App/reducer'
import { selectUserRole } from 'features/App/selectors'
import { useAppDispatch } from 'store'
import { useSelector } from 'react-redux'

const HomePage = lazy(() => import('pages/HomePage/index'))

const PrivateRoutes: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const userRole = useSelector(selectUserRole)

  const isMatch = checkPathMatch(location.pathname, paths)

  const handleNavigate = (screen: string, patientId?: string) => {
    if (patientId) {
      navigate(`${screen}?patientId=${patientId}`)
    } else {
      navigate(screen)
    }
  }

  const handleLogout = () => {
    dispatch(setIsLogged(false))
    dispatch(setUserRole(null))
    navigate(paths.auth)
  }

  // Преобразование формата роли из snake_case в kebab-case
  const convertUserRole = (
    role: string | null
  ):
    | 'admin'
    | 'chief-doctor'
    | 'doctor'
    | 'head-nurse'
    | 'nurse'
    | 'patient'
    | 'laboratory'
    | null => {
    if (!role) return null
    return role.replace(/_/g, '-') as any
  }

  return (
    <Routes>
      <Route
        path={paths.home}
        element={
          <HomePage
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            userRole={convertUserRole(userRole)}
          />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isMatch ? location.pathname : paths.home} replace />
        }
      />
    </Routes>
  )
}
export default PrivateRoutes
