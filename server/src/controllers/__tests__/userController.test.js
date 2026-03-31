// Set environment variables BEFORE any imports that might use them
process.env.JWT_SECRET = 'test-secret-key-for-jwt-signing';
process.env.JWT_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import apiRoutes from '../../routes/index.js';
import User from '../../models/User.js';

// Create test express app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('User Controller Integration Tests', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

  beforeEach(async () => {
    // Clear users before each test
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

    // Create regular user
    regularUser = await User.create({
      email: 'user@test.com',
      password: 'UserPass123',
      role: 'user',
    });
    userToken = jwt.sign({ id: regularUser._id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: 'newuser@test.com',
          password: 'SecurePass123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('email', 'newuser@test.com');
      expect(response.body).toHaveProperty('role', 'user');
      expect(response.body).toHaveProperty('token');
    });

    it('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: 'admin@test.com',
          password: 'AnotherPass123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: 'weak@test.com',
          password: 'short',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should prevent role escalation', async () => {
      // Attempt to register as admin should fail validation
      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: 'hacker@test.com',
          password: 'SecurePass123',
          role: 'admin',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'admin@test.com',
          password: 'AdminPass123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('email', 'admin@test.com');
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'admin@test.com',
          password: 'WrongPass',
        });

      // May get 429 if rate limited, or 401 if not
      expect([401, 429]).toContain(response.status);
      
      if (response.status === 401) {
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
      }
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'user@test.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/users (Admin Only)', () => {
    it('should allow admin to get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should reject non-admin access', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Not authorized as admin');
    });
  });
});
