import express from "express";
import { uploadImage, uploadProfileImage, deleteFile } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(protect);

router.post("/image", upload.single("file"), uploadImage);
router.post("/profile", upload.single("file"), uploadProfileImage);
router.delete("/:publicId", deleteFile);

export default router;
