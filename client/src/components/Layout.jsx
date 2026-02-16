import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomScrollbar from './CustomScrollbar';
import AudioToggle from './AudioToggle';
import { AudioProvider } from './AudioToggle';
import CustomCursor from './CustomCursor';
import HelpButton from './HelpButton';
import { ReactLenis } from 'lenis/react';
import { usePerformanceMetrics } from '../hooks/useInView';
import '../styles/background-effects.css';

const Layout = () => {
  // Track performance metrics in development
  usePerformanceMetrics();

  return (
    <AudioProvider>
      <ReactLenis root>
        <div className='min-h-screen flex bg-bg-body relative'>
          {/* Global Background - CSS Only */}
          <div 
            className='fixed inset-0 z-0 pointer-events-none'
            style={{
              background: `
                radial-gradient(ellipse at 50% 0%, #2a2515 0%, #1a1610 20%, #0f0d08 50%, #000000 100%)
              `,
            }}
          />

          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className='flex-1 ml-16 cursor-none relative z-10'>
            <Outlet />
            <Footer />
          </main>

          {/* UI Overlays */}
          <CustomScrollbar />
          <AudioToggle />
          <CustomCursor />
          <HelpButton />
        </div>
      </ReactLenis>
    </AudioProvider>
  );
};

export default Layout;
