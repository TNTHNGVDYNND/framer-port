// Set environment variables BEFORE any imports that might use them
process.env.JWT_SECRET = 'test-secret-key-for-jwt-signing';
process.env.JWT_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import apiRoutes from '../../routes/index.js';
import User from '../../models/User.js';

// Create test express app (W3: cookieParser mounted like production — the
// cookie-first branch of protect is exercised by the roundtrip tests below)
const app = express();
app.use(express.json());
app.use(cookieParser());
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
    adminToken = jwt.sign({ id: adminUser._id, role: 'admin', ver: adminUser.tokenVersion }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Create regular user
    regularUser = await User.create({
      email: 'user@test.com',
      password: 'UserPass123',
      role: 'user',
    });
    userToken = jwt.sign({ id: regularUser._id, role: 'user', ver: regularUser.tokenVersion }, process.env.JWT_SECRET, {
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
      // M-2/#31: token no longer in the body — HttpOnly cookie instead
      expect(response.body).not.toHaveProperty('token');
      const cookieHeader = response.headers['set-cookie']?.[0] || '';
      expect(cookieHeader).toMatch(/token=/);
      expect(cookieHeader).toMatch(/HttpOnly/i);
      expect(cookieHeader).toMatch(/SameSite=Strict/i);
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
      // M-2/#31: token no longer in the body — HttpOnly cookie instead
      expect(response.body).not.toHaveProperty('token');
      const cookieHeader = response.headers['set-cookie']?.[0] || '';
      expect(cookieHeader).toMatch(/token=/);
      expect(cookieHeader).toMatch(/HttpOnly/i);
      expect(cookieHeader).toMatch(/SameSite=Strict/i);
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

    // W3: cookie-first protect branch + full login→cookie→protected roundtrip
    it('should authenticate via the HttpOnly cookie (login → profile roundtrip)', async () => {
      const login = await request(app)
        .post('/api/users/login')
        .send({ email: 'admin@test.com', password: 'AdminPass123' })
        .expect(200);

      const cookies = login.headers['set-cookie'] || [];
      const authCookie = cookies.find((c) => c.startsWith('token='));
      expect(authCookie).toBeDefined();
      expect(authCookie).toMatch(/HttpOnly/i);
      expect(authCookie).toMatch(/SameSite=Strict/i);

      const cookieHeader = cookies.map((c) => c.split(';')[0]).join('; ');
      const profile = await request(app)
        .get('/api/users/profile')
        .set('Cookie', cookieHeader)
        .expect(200);
      expect(profile.body).toHaveProperty('email', 'admin@test.com');
    });

    it('should reject the cookie path with no cookie (protect 401)', async () => {
      const response = await request(app).get('/api/users/profile').expect(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/:id/force-logout (M-3/#32)', () => {
    it('should revoke all sessions of the target user (admin bumps tokenVersion)', async () => {
      const response = await request(app)
        .post(`/api/users/${regularUser._id}/force-logout`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('tokenVersion', 1);

      // The pre-bump token must now be rejected
      const rejected = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);
      expect(rejected.body).toHaveProperty('message', 'Session revoked');
    });

    it('should reject non-admin force-logout attempts', async () => {
      const response = await request(app)
        .post(`/api/users/${adminUser._id}/force-logout`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
      expect(response.body).toHaveProperty('message', 'Not authorized as admin');
    });

    it('should 404 on unknown user id', async () => {
      const response = await request(app)
        .post('/api/users/000000000000000000000000/force-logout')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should reject pre-M-3 tokens (no ver claim) — fail-closed deploy', async () => {
      const legacyToken = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${legacyToken}`)
        .expect(401);
      expect(response.body).toHaveProperty('message', 'Session revoked');
    });
  });

  describe('POST /api/users/logout', () => {
    it('should clear the auth cookie (W3: was zero-coverage)', async () => {
      const response = await request(app).post('/api/users/logout').expect(200);
      expect(response.body).toHaveProperty('message', 'Logged out');

      const cookies = response.headers['set-cookie'] || [];
      const cleared = cookies.find((c) => c.startsWith('token='));
      expect(cleared).toBeDefined();
      // expired/past-dated clear directive, POST-only
      expect(cleared).toMatch(/token=;( |$)|Expires=Thu, 01 Jan 1970/);
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

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
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
