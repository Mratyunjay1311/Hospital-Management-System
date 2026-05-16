/**
 * ============================================
 * MAIN ENTRY POINT
 * ============================================
 * Wraps app with all required providers:
 * 1. BrowserRouter — enables routing
 * 2. AuthProvider — provides auth state everywhere
 * 3. ThemeProvider — provides dark/light mode everywhere
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import App from "./App.jsx";
import "./index.css";
import "./i18n"; // Import i18n configuration

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
