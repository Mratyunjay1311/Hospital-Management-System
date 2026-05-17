/**
 * ============================================
 * APP - ROOT COMPONENT
 * ============================================
 * 
 * ROUTING ARCHITECTURE:
 * - Public routes: /login, /register (no auth required)
 * - Protected routes: Everything else (requires auth + role check)
 * - DashboardLayout wraps all protected pages (sidebar + navbar)
 * - Lazy Loading: Applied to all routes for code splitting
 */

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

// Layout & Core
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Auth Pages (Public) - NOT lazy loaded for immediate paint
import LandingPage from "./pages/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

// Lazy Loaded Dashboard Pages (Phase 4 & 5)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Patients = lazy(() => import("./pages/Patients"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Doctors = lazy(() => import("./pages/Doctors"));
const Prescriptions = lazy(() => import("./pages/Prescriptions"));
const EMR = lazy(() => import("./pages/EMR"));
const Billing = lazy(() => import("./pages/Billing"));
const Inventory = lazy(() => import("./pages/Inventory"));
const ActivityLogs = lazy(() => import("./pages/ActivityLogs"));
const Profile = lazy(() => import("./pages/Profile"));

// Lazy Loaded Advanced Features (Phase 6)
const SymptomChecker = lazy(() => import("./pages/SymptomChecker"));
const Queue = lazy(() => import("./pages/Queue"));
const Chat = lazy(() => import("./pages/Chat"));
const Ambulance = lazy(() => import("./pages/Ambulance"));
const VideoConsultation = lazy(() => import("./pages/VideoConsultation"));

// Loading fallback component
const PageLoader = () => (
  <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
);

// Framer Motion Page Wrapper for smooth transitions
const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ── Public Routes ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected Routes ── */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Dashboard /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Profile /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          
          <Route path="/patients" element={<ProtectedRoute roles={["admin", "doctor", "receptionist"]}><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Patients /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Doctors /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Appointments /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute roles={["admin", "doctor", "patient"]}><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Prescriptions /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/emr" element={<ProtectedRoute roles={["admin", "doctor"]}><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><EMR /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute roles={["admin", "receptionist"]}><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Billing /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute roles={["admin"]}><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Inventory /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/activity-logs" element={<ProtectedRoute roles={["admin"]}><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><ActivityLogs /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          
          <Route path="/symptom-checker" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><SymptomChecker /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/queue" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Queue /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Chat /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/ambulance" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><Ambulance /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />
          <Route path="/video" element={<ProtectedRoute><DashboardLayout><Suspense fallback={<PageLoader />}><AnimatedPage><VideoConsultation /></AnimatedPage></Suspense></DashboardLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
