/**
 * ============================================
 * CUSTOM API ERROR CLASS
 * ============================================
 * 
 * WHY A CUSTOM ERROR CLASS?
 * - JavaScript's built-in Error only has a message
 * - We need HTTP status codes (400, 401, 404, 500)
 * - We need consistent error responses across the entire API
 * - This is the STANDARD pattern at companies like Google, Stripe, etc.
 * 
 * USAGE:
 *   throw new ApiError(404, "Patient not found");
 *   throw new ApiError(400, "Invalid email format");
 *   throw new ApiError(401, "Not authorized");
 */

class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    // Preserve stack trace for debugging
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
