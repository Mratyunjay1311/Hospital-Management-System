/**
 * ============================================
 * BILLING CONTROLLER
 * ============================================
 */

import Billing from "../models/Billing.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ActivityLog from "../models/ActivityLog.js";

// ── GET /api/billing ──
export const getBillings = asyncHandler(async (req, res) => {
  const { patientId, paymentStatus, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (patientId) filter.patientId = patientId;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Billing.countDocuments(filter);
  const billings = await Billing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

  res.status(200).json(new ApiResponse(200, {
    billings,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  }, "Billings fetched"));
});

// ── GET /api/billing/:id ──
export const getBilling = asyncHandler(async (req, res) => {
  const billing = await Billing.findById(req.params.id);
  if (!billing) throw new ApiError(404, "Invoice not found");
  res.status(200).json(new ApiResponse(200, billing, "Invoice fetched"));
});

// ── POST /api/billing ──
export const createBilling = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, items, discount, paymentMethod, notes } = req.body;

  // Calculate totals
  const processedItems = items.map((item) => ({
    ...item,
    total: item.quantity * item.unitPrice,
  }));
  const subTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 18; // GST
  const taxAmount = Math.round((subTotal * taxRate) / 100);
  const totalAmount = subTotal + taxAmount - (discount || 0);

  const billing = await Billing.create({
    patientId, appointmentId, items: processedItems, subTotal, taxRate, taxAmount, discount: discount || 0, totalAmount, paymentMethod, notes,
  });

  await ActivityLog.create({
    userId: req.user._id,
    action: "CREATE_BILLING",
    description: `Invoice ${billing.invoiceNumber} created — ₹${totalAmount}`,
    targetModel: "Billing",
    targetId: billing._id,
  });

  const populated = await Billing.findById(billing._id);
  res.status(201).json(new ApiResponse(201, populated, "Invoice created"));
});

// ── PATCH /api/billing/:id/pay ──
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, paymentMethod } = req.body;

  const updateData = { paymentStatus };
  if (paymentMethod) updateData.paymentMethod = paymentMethod;
  if (paymentStatus === "paid") updateData.paidAt = new Date();

  const billing = await Billing.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!billing) throw new ApiError(404, "Invoice not found");

  await ActivityLog.create({
    userId: req.user._id,
    action: "UPDATE_BILLING",
    description: `Invoice ${billing.invoiceNumber} marked as ${paymentStatus}`,
    targetModel: "Billing",
    targetId: billing._id,
  });

  res.status(200).json(new ApiResponse(200, billing, "Payment status updated"));
});

// ── DELETE /api/billing/:id ──
export const deleteBilling = asyncHandler(async (req, res) => {
  const billing = await Billing.findByIdAndDelete(req.params.id);
  if (!billing) throw new ApiError(404, "Invoice not found");
  res.status(200).json(new ApiResponse(200, null, "Invoice deleted"));
});
