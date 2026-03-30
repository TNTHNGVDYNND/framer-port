import { useState } from 'react';
import { motion } from 'framer-motion';
import WorkHero from '../components/WorkHero';
import ProjectGrid from '../components/ProjectGrid';

const Work = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Smooth scroll to projects section
    const projectsSection = document.getElementById('projects-grid');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      className='min-h-screen'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Work Hero Section with Stats & Filters */}
      <WorkHero
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Projects Grid Section */}
      <section id='projects-grid' className='px-4 md:px-8 pb-24'>
        <div className='max-w-6xl mx-auto'>
          {/* Section header */}
          <motion.div
            className='mb-8 flex items-center gap-4'
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className='h-px flex-1'
              style={{ backgroundColor: 'var(--color-border-subtle)' }}
            />
            <span
              className='font-mono text-sm uppercase tracking-wider'
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span style={{ color: 'var(--color-brand-primary)' }}>$</span> ls
              -la projects/
            </span>
            <div
              className='h-px flex-1'
              style={{ backgroundColor: 'var(--color-border-subtle)' }}
            />
          </motion.div>

          {/* Project Grid with Filter */}
          <ProjectGrid filter={activeFilter} />
        </div>
      </section>
    </motion.div>
  );
};

export default Work;
