import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomScrollbar from './CustomScrollbar';
import AudioToggle from './AudioToggle';
import { AudioProvider } from './AudioToggle';
import CustomCursor from './CustomCursor';
import { ReactLenis } from 'lenis/react';

const Layout = () => {
  return (
    <AudioProvider>
      <ReactLenis root>
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg-body)' }}>
          <Navbar />
          
          <main className="flex-1 ml-16 cursor-none">
            <Outlet />
            <Footer />
          </main>
          
          <CustomScrollbar />
          <AudioToggle />
          <CustomCursor />
        </div>
      </ReactLenis>
    </AudioProvider>
  );
};

export default Layout;
