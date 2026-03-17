import { createContext, useReducer, useEffect, useContext } from "react";
import { authReducer, initialAuthState } from "./authReducer";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState, () => {
    const savedAuth = localStorage.getItem("APP_AUTH");
    const auth = savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, user: null, token: null, error: null };
    return auth;
  });

  useEffect(() => {
    localStorage.setItem("APP_AUTH", JSON.stringify({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      error: state.error,
      token: state.token,
    }));
  }, [state]);

  const signup = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        dispatch({ type: "SET_ERROR", payload: body.error || "Signup failed" });
        return false;
      }
      dispatch({ type: "SIGNUP", payload: { user: body.user, token: body.token } });
      return true;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Signup failed" });
      return false;
    }
  };

  const login = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        dispatch({ type: "SET_ERROR", payload: body.error || "Invalid email or password" });
        return false;
      }
      dispatch({ type: "LOGIN", payload: { user: body.user, token: body.token } });
      return true;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Login failed" });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (userId, updates) => {
    // TODO: implement backend update endpoint when ready
    dispatch({ type: "SET_ERROR", payload: "Update user not implemented" });
  };

  const removeUser = (userId) => {
    // TODO: implement backend delete endpoint when ready
    dispatch({ type: "SET_ERROR", payload: "Remove user not implemented" });
  };

  return (
    <AuthContext.Provider value={{ ...state, signup, login, logout, updateUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);