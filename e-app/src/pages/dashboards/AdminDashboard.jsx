import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
// --- NEW IMPORTS ---
import CourseCard from "../../components/courses/CourseCard";
import CoursePlayer from "../../components/courses/CoursePlayer";
import StudentPerformanceDashboard from "../../components/StudentPerformanceDashboard";

export default function AdminDashboard() {
  const { user, logout, users, updateUser, removeUser } = useAuth();
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourseForStudent, setSelectedCourseForStudent] = useState(null);

  // Data
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("APP_COURSES") || "[]"));
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem("APP_ENROLLMENTS") || "[]"));
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZZES") || "[]"));
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("APP_COMPLAINTS") || "[]"));
  const [courseProgress, setCourseProgress] = useState(() => JSON.parse(localStorage.getItem("APP_COURSE_PROGRESS") || "{}"));
  const [quizAttempts, setQuizAttempts] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZ_ATTEMPTS") || "[]"));

  // Sync Courses to LocalStorage when admin deletes something
  useEffect(() => {
    localStorage.setItem("APP_COURSES", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("APP_COMPLAINTS", JSON.stringify(complaints));
  }, [complaints]);

  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalQuizzes = quizzes.length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;

  const verifyUser = (userId) => {
    updateUser(userId, { verified: true });
  };

  const solveComplaint = (complaintId) => {
    setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: 'solved' } : c));
  };

  // --- ADMIN SPECIAL FEATURE: DELETE ANY COURSE ---
  const deleteAnyCourse = (courseId) => {
    if (window.confirm("ADMIN ACTION: Are you sure you want to delete this course from the entire platform?")) {
      setCourses(courses.filter(c => c.id !== courseId));
    }
  };

  const removeInstructor = (userId) => {
    if (window.confirm("Remove this instructor and all their courses?")) {
      removeUser(userId);
      setCourses(courses.filter(c => c.instructorId !== userId));
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow" style={{ height: '56px' }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-shield-lock-fill me-2 text-warning"></i>Admin Central
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link text-white">System Admin: {user.name}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-sm ms-3 mt-1" onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1" style={{ minHeight: 'calc(100vh - 56px)' }}>
        {/* Sidebar */}
        <div className="bg-white shadow-sm p-3" style={{ width: '250px', minHeight: '100%' }}>
          <h5 className="text-secondary mb-4 small fw-bold text-uppercase">Management</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "dashboard" ? "bg-primary text-white" : "text-dark"}`} onClick={() => setActiveTab("dashboard")}>
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "users" ? "bg-primary text-white" : "text-dark"}`} onClick={() => setActiveTab("users")}>
                <i className="bi bi-people me-2"></i>User Directory
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "courses" ? "bg-primary text-white" : "text-dark"}`} onClick={() => setActiveTab("courses")}>
                <i className="bi bi-collection-play me-2"></i>Global Courses
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "complaints" ? "bg-primary text-white" : "text-dark"}`} onClick={() => setActiveTab("complaints")}>
                <i className="bi bi-chat-left-dots me-2"></i>Complaints {pendingComplaints > 0 && <span className="badge bg-danger ms-2">{pendingComplaints}</span>}
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          
          {activeTab === "dashboard" && (
            <div>
              <div className="p-5 mb-4 rounded shadow-sm text-white" style={{backgroundColor: '#4f46e5'}}>
                <h1 className="display-5 fw-bold">Platform Overview</h1>
                <p className="lead">You have full control over users, courses, and system health.</p>
              </div>
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <h6 className="text-muted text-uppercase small">Total Users</h6>
                    <h2 className="fw-bold">{totalUsers}</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <h6 className="text-muted text-uppercase small">Active Courses</h6>
                    <h2 className="fw-bold text-success">{totalCourses}</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <h6 className="text-muted text-uppercase small">Live Quizzes</h6>
                    <h2 className="fw-bold text-info">{totalQuizzes}</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <h6 className="text-muted text-uppercase small">Pending Issues</h6>
                    <h2 className="fw-bold text-danger">{pendingComplaints}</h2>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="container-fluid p-0">
              <h2 className="mb-4 fw-bold">User Management</h2>

              {/* --- INSTRUCTORS SECTION --- */}
              <div className="card shadow-sm border-0 mb-5">
                <div className="card-header bg-primary text-white fw-bold">
                  <i className="bi bi-person-badge me-2"></i> Platform Instructors
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Courses</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.role === 'instructor').map(inst => {
                        // Calculate students under this instructor
                        const instCourseIds = courses.filter(c => c.instructorId === inst.id).map(c => c.id);
                        const studentCount = enrollments.filter(e => instCourseIds.includes(e.courseId)).length;

                        return (
                          <tr key={inst.id}>
                            <td>
                              <div className="fw-bold">{inst.name}</div>
                              <button className="btn btn-sm btn-link text-primary p-0" onClick={() => setSelectedInstructor(inst.id)}>
                                View {studentCount} Enrolled Students
                              </button>
                            </td>
                            <td>{inst.email}</td>
                            <td>{instCourseIds.length} Courses</td>
                            <td>
                              {!inst.verified && <button className="btn btn-sm btn-success me-2" onClick={() => verifyUser(inst.id)}>Verify</button>}
                              <button className="btn btn-sm btn-outline-danger" onClick={() => removeInstructor(inst.id)}>Remove</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedInstructor && (
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-info text-white fw-bold">Students Enrolled under Selected Instructor</div>
                  <div className="card-body">
                    <button className="btn btn-sm btn-secondary mb-3" onClick={() => setSelectedInstructor(null)}>Close</button>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr><th>Student ID</th><th>Name</th><th>Course</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {enrollments.filter(e => courses.some(c => c.instructorId === selectedInstructor && c.id === e.courseId)).map((enrollItem, idx) => {
                            const student = users.find(u => u.id === enrollItem.userId);
                            const course = courses.find(c => c.id === enrollItem.courseId);
                            if (!student || !course) return null;
                            return (
                              <tr key={`i-${idx}`}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{course.title}</td>
                                <td><button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedStudent(student); setSelectedCourseForStudent(course); }}>View</button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {selectedStudent && selectedCourseForStudent && (
                <StudentPerformanceDashboard
                  student={selectedStudent}
                  course={selectedCourseForStudent}
                  enrollments={enrollments}
                  courseProgress={courseProgress}
                  quizAttempts={quizAttempts}
                  quizzes={quizzes}
                  onClose={() => { setSelectedStudent(null); setSelectedCourseForStudent(null); }}
                />
              )}

              {/* --- STUDENTS SECTION --- */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-secondary text-white fw-bold">
                  <i className="bi bi-people me-2"></i> Registered Students
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Enrolled In</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.role === 'student').map(stud => (
                        <tr key={stud.id}>
                          <td className="fw-bold">{stud.name}</td>
                          <td>{stud.email}</td>
                          <td>{enrollments.filter(e => e.userId === stud.id).length} Courses</td>
                          <td>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeUser(stud.id)}>Delete Account</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              <h2 className="mb-4 fw-bold">Global Course Management</h2>
              <div className="row g-4">
                {courses.map(course => (
                  <div key={course.id} className="col-md-4">
                    <CourseCard 
                      course={course} 
                      onView={(c) => { setSelectedCourse(c); setActiveTab("view-course"); }} 
                      onDelete={deleteAnyCourse} // Admin delete power!
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "view-course" && selectedCourse && (
            <CoursePlayer course={selectedCourse} onBack={() => { setSelectedCourse(null); setActiveTab("courses"); }} />
          )}

          {activeTab === "complaints" && (
            <div>
              <h2 className="mb-4 fw-bold">Platform Complaints</h2>
              <div className="row g-3">
                {complaints.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <i className="bi bi-info-circle display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">No complaints yet</h5>
                    <p className="text-muted">Great job! No outstanding issues.</p>
                  </div>
                ) : (
                  complaints.map(c => (
                    <div key={c.id} className="col-md-6">
                      <div className={`card shadow-sm border-start border-4 ${c.status === 'pending' ? 'border-danger' : 'border-success'}`}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <h6 className="fw-bold">From: {c.userName}</h6>
                            <span className={`badge ${c.status === 'pending' ? 'bg-danger' : 'bg-success'}`}>{c.status}</span>
                          </div>
                          <p className="small mt-2">{c.complaint}</p>
                          {c.status === 'pending' && <button className="btn btn-sm btn-primary w-100 mt-2" onClick={() => solveComplaint(c.id)}>Resolve Issue</button>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}