import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';

import Layout from './components/Layout';

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ThemeCard = lazy(() => import('./pages/ThemeCard'));

// Loading fallback component
const PageLoader = () => (
  <motion.div
    className="min-h-screen flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: 'var(--color-lagoon)' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: 'var(--color-dusk)' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: 'var(--color-coral)' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span
        className="font-mono text-sm"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Loading...
      </span>
    </div>
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='work' element={<Work />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='theme' element={<ThemeCard />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
