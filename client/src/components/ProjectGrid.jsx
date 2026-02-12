import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { projects } from '../constants';
import Barcode from './Barcode';

const ProjectGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section className='py-12 px-4' style={{ perspective: 1000 }}>
      <div className='container mx-auto max-w-7xl'>
        {/* Header with barcode decoration */}
        <motion.div
          className='flex flex-col items-center mb-16'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='mb-4'
          >
            <Barcode 
              value="SELECTED-WORKS" 
              className="w-48" 
              lineColor="var(--color-dusk)"
            />
          </motion.div>
          
          <h2 
            className='text-4xl md:text-5xl font-dune font-bold text-center mb-4'
            style={{ color: 'var(--color-heading)' }}
          >
            Selected Works
          </h2>
          
          <p 
            className='text-center font-mono max-w-2xl'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            A collection of projects showcasing creativity, technical skill, and problem-solving.
          </p>
        </motion.div>

        {/* 3D Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
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
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div 
            className='text-center font-mono text-xs'
            style={{ color: 'var(--color-neutral-400)' }}
          >
            <span style={{ color: 'var(--color-lagoon)' }}>Total Projects:</span> {String(projects.length).padStart(3, '0')}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectGrid;
