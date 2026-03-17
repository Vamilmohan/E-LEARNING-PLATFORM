import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, error, user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form).then((success) => {
      if (success) {
        navigate(`/dashboard/${user.role}`);
      }
    });
  };

  return (
    <form className="card p-4 shadow" onSubmit={handleSubmit}>
      <h3>Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}

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

      <button className="btn btn-success mt-3 w-100">Login</button>
    </form>
  );
}