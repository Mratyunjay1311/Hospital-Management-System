import express from "express";
import { getAppointments, getAppointment, createAppointment, updateAppointmentStatus, rescheduleAppointment, deleteAppointment } from "../controllers/appointmentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAppointments)
  .post(authorize("admin", "receptionist", "patient"), createAppointment);

router.route("/:id")
  .get(getAppointment)
  .put(authorize("admin", "receptionist"), rescheduleAppointment)
  .delete(authorize("admin"), deleteAppointment);

router.patch("/:id/status", authorize("admin", "doctor"), updateAppointmentStatus);

export default router;
