/**
 * ============================================
 * VALIDATION MIDDLEWARE
 * ============================================
 * 
 * WHY?
 * - Never trust data from the client — ALWAYS validate on the server
 * - Using Zod for schema validation (type-safe, great error messages)
 * - This middleware takes a Zod schema and validates req.body against it
 * 
 * USAGE in routes:
 *   import { validate } from "../middleware/validate.js";
 *   import { createPatientSchema } from "../validators/patientValidator.js";
 *   router.post("/", validate(createPatientSchema), createPatient);
 */

import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    // Parse and validate request body against the Zod schema
    // .parse() throws ZodError if validation fails
    schema.parse(req.body);
    next();
  } catch (error) {
    // Extract user-friendly error messages from Zod
    const errorMessages = error.errors.map(
      (err) => `${err.path.join(".")}: ${err.message}`
    );

    throw new ApiError(400, `Validation failed: ${errorMessages.join(", ")}`);
  }
};
