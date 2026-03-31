import { body, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validate user registration
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['user'])
    .withMessage('Invalid role specified'),
  handleValidationErrors,
];

// Validate user login
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Validate contact form submission
export const validateContact = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(), // Sanitize to prevent XSS
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .escape(), // Sanitize to prevent XSS
  handleValidationErrors,
];

// Validate project creation/update
export const validateProject = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .escape(),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL for the image'),
  body('projectUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL for the project'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items'),
  body('category')
    .optional()
    .isIn(['Frontend', 'Backend', 'MERN', 'APIs', 'Experiments', 'Other'])
    .withMessage('Invalid category specified'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  handleValidationErrors,
];
