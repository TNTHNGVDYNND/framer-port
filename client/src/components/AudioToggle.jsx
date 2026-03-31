import { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize safely after mount
  useEffect(() => {
    setIsReady(true);
  }, []);

  const toggleAudio = useCallback(() => {
    if (!isAudioOn && !audioContext) {
      try {
        // Initialize Web Audio API on first enable
        if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          setAudioContext(ctx);
        }
      } catch (err) {
        console.warn('AudioContext not supported:', err);
      }
    }
    setIsAudioOn((prev) => !prev);
  }, [isAudioOn, audioContext]);

  const playHoverSound = useCallback(() => {
    if (!isAudioOn || !audioContext) return;

    try {
      // Play subtle hover sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.05;
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.05
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (err) {
      // Silently fail if audio can't play
      console.debug('Hover sound failed:', err);
    }
  }, [isAudioOn, audioContext]);

  const playClickSound = useCallback(() => {
    if (!isAudioOn || !audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 1200;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.08;
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.08
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.08);
    } catch (err) {
      // Silently fail if audio can't play
      console.debug('Click sound failed:', err);
    }
  }, [isAudioOn, audioContext]);

  const value = {
    isAudioOn,
    toggleAudio,
    playHoverSound,
    playClickSound,
    isReady,
  };

  // Wrap in try-catch to prevent breaking the app
  try {
    return (
      <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
    );
  } catch (err) {
    console.error('AudioProvider error:', err);
    return <>{children}</>;
  }
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    // Return dummy functions instead of throwing
    return {
      isAudioOn: false,
      toggleAudio: () => {},
      playHoverSound: () => {},
      playClickSound: () => {},
      isReady: true,
    };
  }
  return context;
};

const AudioToggle = () => {
  const { isAudioOn, toggleAudio, isReady } = useAudio();

  if (!isReady) {
    return null;
  }

  return (
    <motion.button
      onClick={toggleAudio}
      className='fixed bottom-4 left-20 z-50 px-4 py-2 rounded-full font-mono text-xs flex items-center gap-2'
      style={{
        backgroundColor: isAudioOn
          ? 'var(--color-status-success)'
          : 'var(--color-border-subtle)',
        color: isAudioOn
          ? 'var(--color-surface-base)'
          : 'var(--color-text-secondary)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <span className='text-sm'>{isAudioOn ? '🔊' : '🔇'}</span>
      <span>Sound: {isAudioOn ? 'On' : 'Off'}</span>
    </motion.button>
  );
};

export default AudioToggle;
