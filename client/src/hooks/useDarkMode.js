/**
 * hooks/useDarkMode.js
 * A hook to manage dark mode preference
 * keep React in sync
 * update storage when toggled
 * update DOM when toggled
 *
 * Uses the View Transitions API for smooth cross-fade between themes.
 * Falls back to instant switch in browsers that don't support it.
 */
import { useLayoutEffect, useState, useCallback, useRef } from 'react';

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

/**
 * Apply the theme to the DOM — separated so it can be called
 * inside a View Transition callback.
 */
function applyTheme(isDark) {
  const html = document.documentElement;
  const theme = isDark ? 'dark' : 'light';

  html.classList.toggle('dark', isDark);
  html.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage may not be available
  }
}

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => pickInitial());
  const isTransitioning = useRef(false);

  // Apply theme on mount and when isDarkMode changes (non-toggle path)
  useLayoutEffect(() => {
    // Skip if a view transition is handling it
    if (isTransitioning.current) {
      isTransitioning.current = false;
      return;
    }
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    const nextDark = !isDarkMode;

    // Use View Transitions API for smooth cross-fade if available
    if (document.startViewTransition) {
      isTransitioning.current = true;
      document.startViewTransition(() => {
        applyTheme(nextDark);
        setIsDarkMode(nextDark);
      });
    } else {
      setIsDarkMode(nextDark);
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    setDarkMode: setIsDarkMode,
    toggleDarkMode,
  };
}
