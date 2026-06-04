import { lazy } from 'react'
import { Route, Navigate, Routes, useLocation, useNavigate } from 'react-router-dom'
import { checkPathMatch, paths } from './helpers'
import { setIsLogged } from 'features/App/reducer'
import { selectUserRole, selectDisplayName } from 'features/App/selectors'
import { useAppDispatch } from 'store'
import { useSelector } from 'react-redux'
import { authApi } from 'api/authApi'
import { UserRole } from 'features/App/types'

const HomePage = lazy(() => import('pages/HomePage/index'))
const LaboratoryPage = lazy(() => import('pages/LaboratoryPage'))
const PatientCabinetPage = lazy(() => import('pages/PatientCabinetPage'))


const toComponentRole = (role: UserRole): 'doctor' | 'nurse' | 'patient' | null => {
  if (!role) return null
  const map: Record<string, 'doctor' | 'nurse' | 'patient'> = {
    Doctor: 'doctor',
    HeadNurse: 'nurse',
    Nurse: 'nurse',
    ChiefDoctor: 'doctor',
    LaboratoryEmployee: 'patient',
    Patient: 'patient'
  }
  return map[role] ?? null
}

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

  const handleLogout = async () => {
    await authApi.logout()
    dispatch(setIsLogged(false))
    navigate(paths.auth)
  }

  const componentRole = toComponentRole(userRole)

  if (userRole === 'Patient') {
    return (
      <Routes>
        <Route path="*" element={<PatientCabinetPage />} />
      </Routes>
    )
  }

  if (userRole === 'LaboratoryEmployee') {
    return (
      <Routes>
        <Route path="*" element={<LaboratoryPage />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route
        path={paths.home}
        element={
          <HomePage
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            userRole={componentRole}
          />
        }
      />
      <Route
        path="*"
        element={<Navigate to={isMatch ? location.pathname : paths.home} replace />}
      />
    </Routes>
  )
}
export default PrivateRoutes
