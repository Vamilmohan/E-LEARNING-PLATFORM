import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import InstructorDashboard from "./pages/dashboards/InstructorDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Profile from "./pages/Profile";
import InstructorProfile from "./pages/InstructorProfile";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatBot from "react-chatbotify";

export default function App() {
  return (
    <BrowserRouter>
     <ChatBot/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["student", "instructor", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor-profile"
          element={
            <ProtectedRoute roles={["instructor", "admin"]}>
              <InstructorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/instructor"
          element={
            <ProtectedRoute roles={["instructor"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}