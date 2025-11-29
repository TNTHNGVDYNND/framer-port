// In a real app, you would fetch this data from the database.
// For now, we'll use a static array of projects.
const sampleProjects = [
  {
    _id: '1',
    title: 'Project One',
    description: 'This is the description for project one.',
    imageUrl: 'https://via.placeholder.com/300',
    projectUrl: '#',
    tags: ['React', 'Node.js', 'Web Design']
  },
  {
    _id: '2',
    title: 'Project Two',
    description: 'This is the description for project two.',
    imageUrl: 'https://via.placeholder.com/300',
    projectUrl: '#',
    tags: ['Vue', 'Firebase', 'Animation']
  }
];


// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = (req, res) => {
  // Later, this will be:
  // const projects = await Project.find();
  res.json(sampleProjects);
};
