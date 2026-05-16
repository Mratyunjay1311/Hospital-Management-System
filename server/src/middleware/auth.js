/**
 * ============================================
 * AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 * ============================================
 * 
 * TWO CONCEPTS:
 * 1. Authentication (protect): "WHO are you?" → Verify JWT token
 * 2. Authorization (authorize): "WHAT can you do?" → Check user role
 * 
 * HOW JWT AUTH WORKS:
 * 1. User logs in → server creates a JWT token → sends to client
 * 2. Client stores token → sends it in every request header
 * 3. This middleware reads the token → verifies it → attaches user to req
 * 4. If token is invalid/expired → reject the request with 401
 * 
 * ROLE-BASED ACCESS CONTROL (RBAC):
 * - Admin: Can do everything
 * - Doctor: Can manage their patients, appointments, prescriptions
 * - Receptionist: Can manage patients, appointments, billing
 * - Patient: Can view their own data only
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// ── PROTECT: Verify JWT Token ──
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Also check cookies (for remember me / httpOnly cookie auth)
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // No token found → not logged in
  if (!token) {
    throw new ApiError(401, "Not authorized. Please log in.");
  }

  // Verify token (will throw if invalid or expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find user by ID from token payload
  // .select("-password") excludes the password from the result
  const currentUser = await User.findById(decoded.id).select("-password");

  if (!currentUser) {
    throw new ApiError(401, "User belonging to this token no longer exists.");
  }

  // Attach user to request object — available in all subsequent middleware/routes
  req.user = currentUser;
  next();
});

// ── AUTHORIZE: Check User Role ──
// Usage: authorize("admin", "doctor") → only admin and doctor can access
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role '${req.user.role}' is not authorized to access this resource.`
      );
    }
    next();
  };
};
