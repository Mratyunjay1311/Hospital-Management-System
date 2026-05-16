/**
 * ============================================
 * AXIOS API CLIENT
 * ============================================
 * 
 * WHY A CENTRALIZED API CLIENT?
 * - Single source for base URL, headers, and error handling
 * - Interceptors automatically attach JWT token to every request
 * - Interceptors automatically handle 401 (token expired) → refresh flow
 * - All API calls go through this one client = easy to debug
 */

import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Send cookies with every request (for refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST INTERCEPTOR: Attach JWT token to every request ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR: Handle token expiry + errors ──
api.interceptors.response.use(
  (response) => response, // Success: pass through
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet → try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Save new token and retry original request
        localStorage.setItem("accessToken", data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → force logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
