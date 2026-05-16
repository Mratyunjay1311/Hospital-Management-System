import express from "express";
import { getStats, getChartData, getRecentActivity } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin", "doctor", "receptionist"));

router.get("/stats", getStats);
router.get("/charts", getChartData);
router.get("/recent", getRecentActivity);

export default router;
