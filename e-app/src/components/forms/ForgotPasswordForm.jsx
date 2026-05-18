import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

// ForgotPasswordForm - handles forgot password flow with OTP verification
export default function ForgotPasswordForm({ onBack }) {
  const [step, setStep] = useState("email"); // "email", "otp", or "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  
  const { sendForgotPasswordOtp, verifyForgotPasswordOtp, resetPassword, error, message, loading } = useAuth();

  // Handle email submission - send OTP
  const handleSendOTP = (e) => {
    e.preventDefault();
    let newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    sendForgotPasswordOtp({ email }).then((success) => {
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
    verifyForgotPasswordOtp({ email, otp }).then((success) => {
      if (success) {
        setStep("reset");
      }
    });
  };

  // Handle password reset
  const handleResetPassword = (e) => {
    e.preventDefault();
    let newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters.";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    resetPassword({ email, otp, newPassword }).then((success) => {
      if (success) {
        // Reset form and go back to login
        setStep("email");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          onBack();
        }, 2000); // Give user 2 seconds to see the success message
      }
    });
  };

  // Step 1: Email verification
  if (step === "email") {
    return (
      <form className="card p-4 shadow auth-card" onSubmit={handleSendOTP}>
        <div className="auth-card-header">
          <span className="auth-card-badge">Recover Access</span>
          <h3>Forgot Password?</h3>
          <p>Enter your registered email to receive an OTP for password reset.</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="input-group mb-2">
          <span className="input-group-text">
            <i className="bi bi-envelope"></i>
          </span>
          <input
            className="form-control"
            placeholder="Enter your registered email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {errors.email && <div className="text-danger small">{errors.email}</div>}

        <button 
          className="btn btn-success mt-3 w-100 auth-action-btn"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <button
          type="button"
          className="btn btn-link mt-2 w-100 auth-action-muted"
          onClick={onBack}
        >
          Back to Login
        </button>
      </form>
    );
  }

  // Step 2: OTP verification
  if (step === "otp") {
    return (
      <form className="card p-4 shadow auth-card" onSubmit={handleVerifyOTP}>
        <div className="auth-card-header">
          <span className="auth-card-badge">Verify</span>
          <h3>Verify OTP</h3>
          <p>Enter the 6-digit code sent to your email.</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <p className="small text-muted">OTP sent to: <strong>{email}</strong></p>

        <div className="input-group mb-2">
          <span className="input-group-text">
            <i className="bi bi-shield-lock"></i>
          </span>
          <input
            className="form-control"
            placeholder="Enter OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />
        </div>
        {errors.otp && <div className="text-danger small">{errors.otp}</div>}

        <button 
          className="btn btn-primary mt-3 w-100"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          className="btn btn-link mt-2 w-100 auth-action-muted"
          onClick={() => {
            setStep("email");
            setOtp("");
            setErrors({});
          }}
        >
          Back to Email
        </button>
      </form>
    );
  }

  // Step 3: Reset password
  if (step === "reset") {
    return (
      <form className="card p-4 shadow auth-card" onSubmit={handleResetPassword}>
        <div className="auth-card-header">
          <span className="auth-card-badge">Reset</span>
          <h3>Set New Password</h3>
          <p>Enter your new password to regain access to your account.</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="input-group mb-2">
          <span className="input-group-text">
            <i className="bi bi-lock"></i>
          </span>
          <input
            className="form-control"
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {errors.newPassword && <div className="text-danger small">{errors.newPassword}</div>}

        <div className="input-group mb-2">
          <span className="input-group-text">
            <i className="bi bi-lock-fill"></i>
          </span>
          <input
            className="form-control"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errors.confirmPassword && <div className="text-danger small">{errors.confirmPassword}</div>}

        <button 
          className="btn btn-success mt-3 w-100 auth-action-btn"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <button
          type="button"
          className="btn btn-link mt-2 w-100 auth-action-muted"
          onClick={() => {
            setStep("otp");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
          }}
        >
          Back to OTP Verification
        </button>
      </form>
    );
  }
}

//this component is used in Login.jsx
