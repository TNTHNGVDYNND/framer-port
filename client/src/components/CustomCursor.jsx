import { useEffect, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';

// Custom cursor component with trail effects
const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [ripples, setRipples] = useState([]);

  // Mouse position tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for smooth following
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trail positions (delayed ghosts)
  const trail1X = useSpring(cursorX, { damping: 30, stiffness: 200 });
  const trail1Y = useSpring(cursorY, { damping: 30, stiffness: 200 });
  const trail2X = useSpring(cursorX, { damping: 35, stiffness: 150 });
  const trail2Y = useSpring(cursorY, { damping: 35, stiffness: 150 });
  const trail3X = useSpring(cursorX, { damping: 40, stiffness: 100 });
  const trail3Y = useSpring(cursorX, { damping: 40, stiffness: 100 });

  // Update cursor position
  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  // Handle mouse down/up for click effect
  useEffect(() => {
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Detect hoverable elements
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('magnetic')
      ) {
        setIsHovering(true);
        setCursorVariant('hover');
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setCursorVariant('default');
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Add ripple effect on click
  const addRipple = useCallback((x, y) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      addRipple(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [addRipple]);

  // Don't render on touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trail elements */}
      <motion.div
        className='fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9998] mix-blend-difference'
        style={{
          x: trail3X,
          y: trail3Y,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: 'var(--color-brand-primary)',
          opacity: 0.2,
        }}
      />
      <motion.div
        className='fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9998] mix-blend-difference'
        style={{
          x: trail2X,
          y: trail2Y,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: 'var(--color-brand-primary)',
          opacity: 0.4,
        }}
      />
      <motion.div
        className='fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9998] mix-blend-difference'
        style={{
          x: trail1X,
          y: trail1Y,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: 'var(--color-brand-primary)',
          opacity: 0.6,
        }}
      />

      {/* Main cursor */}
      <motion.div
        className='fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference'
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div
          className='w-4 h-4 rounded-full border-2'
          style={{
            borderColor: 'var(--color-brand-primary)',
            backgroundColor: isHovering
              ? 'var(--color-brand-primary)'
              : 'transparent',
            transition: 'background-color 0.2s ease',
          }}
        />
      </motion.div>

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className='fixed top-0 left-0 pointer-events-none z-[9997] rounded-full border-2'
            style={{
              x: ripple.x,
              y: ripple.y,
              translateX: '-50%',
              translateY: '-50%',
              borderColor: 'var(--color-brand-primary)',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 60, height: 60, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

// Magnetic wrapper component for interactive elements
export const MagneticButton = ({
  children,
  className = '',
  strength = 0.3,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

export default CustomCursor;
