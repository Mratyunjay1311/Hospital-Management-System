/**
 * ============================================
 * ASYNC HANDLER WRAPPER
 * ============================================
 * 
 * WHY?
 * - Every controller uses async/await for database operations
 * - Without this, you'd need try/catch in EVERY controller function
 * - This wrapper catches errors automatically and passes them to errorHandler
 * 
 * WITHOUT asyncHandler (ugly, repetitive):
 *   const getPatients = async (req, res) => {
 *     try {
 *       const patients = await Patient.find();
 *       res.json(patients);
 *     } catch (error) {
 *       res.status(500).json({ error: error.message }); // repeated everywhere!
 *     }
 *   };
 * 
 * WITH asyncHandler (clean):
 *   const getPatients = asyncHandler(async (req, res) => {
 *     const patients = await Patient.find();
 *     res.json(patients);
 *   });
 *   // Errors automatically caught and sent to error middleware!
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
