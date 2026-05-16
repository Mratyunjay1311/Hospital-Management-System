/**
 * ============================================
 * APPOINTMENT CONTROLLER
 * ============================================
 * Handles booking, status management, conflict prevention, and queue tokens
 */

import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ActivityLog from "../models/ActivityLog.js";

// ── GET /api/appointments — List appointments with filters ──
export const getAppointments = asyncHandler(async (req, res) => {
  const { status, doctorId, patientId, date, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (doctorId) filter.doctorId = doctorId;
  if (patientId) filter.patientId = patientId;

  // If user is a patient, only show their own appointments
  if (req.user.role === "patient") {
    filter.patientId = req.user._id;
  }

  // Filter by date range
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Appointment.countDocuments(filter);

  const appointments = await Appointment.find(filter)
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json(
    new ApiResponse(200, {
      appointments,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    }, "Appointments fetched")
  );
});

// ── GET /api/appointments/:id — Get single appointment ──
export const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, "Appointment not found");
  res.status(200).json(new ApiResponse(200, appointment, "Appointment fetched"));
});

// ── POST /api/appointments — Book new appointment ──
export const createAppointment = asyncHandler(async (req, res) => {
  const { patientId, doctorId, date, slot, type, reason } = req.body;

  // Verify doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // Check for conflict (same doctor + date + slot)
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const conflict = await Appointment.findOne({
    doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    slot,
    status: { $ne: "cancelled" },
  });

  if (conflict) {
    throw new ApiError(409, "This time slot is already booked. Please choose another slot.");
  }

  // Generate token number for the day
  const todayCount = await Appointment.countDocuments({
    doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  const appointment = await Appointment.create({
    patientId: patientId || req.user._id,
    doctorId,
    date: new Date(date),
    slot,
    type: type || "in-person",
    reason,
    tokenNumber: todayCount + 1,
  });

  // Re-fetch with populated fields
  const populatedAppointment = await Appointment.findById(appointment._id);

  await ActivityLog.create({
    userId: req.user._id,
    action: "CREATE_APPOINTMENT",
    description: `Booked appointment for ${date} at ${slot}`,
    targetModel: "Appointment",
    targetId: appointment._id,
  });

  res.status(201).json(new ApiResponse(201, populatedAppointment, "Appointment booked successfully"));
});

// ── PATCH /api/appointments/:id/status — Update appointment status ──
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, cancelReason, notes } = req.body;

  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const updateData = { status };
  if (cancelReason) updateData.cancelReason = cancelReason;
  if (notes) updateData.notes = notes;

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, { new: true });

  if (!appointment) throw new ApiError(404, "Appointment not found");

  await ActivityLog.create({
    userId: req.user._id,
    action: "UPDATE_APPOINTMENT",
    description: `Appointment status changed to ${status}`,
    targetModel: "Appointment",
    targetId: appointment._id,
  });

  res.status(200).json(new ApiResponse(200, appointment, `Appointment ${status}`));
});

// ── PUT /api/appointments/:id — Reschedule appointment ──
export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { date, slot } = req.body;

  // Check conflict for new slot
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await Appointment.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Appointment not found");

  const conflict = await Appointment.findOne({
    doctorId: existing.doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    slot,
    status: { $ne: "cancelled" },
    _id: { $ne: req.params.id },
  });

  if (conflict) throw new ApiError(409, "New slot is already booked");

  existing.date = new Date(date);
  existing.slot = slot;
  existing.status = "pending"; // Reset to pending after reschedule
  await existing.save();

  const updated = await Appointment.findById(existing._id);
  res.status(200).json(new ApiResponse(200, updated, "Appointment rescheduled"));
});

// ── DELETE /api/appointments/:id — Delete appointment ──
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) throw new ApiError(404, "Appointment not found");
  res.status(200).json(new ApiResponse(200, null, "Appointment deleted"));
});
