import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "student", id: Date.now(), verified: true });
  const navigate = useNavigate();
  const { signup, error } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      dispatch({ type: "SET_ERROR", payload: "Passwords do not match" });
      return;
    }
    signup(form).then((success) => {
      if (success) {
        navigate(`/dashboard/${form.role}`);
      }
    });
  };

  return (
    <form className="card p-4 shadow" onSubmit={handleSubmit}>
      <h3>Signup</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-person"></i></span>
        <input className="form-control" placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
        <input className="form-control" placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-lock"></i></span>
        <input className="form-control" placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
        <input className="form-control" placeholder="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
      </div>

      <select className="form-control mt-2"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>

      <button className="btn btn-primary mt-3 w-100">Signup</button>
    </form>
  );
}