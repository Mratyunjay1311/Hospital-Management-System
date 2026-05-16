/**
 * ============================================
 * INVENTORY MODEL
 * ============================================
 * 
 * WHY?
 * - Hospitals need to track medicine stock and equipment
 * - Low-stock alerts prevent running out of critical medicines
 * - Expiry date tracking prevents using expired medicines
 * - This is a unique feature that sets your project apart
 */

import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["medicine", "equipment", "consumable", "other"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String, // "tablets", "bottles", "pieces", etc.
      default: "units",
    },
    threshold: {
      type: Number, // Alert when quantity drops below this
      default: 10,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    supplier: {
      type: String,
      trim: true,
      default: "",
    },
    expiryDate: {
      type: Date,
    },
    batchNumber: {
      type: String,
      default: "",
    },
    location: {
      type: String, // "Pharmacy", "Ward A", "Storage Room"
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field: is this item low on stock?
inventorySchema.virtual("isLowStock").get(function () {
  return this.quantity <= this.threshold;
});

// Virtual field: is this item expired?
inventorySchema.virtual("isExpired").get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Ensure virtuals are included in JSON responses
inventorySchema.set("toJSON", { virtuals: true });
inventorySchema.set("toObject", { virtuals: true });

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
