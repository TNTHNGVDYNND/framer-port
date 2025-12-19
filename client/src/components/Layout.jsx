import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ReactLenis } from 'lenis/react';

const Layout = () => {
  return (
    <ReactLenis root>
        {/* Noticeable bg - future infrastructure */}
      <div className='bg-teal-500 min-h-screen flex flex-col'>
        <Navbar />
        <main className='grow'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Layout;
