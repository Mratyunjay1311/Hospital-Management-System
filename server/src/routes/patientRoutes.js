import express from "express";
import { getPatients, getPatient, createPatient, updatePatient, deletePatient } from "../controllers/patientController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route("/")
  .get(authorize("admin", "doctor", "receptionist"), getPatients)
  .post(authorize("admin", "receptionist"), createPatient);

router.route("/:id")
  .get(getPatient)
  .put(authorize("admin", "receptionist"), updatePatient)
  .delete(authorize("admin"), deletePatient);

export default router;
