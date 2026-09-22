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
    throw new Error(
      `[boot] Missing required env var: ${name} — refusing to start (fail-closed)`,
    );
  }
  return value.trim();
};

// == Why throw, not process.exit(1) (production-grade rationale) ==
// An earlier draft of this gate called process.exit(1) directly. It works, but a
// config module shouldn't own process lifecycle:
//   1. Responsibility: config validates and reports; the ENTRY POINT (server.js)
//      decides how the process dies. Node's default for an unhandled module error
//      is still exit-nonzero — the fail-closed guarantee is identical.
//   2. Testability: with exit(1), the first broken-env import kills the ENTIRE
//      jest runner. With throw, each suite fails individually with this message —
//      the runner survives to report everything.
//   3. Future optionality: server.js may one day wrap boot in try/catch to format
//      failures, run cleanup, or exit with a specific code — throw enables that;
//      exit(1) forecloses it.
// Rule of thumb: libraries/modules throw; applications/entry-points exit.

export const env = {
  mongoUri: required("MONGO_URI"),
  port: process.env.PORT || 5000,
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  // Proxy hops to trust for X-Forwarded-* (M-1/#30). Parsed, never passed raw:
  // dotenv delivers strings, and Express's proxyaddr compiles a bare "1" as an
  // IPv4 subnet (0.0.0.1/32) — silently keeping req.ip = proxy IP, i.e. the
  // exact DoS this setting exists to fix. Contract (review FAIL H1/H2):
  //   integer >= 0  → hop count (behind N proxies, set N)
  //   unset/empty   → false (Express default) — direct-serving, and keeps
  //                   express-rate-limit's forged-XFF fail-loud tripwire armed
  //   anything else → [boot] throw (fail-closed, like required() above)
  trustProxy: (() => {
    const raw = process.env.TRUST_PROXY;
    if (raw === undefined || raw.trim() === "") return false;
    const n = Number.parseInt(raw, 10);
    if (!Number.isInteger(n) || n < 0) {
      throw new Error(
        `[boot] TRUST_PROXY must be a non-negative integer hop count (got "${raw}") — refusing to start (fail-closed)`,
      );
    }
    return n;
  })(),
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
};
