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
          {/* Skip to content link for accessibility */}
          <a
            href='#main-content'
            className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-20 z-50 px-4 py-2 bg-lagoon text-neutral-950 font-mono text-sm rounded'
          >
            Skip to main content
          </a>

          {/* Global Background - CSS Only */}
          <div
            className='fixed inset-0 z-0 pointer-events-none will-change-transform'
            style={{
              background: `
                radial-gradient(ellipse at 50% 0%, #2a2515 0%, #1a1610 20%, #0f0d08 50%, #000000 100%)
              `,
            }}
            aria-hidden='true'
          />

          {/* Film grain overlay */}
          <div className='grain-overlay' aria-hidden='true' />

          {/* Navigation */}
          <header>
            <Navbar />
          </header>

          {/* Main Content */}
          <main
            id='main-content'
            className='flex-1 ml-16 cursor-none relative z-10'
            role='main'
            aria-label='Main content'
          >
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
