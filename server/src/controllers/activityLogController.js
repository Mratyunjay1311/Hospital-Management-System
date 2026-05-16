/**
 * ============================================
 * ACTIVITY LOG CONTROLLER
 * ============================================
 */

import ActivityLog from "../models/ActivityLog.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ── GET /api/activity-logs ──
export const getLogs = asyncHandler(async (req, res) => {
  const { userId, action, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (userId) filter.userId = userId;
  if (action) filter.action = action;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await ActivityLog.countDocuments(filter);
  const logs = await ActivityLog.find(filter)
    .populate("userId", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json(new ApiResponse(200, {
    logs,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  }, "Activity logs fetched"));
});
