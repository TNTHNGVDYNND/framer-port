import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Notification = () => {
  const { notification } = useAuth();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed top-6 left-1/2 z-[100] px-6 py-3 rounded-lg font-mono text-sm border backdrop-blur-md shadow-lg ${
            notification.type === 'error'
              ? 'bg-brand-secondary/90 border-brand-secondary text-text-base'
              : 'bg-brand-primary/90 border-brand-primary text-text-base'
          }`}
          role='alert'
          aria-live='polite'
        >
          <div className='flex items-center gap-3'>
            <span className='text-lg'>
              {notification.type === 'error' ? '⚠️' : '✓'}
            </span>
            <span>{notification.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
