import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TerminalLoader from './TerminalLoader';
import SvgText from './SvgText';
import Barcode from './Barcode';
import PrimeBtn from './buttons/PrimeBtn';

const Hero = () => {
  const [loadingState, setLoadingState] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleLoadingComplete = () => {
    setLoadingState(1);
    setHasLoaded(true);
  };

  // Skip loader if already loaded once (for route navigation)
  useEffect(() => {
    if (hasLoaded && loadingState === 0) {
      setLoadingState(1);
    }
  }, [hasLoaded, loadingState]);

  return (
    <section className='relative min-h-screen'>
      <AnimatePresence mode='sync'>
        {loadingState === 0 && !hasLoaded && (
          <TerminalLoader
            key='terminal-loader'
            onComplete={handleLoadingComplete}
          />
        )}

        {(loadingState === 1 || hasLoaded) && <HeroContent key='hero-content' />}
      </AnimatePresence>
    </section>
  );
};

const HeroContent = () => {
  return (
    <motion.div
      className='hero'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Gradient atmosphere - kept from original */}
      <motion.div
        className='absolute inset-0 z-10'
        animate={{
          backgroundImage: [
            `radial-gradient(
              ellipse at 50% 0%,
              var(--color-inner-glow) 1%,
              var(--color-md-glow) 25%,
              var(--color-outer-glow) 35%,
              var(--color-border-glow) 75%
            )`,
            `radial-gradient(
              ellipse at 50% 8%,
              var(--color-inner-glow) 1%,
              var(--color-md-glow) 26%,
              var(--color-outer-glow) 36%,
              var(--color-border-glow) 95%
            )`,
            `radial-gradient(
              ellipse at 50% 0%,
              var(--color-inner-glow) 1%,
              var(--color-md-glow) 25%,
              var(--color-outer-glow) 35%,
              var(--color-border-glow) 75%
            )`,
          ],
        }}
        transition={{
          duration: 60,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />

      <motion.div
        className='hero__inner'
        initial='hidden'
        animate='visible'
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {/* TITLE BLOCK - Now with SvgText */}
        <motion.div
          className='hero__content'
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          <h1 className='hero__title'>
            <SvgText
              text='HELLO WORLD'
              className='font-dune text-4xl sm:text-5xl md:text-7xl'
              style={{ color: 'var(--color-heading)' }}
              staggerDelay={0.08}
              withCursor={true}
              startDelay={0.3}
            />
          </h1>

          {/* Subtitle with letter animation */}
          <motion.div
            className='mt-6 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <SvgText
              text='& VAIDYANOND'
              className='font-dune text-3xl sm:text-4xl md:text-6xl'
              style={{ color: 'var(--color-heading)' }}
              staggerDelay={0.05}
              startDelay={1.5}
            />
          </motion.div>
        </motion.div>

        {/* PARAGRAPH */}
        <motion.p
          className='hero__subtitle font-mono'
          style={{ color: 'var(--color-text-secondary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          Curiosity - Creativity - Code.
        </motion.p>

        {/* ACTIONS */}
        <motion.div
          className='hero__actions'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <PrimeBtn
            as='a'
            href='https://github.com/TNTHNGVDYNND'
            target='_blank'
            rel='noopener noreferrer'
            variant='gradient'
            tone='primary'
            className='mr-4 font-mono'
          >
            Visit my GitHub
          </PrimeBtn>

          <PrimeBtn
            as={Link}
            to='/contact'
            variant='gradient'
            tone='secondary'
            className='font-mono'
          >
            Get In Touch
          </PrimeBtn>
        </motion.div>

        {/* Barcode decoration */}
        <motion.div
          className='mt-12 flex justify-center'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <Barcode
            value='DEV-2024'
            className='w-48'
            lineColor='var(--color-dusk)'
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
