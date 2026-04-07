import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import PublicRoutes from 'routes/PublicRoutes';
import PrivateRoutes from 'routes/PrivateRoutes';
import { selectIsLogged } from 'features/App/selectors';
import { ToastContainer } from 'react-toastify';
import { SidebarProvider } from './components/ui/sidebar';
import { TooltipProvider } from './components/ui/tooltip';

import { GlobalStyles } from 'App.styled';

const App = () => {
  const isLogged = useSelector(selectIsLogged);

  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <ToastContainer />
          <GlobalStyles />
          <Suspense fallback={<div>Loading...</div>}>
            {isLogged ? <PrivateRoutes /> : <PublicRoutes />}
          </Suspense>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
};
export default App;
