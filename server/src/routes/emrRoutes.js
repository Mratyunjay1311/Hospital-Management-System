import express from "express";
import { getPatientRecords, getRecord, createRecord, updateRecord } from "../controllers/emrController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("doctor"), createRecord);
router.get("/:patientId", authorize("admin", "doctor"), getPatientRecords);
router.route("/record/:id")
  .get(authorize("admin", "doctor", "patient"), getRecord)
  .put(authorize("doctor"), updateRecord);

export default router;
