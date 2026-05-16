/**
 * ============================================
 * AUTH CONTEXT
 * ============================================
 * 
 * WHY CONTEXT FOR AUTH?
 * - Auth state (user, token, role) needs to be available EVERYWHERE
 * - Props drilling user through 50 components = nightmare
 * - Context + useReducer = clean, predictable state management
 * - This is the pattern used at production companies
 * 
 * STATE SHAPE:
 *   { user: {...}, isAuthenticated: bool, isLoading: bool }
 */

import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api.js";

// ── Create Context ──
const AuthContext = createContext(null);

// ── Reducer: Handles all auth state transitions ──
const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // true initially because we check for existing token
};

// ── Provider Component ──
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On app load: check if user has a valid token
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch({ type: "AUTH_FAILURE" });
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        dispatch({ type: "AUTH_SUCCESS", payload: data.data });
      } catch {
        localStorage.removeItem("accessToken");
        dispatch({ type: "AUTH_FAILURE" });
      }
    };

    checkAuth();
  }, []);

  // ── Auth Actions ──
  const login = async (email, password) => {
    dispatch({ type: "AUTH_LOADING" });
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.data.accessToken);
    dispatch({ type: "AUTH_SUCCESS", payload: data.data.user });
    return data;
  };

  const register = async (formData) => {
    dispatch({ type: "AUTH_LOADING" });
    const { data } = await api.post("/auth/register", formData);
    localStorage.setItem("accessToken", data.data.accessToken);
    dispatch({ type: "AUTH_SUCCESS", payload: data.data.user });
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Logout even if API call fails
    }
    localStorage.removeItem("accessToken");
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom Hook: useAuth ──
// Usage: const { user, login, logout, isAuthenticated } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
