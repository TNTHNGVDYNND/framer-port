import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Preloader from './Preloader';
import Curtain from './Curtain';

const HeroContent = () => {
  const title = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const titleText = 'Creative Developer & Designer';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeInOut' }}
      className='text-heading h-screen flex items-center justify-center bg-linear-to-b from-bg-t from-55% via-bg-md via-50% to-bg-b to-61%'
    >
      <div className='mx-auto px-5 text-center max-w-4xl'>
        <motion.h1
          className='text-5xl md:text-7xl font-dune mb-6 leading-tight text-heading'
          variants={title}
          initial='hidden'
          animate='visible'
        >
          {titleText.split(' ').map((char, index) => (
            <motion.span
              key={index}
              variants={word}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
            >
              {char}{' '}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          className='mb-8 leading-relaxed text-base--line-height font-dune text-sub-title max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeInOut' }}
        >
          Welcome to my digital garden of code and curiosity.
        </motion.p>
        <motion.div
          className='flex justify-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
        >
          <Link
            to='/work'
            className='inline-flex text-primary-accent bg-linear-to-b from-tide/90 from-5% via-tide/40 via-60% to-tide/20 to-90% border-0 py-2 px-6 focus:outline-none hover:bg-tide/80 rounded-full text-lg hover:text-avocado-100 items-center transition-colors duration-500'
          >
            View My Work
          </Link>
          <Link
            to='/contact'
            className='ml-4 inline-flex text-muted-text bg-linear-to-b from-dusk/30 from-15% via-dusk/10 via-60% to-dusk/5 to-90% border-0 py-2 px-6 focus:outline-none hover:bg-dusk/40 hover:text-avocado-100 rounded-full text-lg items-center transition-colors duration-500'
          >
            Get In Touch
          </Link>
        </motion.div>
      </div>
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
