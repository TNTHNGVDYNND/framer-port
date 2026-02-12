import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState } from 'react';
import Barcode from './Barcode';
import { useInView, usePrefersReducedMotion } from '../hooks/useInView';

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, isInView] = useInView({ threshold: 0.1, once: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  // 3D Tilt calculations (disabled for reduced motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30
  });

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      rotateX: prefersReducedMotion ? 0 : -15,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className='relative group cursor-pointer'
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d'
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
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        {/* Image with parallax effect */}
        <motion.div
          className='relative h-56 overflow-hidden'
          style={{
            y: useTransform(mouseY, [-0.5, 0.5], [-8, 8]),
            scale: isHovered ? 1.05 : 1,
            transition: 'scale 0.3s ease'
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
              background: `linear-gradient(to top, var(--color-bg-body) 0%, transparent 60%)`
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
            y: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
          style={{
            background: `linear-gradient(to top, var(--color-bg-body) 0%, transparent 100%)`
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
                  color: 'var(--color-text-primary)'
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
            style={{ color: 'var(--color-lagoon)' }}
            onClick={(e) => e.stopPropagation()}
          >
            View Project
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </a>
        </motion.div>

        {/* Barcode decoration */}
        <div className="absolute bottom-2 right-2 opacity-40">
          <Barcode 
            value={project._id} 
            className="w-20" 
            lineColor="var(--color-dusk)"
            animated={false}
          />
        </div>

        {/* ID badge */}
        <div 
          className="absolute top-4 left-4 px-2 py-1 rounded text-xs font-mono"
          style={{ 
            backgroundColor: 'var(--color-neutral-100)',
            color: 'var(--color-text-secondary)'
          }}
        >
          PRJ-{String(project._id).padStart(3, '0')}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;
