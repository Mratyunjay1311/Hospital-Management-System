/**
 * ============================================
 * PRESCRIPTION MODEL
 * ============================================
 * 
 * DESIGN:
 * - Each prescription belongs to a patient, written by a doctor
 * - Contains an array of medicines with dosage details
 * - Can be downloaded as PDF from the frontend
 * - Linked to an appointment for context
 */

import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    medicines: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        dosage: {
          type: String, // e.g., "500mg"
          required: true,
        },
        frequency: {
          type: String, // e.g., "Twice daily", "After meals"
          required: true,
        },
        duration: {
          type: String, // e.g., "7 days", "2 weeks"
          required: true,
        },
        instructions: {
          type: String,
          default: "",
        },
      },
    ],
    diagnosis: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    nextVisitDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate references
prescriptionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patientId",
    select: "name email phone dateOfBirth gender",
  }).populate({
    path: "doctorId",
    select: "userId specialization",
  });
  next();
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
