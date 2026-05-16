import express from "express";
import { getLogs } from "../controllers/activityLogController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/", getLogs);

export default router;
