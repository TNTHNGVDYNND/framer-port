// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging (in development)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: messages,
    });
  }

  if (err.name === 'CastError') {
    // Mongoose cast error (e.g., invalid ObjectId)
    return res.status(400).json({
      error: 'Invalid ID format',
      details: [`Resource not found with id: ${err.value}`],
    });
  }

  if (err.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Field Error',
      details: [`${field} already exists. Please use a different value.`],
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      details: ['Your token is invalid. Please log in again.'],
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      details: ['Your token has expired. Please log in again.'],
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler for undefined routes
export const notFound = (req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.originalUrl}`,
  });
};
