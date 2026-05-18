import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useChatBot } from "../../context/ChatBotContext";

// SignupForm - form for new users to create an account
export default function SignupForm() {
  // Form data - name, email, password, role (student/instructor/admin)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // Get auth functions and state from auth context
  const { sendOTP, verifyOTP, error, message, loading } = useAuth();
  const toast = useToast();
  // Get chatbot function from chatbot context
  const { openChatBot } = useChatBot();

  // Handle form submission - send OTP
  const handleSendOTP = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length <= 4) {
      newErrors.name = "Name must be more than 4 characters.";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(form.name.trim())) {
      newErrors.name = "Name must contain only letters,digits and spaces.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!["student", "instructor", "admin"].includes(form.role)) {
      newErrors.role = "Please select a valid role.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    sendOTP(form).then((success) => {
      if (success) {
        setStep("otp");
      }
    });
  };

  // Handle OTP verification
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }
    setErrors({});
    verifyOTP({ email: form.email, otp }).then((user) => {
      if (user) {
        toast.success("User created successfully!");
        navigate(`/dashboard/${user.role}`);
      }
    });
  };

  if (step === "otp") {
    return (
      <form className="card p-4 shadow auth-card" onSubmit={handleVerifyOTP}>
        <div className="auth-card-header">
          <span className="auth-card-badge">Verify</span>
          <h3>Verify Your Email</h3>
          <p>Enter the 6-digit code from your inbox to unlock access.</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <p>Please enter the 6-digit OTP sent to {form.email}</p>

        <div className="input-group mb-2">
          <span className="input-group-text">
            <i className="bi bi-shield-lock"></i>
          </span>
          <input
            className="form-control"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />
        </div>
        {errors.otp && <div className="text-danger">{errors.otp}</div>}

        <button className="btn btn-primary mt-3 w-100" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          className="btn btn-link mt-2 w-100"
          onClick={() => setStep("form")}
        >
          Back to Signup
        </button>
      </form>
    );
  }

  return (
    <form className="card p-4 shadow auth-card" onSubmit={handleSendOTP}>
      <div className="auth-card-header">
        <span className="auth-card-badge">Create Account</span>
        <h3>Signup</h3>
        <p>Register once and access stunning learning tools with premium design.</p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="input-group mb-2">
        <span className="input-group-text">
          <i className="bi bi-person"></i>
        </span>
        <input
          className="form-control"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      {errors.name && <div className="text-danger">{errors.name}</div>}

      <div className="input-group mb-2">
        <span className="input-group-text">
          <i className="bi bi-envelope"></i>
        </span>
        <input
          className="form-control"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      {errors.email && <div className="text-danger">{errors.email}</div>}

      <div className="input-group mb-2">
        <span className="input-group-text">
          <i className="bi bi-lock"></i>
        </span>
        <input
          className="form-control"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>
      {errors.password && <div className="text-danger">{errors.password}</div>}

      <div className="input-group mb-2">
        <span className="input-group-text">
          <i className="bi bi-lock-fill"></i>
        </span>
        <input
          className="form-control"
          placeholder="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          required
        />
      </div>
      {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}

      <select
        className="form-control mt-2"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && <div className="text-danger">{errors.role}</div>}

      <button className="btn btn-primary mt-3 w-100" disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
      <button 
        className="btn btn-link mt-2 w-100 auth-action-muted" 
        type="button" 
        onClick={openChatBot}
      >
        Need help?
      </button>
      <div className="text-center mt-3">
        <p className="text-muted small">
          Already have an account?{' '}
          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none auth-action-muted p-0"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>
      </div>
    </form>
  );
}


//this component used in singu.jsx page