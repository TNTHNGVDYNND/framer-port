// Enhanced sample projects data
const sampleProjects = [
  {
    _id: '1',
    title: 'Interactive Portfolio Website',
    description:
      'A personal portfolio showcasing creative development skills with interactive animations and a modern design.',
    imageUrl: 'https://via.placeholder.com/400x250/FF5733/FFFFFF?text=Project+1',
    projectUrl: 'https://github.com/yourusername/project1',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    category: 'Frontend',
    featured: true,
  },
  {
    _id: '2',
    title: 'E-commerce Storefront',
    description:
      'A full-stack e-commerce application with product listings, shopping cart functionality, and user authentication.',
    imageUrl: 'https://via.placeholder.com/400x250/33FF57/FFFFFF?text=Project+2',
    projectUrl: 'https://github.com/yourusername/project2',
    tags: ['MERN Stack', 'Redux', 'Stripe API'],
    category: 'MERN',
    featured: true,
  },
  {
    _id: '3',
    title: 'Real-time Chat Application',
    description:
      'A real-time chat application built with WebSockets, allowing users to communicate in various rooms.',
    imageUrl: 'https://via.placeholder.com/400x250/3357FF/FFFFFF?text=Project+3',
    projectUrl: 'https://github.com/yourusername/project3',
    tags: ['Node.js', 'Express', 'Socket.io', 'React'],
    category: 'MERN',
    featured: false,
  },
  {
    _id: '4',
    title: 'Task Management Tool',
    description:
      'A simple and intuitive task management application to help users organize their daily tasks and boost productivity.',
    imageUrl: 'https://via.placeholder.com/400x250/FF33A1/FFFFFF?text=Project+4',
    projectUrl: 'https://github.com/yourusername/project4',
    tags: ['React', 'Context API', 'CSS Modules'],
    category: 'Frontend',
    featured: false,
  },
  {
    _id: '5',
    title: 'Weather Dashboard',
    description:
      'A weather application that displays current weather conditions and forecasts for any city using a third-party API.',
    imageUrl: 'https://via.placeholder.com/400x250/A1FF33/FFFFFF?text=Project+5',
    projectUrl: 'https://github.com/yourusername/project5',
    tags: ['React', 'API Integration', 'Axios'],
    category: 'APIs',
    featured: true,
  },
  {
    _id: '6',
    title: 'ML Image Classifier',
    description: 'A machine learning experiment that classifies images using TensorFlow.js.',
    imageUrl: 'https://via.placeholder.com/400x250/FF9500/FFFFFF?text=Project+6',
    projectUrl: 'https://github.com/yourusername/project6',
    tags: ['TensorFlow.js', 'React', 'ML'],
    category: 'Experiments',
    featured: false,
  },
  {
    _id: '7',
    title: 'Three.js 3D Scene',
    description: 'An interactive 3D scene built with Three.js and WebGL.',
    imageUrl: 'https://via.placeholder.com/400x250/00CED1/FFFFFF?text=Project+7',
    projectUrl: 'https://github.com/yourusername/project7',
    tags: ['Three.js', 'WebGL', 'React'],
    category: 'Experiments',
    featured: false,
  },
];

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = (req, res) => {
  res.json(sampleProjects);
};
