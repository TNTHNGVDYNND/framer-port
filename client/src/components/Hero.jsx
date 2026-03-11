import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TerminalLoader from './TerminalLoader';
import SvgText from './SvgText';
import PrimeBtn from './buttons/PrimeBtn';
import { MagneticButton } from './CustomCursor';
import { use3DTilt } from '../hooks/use3DTilt';
import { TRANSITION_SLOW } from '../utils/motionPresets';

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
      /* eslint-disable-next-line */
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

        {(loadingState === 1 || hasLoaded) && (
          <HeroContent key='hero-content' />
        )}
      </AnimatePresence>
    </section>
  );
};

const HeroContent = () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // 3D Tilt effect (window-relative coords, soft spring)
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave, isHovered } =
    use3DTilt({
      elementRelative: false,
      mouseRange: [-1, 1],
      stiffness: 150,
      damping: 20,
      disabled: prefersReducedMotion,
    });

  return (
    <motion.div
      className='hero'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITION_SLOW}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      {/* Gradient atmosphere with 3D depth */}
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
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          backgroundImage: {
            duration: 60,
            ease: 'easeInOut',
            repeat: Infinity,
          },
          scale: {
            duration: 0.3,
            ease: 'easeOut',
          },
        }}
      />

      {/* 3D Tilt Container - Flex column to push content to bottom */}
      <motion.div
        className='hero__inner relative z-20 flex flex-col justify-end h-full min-h-screen px-8 pb-16'
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
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
        }}
      >
        {/* Floating decorative elements */}
        <FloatingElements />

        {/* Content pushed to bottom for "Midnight Sun in the desert" effect */}
        <div className='flex-1 min-h-[40vh]' />

        {/* TITLE BLOCK - Positioned at bottom in the darker area */}
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
              className='text-heading text-3xl sm:text-4xl md:text-5xl'
              staggerDelay={0.08}
              withCursor={true}
              startDelay={0.3}
            />
          </h1>

          {/* Name subtitle - uses Tailwind semantic colors */}
          <motion.p
            className='hero__subtitle text-base sm:text-lg md:text-xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            My name is{' '}
            <span className='hero__title-name'>Tuanthong Vaidyanond</span>
          </motion.p>
        </motion.div>

        {/* Tagline - uses Tailwind semantic colors */}
        <motion.p
          className='hero__subtitle text-xs sm:text-sm text-neutral-500'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          Curiosity - Creativity - Code.
        </motion.p>

        {/* ACTIONS with 3D hover and magnetic effect  */}
        <motion.div
          className='hero__actions mb-20'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <MagneticButton strength={0.4} className='mr-4'>
            <PrimeBtn
              as='a'
              href='https://github.com/TNTHNGVDYNND'
              target='_blank'
              rel='noopener noreferrer'
              variant='gradient'
              tone='primary'
              className='font-mono border-0'
            >
              Visit my GitHub
            </PrimeBtn>
          </MagneticButton>

          <MagneticButton strength={0.4}>
            <PrimeBtn
              as={Link}
              to='/contact'
              variant='gradient'
              tone='secondary'
              className='font-mono border-0'
            >
              Get In Touch
            </PrimeBtn>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Floating decorative elements for depth - positioned in the sky/upper area only
const FloatingElements = () => {
  return (
    <>
      <motion.div
        className='absolute top-[15%] left-[15%] w-2 h-2 rounded-full bg-lagoon'
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className='absolute top-[25%] right-[20%] w-3 h-3 rounded-full bg-dusk'
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className='absolute top-[40%] left-[25%] w-1.5 h-1.5 rounded-full bg-coral'
        animate={{
          y: [0, -25, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
      <motion.div
        className='absolute top-[10%] right-[40%] w-1 h-1 rounded-full bg-lagoon'
        animate={{
          y: [0, -15, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </>
  );
};

export default Hero;
