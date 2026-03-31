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
import ContactMessage from '../../models/ContactMessage.js';
import User from '../../models/User.js';

// Create test express app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Contact Controller Integration Tests', () => {
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    // Clear data before each test
    await ContactMessage.deleteMany({});
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
  });

  describe('POST /api/contact', () => {
    it('should submit contact form successfully', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message that is at least 10 characters long',
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('id');
    });

    it('should reject missing name', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          email: 'john@example.com',
          message: 'This is a test message that is at least 10 characters long',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject short message', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Short',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/contact/messages (Admin Only)', () => {
    beforeEach(async () => {
      // Create test messages
      await ContactMessage.create([
        { name: 'User 1', email: 'user1@test.com', message: 'Message one is long enough', read: true },
        { name: 'User 2', email: 'user2@test.com', message: 'Message two is long enough', read: false },
      ]);
    });

    it('should allow admin to get all messages', async () => {
      const response = await request(app)
        .get('/api/contact/messages')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('should reject non-admin access', async () => {
      const regularUser = await User.create({
        email: 'user@test.com',
        password: 'UserPass123',
        role: 'user',
      });
      const userToken = jwt.sign({ id: regularUser._id, role: 'user' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      const response = await request(app)
        .get('/api/contact/messages')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Not authorized as admin');
    });
  });

  describe('PATCH /api/contact/:id/read', () => {
    let messageId;

    beforeEach(async () => {
      const message = await ContactMessage.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message that is at least 10 characters long',
        read: false,
      });
      messageId = message._id.toString();
    });

    it('should mark message as read', async () => {
      const response = await request(app)
        .patch(`/api/contact/${messageId}/read`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ read: true })
        .expect(200);

      expect(response.body.data.read).toBe(true);
    });

    it('should reject non-existent message', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .patch(`/api/contact/${fakeId}/read`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Message not found');
    });
  });

  describe('DELETE /api/contact/:id', () => {
    let messageId;

    beforeEach(async () => {
      const message = await ContactMessage.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message that is at least 10 characters long',
      });
      messageId = message._id.toString();
    });

    it('should delete message', async () => {
      const response = await request(app)
        .delete(`/api/contact/${messageId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Message deleted successfully');

      const deleted = await ContactMessage.findById(messageId);
      expect(deleted).toBeNull();
    });
  });
});
