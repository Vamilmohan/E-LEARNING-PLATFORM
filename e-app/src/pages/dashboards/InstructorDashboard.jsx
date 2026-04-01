import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ManualQuizCreator from "../../components/forms/ManualQuizCreator";
import InstructorProfile from "../InstructorProfile";
import CourseForm from "../../components/courses/CourseForm";
import CourseCard from "../../components/courses/CourseCard";
import CoursePlayer from "../../components/courses/CoursePlayer";
import QuizManagement from "../../components/quizzes/QuizManagement";
import ErrorBoundary from "../../components/ErrorBoundary";
import InstructorAnalytics from "../../components/InstructorAnalytics";
import StudentPerformanceDashboard from "../../components/StudentPerformanceDashboard";

export default function InstructorDashboard() {
  const { user, logout, users } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentAnalytics, setSelectedStudentAnalytics] = useState(null);

  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("APP_COURSES") || "[]"));
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem("APP_ENROLLMENTS") || "[]"));
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZZES") || "[]"));
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("APP_COMPLAINTS") || "[]"));
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZ_ATTEMPTS") || "[]"));
  const [courseProgress, setCourseProgress] = useState(() => JSON.parse(localStorage.getItem("APP_COURSE_PROGRESS") || "{}"));

  useEffect(() => { localStorage.setItem("APP_COURSES", JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem("APP_ENROLLMENTS", JSON.stringify(enrollments)); }, [enrollments]);
  useEffect(() => { localStorage.setItem("APP_QUIZZES", JSON.stringify(quizzes)); }, [quizzes]);
  useEffect(() => { localStorage.setItem("APP_COMPLAINTS", JSON.stringify(complaints)); }, [complaints]);
  useEffect(() => { localStorage.setItem("APP_QUIZ_ATTEMPTS", JSON.stringify(quizAttempts)); }, [quizAttempts]);
  useEffect(() => { localStorage.setItem("APP_COURSE_PROGRESS", JSON.stringify(courseProgress)); }, [courseProgress]);

  const myCourses = (courses || []).filter(c => c.instructorId === user.id);
  const myEnrollments = (enrollments || []).filter(e => (myCourses || []).some(c => c.id === e.courseId));
  const myQuizzes = (quizzes || []).filter(q => (myCourses || []).some(c => c.id === q.courseId));

  const addCourse = (courseData) => {
    const newFullCourse = {
      ...courseData,
      id: Date.now().toString(),
      instructorId: user.id,
      instructorName: user.name,
      isMandatory: false
    };
    setCourses([...courses, newFullCourse]);
    setActiveTab("courses");
    alert("Course Published Successfully!");
  };

  const addQuiz = (quiz) => {
    const newQuiz = { ...quiz, id: Date.now().toString(), published: false };
    setQuizzes([...quizzes, newQuiz]);
  };

  const updateQuiz = (quizId, updatedQuiz) => setQuizzes(quizzes.map(q => q.id === quizId ? { ...q, ...updatedQuiz } : q));
  const publishQuiz = (quizId, publishData) => setQuizzes(quizzes.map(q => q.id === quizId ? { ...q, ...publishData } : q));
  const extendDeadline = (quizId, newDeadline) => setQuizzes(quizzes.map(q => q.id === quizId ? { ...q, deadline: newDeadline } : q));

  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? All enrollment data for this course will be lost.")) {
      setCourses(courses.filter(c => c.id !== courseId));
      setEnrollments(enrollments.filter(e => e.courseId !== courseId));
    }
  };

  const totalCourses = myCourses.length;
  const totalEnrollments = myEnrollments.length;
  const totalQuizzes = myQuizzes.length;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow" style={{ height: '56px' }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#"><i className="bi bi-mortarboard me-2"></i>E-Learning Platform</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><span className="nav-link text-white">Welcome, {user.name}</span></li>
              <li className="nav-item"><button className="btn btn-outline-light ms-2" onClick={logout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="bg-white shadow-sm p-3" style={{ width: '250px', minHeight: '100%' }}>
          <h5 className="text-primary mb-4">Instructor Menu</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2"><button className={`nav-link btn btn-link text-start w-100 ${activeTab === "dashboard" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("dashboard")}><i className="bi bi-house-door me-2"></i>Dashboard</button></li>
            <li className="nav-item mb-2"><button className={`nav-link btn btn-link text-start w-100 ${activeTab === "all-platform-courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("all-platform-courses")}><i className="bi bi-globe me-2"></i>Platform Courses</button></li>
            <li className="nav-item mb-2"><button className={`nav-link btn btn-link text-start w-100 ${activeTab === "courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("courses")}><i className="bi bi-collection me-2"></i>My Courses</button></li>
            <li className="nav-item mb-2"><button className={`nav-link btn btn-link text-start w-100 ${activeTab === "create-course" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("create-course")}><i className="bi bi-plus-circle me-2"></i>Create Course</button></li>
            <li className="nav-item mb-2"><button className={`nav-link btn btn-link text-start w-100 ${activeTab === "students" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("students")}><i className="bi bi-people me-2"></i>Students</button></li>
            <li className="nav-item mb-2"><button className={`nav-link btn btn-link text-start w-100 ${activeTab === "quizzes" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("quizzes")}><i className="bi bi-question-circle me-2"></i>Quizzes</button></li>
            <li className="nav-item mb-2"><button className={`nav-link btn btn-link text-start w-100 ${activeTab === "analytics" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("analytics")}><i className="bi bi-bar-chart-line me-2"></i>Analytics</button></li>
            <li className="nav-item mb-2"><button className={`nav-link btn btn-link text-start w-100 ${activeTab === "profile" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("profile")}><i className="bi bi-person me-2"></i>Profile</button></li>
          </ul>
        </div>

        <div className="flex-grow-1 p-4">
          {activeTab === "dashboard" && (
            <div>
              <div className="text-white p-5 mb-4 rounded shadow" style={{ backgroundColor: '#0DCAF0' }}>
                <h1 className="display-4 fw-bold">Instructor Dashboard</h1>
                <p className="lead">Manage your professional courses and track student growth.</p>
              </div>
              <div className="row">
                <div className="col-md-4 mb-4"><div className="card text-center shadow border-0 p-3"><div className="card-body"><i className="bi bi-book display-4 text-primary"></i><h5 className="card-title mt-2">My Courses</h5><p className="card-text display-4 fw-bold">{totalCourses}</p></div></div></div>
                <div className="col-md-4 mb-4"><div className="card text-center shadow border-0 p-3"><div className="card-body"><i className="bi bi-people display-4 text-success"></i><h5 className="card-title mt-2">Total Enrollments</h5><p className="card-text display-4 fw-bold">{totalEnrollments}</p></div></div></div>
                <div className="col-md-4 mb-4"><div className="card text-center shadow border-0 p-3"><div className="card-body"><i className="bi bi-question-circle display-4 text-warning"></i><h5 className="card-title mt-2">My Quizzes</h5><p className="card-text display-4 fw-bold">{totalQuizzes}</p></div></div></div>
              </div>
            </div>
          )}

          {activeTab === "all-platform-courses" && (
            <div>
              <h2 className="mb-4 fw-bold text-dark">All Courses on Platform</h2>
              <div className="row g-4">{courses.map(course => <div key={course.id} className="col-md-4"><CourseCard course={course} onView={(course) => { setSelectedCourse(course); setActiveTab("view-course"); }} /></div>)}</div>
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              <h2 className="mb-4 fw-bold">My Published Courses</h2>
              <div className="row g-4">{myCourses.length > 0 ? myCourses.map(course => <div key={course.id} className="col-md-6 col-lg-4"><CourseCard course={course} onView={(course) => { setSelectedCourse(course); setActiveTab("view-course"); }} onDelete={deleteCourse} /></div>) : <div className="text-center py-5 bg-white rounded shadow-sm"><p className="text-muted">You haven't created any courses yet.</p></div>}</div>
            </div>
          )}

          {activeTab === "view-course" && selectedCourse && (
            <CoursePlayer course={selectedCourse} onBack={() => { setSelectedCourse(null); setActiveTab("courses"); }} />
          )}

          {activeTab === "create-course" && (
            <div><h2 className="mb-4 fw-bold">Design New Course</h2><div className="card shadow border-0"><div className="card-body p-4"><CourseForm onSubmit={addCourse} onCancel={() => setActiveTab("dashboard")} /></div></div></div>
          )}

          {activeTab === "students" && (
            <div>
              <h2 className="mb-4 fw-bold">Enrolled Students</h2>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Search by student name or id..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} />
              </div>
              {myCourses.map(course => {
                const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
                const courseStudents = users.filter(u => courseEnrollments.some(e => e.userId === u.id));
                const filteredStudents = courseStudents.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.id.toString().includes(studentSearch));
                return (
                  <div key={course.id} className="mb-4 p-3 bg-white rounded shadow-sm">
                    <h4 className="text-primary">{course.title}</h4>
                    {courseStudents.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr><th>Student ID</th><th>Name</th><th>Action</th></tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map(student => (
                              <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td><button className="btn btn-sm btn-primary" onClick={() => setSelectedStudentAnalytics({ student, course })}>View</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <p className="text-muted">No students enrolled yet.</p>}
                  </div>
                );
              })}
              {selectedStudentAnalytics && (
                <StudentPerformanceDashboard
                  student={selectedStudentAnalytics.student}
                  course={selectedStudentAnalytics.course}
                  enrollments={enrollments}
                  courseProgress={courseProgress}
                  quizAttempts={quizAttempts}
                  quizzes={quizzes}
                  onClose={() => setSelectedStudentAnalytics(null)}
                />
              )}
            </div>
          )}

          {activeTab === "quizzes" && (
            <ErrorBoundary>
              <QuizManagement courses={courses} quizzes={myQuizzes} quizAttempts={quizAttempts} onCreateQuiz={addQuiz} onUpdateQuiz={updateQuiz} onPublishQuiz={publishQuiz} onExtendDeadline={extendDeadline} />
            </ErrorBoundary>
          )}

          {activeTab === "analytics" && (
            <InstructorAnalytics userId={user.id} courses={courses} enrollments={enrollments} quizzes={quizzes} quizAttempts={quizAttempts} users={users} />
          )}

          {activeTab === "profile" && <InstructorProfile />}
        </div>
      </div>
    </div>
  );
}
