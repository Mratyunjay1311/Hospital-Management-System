# 🏥 MedCare — Hospital Management SaaS Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/Frontend-React_19-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

MedCare is an advanced, production-grade Hospital Management System built with the MERN stack. It transitions traditional hospital operations into a modern, role-based, digital SaaS platform. 

This project was built focusing on **Security, Scalability, and User Experience**, implementing industry-standard architectures like JWT rotation, RBAC, and React Code-Splitting.

---

## ✨ Key Features

### 🔐 Security & Architecture
- **Role-Based Access Control (RBAC):** Distinct dashboards and route protections for `Admin`, `Doctor`, `Receptionist`, and `Patient`.
- **Advanced Authentication:** Secure JWT implementation with HttpOnly Refresh Cookies to prevent XSS and CSRF attacks.
- **Data Protection:** `bcryptjs` for password hashing, `express-mongo-sanitize` against NoSQL injection, and `helmet` for HTTP header security.
- **Zod Validation:** Strict runtime type-checking for all incoming API requests.

### 💻 Core Modules
- **Appointments & Queues:** Conflict-free slot booking with live animated OPD queue tracking.
- **Electronic Medical Records (EMR):** Dual-pane layout featuring a chronological timeline of patient diagnoses, vitals, and treatments.
- **Dynamic Prescriptions:** Complex forms allowing doctors to rapidly add multiple medicines, dosages, and instructions.
- **Billing & Invoices:** Auto-calculating invoices (tax + discounts) with 1-click **PDF Generation** using `html2canvas` and `jsPDF`.
- **Inventory Management:** Tracks hospital supplies with automated low-stock alert badges.
- **Audit Trails:** Comprehensive Activity Logs tracking all sensitive system actions for compliance.

### 🚀 "WOW" Features
- **AI Symptom Checker:** A conversational interface for preliminary AI medical triage.
- **Video Consultation UI:** Modern telemedicine interface with integrated WebRTC-style controls.
- **Ambulance Dispatch:** Emergency request module with simulated live tracking and ETA.
- **Chat System:** Split-pane messaging UI for inter-hospital communication.

### ⚡ Frontend Optimizations
- **React Lazy & Suspense:** Code-splitting for lightning-fast initial page loads.
- **Framer Motion:** Silky smooth page transitions and micro-animations.
- **i18n Multi-language:** Real-time translation toggle between English and Hindi.
- **Error Boundaries:** Graceful error handling preventing the "White Screen of Death".

---

## 📂 Repository Structure

This project follows a Monorepo structure, separating the client and server for scalable deployment.

```text
Hospital-Management-System/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI (Sidebar, Navbar, Layouts)
│   │   ├── context/            # Global State (AuthContext, ThemeContext)
│   │   ├── pages/              # Lazy-loaded route components
│   │   ├── services/           # Axios API client with JWT interceptors
│   │   └── index.css           # Tailwind configuration & global styles
│   ├── index.html
│   └── vite.config.js
│
└── server/                     # Node.js / Express Backend
    ├── src/
    │   ├── config/             # DB & Cloudinary configuration
    │   ├── controllers/        # Business logic for all 11 domains
    │   ├── middlewares/        # Auth, RBAC, Validation, Error Handling
    │   ├── models/             # Mongoose Schemas (8 Models)
    │   ├── routes/             # Express API routes
    │   └── utils/              # ApiError, ApiResponse, seed scripts
    └── server.js               # Express entry point
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Cloudinary Account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hospital-management-system.git
cd hospital-management-system
```

### 2. Backend Setup
```bash
cd server
npm install

# Create environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT Secrets, and Cloudinary keys

# Seed the database with sample users and doctors
node src/utils/seedData.js

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd client
npm install

# Start the Vite development server
npm run dev
```

### 4. Default Seed Credentials
After running the seed script, you can log in with:
- **Admin:** `admin@medcare.com` / `password123`
- **Doctor:** `doctor@medcare.com` / `password123`
- **Receptionist:** `reception@medcare.com` / `password123`
- **Patient:** `patient@medcare.com` / `password123`

---

## 🌐 Deployment Instructions

### Deploying the Backend (Render / Railway)
1. Push your code to GitHub.
2. Connect your repository to Render or Railway.
3. Set the Root Directory to `server`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add all the variables from your `.env` to the platform's Environment Variables section.

### Deploying the Frontend (Vercel / Netlify)
1. Connect your repository to Vercel/Netlify.
2. Set the Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add `VITE_API_URL` pointing to your deployed backend URL.

---

## 👨‍💻 Author

Built by **Mratyunjay** as a demonstration of production-grade Full-Stack Software Engineering.

**[GitHub Profile](https://github.com/Mratyunjay1311)**
