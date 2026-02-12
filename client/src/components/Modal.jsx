import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-neutral-50 rounded-xl border border-dusk/20 max-w-lg w-full max-h-[80vh] overflow-y-auto pointer-events-auto shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dusk/20">
                <h2 
                  className="text-xl font-dune font-bold"
                  style={{ color: 'var(--color-heading)' }}
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Welcome/Instructions Modal
const WelcomeModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to My Portfolio">
      <div className="space-y-4 font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        <p>
          This portfolio features a terminal-inspired aesthetic with modern interactive elements.
        </p>
        
        <div className="space-y-2">
          <h3 className="font-bold" style={{ color: 'var(--color-lagoon)' }}>Navigation</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Use the vertical sidebar on the left to navigate between pages</li>
            <li>Custom scrollbar on the right shows your scroll progress</li>
            <li>All pages are accessible via keyboard (Tab to navigate)</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold" style={{ color: 'var(--color-lagoon)' }}>Interactions</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Custom cursor with trail effect (desktop only)</li>
            <li>Magnetic hover effects on buttons - try hovering over them!</li>
            <li>3D tilt effects on project cards - move your mouse over them</li>
            <li>Click anywhere to see ripple effects</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold" style={{ color: 'var(--color-lagoon)' }}>Features</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Sound toggle button (bottom left) - enables subtle audio feedback</li>
            <li>Theme toggle in the sidebar - switch between light and dark modes</li>
            <li>Terminal-style loading animation on first visit</li>
          </ul>
        </div>
        
        <div 
          className="mt-6 p-4 rounded-lg text-xs"
          style={{ backgroundColor: 'var(--color-neutral-100)' }}
        >
          <span style={{ color: 'var(--color-lagoon)' }}>Pro tip:</span> This portfolio is optimized for desktop viewing. The custom cursor and some effects are disabled on mobile devices for the best touch experience.
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-lg font-mono font-bold transition-colors"
          style={{ 
            backgroundColor: 'var(--color-lagoon)',
            color: 'var(--color-neutral-50)'
          }}
        >
          Got it, let's explore!
        </button>
      </div>
    </Modal>
  );
};

// Keyboard Shortcuts Modal
const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'Tab', description: 'Navigate through interactive elements' },
    { key: 'Enter', description: 'Activate buttons and links' },
    { key: 'Space', description: 'Scroll down the page' },
    { key: 'Shift + Tab', description: 'Navigate backwards' },
    { key: 'Esc', description: 'Close modals and overlays' },
    { key: 'T', description: 'Toggle theme (when not typing)' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        <p className="mb-4">
          This portfolio is fully keyboard accessible. Here are the available shortcuts:
        </p>
        
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: 'var(--color-neutral-100)' }}
            >
              <span 
                className="px-2 py-1 rounded text-xs font-bold"
                style={{ 
                  backgroundColor: 'var(--color-dusk)',
                  color: 'var(--color-neutral-50)'
                }}
              >
                {shortcut.key}
              </span>
              <span className="flex-1 ml-4">{shortcut.description}</span>
            </div>
          ))}
        </div>
        
        <p className="mt-4 text-xs" style={{ color: 'var(--color-neutral-400)' }}>
          All interactive elements have visible focus indicators for keyboard navigation.
        </p>
      </div>
    </Modal>
  );
};

export { Modal, WelcomeModal, KeyboardShortcutsModal };
export default Modal;
