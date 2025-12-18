import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className='h-screen w-screen fixed top-0 left-0 z-50 flex items-center justify-center'
    >
      <div className='w-24 h-1 bg-white rounded-full overflow-hidden'>
        <motion.div
          className='h-full bg-red-500 rounded-full'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </motion.div>
  );
};

export default Preloader;
