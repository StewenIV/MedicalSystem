import { lazy } from 'react'
import { Route, Navigate, Routes, useLocation } from 'react-router-dom'
import { checkPathMatch, paths } from './helpers'

const HomePage = lazy(() => import('pages/HomePage'))

const PrivateRoutes: React.FC = () => {
  const location = useLocation()

  const isMatch = checkPathMatch(location.pathname, paths)

  return (
    <Routes>
      <Route path={paths.home} element={<HomePage />} />
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
