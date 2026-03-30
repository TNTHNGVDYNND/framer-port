import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/database.js';
import apiRoutes from './src/routes/index.js';
import { env } from './src/config/index.js';

const app = express();
const PORT = env.port;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running with ES Modules!');
});

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

startServer();
