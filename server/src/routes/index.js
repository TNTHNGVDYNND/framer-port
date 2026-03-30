import express from 'express';
import * as projectController from '../controllers/projectController.js';
import * as contactController from '../controllers/contactController.js';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Project routes
router.get('/projects', projectController.getProjects);

// Contact routes
router.post('/contact', contactController.submitContactForm);

// User routes
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.get('/users/profile', protect, userController.getUserProfile);

export default router;
