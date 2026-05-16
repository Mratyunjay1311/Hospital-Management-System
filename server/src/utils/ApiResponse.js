/**
 * ============================================
 * STANDARD API RESPONSE CLASS
 * ============================================
 * 
 * WHY?
 * - Every API response should have the SAME shape
 * - Frontend can always expect: { success, message, data }
 * - This makes frontend parsing simple and predictable
 * 
 * USAGE:
 *   res.status(200).json(new ApiResponse(200, data, "Patients fetched"));
 *   res.status(201).json(new ApiResponse(201, newPatient, "Patient created"));
 */

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
