import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Profile from "../Profile";
import CourseList from "../../components/courses/CourseList";
import CoursePlayer from "../../components/courses/CoursePlayer";
import QuizTaker from "../../components/quizzes/QuizTaker";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCourse,setSelectedCourse]=useState(null);

  // Data
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("APP_COURSES") || "[]"));
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem("APP_ENROLLMENTS") || "[]"));
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZZES") || "[]"));
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("APP_COMPLAINTS") || "[]"));
  const [takingQuiz, setTakingQuiz] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZ_ATTEMPTS") || "[]"));

  useEffect(() => {
    localStorage.setItem("APP_COURSES", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("APP_ENROLLMENTS", JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem("APP_QUIZZES", JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem("APP_COMPLAINTS", JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem("APP_QUIZ_ATTEMPTS", JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  const enrolledCourses = (enrollments || []).filter(e => e.userId === user.id).map(e => (courses || []).find(c => c.id === e.courseId)).filter(Boolean);
  const enrolledCourseIds = enrolledCourses.map(c => c.id);

  const availableQuizzes = quizzes.filter(q => {
    if (!q.published || !enrolledCourseIds.includes(q.courseId)) return false;

    // Check if quiz is still available (not past deadline)
    if (q.deadline && new Date() > new Date(q.deadline)) return false;

    // Check attempt limit
    const userAttempts = quizAttempts.filter(a => a.quizId === q.id && a.studentId === user.id);
    if (q.maxAttempts && userAttempts.length >= q.maxAttempts) return false;

    return true;
  });

  const availableCourses = (courses || []).filter(c => !(enrollments || []).some(e => e.userId === user.id && e.courseId === c.id));

  const completedQuizzes = quizAttempts.filter(attempt => attempt.studentId === user.id).map(attempt => {
    const quiz = quizzes.find(q => q.id === attempt.quizId);
    const course = courses.find(c => c.id === quiz?.courseId);
    return {
      ...attempt,
      quizTitle: quiz?.title || 'Unknown Quiz',
      courseTitle: course?.title || 'Unknown Course',
      quiz
    };
  });

  const enroll = (courseId) => {
    setEnrollments([...enrollments, { userId: user.id, courseId }]);
  };

  const fileComplaint = (complaint) => {
    setComplaints([...complaints, { id: Date.now(), userId: user.id, userName: user.name, complaint, status: 'pending' }]);
  };

  const handleQuizComplete = (attemptData) => {
    setQuizAttempts([...quizAttempts, attemptData]);
    setTakingQuiz(null);
    // Removed alert - results will be shown in completed quizzes section
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-book-half me-2"></i>E-Learning Platform
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link">Welcome, {user.name}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-white shadow-sm p-3" style={{ width: '250px', minHeight: 'calc(100vh - 76px)' }}>
          <h5 className="text-primary mb-4">Student Menu</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "dashboard" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("dashboard")}>
                <i className="bi bi-house-door me-2"></i>Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "Enrolled Courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("Enrolled Courses")}>
                <i className="bi bi-collection me-2"></i>Enrolled Courses
              </button>
            </li>
              <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "Completed Courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("Completed Courses")}>
                <i className="bi bi-check-square-fill me-2"></i>Completed Courses
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "browse" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("browse")}>
                <i className="bi bi-search me-2"></i>Browse Courses
              </button>
            </li>
              <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "mandatory courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("mandatory courses")}>
                <i className="bi bi-asterisk me-2"></i>Mandatory Courses
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "quizzes" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("quizzes")}>
                <i className="bi bi-question-circle me-2"></i>Available Quizzes
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "completed-quizzes" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("completed-quizzes")}>
                <i className="bi bi-check-circle me-2"></i>Completed Quizzes
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "performance" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("performance")}>
                <i className="bi bi-graph-up me-2"></i>Performance
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "profile" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("profile")}>
                <i className="bi bi-person me-2"></i>Profile
              </button>
            </li>
          
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "complaints" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("complaints")}>
                <i className="bi bi-exclamation-triangle me-2"></i>Complaints
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          {activeTab === "dashboard" && (
            <div>
              <div style={{ backgroundColor: '#0DCAF0', color: 'white' }} className="p-5 mb-4 rounded shadow">
                <h1 className="display-4">Welcome back, {user.name}!</h1>
                <p className="lead">Continue your learning journey.</p>
              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-book display-4 text-primary"></i>
                      <h5 className="card-title">Enrolled Courses</h5>
                      <p className="card-text display-4">{enrolledCourses.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-trophy display-4 text-success"></i>
                      <h5 className="card-title">Completed Courses</h5>
                      <p className="card-text display-4">0</p> {/* Placeholder */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-book display-4 text-info"></i>
                      <h5 className="card-title">Available Courses</h5>
                      <p className="card-text display-4">{courses.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-question-circle display-4 text-warning"></i>
                      <h5 className="card-title">Available Quizzes</h5>
                      <p className="card-text display-4">{availableQuizzes.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              <h4>Recent Activity</h4>
              <p>No recent activity.</p> {/* Placeholder */}
            </div>
          )}

          {activeTab === "Enrolled Courses" && (
            <div>
              <h2 className="mb-4 fw-bold text-dark">My Enrolled Courses</h2>
              <div className="row">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text">{course.description}</p>
                        <p className="text-muted">Instructor: {course.instructorName}</p>
                        <div className="progress mb-2">
                          <div className="progress-bar bg-success" style={{ width: '0%' }}></div>
                        </div>
                        <small>0% Complete</small>
                        <button 
                          className="btn btn-primary mt-2 me-2"
                          onClick={() => {
                            setSelectedCourse(course);
                            setActiveTab("view-course");
                          }}
                        >
                          Continue Learning
                        </button>
                        <button 
                          className="btn btn-outline-primary mt-2"
                          onClick={() => setActiveTab("quizzes")}
                        >
                          View Quizzes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {enrolledCourses.length === 0 && (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <i className="bi bi-info-circle display-4 text-muted mb-3"></i>
                      <h5 className="text-muted">No enrolled courses yet</h5>
                      <p className="text-muted">Browse available courses and enroll to start learning</p>
                      <button 
                        className="btn btn-primary mt-3"
                        onClick={() => setActiveTab("browse")}
                      >
                        Browse Courses
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "browse" && (
            <div>
              <h2 className="mb-4 fw-bold text-dark">Explore New Skills</h2>
              {/* We pass the availableCourses and a function to 'View' them */}
              <CourseList 
                courses={availableCourses} 
                onViewCourse={(course) => {
                  setSelectedCourse(course);
                  setActiveTab("view-course"); // We will create this tab next!
                }} 
              />
            </div>
          )}

          {activeTab === "quizzes" && !takingQuiz && (
            <div>
              <h2 className="mb-4">Available Quizzes</h2>
              <div className="row">
                {availableQuizzes.map(quiz => {
                  const userAttempts = quizAttempts.filter(a => a.quizId === quiz.id && a.studentId === user.id);
                  const canTakeQuiz = !quiz.maxAttempts || userAttempts.length < quiz.maxAttempts;

                  return (
                    <div key={quiz.id} className="col-md-4 mb-4">
                      <div className="card shadow h-100">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{quiz.title}</h5>
                          <p className="card-text">Course: {(courses || []).find(c => c.id === quiz.courseId)?.title}</p>
                          <p className="text-muted small">Questions: {quiz.totalQuestions}</p>
                          {quiz.deadline && (
                            <p className="text-muted small">
                              Deadline: {new Date(quiz.deadline).toLocaleDateString()}
                            </p>
                          )}
                          {userAttempts.length > 0 && (
                            <p className="text-muted small">
                              Attempts: {userAttempts.length}/{quiz.maxAttempts || '∞'}
                              {userAttempts.length > 0 && (
                                <span className="ms-2">
                                  Best Score: {Math.max(...userAttempts.map(a => a.score))}%
                                </span>
                              )}
                            </p>
                          )}
                          <div className="mt-auto">
                            {canTakeQuiz ? (
                              <button
                                className="btn btn-success w-100"
                                onClick={() => setTakingQuiz(quiz)}
                              >
                                <i className="bi bi-play-circle me-2"></i>Take Quiz
                              </button>
                            ) : (
                              <button className="btn btn-secondary w-100" disabled>
                                <i className="bi bi-x-circle me-2"></i>Max Attempts Reached
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {availableQuizzes.length === 0 && (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <i className="bi bi-info-circle display-4 text-muted mb-3"></i>
                      <h5 className="text-muted">No quizzes available</h5>
                      <p className="text-muted">Quizzes will appear here when your instructors publish them</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "completed-quizzes" && (
            <div>
              <h2 className="mb-4 fw-bold text-dark">Completed Quizzes</h2>
              <div className="row">
                {completedQuizzes.map((attempt, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                      <div className="card-body">
                        <h5 className="card-title">{attempt.quizTitle}</h5>
                        <p className="text-muted">Course: {attempt.courseTitle}</p>
                        <div className="row text-center mb-3">
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <div className="h4 text-primary fw-bold">{attempt.score}%</div>
                              <small className="text-muted">Score</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <div className={`h4 fw-bold ${
                                attempt.quiz?.hasPassingPercentage && attempt.quiz?.passingPercentage
                                  ? attempt.score >= attempt.quiz.passingPercentage ? 'text-success' : 'text-danger'
                                  : attempt.score >= 70 ? 'text-success' : 'text-danger'
                              }`}>
                                {attempt.quiz?.hasPassingPercentage && attempt.quiz?.passingPercentage
                                  ? attempt.score >= attempt.quiz.passingPercentage ? 'Passed' : 'Failed'
                                  : attempt.score >= 70 ? 'Passed' : 'Failed'
                                }
                              </div>
                              <small className="text-muted">Status</small>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted small mb-2">
                          Completed on: {new Date(attempt.completedAt).toLocaleDateString()}
                        </p>
                        {attempt.quiz?.hasPassingPercentage && attempt.quiz?.passingPercentage && (
                          <p className="text-muted small mb-0">
                            Passing Score: {attempt.quiz.passingPercentage}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {completedQuizzes.length === 0 && (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <i className="bi bi-check-circle display-4 text-muted mb-3"></i>
                      <h5 className="text-muted">No completed quizzes yet</h5>
                      <p className="text-muted">Complete some quizzes to see them here</p>
                      <button 
                        className="btn btn-primary mt-3"
                        onClick={() => setActiveTab("quizzes")}
                      >
                        Take a Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {takingQuiz && (
            <QuizTaker
              quiz={takingQuiz}
              studentId={user.id}
              onComplete={handleQuizComplete}
            />
          )}

          {activeTab === "profile" && (
            <div>
              <Profile />
            </div>
          )}

          {activeTab === "complaints" && (
            <div>
              <h2 className="mb-4">File a Complaint</h2>
              <div className="card shadow">
                <div className="card-body">
                  <ComplaintForm onSubmit={fileComplaint} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "view-course" && selectedCourse && (
            <CoursePlayer 
              course={selectedCourse}
              isEnrolled={(enrollments || []).some(e => e.userId === user.id && e.courseId === selectedCourse.id)}
              onEnroll={(courseId) => {
                enroll(courseId);
              }}
              onBack={() => {
                setSelectedCourse(null);
                setActiveTab("browse");
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ComplaintForm({ onSubmit }) {
  const [complaint, setComplaint] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(complaint);
    setComplaint("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea className="form-control" rows="4" value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Describe your complaint..." required />
      <button className="btn btn-warning mt-2">Submit Complaint</button>
    </form>
  );
}
