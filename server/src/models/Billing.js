/**
 * ============================================
 * BILLING MODEL
 * ============================================
 * 
 * WHY?
 * - Every appointment generates a bill
 * - Tracks payment status, method, and amounts
 * - Supports invoice generation (PDF on frontend)
 * - Tax calculation built-in
 * 
 * INVOICE NUMBER:
 * - Auto-generated unique invoice number using a pre-save hook
 * - Format: INV-YYYYMMDD-XXXX (e.g., INV-20260516-0001)
 */

import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
    },
    taxRate: {
      type: Number,
      default: 18, // GST 18%
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid", "refunded"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "insurance", "online", ""],
      default: "",
    },
    paidAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ── Auto-generate invoice number ──
billingSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await mongoose.model("Billing").countDocuments();
    this.invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Auto-populate references
billingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patientId",
    select: "name email phone",
  });
  next();
});

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;
