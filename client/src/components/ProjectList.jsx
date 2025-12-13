import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { projects } from '../constants'; // Import mock projects

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const ProjectList = () => {
  // No more fetching, directly use mock projects
  // const [projects, setProjects] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch('http://localhost:5001/api/projects')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setProjects(data);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       setError(error.message);
  //       setLoading(false);
  //     });
  // }, []);

  // if (loading) {
  //   return <div className="text-center text-white">Loading projects...</div>;
  // }

  // if (error) {
  //   return <div className="text-center text-red-500">Error: {error}</div>;
  // }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Work
        </motion.h2>
        <motion.div
          className="flex overflow-x-auto scroll-snap-x-mandatory p-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Re-added viewport to container
        >
          {projects.map(project => (
            <motion.div
              key={project._id}
              className="flex-shrink-0 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 scroll-snap-align-center"
              // Removed variants={cardVariants} from here
              // Removed viewport={{ once: true, amount: 0.5 }} from here as ProjectCard handles its own
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectList;

