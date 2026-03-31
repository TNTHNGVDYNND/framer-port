import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { connectDB } from './src/config/database.js';
import apiRoutes from './src/routes/index.js';
import { env } from './src/config/index.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

const app = express();
const PORT = env.port;

// Security Middleware
app.use(helmet());

// Response Compression (gzip)
app.use(compression());

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Concise colored output for dev
} else {
  app.use(morgan('combined')); // Standard Apache combined format for production
}

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running with ES Modules!');
});

// Error Handling (must be last)
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
