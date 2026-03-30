import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import TerminalAuthForm from './TerminalAuthForm';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Close modal
    onClose();
    // Redirect to home
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.button
        type='button'
        aria-label='Close auth modal'
        className='fixed inset-0 z-100 bg-black/60 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className='pointer-events-none fixed inset-0 z-101 flex items-center justify-center p-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          role='dialog'
          aria-modal='true'
          aria-labelledby='auth-title'
          className='pointer-events-auto w-full max-w-lg overflow-y-auto rounded-xl border border-brand-accent/20 bg-bg-body shadow-2xl'
          initial={{ scale: 0.96, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(event) => event.stopPropagation()}
        >
          <TerminalAuthForm onSuccess={handleSuccess} onClose={onClose} />
        </motion.div>
      </motion.div>
    </>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthModal;
