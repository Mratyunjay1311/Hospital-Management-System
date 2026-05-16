/**
 * ============================================
 * AUTH CONTROLLER
 * ============================================
 * 
 * HANDLES:
 * - Register (create new user + hash password + return JWT)
 * - Login (verify credentials + return JWT + set cookie)
 * - Get current user profile
 * - Logout (clear cookie)
 * - Refresh token
 * 
 * TOKEN STRATEGY:
 * - Access Token: Short-lived (7d), sent in response body
 * - Refresh Token: Long-lived (30d), stored in httpOnly cookie
 * - Frontend stores access token in memory (not localStorage for security)
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ActivityLog from "../models/ActivityLog.js";

// ── Helper: Generate JWT Access Token ──
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ── Helper: Generate JWT Refresh Token ──
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// ── Helper: Set refresh token as httpOnly cookie ──
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true, // JavaScript cannot access this cookie (prevents XSS)
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

// ============================================
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ============================================
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, gender } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Create user (password is hashed automatically by pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    role: role || "patient",
    phone,
    gender,
  });

  // If registering as doctor, create doctor profile too
  if (role === "doctor") {
    await Doctor.create({
      userId: user._id,
      specialization: req.body.specialization || "General Physician",
      consultationFee: req.body.consultationFee || 500,
      experience: req.body.experience || 0,
    });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token as cookie
  setRefreshTokenCookie(res, refreshToken);

  // Log activity
  await ActivityLog.create({
    userId: user._id,
    action: "LOGIN",
    description: `New user registered: ${user.name} (${user.role})`,
  });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  res.status(201).json(
    new ApiResponse(201, {
      user: userResponse,
      accessToken,
    }, "Registration successful")
  );
});

// ============================================
// @route   POST /api/auth/login
// @desc    Login user & return JWT
// @access  Public
// ============================================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Find user and INCLUDE password (normally excluded by select: false)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated. Contact admin.");
  }

  // Verify password using the model's comparePassword method
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set cookie
  setRefreshTokenCookie(res, refreshToken);

  // Log activity
  await ActivityLog.create({
    userId: user._id,
    action: "LOGIN",
    description: `User logged in: ${user.name}`,
  });

  // Remove sensitive fields
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  res.status(200).json(
    new ApiResponse(200, {
      user: userResponse,
      accessToken,
    }, "Login successful")
  );
});

// ============================================
// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
// ============================================
export const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, user, "User profile fetched")
  );
});

// ============================================
// @route   PUT /api/auth/profile
// @desc    Update current user profile
// @access  Private
// ============================================
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, gender, dateOfBirth, bloodGroup, address, allergies, emergencyContact } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, gender, dateOfBirth, bloodGroup, address, allergies, emergencyContact },
    { new: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, user, "Profile updated successfully")
  );
});

// ============================================
// @route   POST /api/auth/logout
// @desc    Logout user & clear cookie
// @access  Private
// ============================================
export const logout = asyncHandler(async (req, res) => {
  // Clear refresh token from database
  await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

  // Log activity
  await ActivityLog.create({
    userId: req.user._id,
    action: "LOGOUT",
    description: `User logged out: ${req.user.name}`,
  });

  // Clear cookie
  res.clearCookie("refreshToken");

  res.status(200).json(
    new ApiResponse(200, null, "Logged out successfully")
  );
});

// ============================================
// @route   POST /api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public (but needs valid refresh token)
// ============================================
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, "No refresh token provided");
  }

  // Verify refresh token
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  // Find user with this refresh token
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // Generate new access token
  const accessToken = generateAccessToken(user._id);

  res.status(200).json(
    new ApiResponse(200, { accessToken }, "Token refreshed")
  );
});
