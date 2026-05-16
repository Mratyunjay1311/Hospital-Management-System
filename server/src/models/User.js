/**
 * ============================================
 * USER MODEL
 * ============================================
 * 
 * WHY THIS DESIGN?
 * - Central user model for ALL roles (Admin, Doctor, Receptionist, Patient)
 * - "role" field determines what the user can do (RBAC)
 * - Password is hashed BEFORE saving (pre-save hook)
 * - Password is NEVER returned in queries (select: false)
 * 
 * SECURITY:
 * - bcrypt hashing with 12 salt rounds (industry standard)
 * - comparePassword method for login verification
 * - Email uniqueness enforced at database level
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // NEVER include password in query results by default
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "receptionist", "patient"],
      default: "patient",
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    profileImage: {
      type: String, // Cloudinary URL
      default: "",
    },
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// ── PRE-SAVE HOOK: Hash password before saving ──
// This runs automatically every time a user is saved
userSchema.pre("save", async function (next) {
  // Only hash the password if it was modified (or is new)
  // Without this check, password gets re-hashed on every save!
  if (!this.isModified("password")) return next();

  // Hash password with bcrypt (12 salt rounds)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── INSTANCE METHOD: Compare password for login ──
// Usage: const isMatch = await user.comparePassword("plaintext123");
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
