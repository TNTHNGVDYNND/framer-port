import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WelcomeModal, KeyboardShortcutsModal } from './Modal';

const HelpButton = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Show welcome modal on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setShowWelcome(true);
        localStorage.setItem('hasSeenWelcome', 'true');
      }, 2500); // Show after terminal loader completes
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Keyboard shortcut for help
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show shortcuts with '?'
      if (e.key === '?' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        setShowShortcuts(true);
      }
      // Show welcome with 'h'
      if (e.key === 'h' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        setShowWelcome(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Help button */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-lg"
        style={{
          backgroundColor: 'var(--color-neutral-100)',
          color: 'var(--color-lagoon)',
          border: '2px solid var(--color-lagoon)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowWelcome(true)}
        title="Help (Press H)"
      >
        ?
      </motion.button>

      {/* Modals */}
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </>
  );
};

export default HelpButton;
