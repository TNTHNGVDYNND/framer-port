import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import TerminalHeader from './TerminalHeader';
import { TRANSITION_NORMAL, TRANSITION_SLOW } from '../utils/motionPresets';

// Animated counter hook
const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (easeOutExpo)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOutExpo * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration, start]);

  return { count, ref };
};

const StatCounter = ({ value, label, suffix = '' }) => {
  const { count, ref } = useCountUp(value);

  return (
    <motion.div
      ref={ref}
      className='text-center'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        className='text-4xl md:text-5xl font-bold font-mono mb-2'
        style={{ color: 'var(--color-lagoon)' }}
      >
        {count}
        {suffix}
      </div>
      <div
        className='text-sm font-mono uppercase tracking-wider'
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </div>
    </motion.div>
  );
};

StatCounter.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  suffix: PropTypes.string,
};

const WorkHero = ({ activeFilter, onFilterChange }) => {
  const filters = ['All', 'MERN', 'APIs', 'Frontend', 'Experiments'];

  const stats = [
    { value: 20, label: 'Projects Built', suffix: '+' },
    { value: 5, label: 'Technologies', suffix: '+' },
    { value: 365, label: 'Days of Code', suffix: '' },
  ];

  return (
    <section className='py-24 px-4 md:px-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Terminal Header */}
        <motion.div
          className='mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Terminal controls */}
          <TerminalHeader
            filename='portfolio_work.exe'
            className='mb-6'
            labelClassName='text-sm'
          />

          {/* Main heading */}
          <h1
            className='text-4xl md:text-6xl font-bold font-mono mb-4'
            style={{ color: 'var(--color-heading)' }}
          >
            <span className='text-neutral-500 mr-2'>$</span>./showcase_work
          </h1>

          {/* Philosophy text */}
          <p
            className='text-lg max-w-2xl mb-8 font-mono'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span style={{ color: 'var(--color-ok-400)' }}>➜</span> Explore my
            digital craftsmanship. Each project represents a unique challenge, a
            learning opportunity, and a step forward in my development journey.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className='grid grid-cols-3 gap-8 mb-16 p-8 rounded-lg border'
          style={{
            backgroundColor: 'var(--color-neutral-50)',
            borderColor: 'var(--color-neutral-200)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
            />
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className='flex flex-wrap gap-2 mb-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span
            className='font-mono text-sm mr-4 self-center'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span style={{ color: 'var(--color-lagoon)' }}>$</span> filter
            --category:
          </span>
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className='px-4 py-2 rounded font-mono text-sm transition-all duration-300 border'
              style={{
                backgroundColor:
                  activeFilter === filter
                    ? 'var(--color-lagoon)'
                    : 'var(--color-neutral-100)',
                color:
                  activeFilter === filter
                    ? 'var(--color-neutral-950)'
                    : 'var(--color-text-primary)',
                borderColor:
                  activeFilter === filter
                    ? 'var(--color-lagoon)'
                    : 'var(--color-neutral-200)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {/* Filter hint */}
        <motion.div
          className='font-mono text-xs mb-8'
          style={{ color: 'var(--color-text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span style={{ color: 'var(--color-ok-400)' }}>➜</span> Currently
          viewing:{' '}
          <span style={{ color: 'var(--color-dusk)' }}>{activeFilter}</span>{' '}
          projects
        </motion.div>
      </div>
    </section>
  );
};

WorkHero.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default WorkHero;
