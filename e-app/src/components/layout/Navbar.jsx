import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">E-Learn</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">

            {!isAuthenticated && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/signup">Signup</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
              </>
            )}

            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to={`/dashboard/${user.role}`}>
                  {user.role} Dashboard
                </NavLink>
              </li>
            )}

          </ul>

          {isAuthenticated && (
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}