import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Simulates a progress bar that increments via setInterval.
 *
 * Signature: useProgressSimulation(onComplete, { increment, interval })
 * Returns:   { progress, start, stop, complete, reset }
 *
 *   start()    — resets to 0 and begins the interval
 *   stop()     — clears the interval, progress stays at current value
 *   complete() — clears the interval, forces progress to 100 (does NOT fire onComplete)
 *   reset()    — clears the interval and resets progress to 0
 *
 * onComplete fires automatically when the interval increments past 100.
 */
export function useProgressSimulation(
  onComplete,
  { increment = 10, interval = 200 } = {}
) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onCompleteRef current without adding it to callback deps
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // Cleanup on unmount
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const start = useCallback(() => {
    clearInterval(intervalRef.current);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          onCompleteRef.current?.();
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  }, [increment, interval]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  const complete = useCallback(() => {
    clearInterval(intervalRef.current);
    setProgress(100);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setProgress(0);
  }, []);

  return { progress, start, stop, complete, reset };
}

export default useProgressSimulation;
