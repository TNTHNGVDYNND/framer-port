import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PrimeGradient from './components/buttons/PrimeGradient';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <PrimeGradient />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
