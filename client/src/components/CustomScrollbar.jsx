import { motion, useScroll, useTransform } from 'framer-motion';

const CustomScrollbar = () => {
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to thumb position
  const thumbY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', 'calc(100vh - 48px)']
  );

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value) / 100;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: value * maxScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className='fixed right-0 top-0 bottom-0 w-8 z-50 flex items-center justify-center'>
      {/* Track background */}
      <div
        className='absolute right-3 top-6 bottom-6 w-0.5 rounded-full'
        style={{ backgroundColor: 'var(--color-border-subtle)' }}
      >
        <motion.div
          className='w-full rounded-full origin-top'
          style={{
            height: '100%',
            scaleY: scrollYProgress,
            backgroundColor: 'var(--color-brand-primary)',
          }}
        />
      </div>

      {/* Invisible range input for interaction */}
      <input
        type='range'
        min='0'
        max='100'
        step='0.1'
        className='absolute right-0 top-0 bottom-0 w-8 opacity-0 cursor-pointer'
        onChange={handleSliderChange}
        defaultValue={0}
        aria-label='Scroll progress'
      />

      {/* Thumb indicator */}
      <motion.div
        className='absolute right-2 w-3 h-3 rounded-full pointer-events-none'
        style={{
          backgroundColor: 'var(--color-brand-primary)',
          y: thumbY,
        }}
      />
    </div>
  );
};

export default CustomScrollbar;
