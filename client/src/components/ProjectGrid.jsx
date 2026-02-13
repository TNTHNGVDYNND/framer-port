import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { projects } from '../constants';
import Barcode from './Barcode';
import { useInView, usePrefersReducedMotion } from '../hooks/useInView';

const ProjectGrid = () => {
  const [ref, isInView] = useInView({ threshold: 0.05, once: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: 0.2
      }
    }
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
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='mb-4'
          >
            <Barcode 
              value="SELECTED-WORKS" 
              className="w-48" 
              lineColor="var(--color-dusk)"
            />
          </motion.div>
          
          <h2 className='text-4xl md:text-5xl font-dune font-bold text-heading text-center mb-4'>
            Selected Works
          </h2>
          
          <p className='text-center font-mono max-w-2xl text-text-secondary'>
            A collection of projects showcasing creativity, technical skill, and problem-solving.
          </p>
        </motion.div>

        {/* 3D Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              index={index}
            />
          ))}
        </motion.div>

        {/* Footer decoration */}
        <motion.div
          className='mt-16 flex justify-center'
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className='text-center font-mono text-xs text-neutral-400'>
            <span className='text-lagoon'>Total Projects:</span> {String(projects.length).padStart(3, '0')}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectGrid;
