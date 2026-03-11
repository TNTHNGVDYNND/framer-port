import { BrowserRouter } from 'react-router-dom';
import PrimeGradient from './components/buttons/PrimeGradient';
import AppRoutes from './AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <PrimeGradient />
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
