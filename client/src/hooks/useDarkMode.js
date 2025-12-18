/**
 * hooks/useDarkMode.js
 * A hook to manage dark mode preference
 * keep React in sync
 * update storage when toggled
 * update DOM when toggled
 */
import { useLayoutEffect, useState, useCallback } from 'react';

const THEME_KEY = 'theme';

function pickInitial() {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
  } catch {
    // localStorage may not be available
  }

  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => pickInitial());

  useLayoutEffect(() => {
    const html = document.documentElement;
    const theme = isDarkMode ? 'dark' : 'light';

    html.classList.toggle('dark', isDarkMode);
    html.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage may not be available
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((v) => !v);
  }, []);

  return {
    isDarkMode,
    setDarkMode: setIsDarkMode,
    toggleDarkMode,
  };
}
