import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { env } from "../config/index.js";
import { AUTH_COOKIE_NAME } from "../middleware/authMiddleware.js";

// Timing side-channel dummy (drill L-7/#38 bundle, flagged in the #44 review):
// login's user-absent path used to return before any bcrypt work — response
// time distinguished registered emails. The dummy hash matches the real cost
// factor (12); the absent-user path now burns the same compare before the
// identical 401. Value is FIXED (hash of a fixed string) — it is never compared
// against successfully, it only costs time.
const DUMMY_HASH = bcrypt.hashSync(
  "timing-equalizer-dummy-password",
  12,
);

const generateToken = (id, role, tokenVersion) => {
  // M-3/#32: `ver` is the revocation epoch — protect rejects any token whose ver
  // no longer matches the user's tokenVersion (bumped on force-logout / password
  // change). Strict comparison: pre-M-3 tokens (no ver) die at deploy — one-time
  // re-login, fail-closed by design.
  return jwt.sign({ id, role, ver: tokenVersion }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

// M-2/#31: the token rides an HttpOnly + SameSite=Strict cookie — XSS cannot read
// it (localStorage could). Deliberately a SESSION cookie (no maxAge): the browser
// drops it on close, and the JWT's own expiry bounds server-side validity anyway.
// `secure` flips on in production (TLS behind the proxy). The token is NO LONGER
// returned in the response body — the body copy was the XSS-readable channel.
const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.isProduction,
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // Timing-equalize with the user-present path: same bcrypt cost, same 401.
      await bcrypt.compare(password, DUMMY_HASH);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role, user.tokenVersion);
    setAuthCookie(res, token);

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout — clear the auth cookie (M-2/#31)
// @route   POST /api/users/logout
// @access  Public (idempotent)
export const logoutUser = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.isProduction,
  });
  res.json({ message: "Logged out" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Force-logout all sessions of a user (M-3/#32) — bumps tokenVersion,
// invalidating every outstanding token/cookie for that user at next request.
// @route   POST /api/users/:id/force-logout
// @access  Private/Admin
export const forceLogoutUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { tokenVersion: 1 } },
      { new: true, runValidators: true },
    ).select("email role tokenVersion");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: `All sessions revoked for ${user.email}`,
      data: { email: user.email, role: user.role, tokenVersion: user.tokenVersion },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};
