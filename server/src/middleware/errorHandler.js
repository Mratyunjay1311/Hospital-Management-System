/**
 * ============================================
 * GLOBAL ERROR HANDLER MIDDLEWARE
 * ============================================
 * 
 * WHY?
 * - Centralized error handling = ONE place to format all errors
 * - Different errors need different treatment:
 *   - Validation errors → 400
 *   - Duplicate key (email exists) → 409
 *   - Invalid ObjectId → 400
 *   - Our custom ApiError → use its statusCode
 * 
 * HOW IT WORKS:
 * - Express knows this is an error handler because it has 4 params (err, req, res, next)
 * - Any error thrown/passed to next(error) in any route lands here
 * - We format it nicely and send a consistent JSON response
 */

import ApiError from "../utils/ApiError.js";

// Handle 404 — No route matched
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers (in development only)
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  // ── Mongoose Bad ObjectId (invalid MongoDB ID format) ──
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ID: ${err.value}`;
    error = new ApiError(400, message);
  }

  // ── Mongoose Duplicate Key Error (e.g., email already exists) ──
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for '${field}'. This ${field} already exists.`;
    error = new ApiError(409, message);
  }

  // ── Mongoose Validation Error (required fields missing, etc.) ──
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = `Validation failed: ${messages.join(", ")}`;
    error = new ApiError(400, message);
  }

  // ── JWT Errors ──
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please log in again.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired. Please log in again.");
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
