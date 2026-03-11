import { useState, useCallback } from 'react';

let _id = 0;

/**
 * Manages terminal-style output lines.
 *
 * Returns: { output, addLine, addLines, clear, setOutput }
 * Line shape: { text: string, type: string, id: number }
 * Types: 'info' | 'system' | 'success' | 'error' | 'command' | 'easter'
 */
export function useTerminalOutput(initial = []) {
  const [output, setOutput] = useState(initial);

  const addLine = useCallback((text, type = 'info') => {
    setOutput((prev) => [...prev, { text, type, id: ++_id }]);
  }, []);

  const addLines = useCallback((lines, type = 'info') => {
    const entries = lines.map((text) => ({ text, type, id: ++_id }));
    setOutput((prev) => [...prev, ...entries]);
  }, []);

  const clear = useCallback(() => setOutput([]), []);

  return { output, addLine, addLines, clear, setOutput };
}

export default useTerminalOutput;
