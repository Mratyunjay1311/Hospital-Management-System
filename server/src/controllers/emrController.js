/**
 * ============================================
 * EMR (Electronic Medical Records) CONTROLLER
 * ============================================
 */

import MedicalRecord from "../models/MedicalRecord.js";
import Doctor from "../models/Doctor.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ActivityLog from "../models/ActivityLog.js";

// ── GET /api/emr/:patientId — Get all records for a patient ──
export const getPatientRecords = asyncHandler(async (req, res) => {
  const records = await MedicalRecord.find({ patientId: req.params.patientId })
    .populate("doctorId", "userId specialization")
    .populate("appointmentId", "date slot status")
    .sort({ visitDate: -1 });

  res.status(200).json(new ApiResponse(200, records, "Medical records fetched"));
});

// ── GET /api/emr/record/:id — Get single record ──
export const getRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id)
    .populate("doctorId", "userId specialization")
    .populate("patientId", "name email phone dateOfBirth gender bloodGroup");
  if (!record) throw new ApiError(404, "Record not found");
  res.status(200).json(new ApiResponse(200, record, "Record fetched"));
});

// ── POST /api/emr — Create medical record ──
export const createRecord = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, diagnosis, symptoms, treatmentNotes, testReports, vitals, followUpDate } = req.body;

  const doctor = await Doctor.findOne({ userId: req.user._id });
  if (!doctor) throw new ApiError(403, "Only doctors can create medical records");

  const record = await MedicalRecord.create({
    patientId, doctorId: doctor._id, appointmentId, diagnosis, symptoms, treatmentNotes, testReports, vitals, followUpDate,
  });

  await ActivityLog.create({
    userId: req.user._id,
    action: "CREATE_RECORD",
    description: `Medical record created for patient`,
    targetModel: "MedicalRecord",
    targetId: record._id,
  });

  res.status(201).json(new ApiResponse(201, record, "Medical record created"));
});

// ── PUT /api/emr/record/:id — Update record ──
export const updateRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!record) throw new ApiError(404, "Record not found");
  res.status(200).json(new ApiResponse(200, record, "Record updated"));
});
