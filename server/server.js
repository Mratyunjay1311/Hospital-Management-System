/**
 * ============================================
 * SERVER ENTRY POINT
 * ============================================
 * 
 * WHY THIS STRUCTURE?
 * - We separate "app creation" from "server startup" 
 * - This makes testing easier (you can import the app without starting the server)
 * - This is how production Node.js apps are structured at companies
 * 
 * MIDDLEWARE ORDER MATTERS:
 * 1. Security (helmet, cors, sanitize) — block attacks first
 * 2. Parsing (json, cookies) — parse request body
 * 3. Logging (morgan) — log every request
 * 4. Rate limiting — prevent abuse
 * 5. Routes — handle business logic
 * 6. Error handler — catch everything that went wrong (MUST be last)
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Load environment variables BEFORE anything else
dotenv.config();

import { connectDB } from "./src/config/db.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";

// Import route files
import authRoutes from "./src/routes/authRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import prescriptionRoutes from "./src/routes/prescriptionRoutes.js";
import billingRoutes from "./src/routes/billingRoutes.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import activityLogRoutes from "./src/routes/activityLogRoutes.js";
import emrRoutes from "./src/routes/emrRoutes.js";

// ============================================
// CREATE EXPRESS APP
// ============================================
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet: Sets various HTTP headers to prevent attacks (XSS, clickjacking, etc.)
app.use(helmet());

// CORS: Allow frontend (localhost:5173) to talk to backend (localhost:5000)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Sanitize: Prevents MongoDB operator injection attacks
// Example: Without this, someone could send { "$gt": "" } to bypass auth
app.use(mongoSanitize());

// Rate Limiting: Prevents brute-force attacks
// Max 100 requests per 15 minutes per IP address
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
});
app.use("/api", limiter);

// ============================================
// PARSING MIDDLEWARE
// ============================================

// Parse JSON bodies (for POST/PUT requests)
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse cookies (for JWT refresh tokens)
app.use(cookieParser());

// ============================================
// LOGGING
// ============================================

// Morgan: Log every HTTP request in dev mode
// "dev" format: :method :url :status :response-time ms
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ============================================
// API ROUTES
// ============================================

// Health check endpoint — useful for deployment platforms
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital Management API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Mount route modules
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/emr", emrRoutes);

// ============================================
// ERROR HANDLING (must be LAST middleware)
// ============================================

// Handle 404 — route not found
app.use(notFound);

// Global error handler — catches all errors from routes
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🏥 Hospital Management API Server`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   Port:        ${PORT}`);
    console.log(`   URL:         http://localhost:${PORT}`);
    console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
  });
});
