// Set test environment variables BEFORE any imports
process.env.JWT_SECRET = 'test-secret-key-for-jwt-signing';
process.env.JWT_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

// Now import dependencies
import 'dotenv/config';
import mongoose from 'mongoose';

// Connect to test database before all tests
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    const testUri = process.env.MONGO_URI?.replace(/\/[^/]*$/, '/test-framer-port') || 
                    'mongodb://localhost:27017/test-framer-port';
    await mongoose.connect(testUri);
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Clean up after each test
afterEach(() => {
  // Clear any mocks if needed
});
