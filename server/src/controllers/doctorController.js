/**
 * ============================================
 * DOCTOR CONTROLLER
 * ============================================
 * Full CRUD + availability/slot management
 */

import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ── GET /api/doctors — List all doctors ──
export const getDoctors = asyncHandler(async (req, res) => {
  const { search, specialization, sort, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (specialization) filter.specialization = specialization;

  let query = Doctor.find(filter);

  // Search by doctor name (through populated userId)
  if (search) {
    const userIds = await User.find({
      name: { $regex: search, $options: "i" },
      role: "doctor",
    }).select("_id");
    filter.userId = { $in: userIds.map((u) => u._id) };
    query = Doctor.find(filter);
  }

  if (sort === "fee-low") query = query.sort({ consultationFee: 1 });
  else if (sort === "fee-high") query = query.sort({ consultationFee: -1 });
  else if (sort === "rating") query = query.sort({ rating: -1 });
  else if (sort === "experience") query = query.sort({ experience: -1 });
  else query = query.sort({ createdAt: -1 });

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Doctor.countDocuments(filter);

  const doctors = await query.skip(skip).limit(Number(limit));

  res.status(200).json(
    new ApiResponse(200, {
      doctors,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    }, "Doctors fetched")
  );
});

// ── GET /api/doctors/:id — Get single doctor ──
export const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new ApiError(404, "Doctor not found");
  res.status(200).json(new ApiResponse(200, doctor, "Doctor fetched"));
});

// ── POST /api/doctors — Create doctor (admin only) ──
export const createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, gender, specialization, consultationFee, experience, qualification, bio, availability } = req.body;

  // Create user account first
  const user = await User.create({
    name, email, password: password || "doctor123", role: "doctor", phone, gender,
  });

  // Create doctor profile
  const doctor = await Doctor.create({
    userId: user._id, specialization, consultationFee, experience, qualification, bio, availability,
  });

  res.status(201).json(new ApiResponse(201, doctor, "Doctor created"));
});

// ── PUT /api/doctors/:id — Update doctor ──
export const updateDoctor = asyncHandler(async (req, res) => {
  const { specialization, consultationFee, experience, qualification, bio, availability, isAvailable } = req.body;

  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { specialization, consultationFee, experience, qualification, bio, availability, isAvailable },
    { new: true, runValidators: true }
  );

  if (!doctor) throw new ApiError(404, "Doctor not found");

  // Also update user fields if provided
  if (req.body.name || req.body.phone) {
    await User.findByIdAndUpdate(doctor.userId._id || doctor.userId, {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.phone && { phone: req.body.phone }),
    });
  }

  res.status(200).json(new ApiResponse(200, doctor, "Doctor updated"));
});

// ── DELETE /api/doctors/:id — Delete doctor ──
export const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // Also update user role
  await User.findByIdAndUpdate(doctor.userId._id || doctor.userId, { role: "patient" });

  res.status(200).json(new ApiResponse(200, null, "Doctor deleted"));
});

// ── GET /api/doctors/:id/slots?date=YYYY-MM-DD — Get available slots for a date ──
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) throw new ApiError(400, "Date is required");

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // Get day name from date
  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

  // Find doctor's slots for this day
  const daySchedule = doctor.availability.find((a) => a.day === dayName);
  const allSlots = daySchedule?.slots || [];

  // Find already booked slots
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookedAppointments = await Appointment.find({
    doctorId: req.params.id,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "cancelled" },
  }).select("slot");

  const bookedSlots = bookedAppointments.map((a) => a.slot);

  // Mark each slot as available or booked
  const slots = allSlots.map((slot) => ({
    time: slot,
    isBooked: bookedSlots.includes(slot),
  }));

  res.status(200).json(new ApiResponse(200, { date, dayName, slots }, "Slots fetched"));
});
