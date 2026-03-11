import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Runs an async function and tracks loading / error / data state.
 *
 * Signature: useAsyncOperation(asyncFn, deps?)
 * Returns:   { loading, error, data, success, run }
 *
 *   asyncFn  — the async function to call (always reads the latest version via ref)
 *   deps     — if provided, auto-runs on mount and whenever deps change (like useEffect)
 *              if omitted, call run() manually
 *
 * run(...args) — manually trigger the operation (also used internally for auto-run)
 */
export function useAsyncOperation(asyncFn, deps) {
  const autoRun = deps !== undefined;

  const [loading, setLoading] = useState(autoRun);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [success, setSuccess] = useState(false);

  const isMountedRef = useRef(true);
  const asyncFnRef = useRef(asyncFn);

  // Always keep the ref pointing at the latest function without triggering re-render
  useEffect(() => {
    asyncFnRef.current = asyncFn;
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await asyncFnRef.current(...args);
      if (isMountedRef.current) {
        setData(result);
        setSuccess(true);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || String(err));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Auto-run effect — only active when deps is provided by the caller.
  // deps is intentionally dynamic (not a literal array); exhaustive-deps cannot verify it.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (autoRun) run();
  }, deps ?? []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return { loading, error, data, success, run };
}

export default useAsyncOperation;
