import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Navigation bar - shows different links based on login status and user role
export default function Navbar(){
  // Get authentication state from context
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const getProfilePath = () => {
    if (!user) return "/";
    const basePath = `/dashboard/${user.role}?tab=profile`;
    const currentTab = new URLSearchParams(location.search).get("tab");
    if (location.pathname === `/dashboard/${user.role}` && currentTab === "profile") {
      return `${basePath}&_=${Date.now()}`;
    }
    return basePath;
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark app-navbar shadow"
      style={{ height: "56px" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-mortarboard me-2"></i>E-Learning Platform
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          {/* Use profile icon for mobile toggler to match design */}
          <i className="bi bi-person-circle text-white fs-4" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link btn btn-outline-light btn-sm rounded-pill mx-1 ${
                        isActive ? "active" : ""
                      }`
                    }
                    to="/signup"
                  >
                    Signup
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link btn btn-outline-light btn-sm rounded-pill mx-1 ${
                        isActive ? "active" : ""
                      }`
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                <li className="nav-item dropdown d-none d-lg-block">
                  <button
                    className="btn btn-link nav-link dropdown-toggle text-white p-0 d-flex align-items-center"
                    id="profileDropdownDesktop"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    <i className="bi bi-person-circle fs-4 me-2" />
                    <span className="d-none d-xl-inline">Account</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdownDesktop">
                    <li className="dropdown-header small text-muted px-3">Signed in as</li>
                    <li className="px-3 py-2">
                      <div className="fw-bold">{user.name}</div>
                      <div className="small text-muted">{user.email}</div>
                      <div className="small text-muted">Role: {user.role}</div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to={getProfilePath()}>
                        <i className="bi bi-person me-2"></i>View Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li className="px-3 py-2">
                      <button className="btn btn-danger w-100" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item d-lg-none">
                  <div className="p-2 bg-white rounded shadow-sm mb-2">
                    <div className="small text-muted">Signed in as</div>
                    <div className="fw-bold">{user.name}</div>
                    <div className="small text-muted mb-2">{user.email}</div>
                    <div className="mb-2"><span className="small text-muted">Role:</span> <strong className="ms-1">{user.role}</strong></div>
                    <div>
                      <Link className="btn btn-sm btn-outline-primary w-100 mb-2" to={getProfilePath()}>
                        <i className="bi bi-person me-2"></i>View Profile
                      </Link>
                      <button className="btn btn-danger w-100" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </div>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}


// This navbar used in singup.jsx,login.jsx,admindashboard,studentdashboard,instructordashboard
