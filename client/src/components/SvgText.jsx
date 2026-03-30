import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SvgText = ({
  text,
  className = '',
  staggerDelay = 0.05,
  withCursor = false,
  cursorBlinkSpeed = 0.8,
  startDelay = 0,
  style = {},
}) => {
  const letters = text.split('');
  const [animationComplete, setAnimationComplete] = useState(false);

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: startDelay + i * staggerDelay,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1.0],
      },
    }),
  };

  useEffect(() => {
    if (!withCursor) return;

    const totalDuration = startDelay + letters.length * staggerDelay + 0.5;
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, totalDuration * 1000);

    return () => clearTimeout(timer);
  }, [letters.length, staggerDelay, startDelay, withCursor]);

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial='hidden'
      animate='visible'
      style={{ perspective: 1000, ...style }}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          style={{
            display: 'inline-block',
            transformStyle: 'preserve-3d',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}

      {withCursor && (
        <motion.span
          className='inline-block w-[3px] h-[1em] bg-current ml-1 align-middle'
          initial={{ opacity: 0 }}
          animate={{
            opacity: animationComplete ? [1, 0, 1] : 0,
          }}
          transition={{
            duration: cursorBlinkSpeed,
            repeat: animationComplete ? Infinity : 0,
            ease: 'linear',
          }}
        />
      )}
    </motion.span>
  );
};

export default SvgText;
