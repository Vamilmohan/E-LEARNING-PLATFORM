import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ManualQuizCreator from "../../components/forms/ManualQuizCreator";
import InstructorProfile from "../InstructorProfile";
// --- NEW IMPORTS ---
import CourseForm from "../../components/courses/CourseForm"; 
import CourseCard from "../../components/courses/CourseCard";
import CoursePlayer from "../../components/courses/CoursePlayer";
import QuizManagement from "../../components/quizzes/QuizManagement";
import ErrorBoundary from "../../components/ErrorBoundary";
export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("APP_COURSES") || "[]"));
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem("APP_ENROLLMENTS") || "[]"));
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZZES") || "[]"));
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("APP_COMPLAINTS") || "[]"));
  const [selectedCourse,setSelectedCourse]=useState(null);
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

  const myCourses = (courses || []).filter(c => c.instructorId === user.id);
  const myEnrollments = (enrollments || []).filter(e => (myCourses || []).some(c => c.id === e.courseId));
  const myQuizzes = (quizzes || []).filter(q => (myCourses || []).some(c => c.id === q.courseId));

  // --- UPDATED ADD COURSE LOGIC ---
  const addCourse = (courseData) => {
    const newFullCourse = { 
      ...courseData, 
      id: Date.now().toString(), 
      instructorId: user.id, 
      instructorName: user.name,
      isMandatory: false 
    };
    setCourses([...courses, newFullCourse]);
    setActiveTab("courses"); // Redirect to list after adding
    alert("Course Published Successfully!");
  };

  const addQuiz = (quiz) => {
    const newQuiz = {
      ...quiz,
      id: Date.now().toString(),
      published: false
    };
    setQuizzes([...quizzes, newQuiz]);
  };

  const updateQuiz = (quizId, updatedQuiz) => {
    setQuizzes(quizzes.map(q => q.id === quizId ? { ...q, ...updatedQuiz } : q));
  };

  const publishQuiz = (quizId, publishData) => {
    setQuizzes(quizzes.map(q =>
      q.id === quizId
        ? { ...q, ...publishData }
        : q
    ));
  };

  const extendDeadline = (quizId, newDeadline) => {
    setQuizzes(quizzes.map(q =>
      q.id === quizId
        ? { ...q, deadline: newDeadline }
        : q
    ));
  };
  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? All enrollment data for this course will be lost.")) {
      const updatedCourses = courses.filter(c => c.id !== courseId);
      setCourses(updatedCourses);
      
      // Also clean up enrollments related to this course
      const updatedEnrollments = enrollments.filter(e => e.courseId !== courseId);
      setEnrollments(updatedEnrollments);
    }
  };

  const totalCourses = myCourses.length;
  const totalEnrollments = myEnrollments.length;
  const totalQuizzes = myQuizzes.length;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-mortarboard me-2"></i>E-Learning Platform
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link text-white">Welcome, {user.name}</span>
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
          <h5 className="text-primary mb-4">Instructor Menu</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "dashboard" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("dashboard")}>
                <i className="bi bi-house-door me-2"></i>Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "all-platform-courses" ? "text-primary fw-bold" : "text-dark"}`} 
                onClick={() => setActiveTab("all-platform-courses")}>
                <i className="bi bi-globe me-2"></i>Platform Courses
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("courses")}>
                <i className="bi bi-collection me-2"></i>My Courses
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "create-course" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("create-course")}>
                <i className="bi bi-plus-circle me-2"></i>Create Course
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "students" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("students")}>
                <i className="bi bi-people me-2"></i>Students
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "quizzes" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("quizzes")}>
                <i className="bi bi-question-circle me-2"></i>Quizzes
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start w-100 ${activeTab === "profile" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("profile")}>
                <i className="bi bi-person me-2"></i>Profile
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          {activeTab === "dashboard" && (
            <div>
              <div className="text-white p-5 mb-4 rounded shadow" style={{backgroundColor:'#0DCAF0'}}>
                <h1 className="display-4 fw-bold">Instructor Dashboard</h1>
                <p className="lead">Manage your professional courses and track student growth.</p>
              </div>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow border-0 p-3">
                    <div className="card-body">
                      <i className="bi bi-book display-4 text-primary"></i>
                      <h5 className="card-title mt-2">My Courses</h5>
                      <p className="card-text display-4 fw-bold">{totalCourses}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow border-0 p-3">
                    <div className="card-body">
                      <i className="bi bi-people display-4 text-success"></i>
                      <h5 className="card-title mt-2">Total Enrollments</h5>
                      <p className="card-text display-4 fw-bold">{totalEnrollments}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow border-0 p-3">
                    <div className="card-body">
                      <i className="bi bi-question-circle display-4 text-warning"></i>
                      <h5 className="card-title mt-2">My Quizzes</h5>
                      <p className="card-text display-4 fw-bold">{totalQuizzes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "all-platform-courses" && (
            <div>
              <h2 className="mb-4 fw-bold text-dark">All Courses on Platform</h2>
              <div className="row g-4">
                {courses.map(course => (
                  <div key={course.id} className="col-md-4">
                    <CourseCard course={course} onView={(course) => {
                          setSelectedCourse(course);
                          setActiveTab("view-course"); 
                        }}  />
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* --- UPDATED MY COURSES TAB --- */}
          {activeTab === "courses" && (
            <div>
              <h2 className="mb-4 fw-bold">My Published Courses</h2>
              <div className="row g-4">
                {myCourses.length > 0 ? (
                  myCourses.map(course => (
                    <div key={course.id} className="col-md-6 col-lg-4">
                      <CourseCard 
                        course={course} 
                        // 1. Logic to enter the "Player" view
                        onView={(course) => {
                          setSelectedCourse(course);
                          setActiveTab("view-course"); 
                        }} 
                        // 2. Logic to delete the course
                        onDelete={deleteCourse} 
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 bg-white rounded shadow-sm">
                    <p className="text-muted">You haven't created any courses yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "view-course" && selectedCourse && (
            <CoursePlayer 
              course={selectedCourse} 
              onBack={() => {
                setSelectedCourse(null);
                setActiveTab("courses"); // Goes back to the list
              }} 
            />
          )}

          {/* --- UPDATED CREATE COURSE TAB --- */}
          {activeTab === "create-course" && (
            <div>
              <h2 className="mb-4 fw-bold">Design New Course</h2>
              <div className="card shadow border-0">
                <div className="card-body p-4">
                   <CourseForm onSubmit={addCourse} onCancel={() => setActiveTab("dashboard")} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div>
              <h2 className="mb-4 fw-bold">Enrolled Students</h2>
              {myCourses.map(course => (
                <div key={course.id} className="mb-4 p-3 bg-white rounded shadow-sm">
                  <h4 className="text-primary">{course.title}</h4>
                  <div className="row mt-3">
                    {enrollments.filter(e => e.courseId === course.id).length > 0 ? (
                        enrollments.filter(e => e.courseId === course.id).map(e => (
                            <div key={e.userId} className="col-md-4 mb-3">
                              <div className="card border-0 bg-light p-2">
                                <div className="card-body text-center">
                                  <i className="bi bi-person-circle fs-3 text-secondary"></i>
                                  <p className="card-text mt-2 mb-0 small text-muted">Student ID: {e.userId}</p>
                                </div>
                              </div>
                            </div>
                        ))
                    ) : <p className="text-muted ms-2">No students enrolled yet.</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "quizzes" && (
            <ErrorBoundary>
              <QuizManagement
                courses={courses}
                quizzes={myQuizzes}
                quizAttempts={quizAttempts}
                onCreateQuiz={addQuiz}
                onUpdateQuiz={updateQuiz}
                onPublishQuiz={publishQuiz}
                onExtendDeadline={extendDeadline}
              />
            </ErrorBoundary>
          )}

          {activeTab === "profile" && (
            <InstructorProfile />
          )}
        </div>
      </div>
    </div>
  );
}