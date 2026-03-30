import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track mouse position
 * Returns normalized mouse coordinates (0-1 range) for WebGL shader interaction
 * Uses requestAnimationFrame for smooth updates
 *
 * @returns {Object} Mouse position with x, y coordinates or null if not available
 */
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState(null);
  const rafIdRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    // Skip on touch devices (coarse pointer)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let isActive = true;

    const updateMousePosition = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Throttled update using RAF
    const throttledUpdate = () => {
      const now = performance.now();

      // Update at most every 16ms (approx 60fps)
      if (now - lastUpdateRef.current >= 16) {
        if (isActive) {
          setMousePosition({ ...mouseRef.current });
          lastUpdateRef.current = now;
        }
      }

      rafIdRef.current = requestAnimationFrame(throttledUpdate);
    };

    // Add event listener
    window.addEventListener('mousemove', updateMousePosition, {
      passive: true,
    });

    // Start the RAF loop
    rafIdRef.current = requestAnimationFrame(throttledUpdate);

    // Cleanup
    return () => {
      isActive = false;
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
