import { Suspense } from 'react'
import { useSelector } from 'react-redux'

import PublicRoutes from 'routes/PublicRoutes'
import PrivateRoutes from 'routes/PrivateRoutes'
import { selectIsLogged } from 'features/App/selectors'
import { ToastContainer } from 'react-toastify'

import { GlobalStyles } from 'App.styled'

const App = () => {
  const isLogged = useSelector(selectIsLogged)

  return (
    <>
    <ToastContainer />
      <GlobalStyles />
      <Suspense fallback={<div>Loading...</div>}>
        {isLogged ? <PrivateRoutes /> : <PublicRoutes />}
      </Suspense>
      <ToastContainer />
    </>
  )
}
export default App
