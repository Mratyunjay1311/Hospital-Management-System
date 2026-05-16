/**
 * ============================================
 * DATABASE CONNECTION
 * ============================================
 * 
 * WHY SEPARATE FILE?
 * - Single Responsibility Principle: this file does ONE thing — connect to MongoDB
 * - If we need to change database config, we change ONE file
 * - We can reuse this in seed scripts, migrations, etc.
 * 
 * CONNECTION STRATEGY:
 * - Use mongoose.connect() with the Atlas URI from .env
 * - If connection fails, log the error and exit the process
 * - In production, you'd add retry logic here
 */

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code
    // In production, you might want to retry instead
    process.exit(1);
  }
};
