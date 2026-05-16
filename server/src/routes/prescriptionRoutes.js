import express from "express";
import { getPrescriptions, getPrescription, createPrescription, deletePrescription } from "../controllers/prescriptionController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getPrescriptions)
  .post(authorize("doctor"), createPrescription);

router.route("/:id")
  .get(getPrescription)
  .delete(authorize("admin", "doctor"), deletePrescription);

export default router;
