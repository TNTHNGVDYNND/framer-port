import { useState, createContext, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  const toggleAudio = useCallback(() => {
    if (!isAudioOn && !audioContext) {
      // Initialize Web Audio API on first enable
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(ctx);
    }
    setIsAudioOn((prev) => !prev);
  }, [isAudioOn, audioContext]);

  const playHoverSound = useCallback(() => {
    if (!isAudioOn || !audioContext) return;

    // Play subtle hover sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.05;
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  }, [isAudioOn, audioContext]);

  const playClickSound = useCallback(() => {
    if (!isAudioOn || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1200;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.08;
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
  }, [isAudioOn, audioContext]);

  const value = {
    isAudioOn,
    toggleAudio,
    playHoverSound,
    playClickSound,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

const AudioToggle = () => {
  const { isAudioOn, toggleAudio } = useAudio();

  return (
    <motion.button
      onClick={toggleAudio}
      className="fixed bottom-4 left-20 z-50 px-4 py-2 rounded-full font-mono text-xs flex items-center gap-2"
      style={{
        backgroundColor: isAudioOn
          ? 'var(--color-ok-400)'
          : 'var(--color-neutral-200)',
        color: isAudioOn
          ? 'var(--color-neutral-50)'
          : 'var(--color-text-secondary)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <span className="text-sm">{isAudioOn ? '🔊' : '🔇'}</span>
      <span>Sound: {isAudioOn ? 'On' : 'Off'}</span>
    </motion.button>
  );
};

export default AudioToggle;
