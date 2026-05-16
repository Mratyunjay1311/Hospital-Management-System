/**
 * ============================================
 * UPLOAD CONTROLLER
 * ============================================
 * Handles file uploads to Cloudinary
 */

import cloudinary from "../config/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

// ── POST /api/upload/image — Upload single image ──
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");

  res.status(200).json(
    new ApiResponse(200, {
      url: req.file.path,
      publicId: req.file.filename,
    }, "File uploaded successfully")
  );
});

// ── POST /api/upload/profile — Upload profile image ──
export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");

  // Update user's profile image
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: req.file.path },
    { new: true }
  ).select("-password -refreshToken");

  res.status(200).json(new ApiResponse(200, user, "Profile image updated"));
});

// ── DELETE /api/upload/:publicId — Delete file from Cloudinary ──
export const deleteFile = asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  await cloudinary.uploader.destroy(publicId);
  res.status(200).json(new ApiResponse(200, null, "File deleted"));
});
