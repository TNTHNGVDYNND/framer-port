import React, { useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THEME_KEY = 'color-theme-toggle';

const SunIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <circle cx='12' cy='12' r='5' />
    <line x1='12' y1='1' x2='12' y2='3' />
    <line x1='12' y1='21' x2='12' y2='23' />
    <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
    <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
    <line x1='1' y1='12' x2='3' y2='12' />
    <line x1='21' y1='12' x2='23' y2='12' />
    <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
    <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
  </svg>
);

const MoonIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
);

const ThemeToggle = () => {
  const lightTheme = 'light';
  const darkTheme = 'dark';

  const getDataTheme = (theme) =>
    theme === darkTheme ? darkTheme : lightTheme;
  const getToggledTheme = (theme) =>
    theme === darkTheme ? lightTheme : darkTheme;

  const initialTheme = localStorage.getItem(THEME_KEY) || lightTheme;
  const [theme, setTheme] = useState(initialTheme);
  const [key, setKey] = useState(0);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', getDataTheme(theme));
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = getToggledTheme(theme);
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, getDataTheme(newTheme));
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <div className='relative w-8 h-8'>
      <AnimatePresence mode='wait' initial={false}>
        <motion.button
          key={key}
          onClick={toggleTheme}
          className='flex items-center justify-center w-full h-full p-1 rounded-md border border-neutral-500 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500'
          aria-label='Toggle theme'
          initial={{ opacity: 0, rotate: -90, scale: 0 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {theme === 'light' ? (
            <SunIcon className='w-full h-full text-neutral-900' />
          ) : (
            <MoonIcon className='w-full h-full text-dusk' />
          )}
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
