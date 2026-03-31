// Set environment variables BEFORE any imports that might use them
process.env.JWT_SECRET = 'test-secret-key-for-jwt-signing';
process.env.JWT_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import apiRoutes from '../../routes/index.js';
import Project from '../../models/Project.js';
import User from '../../models/User.js';

// Create test express app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Project Controller Integration Tests', () => {
  let adminToken;
  let adminUser;
  let testProjects = [];

  beforeEach(async () => {
    // Clear data before each test
    await Project.deleteMany({});
    await User.deleteMany({});
    
    // Create admin user
    adminUser = await User.create({
      email: 'admin@test.com',
      password: 'AdminPass123',
      role: 'admin',
    });
    adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Create test projects
    testProjects = await Project.create([
      {
        title: 'Featured Frontend Project',
        description: 'This is a featured frontend project with a long enough description',
        category: 'Frontend',
        featured: true,
        tags: ['React', 'CSS'],
      },
      {
        title: 'Backend Project',
        description: 'This is a backend project with a long enough description here',
        category: 'Backend',
        featured: false,
        tags: ['Node.js', 'Express'],
      },
    ]);
  });

  describe('GET /api/projects', () => {
    it('should get all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/projects?category=Frontend')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].category).toBe('Frontend');
    });

    it('should filter by featured', async () => {
      const response = await request(app)
        .get('/api/projects?featured=true')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].featured).toBe(true);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should get single project by ID', async () => {
      const projectId = testProjects[0]._id.toString();
      
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', projectId);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/projects/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Project not found');
    });
  });

  describe('POST /api/projects (Admin Only)', () => {
    it('should create new project as admin', async () => {
      const newProject = {
        title: 'New Admin Project',
        description: 'This is a new project created by an admin with a long enough description',
        category: 'APIs',
        featured: true,
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProject)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Project created successfully');
      expect(response.body.data).toHaveProperty('title', newProject.title);
    });

    it('should reject non-admin creating project', async () => {
      const regularUser = await User.create({
        email: 'user@test.com',
        password: 'UserPass123',
        role: 'user',
      });
      const userToken = jwt.sign({ id: regularUser._id, role: 'user' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'New Project',
          description: 'This is a new project with a long enough description',
        })
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Not authorized as admin');
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update project as admin', async () => {
      const projectId = testProjects[0]._id.toString();
      
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Project Title',
          description: 'This is an updated description that is long enough for the project',
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Project updated successfully');
      expect(response.body.data.title).toBe('Updated Project Title');
    });

    it('should reject update to non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Title',
          description: 'This is an updated description that is long enough',
        })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Project not found');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete project as admin', async () => {
      const projectId = testProjects[0]._id.toString();
      
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Project deleted successfully');

      const deleted = await Project.findById(projectId);
      expect(deleted).toBeNull();
    });
  });
});
