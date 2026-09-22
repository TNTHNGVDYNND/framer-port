import express from 'express';
import mongoose from 'mongoose';
import * as projectController from '../controllers/projectController.js';
import * as contactController from '../controllers/contactController.js';
import * as userController from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { authLimiter, contactLimiter, apiLimiter } from '../middleware/rateLimiter.js';
import { validateLogin, validateContact, validateProject } from '../middleware/validation.js';
import { cacheMiddleware, clearCache } from '../middleware/cache.js';

const router = express.Router();

// Apply general API rate limiting to all routes
router.use(apiLimiter);

// ===========================================
// HEALTH CHECK
// ===========================================

// Health check endpoints (L-3/#35 split):
//   GET /health           — PUBLIC liveness: minimal shape, zero internals.
//                           For LBs/monitors/compose (the api healthcheck spiders this).
//                           Always 200 while the process serves — DB readiness is NOT
//                           this endpoint's job (startup ordering is compose's
//                           depends_on + mongo healthcheck; runtime depth is admin's).
//   GET /health/detailed   — ADMIN readiness/depth: db state, memory, uptime,
//                           version, environment. protect + adminOnly.
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.get('/health/detailed', protect, adminOnly, (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    }[dbState] || 'unknown';

  const memory = process.memoryUsage();

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    memory: {
      used: Math.round(memory.heapUsed / 1024 / 1024),
      total: Math.round(memory.heapTotal / 1024 / 1024),
      unit: 'MB',
    },
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===========================================
// PUBLIC ENDPOINTS
// ===========================================

// Project routes - Public with caching
// GET cached for 10 minutes (600s), write operations clear cache
router.get('/projects', cacheMiddleware(600), projectController.getProjects);
router.get('/projects/:id', cacheMiddleware(300), projectController.getProjectById);

// Contact form - Public (with stricter rate limiting)
router.post('/contact', contactLimiter, validateContact, contactController.submitContactForm);

// User authentication - Public (with auth rate limiting)
router.post('/users/login', authLimiter, validateLogin, userController.loginUser);
router.post('/users/logout', userController.logoutUser);

// ===========================================
// PROTECTED ENDPOINTS (Authentication Required)
// ===========================================

// User profile - Authenticated users only
router.get('/users/profile', protect, userController.getUserProfile);

// ===========================================
// ADMIN ONLY ENDPOINTS (Admin Role Required)
// ===========================================

// Project management - Admin only
// Write operations clear cache for consistency
router.post(
  '/projects',
  protect,
  adminOnly,
  validateProject,
  (req, res, next) => {
    clearCache('/projects');
    next();
  },
  projectController.createProject
);

router.put(
  '/projects/:id',
  protect,
  adminOnly,
  validateProject,
  (req, res, next) => {
    clearCache('/projects');
    clearCache(`/projects/${req.params.id}`);
    next();
  },
  projectController.updateProject
);

router.delete(
  '/projects/:id',
  protect,
  adminOnly,
  (req, res, next) => {
    clearCache('/projects');
    clearCache(`/projects/${req.params.id}`);
    next();
  },
  projectController.deleteProject
);

// Contact message management - Admin only
// GET cached for 2 minutes (120s), write operations clear cache
router.get(
  '/contact/messages',
  protect,
  adminOnly,
  cacheMiddleware(120),
  contactController.getAllContactMessages
);

router.patch(
  '/contact/:id/read',
  protect,
  adminOnly,
  (req, res, next) => {
    clearCache('/contact');
    next();
  },
  contactController.markMessageAsRead
);

router.delete(
  '/contact/:id',
  protect,
  adminOnly,
  (req, res, next) => {
    clearCache('/contact');
    next();
  },
  contactController.deleteContactMessage
);

// User management - Admin only
// User list cached for 5 minutes (300s)
router.get('/users', protect, adminOnly, cacheMiddleware(300), userController.getAllUsers);
router.post('/users/:id/force-logout', protect, adminOnly, userController.forceLogoutUser);

export default router;
