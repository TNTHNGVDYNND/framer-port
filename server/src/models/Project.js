import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: String,
  projectUrl: String,
  tags: [String],
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'MERN', 'APIs', 'Experiments', 'Other'],
    default: 'Other'
  },
  featured: {
    type: Boolean,
    default: false
  }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
