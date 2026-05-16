/**
 * ============================================
 * DOCTOR MODEL
 * ============================================
 * 
 * WHY SEPARATE FROM USER?
 * - A Doctor IS a User, but has extra fields (specialization, fees, availability)
 * - We link Doctor to User via userId (reference/population pattern)
 * - This is called "data normalization" — no duplicate data
 * 
 * AVAILABILITY DESIGN:
 * - Each day of the week has an array of time slots
 * - This allows flexible scheduling (different hours on different days)
 * - Frontend reads this to show available booking slots
 */

import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      // Common medical specializations
      enum: [
        "General Physician",
        "Cardiologist",
        "Dermatologist",
        "Neurologist",
        "Orthopedic",
        "Pediatrician",
        "Gynecologist",
        "ENT Specialist",
        "Ophthalmologist",
        "Psychiatrist",
        "Dentist",
        "Surgeon",
        "Urologist",
        "Oncologist",
        "Radiologist",
        "Other",
      ],
    },
    qualification: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: Number, // Years of experience
      default: 0,
      min: [0, "Experience cannot be negative"],
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Fee cannot be negative"],
    },
    // Availability: which days and time slots the doctor is available
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        slots: [
          {
            type: String, // Format: "HH:MM" e.g., "09:00", "14:30"
          },
        ],
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Populate user data automatically when querying doctors
doctorSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "name email phone profileImage gender",
  });
  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
