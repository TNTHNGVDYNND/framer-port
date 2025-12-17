import { createContext } from 'react';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

export default ThemeContext;
