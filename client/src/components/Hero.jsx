import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Preloader from './Preloader';
import Curtain from './Curtain';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const titleContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const word = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: 'easeOut', duration: 0.6 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const HeroContent = () => {
  const titleText = 'Creative Developer & Designer';

  return (
    <motion.div
      className='h-screen flex items-center justify-center bg-linear-to-b from-bg-t from-55% via-bg-md via-50% to-bg-b to-61%'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeInOut' }}
    >
      <motion.div
        className='mx-auto px-5 max-w-5xl w-full text-center'
        variants={container}
        initial='hidden'
        animate='visible'
      >
        {/* TITLE BLOCK */}
        <motion.div variants={titleContainer} className='mb-6'>
          <motion.h1 className='text-5xl md:text-7xl font-dune leading-tight bg-clip-text text-transparent bg-linear-to-b from-heading to-night font-bold'>
            {titleText.split(' ').map((wordText, index) => (
              <motion.span
                key={index}
                variants={word}
                className='inline-block mr-2'
              >
                {wordText}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>

        {/* PARAGRAPH */}
        <motion.p
          variants={fadeUp}
          className='mb-8 leading-relaxed text-base--line-height font-dune text-sub-title max-w-2xl mx-auto'
        >
          Welcome to my digital garden, where code grows with curiosity.
        </motion.p>

        {/* ACTIONS */}
        <motion.div
          variants={fadeUp}
          className='flex flex-col sm:flex-row justify-center gap-4'
        >
          <Link
            to='/work'
            className='inline-flex text-primary-accent bg-linear-to-b from-tide/90 via-tide/40 to-tide/20 py-2 px-6 rounded-full text-sm transition-colors duration-500 hover:bg-tide/80'
          >
            View My Work
          </Link>

          <Link
            to='/contact'
            className='inline-flex text-muted-text bg-linear-to-b from-dusk/30 via-dusk/10 to-dusk/5 py-2 px-6 rounded-full text-sm transition-colors duration-500 hover:bg-dusk/40'
          >
            Get In Touch
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Hero = () => {
  const [loadingState, setLoadingState] = useState(0); // 0: preloader, 1: curtain, 2: content

  useEffect(() => {
    if (loadingState === 0) {
      const timer = setTimeout(() => setLoadingState(1), 750);
      return () => clearTimeout(timer);
    } else if (loadingState === 1) {
      const timer = setTimeout(() => setLoadingState(2), 600); // User-specified duration
      return () => clearTimeout(timer);
    }
  }, [loadingState]);

  return (
    <section>
      <AnimatePresence mode='wait'>
        {loadingState === 0 && <Preloader key='preloader' />}
        {loadingState === 1 && <Curtain key='curtain' />}
        {loadingState === 2 && <HeroContent key='hero' />}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
