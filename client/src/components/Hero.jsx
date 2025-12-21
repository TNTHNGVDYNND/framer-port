import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Preloader from './Preloader';
import Curtain from './Curtain';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.5,
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
    transition: { duration: 0.6, ease: 'easeInOut' },
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
      className='hero'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeInOut' }}
    >
      {/* 1. Gradient atmosphere */}
      <motion.div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `
        radial-gradient(
          ellipse at top, 
          var(--color-inner-glow) 5%,
          var(--color-md-glow) 25%,
          var(--color-outer-glow) 35%,
          var(--color-border-glow) 90%
        )
      `,
        }}
        animate={{
          backgroundPosition: ['50% 0%', '50% 5%', '50% 0%'],
        }}
        transition={{
          duration: 30,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />

      {/* 2. Surface shimmer */}
      <motion.div
        className='absolute top-0 left-0 right-0 h-[55%] pointer-events-none'
        style={{
          backgroundImage: `
      repeating-linear-gradient(
        -12deg,
        rgba(255,255,255,0.18) 0px,
        rgba(255,255,255,0.04) 18px,
        rgba(255,255,255,0.18) 36px
      )
    `,
          filter: 'blur(14px)',
          mixBlendMode: 'soft-light',
        }}
        animate={{
          x: ['-8%', '8%', '-8%'],
        }}
        transition={{
          duration: 36,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />

      <motion.div
        className='mx-auto px-5 max-w-5xl w-full text-center z-20'
        variants={container}
        initial='hidden'
        animate='visible'
      >
        {/* TITLE BLOCK */}
        <motion.div variants={titleContainer} className='hero__content'>
          <motion.h1 className='hero__title'>
            {titleText.split(' ').map((wordText, index) => (
              <motion.span
                key={index}
                variants={word}
                className='hero__title-word'
              >
                {wordText}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>

        {/* PARAGRAPH */}
        <motion.p variants={fadeUp} className='hero__subtitle'>
          Curiosity - Creativity - Code.
        </motion.p>

        {/* ACTIONS */}
        <motion.div variants={fadeUp} className='hero__actions'>
          <Link to='/work' className='hero__action hero__action--primary'>
            View My Work
          </Link>

          <Link to='/contact' className='hero__action hero__action--secondary'>
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
      const timer = setTimeout(() => setLoadingState(2), 1000);
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
