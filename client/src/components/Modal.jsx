import { useEffect, useId } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const backdropAnimation = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1 };

  const modalAnimation = shouldReduceMotion ? { opacity: 1 } : { opacity: 1 };

  const panelInitial = shouldReduceMotion
    ? { opacity: 1 }
    : { scale: 0.96, y: 20, opacity: 0 };

  const panelAnimate = shouldReduceMotion
    ? { opacity: 1 }
    : { scale: 1, y: 0, opacity: 1 };

  const panelExit = shouldReduceMotion
    ? { opacity: 0 }
    : { scale: 0.96, y: 20, opacity: 0 };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type='button'
            aria-label='Close modal backdrop'
            className='fixed inset-0 z-100 bg-black/60 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={backdropAnimation}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className='pointer-events-none fixed inset-0 z-101 flex items-center justify-center p-4'
            initial={{ opacity: 0 }}
            animate={modalAnimation}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role='dialog'
              aria-modal='true'
              aria-labelledby={titleId}
              className='pointer-events-auto max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl border border-brand-accent/20 bg-bg-body shadow-2xl'
              initial={panelInitial}
              animate={panelAnimate}
              exit={panelExit}
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { type: 'spring', damping: 25, stiffness: 300 }
              }
              onClick={(event) => event.stopPropagation()}
            >
              <div className='flex items-center justify-between border-b border-brand-accent/20 p-6'>
                <h2
                  id={titleId}
                  className='font-dune text-xl font-bold text-heading'
                >
                  {title}
                </h2>

                <button
                  type='button'
                  onClick={onClose}
                  aria-label='Close modal'
                  className='rounded-full p-2 text-text-secondary transition-colors hover:bg-surface-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-lagoon) focus-visible:ring-offset-2'
                >
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              <div className='p-6'>{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Welcome/Instructions Modal
const WelcomeModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Welcome to My Portfolio'>
      <div className='space-y-4 font-mono text-sm text-text-secondary'>
        <p>
          This portfolio features a terminal-inspired aesthetic with modern
          interactive elements.
        </p>

        <div className='space-y-2'>
          <h3 className='font-bold text-brand-primary'>Navigation</h3>
          <ul className='list-disc space-y-1 pl-4'>
            <li>
              Use the vertical sidebar on the left to navigate between pages
            </li>
            <li>Custom scrollbar on the right shows your scroll progress</li>
            <li>All pages are accessible via keyboard (Tab to navigate)</li>
          </ul>
        </div>

        <div className='space-y-2'>
          <h3 className='font-bold text-brand-primary'>Interactions</h3>
          <ul className='list-disc space-y-1 pl-4'>
            <li>Custom cursor with trail effect (desktop only)</li>
            <li>Magnetic hover effects on buttons - try hovering over them!</li>
            <li>
              3D tilt effects on project cards - move your mouse over them
            </li>
            <li>Click anywhere to see ripple effects</li>
          </ul>
        </div>

        <div className='space-y-2'>
          <h3 className='font-bold text-brand-primary'>Features</h3>
          <ul className='list-disc space-y-1 pl-4'>
            <li>
              Sound toggle button (bottom left) - enables subtle audio feedback
            </li>
            <li>
              Theme toggle in the sidebar - switch between light and dark modes
            </li>
            <li>Terminal-style loading animation on first visit</li>
          </ul>
        </div>

        <div className='mt-6 rounded-lg bg-bg-b p-4 text-xs'>
          <span className='text-secondary-accent'>Pro tip:</span> This portfolio
          is optimized for desktop viewing. The custom cursor and some effects
          are disabled on mobile devices for the best touch experience.
        </div>

        <button
          type='button'
          onClick={onClose}
          className='mt-6 w-full rounded-lg bg-brand-primary py-3 font-mono font-bold text-text-base transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'
        >
          Got it, let&apos;s explore!
        </button>
      </div>
    </Modal>
  );
};

WelcomeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
    <Modal isOpen={isOpen} onClose={onClose} title='Keyboard Shortcuts'>
      <div className='font-mono text-sm text-text-secondary'>
        <p className='mb-4'>
          This portfolio is fully keyboard accessible. Here are the available
          shortcuts:
        </p>

        <div className='space-y-2'>
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className='flex items-center justify-between rounded-lg bg-surface-base p-3'
            >
              <span className='rounded bg-brand-accent px-2 py-1 text-xs font-bold text-text-base'>
                {shortcut.key}
              </span>
              <span className='ml-4 flex-1'>{shortcut.description}</span>
            </div>
          ))}
        </div>

        <p className='mt-4 text-xs text-text-muted'>
          All interactive elements have visible focus indicators for keyboard
          navigation.
        </p>
      </div>
    </Modal>
  );
};

KeyboardShortcutsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { Modal, WelcomeModal, KeyboardShortcutsModal };
export default Modal;
