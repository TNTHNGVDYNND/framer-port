import dotenv from 'dotenv';
dotenv.config();

export const env = {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
};
