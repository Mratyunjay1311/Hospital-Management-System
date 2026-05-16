/**
 * ============================================
 * PROTECTED ROUTE COMPONENT
 * ============================================
 * Wraps routes that require authentication.
 * Redirects to /login if not authenticated.
 * Optionally checks for specific roles.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login (save current URL for redirect back)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check: if route requires specific roles, verify user has one
  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">Access Denied</p>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
