import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to track scroll velocity
 * Returns velocity value (positive or negative) for WebGL shader distortion
 * Uses Lenis smooth scroll velocity if available, falls back to native scroll
 * 
 * @returns {number} Scroll velocity (-1 to 1, smoothed)
 */
const useScrollVelocity = () => {
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());
  const velocityRef = useRef(0);
  const rafIdRef = useRef(null);
  const lenisRef = useRef(null);

  // Get Lenis instance if available
  useEffect(() => {
    // Try to get Lenis from window (if it was initialized globally in main.jsx)
    if (typeof window !== 'undefined' && window.lenis) {
      lenisRef.current = window.lenis;
    }
  }, []);

  const calculateVelocity = useCallback(() => {
    const currentTime = performance.now();
    const timeDelta = currentTime - lastTime.current;
    
    // Update at 60fps
    if (timeDelta < 16) {
      rafIdRef.current = requestAnimationFrame(calculateVelocity);
      return;
    }

    let currentScrollY;
    let rawVelocity = 0;

    // Check if Lenis is available with velocity property
    if (lenisRef.current && lenisRef.current.velocity !== undefined) {
      // Use Lenis velocity directly (already smoothed)
      rawVelocity = lenisRef.current.velocity / 3; // Normalize to reasonable range
      currentScrollY = lenisRef.current.scroll;
    } else {
      // Fallback to native scroll calculation
      currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      // Calculate velocity (pixels per second, normalized)
      rawVelocity = (scrollDelta / timeDelta) * 500; // Increased sensitivity
    }
    
    // Normalize to -1 to 1 range
    const normalizedVelocity = Math.max(-1, Math.min(1, rawVelocity));
    
    // Smooth the velocity with exponential decay
    velocityRef.current = velocityRef.current * 0.85 + normalizedVelocity * 0.15;
    
    // Only update state if velocity changed significantly
    if (Math.abs(velocityRef.current - velocity) > 0.001 || Math.abs(velocityRef.current) > 0.01) {
      setVelocity(velocityRef.current);
    }
    
    // Update refs
    lastScrollY.current = currentScrollY;
    lastTime.current = currentTime;
    
    rafIdRef.current = requestAnimationFrame(calculateVelocity);
  }, [velocity]);

  useEffect(() => {
    let isActive = true;
    
    const wrappedCalculate = () => {
      if (isActive) {
        calculateVelocity();
      }
    };

    // Start tracking
    rafIdRef.current = requestAnimationFrame(wrappedCalculate);

    // Cleanup
    return () => {
      isActive = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [calculateVelocity]);

  return velocity;
};

export default useScrollVelocity;
