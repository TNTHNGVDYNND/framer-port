import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/database.js';
import apiRoutes from './src/routes/index.js';
import { env } from './src/config/index.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

const app = express();
const PORT = env.port;

// Trust proxy (M-1/#30): an app SETTING (not middleware — req.ip resolves it
// lazily), set before serving traffic. Parsed hop count from TRUST_PROXY; unset
// → false (direct-serving) which keeps express-rate-limit's forged-XFF fail-loud
// tripwire armed. Behind a proxy, unset trust proxy means every request shares
// the proxy's IP — the per-IP authLimiter (5/15min) degenerates into ONE
// sitewide bucket, so a single attacker exhausts login for everyone.
app.set("trust proxy", env.trustProxy);

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
// Cookie parsing (M-2/#31): the auth JWT rides an HttpOnly cookie — JS can never
// read it. Mounted before routes; protect reads req.cookies.token.
app.use(cookieParser());

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
