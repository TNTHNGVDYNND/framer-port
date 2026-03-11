import React from 'react';
import PropTypes from 'prop-types';
import ThemeContext from './themeContext';
import { useDarkMode } from '../hooks';

export default function ThemeProvider({ children }) {
  const { isDarkMode, setDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ThemeContext.Provider value={{ isDarkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
