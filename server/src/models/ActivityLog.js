/**
 * ============================================
 * ACTIVITY LOG MODEL
 * ============================================
 * 
 * WHY?
 * - Audit trail: track WHO did WHAT and WHEN
 * - Required in healthcare for compliance (HIPAA-like requirements)
 * - Great for security monitoring and debugging
 * - Impressive feature for interviews: shows you understand audit logging
 */

import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGOUT",
        "CREATE_PATIENT",
        "UPDATE_PATIENT",
        "DELETE_PATIENT",
        "CREATE_APPOINTMENT",
        "UPDATE_APPOINTMENT",
        "CANCEL_APPOINTMENT",
        "CREATE_PRESCRIPTION",
        "CREATE_BILLING",
        "UPDATE_BILLING",
        "CREATE_RECORD",
        "UPDATE_INVENTORY",
        "UPLOAD_FILE",
        "OTHER",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    targetModel: {
      type: String, // "Patient", "Appointment", etc.
      default: "",
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the affected record
    },
    ipAddress: {
      type: String,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Any extra data
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries by user and date
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
