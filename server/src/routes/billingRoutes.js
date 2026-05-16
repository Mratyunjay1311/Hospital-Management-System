import express from "express";
import { getBillings, getBilling, createBilling, updatePaymentStatus, deleteBilling } from "../controllers/billingController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(authorize("admin", "receptionist"), getBillings)
  .post(authorize("admin", "receptionist"), createBilling);

router.route("/:id")
  .get(getBilling)
  .delete(authorize("admin"), deleteBilling);

router.patch("/:id/pay", authorize("admin", "receptionist"), updatePaymentStatus);

export default router;
