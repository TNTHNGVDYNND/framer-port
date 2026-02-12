import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
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
  useState(() => {
    if (hasLoaded && loadingState === 0) {
      setLoadingState(1);
    }
  });

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
  // 3D Tilt effect state
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate mouse position relative to center (-1 to 1)
    mouseX.set((clientX - innerWidth / 2) / (innerWidth / 2));
    mouseY.set((clientY - innerHeight / 2) / (innerHeight / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Smooth spring animations for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), {
    stiffness: 150,
    damping: 20
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), {
    stiffness: 150,
    damping: 20
  });

  return (
    <motion.div
      className='hero'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
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
            ease: 'easeOut'
          }
        }}
      />

      {/* 3D Tilt Container */}
      <motion.div
        className='hero__inner relative z-20'
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
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floating decorative elements */}
        <FloatingElements />

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

        {/* ACTIONS with 3D hover */}
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

// Floating decorative elements for depth
const FloatingElements = () => {
  return (
    <>
      <motion.div
        className="absolute top-20 left-20 w-2 h-2 rounded-full"
        style={{ backgroundColor: 'var(--color-lagoon)' }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-3 h-3 rounded-full"
        style={{ backgroundColor: 'var(--color-dusk)' }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-32 left-40 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: 'var(--color-coral)' }}
        animate={{
          y: [0, -25, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </>
  );
};

export default Hero;
