import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";

export default function Home() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"} shadow-sm`}>
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-primary" to="/">E-Learn Platform</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-outline-secondary me-2" onClick={toggleTheme}>
                  {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary me-2" to="/signup">Signup</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" style={{ minHeight: '75vh' }}>
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" style={{ backgroundColor: theme === 'dark' ? '#ffffff' : '#000000', opacity: 0.7 }}></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" style={{ backgroundColor: theme === 'dark' ? '#ffffff' : '#000000', opacity: 0.7 }}></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" style={{ backgroundColor: theme === 'dark' ? '#ffffff' : '#000000', opacity: 0.7 }}></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="3" style={{ backgroundColor: theme === 'dark' ? '#ffffff' : '#000000', opacity: 0.7 }}></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="4" style={{ backgroundColor: theme === 'dark' ? '#ffffff' : '#000000', opacity: 0.7 }}></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="5" style={{ backgroundColor: theme === 'dark' ? '#ffffff' : '#000000', opacity: 0.7 }}></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active" style={{ height: '75vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center p-5 text-white">
                <h1 className="display-4 fw-bold mb-4">Course Management</h1>
                <p className="lead mb-4">Create, edit, and organize courses with ease. Instructors can upload materials, set schedules, and track progress seamlessly. Manage multiple courses, assign resources, and monitor student engagement.</p>
                <ul className="list-unstyled d-inline-block text-start mb-4">
                  <li> Intuitive course builder with drag-and-drop</li>
                  <li>Multimedia content support (videos, PDFs, quizzes)</li>
                  <li>Progress tracking and analytics</li>
                  <li>Collaborative tools for team teaching</li>
                </ul>
                <br />
                <Link className="btn btn-light btn-lg mt-3" to="/signup">Get Started</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item" style={{ height: '75vh' }}>
            <div className="d-flex align-items-center justify-content-center h-100" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
              <div className="text-center p-5 text-white">
                <h1 className="display-4 fw-bold mb-4">Enroll Courses</h1>
                <p className="lead mb-4">Students can browse and enroll in courses, track their learning path, and access resources anytime, anywhere. Get personalized recommendations and certificates upon completion.</p>
                <ul className="list-unstyled d-inline-block text-start">
                  <li> Easy enrollment with one-click</li>
                  <li>Personalized dashboard with progress</li>
                  <li>24/7 access on any device</li>
                  <li> Certificate generation and sharing</li>
                </ul>
                <br />
                <Link className="btn btn-light btn-lg mt-3" to="/signup">Enroll Now</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item" style={{ height: '75vh' }}>
            <div className="d-flex align-items-center justify-content-center h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div className="text-center p-5 text-white">
                <h1 className="display-4 fw-bold mb-4">Notifications</h1>
                <p className="lead mb-4">Stay updated with real-time notifications for new courses, assignments, deadlines, and platform updates. Never miss important announcements or due dates.</p>
                <ul className="list-unstyled d-inline-block text-start">
                  <li> Instant alerts via email and app</li>
                  <li>Customizable notification preferences</li>
                  <li>Deadline reminders and updates</li>
                  <li>Community announcements</li>
                </ul>
                <br />
                <Link className="btn btn-light btn-lg mt-3" to="/signup">Learn More</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item" style={{ height: '75vh' }}>
            <div className="d-flex align-items-center justify-content-center h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="text-center p-5 text-white">
                <h1 className="display-4 fw-bold mb-4">Quizzes & Assessments</h1>
                <p className="lead mb-4">Take interactive quizzes, get instant feedback, and track your performance across courses with detailed analytics. Improve learning with adaptive questions.</p>
                <ul className="list-unstyled d-inline-block text-start">
                  <li>Multiple question types (MCQ, essay, coding)</li>
                  <li>Instant results and explanations</li>
                  <li>Performance analytics and reports</li>
                  <li>Timed quizzes with auto-submit</li>
                </ul>
                <br />
                <Link className="btn btn-light btn-lg mt-3" to="/signup">Start Quizzing</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item" style={{ height: '75vh' }}>
            <div className="d-flex align-items-center justify-content-center h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div className="text-center p-5 text-white">
                <h1 className="display-4 fw-bold mb-4">Feedback & Ratings</h1>
                <p className="lead mb-4">Rate courses and instructors, provide feedback to improve the learning experience and help others choose the best courses. Build a trusted community.</p>
                <ul className="list-unstyled d-inline-block text-start">
                  <li>5-star rating system for courses</li>
                  <li>Detailed reviews and comments</li>
                  <li>Instructor feedback and ratings</li>
                  <li>Community-driven recommendations</li>
                </ul>
                <br />
                <Link className="btn btn-light btn-lg mt-3" to="/signup">Give Feedback</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item" style={{ height: '75vh' }}>
            <div className="d-flex align-items-center justify-content-center h-100" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <div className="text-center p-5 text-white">
                <h1 className="display-4 fw-bold mb-4">Complaint Management</h1>
                <p className="lead mb-4">Report issues like malware content or platform problems. Admins review and resolve complaints promptly for a safe and reliable environment.</p>
                <ul className="list-unstyled d-inline-block text-start">
                  <li>Secure and anonymous reporting</li>
                  <li>Quick resolution by admins</li>
                  <li>Transparent process updates</li>
                  <li>Prevention of harmful content</li>
                </ul>
                <br />
                <Link className="btn btn-light btn-lg mt-3" to="/signup">Report Issue</Link>
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Features Carousel */}
      <section className={theme === "dark" ? "py-5 bg-dark text-white" : "py-5 bg-light"}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold animate__animated animate__fadeIn">Platform Features</h2>
        </div>
        <div className="container-fluid px-0">
          <div id="featuresCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#featuresCarousel" data-bs-slide-to="0" className="active bg-secondary"></button>
              <button type="button" data-bs-target="#featuresCarousel" data-bs-slide-to="1" className="bg-secondary"></button>
              <button type="button" data-bs-target="#featuresCarousel" data-bs-slide-to="2" className="bg-secondary"></button>
              <button type="button" data-bs-target="#featuresCarousel" data-bs-slide-to="3" className="bg-secondary"></button>
              <button type="button" data-bs-target="#featuresCarousel" data-bs-slide-to="4" className="bg-secondary"></button>
              <button type="button" data-bs-target="#featuresCarousel" data-bs-slide-to="5" className="bg-secondary"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active" style={{ height: '60vh' }}>
                <div className="row align-items-center" style={{ height: '60vh' }}>
                  <div className="col-md-6 text-center">
                    <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-circle d-inline-block animate__animated animate__bounceIn">
                      <span className="display-1 text-white">📚</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                        <h3 className="fw-bold text-primary animate__animated animate__fadeInRight">Course Management</h3>
                    <p className="lead animate__animated animate__fadeInRight animate__delay-1s">Create, edit, and organize courses with ease. Instructors can upload materials, set schedules, and track progress seamlessly. Manage multiple courses, assign resources, and monitor student engagement.</p>
                    <ul className="list-unstyled">
                      <li>Intuitive course builder with drag-and-drop</li>
                      <li>Multimedia content support (videos, PDFs, quizzes)</li>
                      <li>Progress tracking and analytics</li>
                      <li>Collaborative tools for team teaching</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row align-items-center" style={{ height: '60vh' }}>
                  <div className="col-md-6 text-center">
                    <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-circle d-inline-block animate__animated animate__bounceIn">
                      <span className="display-1 text-white">🎓</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="fw-bold text-success animate__animated animate__fadeInRight">Enroll Courses</h3>
                    <p className="lead animate__animated animate__fadeInRight animate__delay-1s">Students can browse and enroll in courses, track their learning path, and access resources anytime, anywhere. Get personalized recommendations and certificates upon completion.</p>
                    <ul className="list-unstyled">
                      <li>Easy enrollment with one-click</li>
                      <li>Personalized dashboard with progress</li>
                      <li>24/7 access on any device</li>
                      <li>Certificate generation and sharing</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row align-items-center" style={{ height: '60vh' }}>
                  <div className="col-md-6 text-center">
                    <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-circle d-inline-block animate__animated animate__bounceIn">
                      <span className="display-1 text-white">🔔</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="fw-bold text-warning animate__animated animate__fadeInRight">Notifications</h3>
                    <p className="lead animate__animated animate__fadeInRight animate__delay-1s">Stay updated with real-time notifications for new courses, assignments, deadlines, and platform updates. Never miss important announcements or due dates.</p>
                    <ul className="list-unstyled">
                      <li>Instant alerts via email and app</li>
                      <li>Customizable notification preferences</li>
                      <li>Deadline reminders and updates</li>
                      <li>Community announcements</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row align-items-center" style={{ height: '60vh' }}>
                  <div className="col-md-6 text-center">
                    <div className="p-4 bg-gradient-to-br from-red-400 to-red-600 rounded-circle d-inline-block animate__animated animate__bounceIn">
                      <span className="display-1 text-white">📝</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="fw-bold text-danger animate__animated animate__fadeInRight">Quizzes & Assessments</h3>
                    <p className="lead animate__animated animate__fadeInRight animate__delay-1s">Take interactive quizzes, get instant feedback, and track your performance across courses with detailed analytics. Improve learning with adaptive questions.</p>
                    <ul className="list-unstyled">
                      <li>Multiple question types (MCQ, essay, coding)</li>
                      <li>Instant results and explanations</li>
                      <li>Performance analytics and reports</li>
                      <li>Timed quizzes with auto-submit</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row align-items-center" style={{ height: '60vh' }}>
                  <div className="col-md-6 text-center">
                    <div className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-circle d-inline-block animate__animated animate__bounceIn">
                      <span className="display-1 text-white">⭐</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="fw-bold text-info animate__animated animate__fadeInRight">Feedback & Ratings</h3>
                    <p className="lead animate__animated animate__fadeInRight animate__delay-1s">Rate courses and instructors, provide feedback to improve the learning experience and help others choose the best courses. Build a trusted community.</p>
                    <ul className="list-unstyled">
                      <li>5-star rating system for courses</li>
                      <li>Detailed reviews and comments</li>
                      <li>Instructor feedback and ratings</li>
                      <li>Community-driven recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row align-items-center" style={{ height: '60vh' }}>
                  <div className="col-md-6 text-center">
                    <div className="p-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-circle d-inline-block animate__animated animate__bounceIn">
                      <span className="display-1 text-white">⚠️</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="fw-bold text-secondary animate__animated animate__fadeInRight">Complaint Management</h3>
                    <p className="lead animate__animated animate__fadeInRight animate__delay-1s">Report issues like malware content or platform problems. Admins review and resolve complaints promptly for a safe and reliable environment.</p>
                    <ul className="list-unstyled">
                      <li>Secure and anonymous reporting</li>
                      <li>Quick resolution by admins</li>
                      <li>Transparent process updates</li>
                      <li>Prevention of harmful content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#featuresCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#featuresCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
