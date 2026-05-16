import express from "express";
import { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor, getAvailableSlots } from "../controllers/doctorController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getDoctors)
  .post(authorize("admin"), createDoctor);

router.route("/:id")
  .get(getDoctor)
  .put(authorize("admin"), updateDoctor)
  .delete(authorize("admin"), deleteDoctor);

router.get("/:id/slots", getAvailableSlots);

export default router;
