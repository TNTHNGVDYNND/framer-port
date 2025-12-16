// only a context constant — no React components in this file
import { createContext } from 'react';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

export default ThemeContext;
