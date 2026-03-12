import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import ProjectCard from './ProjectCard';
import { projects } from '../constants';
import Barcode from './Barcode';
import { useInView, usePrefersReducedMotion } from '../hooks';

const ProjectGrid = ({ filter }) => {
  const [ref, isInView] = useInView({ threshold: 0.05, once: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Filter projects based on category
  const filteredProjects =
    filter === 'All'
      ? projects
      : projects.filter((project) => project.category === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section ref={ref} className='py-12 px-4' style={{ perspective: 1000 }}>
      <div className='container mx-auto max-w-7xl'>
        {/* Header with barcode decoration */}
        <motion.div
          className='flex flex-col items-center mb-16'
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ delay: 0.2, duration: 0.5 }}
            className='mb-4'
          >
            <Barcode
              value='SELECTED-WORKS'
              className='w-48'
              lineColor='var(--color-brand-accent)'
            />
          </motion.div>

          <h2 className='text-4xl md:text-5xl font-dune font-bold text-heading text-center mb-4'>
            Selected Works
          </h2>

          <p className='text-center font-mono max-w-2xl text-text-secondary'>
            A collection of projects showcasing creativity, technical skill, and
            problem-solving.
          </p>

          {/* Filter status */}
          <motion.div
            className='mt-4 font-mono text-sm'
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span style={{ color: 'var(--color-brand-primary)' }}>➜</span> Showing{' '}
            {filteredProjects.length} of {projects.length} projects
            {filter !== 'All' && (
              <span>
                {' '}
                in <span style={{ color: 'var(--color-brand-accent)' }}>{filter}</span>
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* 3D Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <AnimatePresence mode='wait'>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            className='text-center py-16 font-mono'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className='text-6xl mb-4'
              style={{ color: 'var(--color-neutral-300)' }}
            >
              📁
            </div>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No projects found in this category.
            </p>
            <p
              className='text-sm mt-2'
              style={{ color: 'var(--color-neutral-400)' }}
            >
              Try selecting a different filter.
            </p>
          </motion.div>
        )}

        {/* Footer decoration */}
        <motion.div
          className='mt-16 flex justify-center'
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className='text-center font-mono text-xs text-neutral-400'>
            <span className='text-brand-primary'>Total Projects:</span>{' '}
            {String(projects.length).padStart(3, '0')}
            {filter !== 'All' && (
              <>
                {' '}
                | <span className='text-brand-accent'>Filtered:</span>{' '}
                {String(filteredProjects.length).padStart(3, '0')}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

ProjectGrid.propTypes = {
  filter: PropTypes.string,
};

ProjectGrid.defaultProps = {
  filter: 'All',
};

export default ProjectGrid;
