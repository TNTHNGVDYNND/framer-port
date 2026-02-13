import { useEffect, useRef, useState } from 'react';

// Intersection Observer hook for lazy loading animations
export const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Optionally unobserve after first intersection
          if (options.once !== false) {
            observer.unobserve(element);
          }
        } else if (options.once === false) {
          setIsInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, isInView];
};

// Prefers reduced motion hook for accessibility
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Performance metrics hook (for development)
export const usePerformanceMetrics = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log Core Web Vitals
      const logWebVitals = () => {
        // First Contentful Paint
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcp) {
          console.log('FCP:', fcp.startTime);
        }

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const delay = entry.processingStart - entry.startTime;
            console.log('FID:', delay);
          }
        }).observe({ entryTypes: ['first-input'] });
      };

      // Wait for page load
      if (document.readyState === 'complete') {
        logWebVitals();
      } else {
        window.addEventListener('load', logWebVitals);
      }
    }
  }, []);
};

// Image preloader utility
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

// Batch image preloader
export const preloadImages = async (srcs) => {
  const promises = srcs.map(preloadImage);
  return Promise.allSettled(promises);
};

export default useInView;
