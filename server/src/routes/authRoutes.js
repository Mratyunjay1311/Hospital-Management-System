import express from "express";
import { register, login, getMe, updateProfile, logout, refreshToken } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

// Protected routes (must be logged in)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/logout", protect, logout);

export default router;
