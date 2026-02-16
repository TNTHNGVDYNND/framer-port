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
        <div className='min-h-screen flex relative'>
          {/* Layer 1: Global Base Background - Warm Amber to Black */}
          <div 
            className='fixed inset-0 z-0 pointer-events-none'
            style={{
              background: `
                radial-gradient(ellipse at 50% 0%, #3d3020 0%, #251e15 15%, #15120c 40%, #0a0805 70%, #000000 100%)
              `,
            }}
          />

          {/* Layer 2: Animated Amber Glow */}
          <div 
            className='fixed top-[-20%] left-[-10%] right-[-10%] h-[60%] z-1 pointer-events-none'
            style={{
              background: `
                radial-gradient(ellipse at 50% 0%, rgba(218, 165, 32, 0.4) 0%, rgba(184, 134, 11, 0.2) 30%, transparent 60%)
              `,
              filter: 'blur(60px)',
              animation: 'glow-pulse 8s ease-in-out infinite',
            }}
          />

          {/* Layer 3: Subtle Grain Overlay */}
          <div 
            className="grain-overlay"
            style={{ 
              position: 'fixed',
              opacity: 0.025,
              zIndex: 2 
            }}
          />

          {/* Layer 4: Vignette for depth */}
          <div 
            className='fixed inset-0 z-3 pointer-events-none'
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)
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
