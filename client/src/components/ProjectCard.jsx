import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      className='bg-gray-800 rounded-lg overflow-hidden shadow-lg'
      variants={cardVariants}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <img
        className='w-full h-56 object-cover'
        src={project.imageUrl}
        alt={project.title}
      />
      <div className='p-6'>
        <h3 className='text-2xl font-bold mb-2 text-white'>{project.title}</h3>
        <p className='text-gray-400 mb-4'>{project.description}</p>
        <div className='flex flex-wrap gap-2 mb-4'>
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className='bg-gray-700 text-gray-300 text-sm font-medium px-2.5 py-0.5 rounded'
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={project.projectUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-block bg-sky-600 text-white font-semibold px-4 py-2 rounded hover:bg-sky-700 transition-colors duration-300'
        >
          View Project
        </a>
      </div>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    projectUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProjectCard;
