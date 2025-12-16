import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import 'wicg-inert';
import App from './App';
import ThemeProvider from './context/ThemeProvider';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  smoothTouch: false, // Disable on touch devices (can feel sluggish)
  wheelMultiplier: 1,
});

// Lenis animation loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
