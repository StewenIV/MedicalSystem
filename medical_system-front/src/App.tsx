import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import PublicRoutes from 'routes/PublicRoutes'
import PrivateRoutes from 'routes/PrivateRoutes'
import { selectIsLogged } from 'features/App/selectors'
import { ToastContainer } from 'react-toastify'
import { GlobalStyles } from 'App.styled'
import { TooltipProvider } from '@/components/ui/tooltip'


const App = () => {
  const isLogged = useSelector(selectIsLogged)

  return (
    <TooltipProvider>
      <ToastContainer />
      <GlobalStyles />
      <Suspense fallback={<div>Loading...</div>}>
        {isLogged ? <PrivateRoutes /> : <PublicRoutes />}
      </Suspense>
    </TooltipProvider>
  )
}
export default App
