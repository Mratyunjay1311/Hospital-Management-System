/**
 * ============================================
 * INVENTORY CONTROLLER
 * ============================================
 */

import Inventory from "../models/Inventory.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ── GET /api/inventory ──
export const getInventory = asyncHandler(async (req, res) => {
  const { search, category, lowStock, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };
  if (lowStock === "true") filter.$expr = { $lte: ["$quantity", "$threshold"] };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Inventory.countDocuments(filter);
  const items = await Inventory.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

  res.status(200).json(new ApiResponse(200, {
    items,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  }, "Inventory fetched"));
});

// ── POST /api/inventory ──
export const createItem = asyncHandler(async (req, res) => {
  const item = await Inventory.create(req.body);
  res.status(201).json(new ApiResponse(201, item, "Item added to inventory"));
});

// ── PUT /api/inventory/:id ──
export const updateItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, "Item not found");
  res.status(200).json(new ApiResponse(200, item, "Item updated"));
});

// ── DELETE /api/inventory/:id ──
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Item not found");
  res.status(200).json(new ApiResponse(200, null, "Item deleted"));
});

// ── GET /api/inventory/alerts — Low stock and expired items ──
export const getAlerts = asyncHandler(async (req, res) => {
  const [lowStock, expired] = await Promise.all([
    Inventory.find({ $expr: { $lte: ["$quantity", "$threshold"] } }),
    Inventory.find({ expiryDate: { $lte: new Date() } }),
  ]);
  res.status(200).json(new ApiResponse(200, { lowStock, expired }, "Alerts fetched"));
});
