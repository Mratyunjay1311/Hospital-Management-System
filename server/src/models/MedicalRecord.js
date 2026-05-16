/**
 * ============================================
 * MEDICAL RECORD (EMR) MODEL
 * ============================================
 * 
 * WHY EMR?
 * - Electronic Medical Records are the CORE of any healthcare system
 * - Tracks complete patient history: diagnoses, treatments, test reports
 * - Linked to specific appointments (each visit creates a record)
 * - Only doctors can create/edit records (enforced in routes)
 */

import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
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
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
      trim: true,
    },
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    treatmentNotes: {
      type: String,
      trim: true,
      default: "",
    },
    testReports: [
      {
        testName: String,
        result: String,
        fileUrl: String, // Cloudinary URL for uploaded report
        date: { type: Date, default: Date.now },
      },
    ],
    vitals: {
      bloodPressure: String,
      heartRate: String,
      temperature: String,
      weight: String,
      height: String,
      oxygenSaturation: String,
    },
    followUpDate: {
      type: Date,
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast patient history queries
medicalRecordSchema.index({ patientId: 1, visitDate: -1 });

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;
