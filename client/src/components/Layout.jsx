import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomScrollbar from './CustomScrollbar';
import AudioToggle from './AudioToggle';
import { AudioProvider } from './AudioToggle';
import CustomCursor from './CustomCursor';
import HelpButton from './HelpButton';
import Notification from './Notification';
import { ReactLenis } from 'lenis/react';
import { usePerformanceMetrics } from '../hooks';
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
            className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-20 z-50 px-4 py-2 bg-brand-primary text-text-base font-mono text-sm rounded'
          >
            Skip to main content
          </a>

          {/* Global Background - CSS Only */}
          <div
            className='fixed inset-0 z-0 pointer-events-none will-change-transform'
            style={{
              background: `
                radial-gradient(ellipse at 50% 0%, var(--color-atmo-center) 0%, var(--color-atmo-mid) 20%, var(--color-atmo-edge) 50%, var(--color-atmo-deep) 100%)
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
          <Notification />
        </div>
      </ReactLenis>
    </AudioProvider>
  );
};

export default Layout;
