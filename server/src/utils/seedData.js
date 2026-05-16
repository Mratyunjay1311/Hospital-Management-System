/**
 * ============================================
 * SEED DATA SCRIPT
 * ============================================
 * Run: npm run seed (from server directory)
 * Creates demo admin, doctors, patients, and sample data
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Inventory from "../models/Inventory.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Inventory.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // ── Create Admin ──
    const admin = await User.create({
      name: "Admin User",
      email: "admin@hospital.com",
      password: "admin123",
      role: "admin",
      phone: "9999999999",
      gender: "male",
    });
    console.log("👑 Admin created: admin@hospital.com / admin123");

    // ── Create Receptionist ──
    const receptionist = await User.create({
      name: "Priya Sharma",
      email: "receptionist@hospital.com",
      password: "reception123",
      role: "receptionist",
      phone: "9888888888",
      gender: "female",
    });
    console.log("🏥 Receptionist created: receptionist@hospital.com / reception123");

    // ── Create Doctors ──
    const doctorUsers = await User.create([
      { name: "Dr. Rajesh Sharma", email: "dr.sharma@hospital.com", password: "doctor123", role: "doctor", phone: "9111111111", gender: "male" },
      { name: "Dr. Priya Mishra", email: "dr.mishra@hospital.com", password: "doctor123", role: "doctor", phone: "9222222222", gender: "female" },
      { name: "Dr. Amit Patel", email: "dr.patel@hospital.com", password: "doctor123", role: "doctor", phone: "9333333333", gender: "male" },
      { name: "Dr. Sneha Gupta", email: "dr.gupta@hospital.com", password: "doctor123", role: "doctor", phone: "9444444444", gender: "female" },
    ]);

    const doctors = await Doctor.create([
      {
        userId: doctorUsers[0]._id, specialization: "Cardiologist", consultationFee: 800, experience: 12, qualification: "MD, DM Cardiology",
        bio: "Experienced cardiologist with 12+ years in cardiac care",
        availability: [
          { day: "Monday", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"] },
          { day: "Wednesday", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"] },
          { day: "Friday", slots: ["14:00", "14:30", "15:00", "15:30", "16:00"] },
        ],
      },
      {
        userId: doctorUsers[1]._id, specialization: "Dermatologist", consultationFee: 600, experience: 8, qualification: "MD Dermatology",
        bio: "Specialist in skin disorders and cosmetic dermatology",
        availability: [
          { day: "Tuesday", slots: ["10:00", "10:30", "11:00", "11:30", "12:00"] },
          { day: "Thursday", slots: ["10:00", "10:30", "11:00", "11:30", "12:00"] },
          { day: "Saturday", slots: ["09:00", "09:30", "10:00", "10:30"] },
        ],
      },
      {
        userId: doctorUsers[2]._id, specialization: "Orthopedic", consultationFee: 700, experience: 15, qualification: "MS Orthopedics",
        bio: "Expert in joint replacements and sports injuries",
        availability: [
          { day: "Monday", slots: ["14:00", "14:30", "15:00", "15:30", "16:00"] },
          { day: "Wednesday", slots: ["14:00", "14:30", "15:00", "15:30", "16:00"] },
          { day: "Friday", slots: ["09:00", "09:30", "10:00", "10:30", "11:00"] },
        ],
      },
      {
        userId: doctorUsers[3]._id, specialization: "Pediatrician", consultationFee: 500, experience: 6, qualification: "MD Pediatrics",
        bio: "Caring pediatrician focused on child development and wellness",
        availability: [
          { day: "Tuesday", slots: ["14:00", "14:30", "15:00", "15:30"] },
          { day: "Thursday", slots: ["14:00", "14:30", "15:00", "15:30"] },
          { day: "Saturday", slots: ["10:00", "10:30", "11:00", "11:30", "12:00"] },
        ],
      },
    ]);
    console.log("🩺 4 Doctors created (password: doctor123)");

    // ── Create Patients ──
    const patients = await User.create([
      { name: "Rahul Kumar", email: "rahul@patient.com", password: "patient123", role: "patient", phone: "9555555551", gender: "male", bloodGroup: "B+", allergies: ["Penicillin"], dateOfBirth: new Date("1995-03-15") },
      { name: "Anjali Singh", email: "anjali@patient.com", password: "patient123", role: "patient", phone: "9555555552", gender: "female", bloodGroup: "O+", dateOfBirth: new Date("1990-07-22") },
      { name: "Vikram Joshi", email: "vikram@patient.com", password: "patient123", role: "patient", phone: "9555555553", gender: "male", bloodGroup: "A-", allergies: ["Sulfa drugs"], dateOfBirth: new Date("1988-11-08") },
      { name: "Meera Reddy", email: "meera@patient.com", password: "patient123", role: "patient", phone: "9555555554", gender: "female", bloodGroup: "AB+", dateOfBirth: new Date("2000-01-30") },
      { name: "Arjun Nair", email: "arjun@patient.com", password: "patient123", role: "patient", phone: "9555555555", gender: "male", bloodGroup: "O-", dateOfBirth: new Date("1992-05-18") },
    ]);
    console.log("🧑‍🤝‍🧑 5 Patients created (password: patient123)");

    // ── Create Sample Appointments ──
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    await Appointment.create([
      { patientId: patients[0]._id, doctorId: doctors[0]._id, date: tomorrow, slot: "09:00", status: "confirmed", reason: "Chest pain checkup", tokenNumber: 1 },
      { patientId: patients[1]._id, doctorId: doctors[1]._id, date: tomorrow, slot: "10:00", status: "pending", reason: "Skin rash", tokenNumber: 1 },
      { patientId: patients[2]._id, doctorId: doctors[2]._id, date: tomorrow, slot: "14:00", status: "confirmed", reason: "Knee pain", tokenNumber: 1 },
    ]);
    console.log("📅 3 Sample appointments created");

    // ── Create Sample Inventory ──
    await Inventory.create([
      { name: "Paracetamol 500mg", category: "medicine", quantity: 500, unit: "tablets", threshold: 50, price: 2 },
      { name: "Amoxicillin 250mg", category: "medicine", quantity: 8, unit: "capsules", threshold: 20, price: 5 },
      { name: "Digital Thermometer", category: "equipment", quantity: 15, unit: "pieces", threshold: 5, price: 350 },
      { name: "Surgical Gloves (Box)", category: "consumable", quantity: 3, unit: "boxes", threshold: 10, price: 250 },
      { name: "Blood Pressure Monitor", category: "equipment", quantity: 8, unit: "pieces", threshold: 3, price: 2500 },
      { name: "Ibuprofen 400mg", category: "medicine", quantity: 200, unit: "tablets", threshold: 30, price: 3 },
    ]);
    console.log("📦 6 Inventory items created (2 low stock for alerts)");

    console.log("\n🎉 Seed completed successfully!\n");
    console.log("=== LOGIN CREDENTIALS ===");
    console.log("Admin:        admin@hospital.com / admin123");
    console.log("Receptionist: receptionist@hospital.com / reception123");
    console.log("Doctor:       dr.sharma@hospital.com / doctor123");
    console.log("Patient:      rahul@patient.com / patient123");
    console.log("========================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedData();
