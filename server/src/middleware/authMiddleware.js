import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/index.js';

// M-2/#31: the auth JWT rides this HttpOnly cookie. Single constant shared with
// userController (set/clear) — keep the two sides in lockstep.
export const AUTH_COOKIE_NAME = 'token';

// Protect routes - Verify JWT token.
// Token source priority (M-2/#31): HttpOnly cookie first (browser flow); the
// Authorization: Bearer header remains as an explicit fallback for programmatic
// clients (curl/scripts with a cookie jar or an out-of-band token).
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
    token = req.cookies[AUTH_COOKIE_NAME];
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // L-7/#38: algorithm pinned to the family the app signs with — blocks
    // algorithm-confusion variants (e.g. alg:none / RS→HS key confusion).
    const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
    
    // Get user from database to include role in req.user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // M-3/#32: revocation check — strict comparison, so pre-M-3 tokens (no ver)
    // also die at deploy (one-time re-login, fail-closed).
    if (decoded.ver !== user.tokenVersion) {
      return res.status(401).json({ message: 'Session revoked' });
    }
    
    // Attach user with role to request object
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Admin only middleware - Must be used after protect
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};
