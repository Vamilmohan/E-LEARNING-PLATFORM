import { createContext, useReducer, useEffect, useContext } from "react";
import { authReducer, initialAuthState } from "./authReducer";

const API_BASE = "http://localhost:5000/api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("=== LOADED CURRENT USER ===");
        console.log("Full user data:", data);
        console.log("Instructor profile:", data.instructorProfile);
        dispatch({ type: "LOGIN", payload: { user: data } });
        if (data.role === "admin" || data.role === "instructor") {
          await fetchUsers();
        }
      } else {
        console.warn("Failed to load user, status:", response.status);
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      console.error("Error loading current user:", error);
      dispatch({ type: "LOGOUT" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_USERS", payload: data });
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
    return [];
  };

  const sendOTP = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_MESSAGE", payload: result.message });
        return true;
      }
      dispatch({ type: "SET_ERROR", payload: result.message });
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Network error" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const verifyOTP = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        dispatch({ type: "LOGIN", payload: { user: result.user } });
        if (result.user.role === "admin" || result.user.role === "instructor") {
          await fetchUsers();
        }
        return result.user;
      }
      dispatch({ type: "SET_ERROR", payload: result.message });
      return null;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Network error" });
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("=== LOGIN SUCCESSFUL ===");
        console.log("User from login response:", result.user);
        dispatch({ type: "LOGIN", payload: { user: result.user } });
        
        // Now fetch the complete profile including instructor profile
        console.log("Fetching complete profile from /api/profile...");
        await loadCurrentUser();
        
        if (result.user.role === "admin" || result.user.role === "instructor") {
          await fetchUsers();
        }
        return result.user;
      }
      dispatch({ type: "SET_ERROR", payload: result.message });
      return null;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Network error" });
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  const updateUserProfile = async (profileData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      console.log('=== AUTH CONTEXT UPDATE ===');
      console.log('UPDATING PROFILE WITH:', profileData);
      const response = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      
      const result = await response.json();
      console.log('RESPONSE FROM SERVER:', result);
      
      if (response.ok) {
        console.log('UPDATE SUCCESS, DISPATCHING NEW USER:', result.user);
        dispatch({ type: "LOGIN", payload: { user: result.user } });
        dispatch({ type: "SET_MESSAGE", payload: "Profile updated successfully" });
        return result.user;
      }
      
      console.error('Response not ok:', result);
      dispatch({ type: "SET_ERROR", payload: result.message || "Failed to update profile" });
      return null;
    } catch (error) {
      console.error('UPDATE ERROR:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      dispatch({ type: "SET_ERROR", payload: "Network error: " + error.message });
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateUser = async (userId, updateData) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      const result = await response.json();
      if (response.ok) {
        await fetchUsers();
        return result;
      }
    } catch (error) {
      console.error("Failed to update user", error);
    }
    return null;
  };

  const removeUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        await fetchUsers();
        return true;
      }
    } catch (error) {
      console.error("Failed to remove user", error);
    }
    return false;
  };

  const refreshUserProfile = async () => {
    console.log("=== FORCE REFRESHING USER PROFILE ===");
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Refreshed user data:", data);
        console.log("Refreshed instructor profile:", data.instructorProfile);
        dispatch({ type: "LOGIN", payload: { user: data } });
        return data;
      } else {
        console.error("Failed to refresh profile, status:", response.status);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
    return null;
  };

  const sendForgotPasswordOtp = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_BASE}/auth/send-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_MESSAGE", payload: result.message });
        return true;
      }
      dispatch({ type: "SET_ERROR", payload: result.message });
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Network error" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const verifyForgotPasswordOtp = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_BASE}/auth/verify-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_MESSAGE", payload: result.message });
        return true;
      }
      dispatch({ type: "SET_ERROR", payload: result.message });
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Network error" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const resetPassword = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_MESSAGE", payload: result.message });
        return true;
      }
      dispatch({ type: "SET_ERROR", payload: result.message });
      return false;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Network error" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        sendOTP,
        verifyOTP,
        login,
        logout,
        updateUserProfile,
        refreshUserProfile,
        sendForgotPasswordOtp,
        verifyForgotPasswordOtp,
        resetPassword,
        users: state.users,
        updateUser,
        removeUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
