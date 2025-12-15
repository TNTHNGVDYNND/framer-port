import React from 'react';
import { motion } from 'framer-motion';

const reveal = {
  initial: {
    y: 0,
  },
  exit: {
    y: '-100vh',
    transition: { duration: 0.5, ease: [0.75, 0, 0.24, 1] },
  },
};

const Curtain = () => {
  return (
    <motion.div
      variants={reveal}
      initial='initial'
      exit='exit'
      className='h-screen w-screen fixed top-0 left-0 z-40 bg-black/50'
    />
  );
};

export default Curtain;
