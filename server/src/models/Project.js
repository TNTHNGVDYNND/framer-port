import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  projectUrl: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'MERN', 'APIs', 'Experiments', 'Other'],
    default: 'Other',
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Indexes for performance
projectSchema.index({ category: 1, featured: -1 }); // For filtering queries
projectSchema.index({ featured: -1 }); // For featured projects queries
projectSchema.index({ createdAt: -1 }); // For sorting by date

const Project = mongoose.model('Project', projectSchema);

export default Project;
