import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import TerminalHeader from './TerminalHeader';

const careerPhases = [
  {
    id: 1,
    year: '2005-2015',
    role: 'Field Journalist',
    company: 'Siam Sport Syndicate',
    location: 'Bangkok → UK',
    description:
      'Sports and cultural correspondent covering major events across Thailand and the UK. Developed keen analytical skills and storytelling abilities.',
    icon: '📰',
    color: 'var(--color-lagoon)',
    skills: ['Research', 'Writing', 'Analysis', 'Interviewing'],
  },
  {
    id: 2,
    year: '2015-2023',
    role: 'Chef & Restaurateur',
    company: 'Wirtshauskatze',
    location: 'Nürnberg, Germany',
    description:
      "Founded and operated 'Wirtshauskatze' restaurant. Mastered project management, team leadership, and creative problem-solving under pressure.",
    icon: '👨‍🍳',
    color: 'var(--color-dusk)',
    skills: ['Leadership', 'Creativity', 'Operations', 'Customer Service'],
  },
  {
    id: 3,
    year: '2024-Present',
    role: 'Full-Stack Developer',
    company: 'MERN Stack Certified',
    location: 'Seeking Opportunities',
    description:
      'Completed intensive full-stack program. Bringing analytical mindset, creativity, and hands-on engineering approach to web development.',
    icon: '💻',
    color: 'var(--color-coral)',
    skills: ['React', 'Node.js', 'Problem Solving', 'System Design'],
  },
];

const nodeVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.4,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const TimelineNode = ({ phase, index }) => {
  return (
    <motion.div
      className='relative pl-16 md:pl-24'
      custom={index}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, margin: '-100px' }}
      variants={nodeVariants}
    >
      {/* Timeline dot */}
      <motion.div
        className='absolute left-4 md:left-8 top-0 w-8 h-8 rounded-full flex items-center justify-center text-lg z-10'
        style={{ backgroundColor: phase.color }}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {phase.icon}
      </motion.div>

      {/* Content card */}
      <div className='relative'>
        {/* Year badge */}
        <div
          className='inline-block px-3 py-1 rounded-full text-xs font-mono mb-3 border'
          style={{
            backgroundColor: 'var(--color-neutral-100)',
            borderColor: phase.color,
            color: phase.color,
          }}
        >
          {phase.year}
        </div>

        {/* Role title */}
        <h3
          className='text-2xl md:text-3xl font-bold mb-1 font-mono'
          style={{ color: 'var(--color-heading)' }}
        >
          <span className='text-neutral-500 mr-2'>$</span>
          {phase.role}
        </h3>

        {/* Company & Location */}
        <div className='flex flex-wrap items-center gap-3 mb-4 text-sm'>
          <span
            className='font-mono font-semibold'
            style={{ color: 'var(--color-text-primary)' }}
          >
            {phase.company}
          </span>
          <span className='text-neutral-400'>|</span>
          <span
            className='font-mono text-xs'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {phase.location}
          </span>
        </div>

        {/* Description */}
        <p
          className='text-base leading-relaxed mb-4 max-w-2xl'
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {phase.description}
        </p>

        {/* Skills */}
        <div className='flex flex-wrap gap-2'>
          {phase.skills.map((skill, i) => (
            <span
              key={i}
              className='px-2 py-1 rounded text-xs font-mono border'
              style={{
                backgroundColor: 'var(--color-neutral-100)',
                borderColor: 'var(--color-neutral-200)',
                color: 'var(--color-text-primary)',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const CareerTimeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Animate SVG path as user scrolls
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      className='py-24 px-4 md:px-8 relative overflow-hidden'
    >
      {/* Background grid effect */}
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `linear-gradient(var(--color-neutral-300) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-neutral-300) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className='max-w-5xl mx-auto relative'>
        {/* Terminal window header */}
        <motion.div
          className='mb-12 border-b pb-4'
          style={{ borderColor: 'var(--color-neutral-200)' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <TerminalHeader filename='career_history.sh' className='mb-2' />

          <h2
            className='text-3xl md:text-4xl font-bold font-mono'
            style={{ color: 'var(--color-heading)' }}
          >
            <span className='text-neutral-500 mr-2'>$</span>cat career.txt
          </h2>
          <p
            className='mt-2 font-mono text-sm'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span style={{ color: 'var(--color-ok-400)' }}>➜</span> Loading
            career trajectory...
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className='relative'>
          {/* SVG Connecting line - desktop */}
          <svg
            className='absolute left-4 md:left-8 top-0 bottom-0 w-4 hidden md:block pointer-events-none'
            style={{ height: '100%' }}
            preserveAspectRatio='none'
          >
            <motion.line
              x1='8'
              y1='16'
              x2='8'
              y2='100%'
              stroke='var(--color-lagoon)'
              strokeWidth='2'
              strokeLinecap='round'
              style={{
                pathLength: prefersReducedMotion ? 1 : pathLength,
                opacity: 0.3,
              }}
            />
          </svg>

          {/* Mobile connecting line */}
          <div
            className='absolute left-4 top-8 bottom-8 w-0.5 md:hidden pointer-events-none'
            style={{ backgroundColor: 'var(--color-neutral-200)' }}
          />

          {/* Timeline nodes */}
          <div className='space-y-16 md:space-y-24 relative z-10'>
            {careerPhases.map((phase, index) => (
              <TimelineNode key={phase.id} phase={phase} index={index} />
            ))}
          </div>

          {/* End of timeline marker */}
          <motion.div
            className='pl-16 md:pl-24 pt-8 flex items-center gap-3'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
          >
            <div
              className='w-3 h-3 rounded-full animate-pulse'
              style={{ backgroundColor: 'var(--color-coral)' }}
            />
            <span
              className='font-mono text-sm'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <span style={{ color: 'var(--color-ok-400)' }}>➜</span> Continue
              to next chapter...
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

TimelineNode.propTypes = {
  phase: PropTypes.shape({
    id: PropTypes.number.isRequired,
    year: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default CareerTimeline;
