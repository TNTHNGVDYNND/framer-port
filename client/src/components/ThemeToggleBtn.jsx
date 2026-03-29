import React from 'react';
import useTheme from '../context/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggleBtn = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <div className='relative w-8 h-8 flex items-center justify-center bg-bg-b rounded-full shadow-lg shadow-dusk/50 hover:shadow-dusk transition-shadow duration-200'>
      <AnimatePresence mode='wait' initial={false}>
        <motion.button
          key={isDarkMode ? 'dark' : 'light'}
          onClick={toggleDarkMode}
          aria-label={
            isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
          }
          aria-pressed={isDarkMode}
          className={`
    w-full h-full rounded-full cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-bg-t
    ${
      isDarkMode
        ? 'bg-radial-[at_25%_25%] from-warn-700 via-warn-900 via-10% to-dusk to-75%'
        : 'bg-radial-[at_25%_25%] from-surface-base via-surface-elevated via-60% to-surface-overlay to-45%'
    }
  `}
          initial={{ opacity: 0, rotate: -90, scale: 0 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggleBtn;
