/**
 * ============================================
 * PRESCRIPTION CONTROLLER
 * ============================================
 */

import Prescription from "../models/Prescription.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ActivityLog from "../models/ActivityLog.js";

// ── GET /api/prescriptions ──
export const getPrescriptions = asyncHandler(async (req, res) => {
  const { patientId, doctorId, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (patientId) filter.patientId = patientId;
  if (doctorId) filter.doctorId = doctorId;
  if (req.user.role === "patient") filter.patientId = req.user._id;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Prescription.countDocuments(filter);
  const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

  res.status(200).json(new ApiResponse(200, {
    prescriptions,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  }, "Prescriptions fetched"));
});

// ── GET /api/prescriptions/:id ──
export const getPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) throw new ApiError(404, "Prescription not found");
  res.status(200).json(new ApiResponse(200, prescription, "Prescription fetched"));
});

// ── POST /api/prescriptions ──
export const createPrescription = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, medicines, diagnosis, notes, nextVisitDate } = req.body;

  // Find doctor profile for the logged-in doctor user
  const Doctor = (await import("../models/Doctor.js")).default;
  const doctor = await Doctor.findOne({ userId: req.user._id });
  if (!doctor) throw new ApiError(403, "Only doctors can create prescriptions");

  const prescription = await Prescription.create({
    patientId, doctorId: doctor._id, appointmentId, medicines, diagnosis, notes, nextVisitDate,
  });

  const populated = await Prescription.findById(prescription._id);

  await ActivityLog.create({
    userId: req.user._id,
    action: "CREATE_PRESCRIPTION",
    description: `Created prescription for patient`,
    targetModel: "Prescription",
    targetId: prescription._id,
  });

  res.status(201).json(new ApiResponse(201, populated, "Prescription created"));
});

// ── DELETE /api/prescriptions/:id ──
export const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findByIdAndDelete(req.params.id);
  if (!prescription) throw new ApiError(404, "Prescription not found");
  res.status(200).json(new ApiResponse(200, null, "Prescription deleted"));
});
