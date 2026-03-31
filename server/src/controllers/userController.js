import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/index.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    next(error);
  }
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
