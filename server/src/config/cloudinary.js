/**
 * ============================================
 * CLOUDINARY CONFIGURATION
 * ============================================
 * 
 * WHY CLOUDINARY?
 * - Storing files on your server is expensive and not scalable
 * - Cloudinary gives you a CDN (Content Delivery Network) for free
 * - Automatic image optimization, resizing, and format conversion
 * - This is how production apps handle file uploads
 * 
 * HOW IT WORKS:
 * 1. User uploads a file → it goes to our Express server
 * 2. Our server forwards it to Cloudinary
 * 3. Cloudinary stores it and returns a URL
 * 4. We save that URL in MongoDB
 */

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary as storage
// Multer handles multipart/form-data (file uploads)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hospital-management", // All uploads go to this folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Auto-resize images
  },
});

// Create multer upload middleware
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

export default cloudinary;
