import { motion, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import Barcode from './Barcode';
import { useInView, usePrefersReducedMotion } from '../hooks';
import { use3DTilt } from '../hooks';
import {
  SPRING_SNAPPY,
  TRANSITION_NORMAL,
  TRANSITION_FAST,
  PROJECT_CARD_ENTRY,
} from '../utils/motionPresets';

const ProjectCard = ({ project, index }) => {
  const [ref, isInView] = useInView({ threshold: 0.1, once: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  // 3D Tilt (element-relative coords, snappy spring)
  const {
    rotateX,
    rotateY,
    mouseY,
    handleMouseMove,
    handleMouseLeave,
    isHovered,
  } = use3DTilt({
    stiffness: SPRING_SNAPPY.stiffness,
    damping: SPRING_SNAPPY.damping,
    disabled: prefersReducedMotion,
  });

  // Parallax translation for the card image (separate from card rotation)
  const imageParallaxY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);

  return (
    <motion.div
      ref={ref}
      className='relative group cursor-pointer'
      variants={PROJECT_CARD_ENTRY}
      custom={index}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className='relative rounded-xl overflow-hidden border backdrop-blur-sm'
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          backgroundColor: 'var(--color-card-bg)',
          borderColor: 'var(--color-border-color)',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
        whileHover={{
          scale: 1.02,
          transition: TRANSITION_NORMAL,
        }}
      >
        {/* Image with parallax effect */}
        <motion.div
          className='relative h-56 overflow-hidden'
          style={{
            y: imageParallaxY,
            scale: isHovered ? 1.05 : 1,
            transition: 'scale 0.3s ease',
          }}
        >
          <img
            className='w-full h-full object-cover'
            src={project.imageUrl}
            alt={project.title}
          />

          {/* Gradient overlay on hover */}
          <motion.div
            className='absolute inset-0'
            style={{
              background: `linear-gradient(to top, var(--color-bg-body) 0%, transparent 60%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Content overlay */}
        <motion.div
          className='absolute bottom-0 left-0 right-0 p-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ ...TRANSITION_NORMAL, delay: isHovered ? 0.1 : 0 }}
          style={{
            background: `linear-gradient(to top, var(--color-bg-body) 0%, transparent 100%)`,
          }}
        >
          <h3
            className='text-xl font-mono font-bold mb-2'
            style={{ color: 'var(--color-heading)' }}
          >
            {project.title}
          </h3>
          <p
            className='text-sm mb-4 line-clamp-2'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className='px-2 py-1 rounded text-xs font-mono'
                style={{
                  backgroundColor: 'var(--color-neutral-100)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* View Project link */}
          <a
            href={project.projectUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 font-mono text-sm font-semibold transition-colors duration-300'
            style={{ color: 'var(--color-brand-primary)' }}
            onClick={(e) => e.stopPropagation()}
          >
            View Project
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
              transition={TRANSITION_FAST}
            >
              →
            </motion.span>
          </a>
        </motion.div>

        {/* Barcode decoration */}
        <div className='absolute bottom-2 right-2 opacity-40'>
          <Barcode
            value={project._id}
            className='w-20'
            lineColor='var(--color-brand-accent)'
            animated={false}
          />
        </div>

        {/* ID badge */}
        <div
          className='absolute top-4 left-4 px-2 py-1 rounded text-xs font-mono z-10'
          style={{
            backgroundColor: 'var(--color-neutral-100)',
            color: 'var(--color-text-secondary)',
          }}
        >
          PRJ-{String(project._id).padStart(3, '0')}
        </div>

        {/* Featured badge */}
        {project.featured && (
          <motion.div
            className='absolute top-4 right-4 px-2 py-1 rounded text-xs font-mono z-10 flex items-center gap-1'
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-neutral-950)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span>★</span>
            <span>FEATURED</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    projectUrl: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.string,
    featured: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ProjectCard;
