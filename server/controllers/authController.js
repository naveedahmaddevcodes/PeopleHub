import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role, department, joinDate } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please add name, email and password" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (role defaults to 'employee' if not provided)
    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: role || "employee",
      department: department || null,
      joinDate: joinDate || Date.now(),
    });

    if (user) {
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set refresh token cookie
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        joinDate: user.joinDate,
        accessToken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please add email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      setRefreshTokenCookie(res, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        joinDate: user.joinDate,
        accessToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Refresh access token using refresh cookie
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh cookie)
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      joinDate: user.joinDate,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// @desc    Logout user / clear refresh cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  clearRefreshTokenCookie(res);
  res.json({ message: "Logged out successfully" });
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
