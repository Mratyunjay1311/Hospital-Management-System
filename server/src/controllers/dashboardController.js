/**
 * ============================================
 * DASHBOARD CONTROLLER
 * ============================================
 * Aggregation queries for analytics cards, charts, and stats
 */

import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Billing from "../models/Billing.js";
import Doctor from "../models/Doctor.js";
import Inventory from "../models/Inventory.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ── GET /api/dashboard/stats — Overview statistics ──
export const getStats = asyncHandler(async (req, res) => {
  const [totalPatients, totalDoctors, totalAppointments, revenueResult] = await Promise.all([
    User.countDocuments({ role: "patient" }),
    Doctor.countDocuments(),
    Appointment.countDocuments(),
    Billing.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  // Today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayAppointments, pendingAppointments, lowStockItems] = await Promise.all([
    Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
    Appointment.countDocuments({ status: "pending" }),
    Inventory.countDocuments({ $expr: { $lte: ["$quantity", "$threshold"] } }),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue,
      todayAppointments,
      pendingAppointments,
      lowStockItems,
    }, "Dashboard stats fetched")
  );
});

// ── GET /api/dashboard/charts — Chart data for revenue and appointments ──
export const getChartData = asyncHandler(async (req, res) => {
  // Monthly appointment count for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const appointmentsByMonth = await Appointment.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Monthly revenue for last 6 months
  const revenueByMonth = await Billing.aggregate([
    { $match: { paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Appointment status distribution
  const statusDistribution = await Appointment.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // Top doctors by appointment count
  const topDoctors = await Appointment.aggregate([
    { $group: { _id: "$doctorId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      appointmentsByMonth,
      revenueByMonth,
      statusDistribution,
      topDoctors,
    }, "Chart data fetched")
  );
});

// ── GET /api/dashboard/recent — Recent activities and upcoming appointments ──
export const getRecentActivity = asyncHandler(async (req, res) => {
  const [recentAppointments, upcomingAppointments, recentPatients] = await Promise.all([
    Appointment.find().sort({ createdAt: -1 }).limit(5),
    Appointment.find({
      date: { $gte: new Date() },
      status: { $in: ["pending", "confirmed"] },
    }).sort({ date: 1 }).limit(5),
    User.find({ role: "patient" }).sort({ createdAt: -1 }).limit(5).select("name email createdAt profileImage"),
  ]);

  res.status(200).json(
    new ApiResponse(200, { recentAppointments, upcomingAppointments, recentPatients }, "Recent activity fetched")
  );
});
