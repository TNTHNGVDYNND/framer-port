import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='bg-surface-base text-text-muted py-6'>
      <div className='container mx-auto text-center'>
        <p>&copy; {year} TNTHNGVDYNND. All Rights Reserved.</p>
        <p className='mt-2'>
          Built with React, Tailwind CSS, and Framer Motion.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
