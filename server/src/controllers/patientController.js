/**
 * ============================================
 * PATIENT CONTROLLER
 * ============================================
 * Full CRUD + search/filter/sort/pagination
 * Only users with role "patient" are managed here
 */

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ActivityLog from "../models/ActivityLog.js";

// ── GET /api/patients — List all patients with search, filter, sort, pagination ──
export const getPatients = asyncHandler(async (req, res) => {
  const { search, bloodGroup, gender, sort, page = 1, limit = 10 } = req.query;

  // Build query filter
  const filter = { role: "patient" };

  // Search by name or email
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by blood group
  if (bloodGroup) filter.bloodGroup = bloodGroup;
  if (gender) filter.gender = gender;

  // Sort options
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (sort === "name") sortOption = { name: 1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(filter);

  const patients = await User.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, {
      patients,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    }, "Patients fetched successfully")
  );
});

// ── GET /api/patients/:id — Get single patient ──
export const getPatient = asyncHandler(async (req, res) => {
  const patient = await User.findById(req.params.id).select("-password -refreshToken");

  if (!patient || patient.role !== "patient") {
    throw new ApiError(404, "Patient not found");
  }

  res.status(200).json(new ApiResponse(200, patient, "Patient fetched"));
});

// ── POST /api/patients — Create patient (by receptionist/admin) ──
export const createPatient = asyncHandler(async (req, res) => {
  const { name, email, password, phone, gender, dateOfBirth, bloodGroup, address, allergies, emergencyContact } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const patient = await User.create({
    name, email, password: password || "patient123",
    role: "patient", phone, gender, dateOfBirth, bloodGroup, address, allergies, emergencyContact,
  });

  await ActivityLog.create({
    userId: req.user._id,
    action: "CREATE_PATIENT",
    description: `Created patient: ${patient.name}`,
    targetModel: "User",
    targetId: patient._id,
  });

  const patientResponse = patient.toObject();
  delete patientResponse.password;

  res.status(201).json(new ApiResponse(201, patientResponse, "Patient created"));
});

// ── PUT /api/patients/:id — Update patient ──
export const updatePatient = asyncHandler(async (req, res) => {
  const { name, phone, gender, dateOfBirth, bloodGroup, address, allergies, emergencyContact } = req.body;

  const patient = await User.findOneAndUpdate(
    { _id: req.params.id, role: "patient" },
    { name, phone, gender, dateOfBirth, bloodGroup, address, allergies, emergencyContact },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!patient) throw new ApiError(404, "Patient not found");

  await ActivityLog.create({
    userId: req.user._id,
    action: "UPDATE_PATIENT",
    description: `Updated patient: ${patient.name}`,
    targetModel: "User",
    targetId: patient._id,
  });

  res.status(200).json(new ApiResponse(200, patient, "Patient updated"));
});

// ── DELETE /api/patients/:id — Delete patient ──
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await User.findOneAndDelete({ _id: req.params.id, role: "patient" });

  if (!patient) throw new ApiError(404, "Patient not found");

  await ActivityLog.create({
    userId: req.user._id,
    action: "DELETE_PATIENT",
    description: `Deleted patient: ${patient.name}`,
    targetModel: "User",
    targetId: patient._id,
  });

  res.status(200).json(new ApiResponse(200, null, "Patient deleted"));
});
