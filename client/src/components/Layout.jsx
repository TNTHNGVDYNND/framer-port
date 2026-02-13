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

const Layout = () => {
  // Track performance metrics in development
  usePerformanceMetrics();

  return (
    <AudioProvider>
      <ReactLenis root>
        <div className='min-h-screen flex bg-bg-body'>
          <Navbar />

          <main className='flex-1 ml-16 cursor-none'>
            <Outlet />
            <Footer />
          </main>

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
