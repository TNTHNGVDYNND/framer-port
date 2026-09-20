// import dotenv from 'dotenv';
// dotenv.config();

// export const env = {
//   mongoUri: process.env.MONGO_URI,
//   port: process.env.PORT || 5000,
//   jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
//   jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
//   admin: {
//     email: process.env.ADMIN_EMAIL,
//     password: process.env.ADMIN_PASSWORD,
//   },
// };
// line 7 — process.env.JWT_SECRET || 'dev-secret-change-in-production'.
// If JWT_SECRET is unset or empty string (empty is falsy, so the || fires), the app silently signs and verifies every JWT with a string that's published in your public repo. Anyone who reads the repo can mint valid tokens.
// The deeper sin: it fails open — misconfiguration produces a running app with broken security, not a loud error. MONGO_URI has the adjacent weakness (no fallback, but also no check — it dies later, confusingly, inside the DB connect).
// == The fix ==
// — a fail-closed boot gate at the earliest point (config/index.js is imported before anything else, so the check fires before the server listens, before any token is ever signed):
//
import dotenv from "dotenv";
dotenv.config();

const required = (name) => {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(
      `[boot] Missing required env var: ${name} — refusing to start (fail-closed)`,
    );
    process.exit(1);
  }
  return value;
};

export const env = {
  mongoUri: required("MONGO_URI"),
  port: process.env.PORT || 5000,
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
};
