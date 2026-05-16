/**
 * ============================================
 * APPOINTMENT MODEL
 * ============================================
 * 
 * STATUS FLOW:
 *   Pending → Confirmed → Completed
 *                ↘ Cancelled
 * 
 * CONFLICT PREVENTION:
 * - Compound index on (doctorId + date + slot) ensures no double-booking
 * - This is enforced at the DATABASE level (not just code level)
 * - Even if two requests arrive simultaneously, MongoDB prevents duplicates
 */

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    slot: {
      type: String, // "10:00", "14:30" etc.
      required: [true, "Time slot is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["in-person", "video-consultation"],
      default: "in-person",
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    // Token number for queue management
    tokenNumber: {
      type: Number,
    },
    cancelReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ── COMPOUND INDEX: Prevent double-booking ──
// Only ONE appointment can exist for a doctor + date + slot + non-cancelled status
appointmentSchema.index(
  { doctorId: 1, date: 1, slot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $ne: "cancelled" },
    },
  }
);

// Auto-populate patient and doctor details
appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patientId",
    select: "name email phone profileImage",
  }).populate({
    path: "doctorId",
    select: "userId specialization consultationFee",
  });
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
