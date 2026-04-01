import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StudentPerformanceDashboard = ({ user, enrolledCourses, courseProgress, quizAttempts, quizzes }) => {
  // Calculate overall performance metrics
  const totalEnrolled = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => (courseProgress[course.id]?.progress || 0) >= 100);
  const inProgressCourses = enrolledCourses.filter(course => {
    const progress = courseProgress[course.id]?.progress || 0;
    return progress > 0 && progress < 100;
  });
  const notStartedCourses = enrolledCourses.filter(course => (courseProgress[course.id]?.progress || 0) === 0);

  // Calculate average quiz score
  const userQuizAttempts = quizAttempts.filter(attempt => attempt.studentId === user.id);
  const averageQuizScore = userQuizAttempts.length > 0
    ? Math.round(userQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / userQuizAttempts.length)
    : 0;

  // Calculate overall completion percentage
  const overallCompletion = totalEnrolled > 0
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (courseProgress[course.id]?.progress || 0), 0) / totalEnrolled)
    : 0;

  // Course-wise performance data
  const coursePerformanceData = enrolledCourses.map(course => {
    const progress = courseProgress[course.id]?.progress || 0;
    const courseQuizzes = quizzes.filter(q => q.courseId === course.id && q.published);
    const courseAttempts = userQuizAttempts.filter(attempt => courseQuizzes.some(q => q.id === attempt.quizId));
    const avgScore = courseAttempts.length > 0
      ? Math.round(courseAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / courseAttempts.length)
      : 0;

    let status = 'Not Started';
    if (progress >= 100) status = 'Completed';
    else if (progress > 0) status = 'In Progress';

    return {
      courseName: course.title,
      progress: progress,
      quizScore: avgScore,
      status: status,
      course: course
    };
  });

  // Quiz analytics
  const enrolledCourseIds = enrolledCourses.map(c => c.id);
  const assignedQuizzes = quizzes.filter(q => q.published && enrolledCourseIds.includes(q.courseId));
  const attemptedQuizzes = userQuizAttempts.length;
  const highestScore = userQuizAttempts.length > 0 ? Math.max(...userQuizAttempts.map(a => a.score)) : 0;

  // Quiz performance data for charts
  const quizPerformanceData = userQuizAttempts.map((attempt, index) => {
    const quiz = quizzes.find(q => q.id === attempt.quizId);
    const course = enrolledCourses.find(c => c.id === quiz?.courseId);
    return {
      id: index + 1,
      quizName: quiz?.title || 'Unknown Quiz',
      courseName: course?.title || 'Unknown Course',
      score: attempt.score,
      date: new Date(attempt.completedAt).toLocaleDateString(),
      timeTaken: Math.floor(Math.random() * 45) + 15, // Mock time data
      onTime: new Date(attempt.completedAt) <= new Date(quiz?.deadline || Date.now())
    };
  });

  // Charts data
  const scoreProgressData = quizPerformanceData.map((item, index) => ({
    attempt: index + 1,
    score: item.score,
    date: item.date
  }));

  const completionChartData = [
    { name: 'Completed', value: completedCourses.length, color: '#28a745' },
    { name: 'In Progress', value: inProgressCourses.length, color: '#ffc107' },
    { name: 'Not Started', value: notStartedCourses.length, color: '#dc3545' }
  ];

  const courseScoreData = coursePerformanceData.map(item => ({
    course: item.courseName.length > 20 ? item.courseName.substring(0, 20) + '...' : item.courseName,
    score: item.quizScore,
    progress: item.progress
  }));

  // Activity timeline (mock data based on real attempts and progress)
  const activityTimeline = [
    ...userQuizAttempts.slice(-3).map(attempt => {
      const quiz = quizzes.find(q => q.id === attempt.quizId);
      return {
        type: 'quiz',
        title: `Attempted quiz: ${quiz?.title || 'Unknown Quiz'}`,
        date: new Date(attempt.completedAt),
        score: attempt.score
      };
    }),
    ...completedCourses.slice(-2).map(course => ({
      type: 'course',
      title: `Completed course: ${course.title}`,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      score: null
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 5);

  // Weak areas detection
  const weakAreas = coursePerformanceData.filter(item => item.quizScore < 50 || item.progress < 50);

  // Performance status
  const getPerformanceStatus = () => {
    if (overallCompletion >= 80 && averageQuizScore >= 80) return { status: 'Excellent', color: 'success', icon: 'bi-trophy-fill' };
    if (overallCompletion >= 50 && averageQuizScore >= 50) return { status: 'Average', color: 'warning', icon: 'bi-dash-circle-fill' };
    return { status: 'Needs Improvement', color: 'danger', icon: 'bi-exclamation-triangle-fill' };
  };

  const performanceStatus = getPerformanceStatus();

  // Achievements
  const achievements = [];
  if (completedCourses.length > 0) achievements.push({ title: 'First Course Completed', icon: 'bi-check-circle-fill', color: 'success' });
  if (highestScore >= 90) achievements.push({ title: 'Scored above 90%', icon: 'bi-star-fill', color: 'warning' });
  if (userQuizAttempts.length >= 5) achievements.push({ title: 'Quiz Master', icon: 'bi-question-circle-fill', color: 'info' });

  return (
    <div className="student-performance-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Performance Dashboard</h2>
        <span className={`badge bg-${performanceStatus.color} fs-6`}>
          <i className={`bi ${performanceStatus.icon} me-1`}></i>
          {performanceStatus.status}
        </span>
      </div>

      {/* Overall Performance Summary */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-book display-4 text-primary mb-2"></i>
              <h5 className="card-title">Enrolled Courses</h5>
              <h3 className="text-primary">{totalEnrolled}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-check-circle display-4 text-success mb-2"></i>
              <h5 className="card-title">Completed Courses</h5>
              <h3 className="text-success">{completedCourses.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-graph-up display-4 text-info mb-2"></i>
              <h5 className="card-title">Average Quiz Score</h5>
              <h3 className="text-info">{averageQuizScore}%</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-bar-chart display-4 text-warning mb-2"></i>
              <h5 className="card-title">Overall Completion</h5>
              <h3 className="text-warning">{overallCompletion}%</h3>
              <div className="progress mt-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${overallCompletion}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0">Score Progress Over Time</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={scoreProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attempt" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#007bff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0">Course Completion Status</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={completionChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {completionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Course-wise Performance */}
      <div className="card shadow border-0 mb-4">
        <div className="card-header bg-info text-white">
          <h6 className="mb-0">Course-wise Performance</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Progress</th>
                  <th>Quiz Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformanceData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.courseName}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">{item.progress}%</span>
                        <div className="progress flex-grow-1" style={{ height: '6px', width: '80px' }}>
                          <div
                            className={`progress-bar ${item.progress >= 100 ? 'bg-success' : item.progress > 50 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.quizScore >= 80 ? 'bg-success' : item.quizScore >= 60 ? 'bg-warning' : 'bg-danger'}`}>
                        {item.quizScore}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Completed' ? 'bg-success' : item.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quiz Analytics */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">Quiz Analytics</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <h4 className="text-primary">{assignedQuizzes.length}</h4>
                    <small className="text-muted">Assigned</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <h4 className="text-success">{attemptedQuizzes}</h4>
                    <small className="text-muted">Attempted</small>
                  </div>
                </div>
              </div>
              <div className="row text-center mt-3">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <h4 className="text-info">{highestScore}%</h4>
                    <small className="text-muted">Highest Score</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <h4 className="text-warning">{averageQuizScore}%</h4>
                    <small className="text-muted">Average Score</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-secondary text-white">
              <h6 className="mb-0">Course-wise Scores</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={courseScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6c757d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card shadow border-0 mb-4">
        <div className="card-header bg-dark text-white">
          <h6 className="mb-0">Recent Activity</h6>
        </div>
        <div className="card-body">
          <div className="timeline">
            {activityTimeline.map((activity, index) => (
              <div key={index} className="timeline-item mb-3">
                <div className="d-flex">
                  <div className="timeline-marker bg-primary me-3"></div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{activity.title}</h6>
                        {activity.score && (
                          <span className={`badge ${activity.score >= 70 ? 'bg-success' : 'bg-danger'} me-2`}>
                            {activity.score}%
                          </span>
                        )}
                        <small className="text-muted">
                          {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                        </small>
                      </div>
                      <i className={`bi ${activity.type === 'quiz' ? 'bi-question-circle text-primary' : 'bi-check-circle text-success'} fs-4`}></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak Areas & Achievements */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-danger text-white">
              <h6 className="mb-0">Areas for Improvement</h6>
            </div>
            <div className="card-body">
              {weakAreas.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {weakAreas.map((area, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {area.courseName}
                      <div>
                        {area.quizScore < 50 && (
                          <span className="badge bg-danger me-1">Low Quiz Score</span>
                        )}
                        {area.progress < 50 && (
                          <span className="badge bg-warning">Low Progress</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-center py-3">Great job! No weak areas detected.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0">Achievements</h6>
            </div>
            <div className="card-body">
              {achievements.length > 0 ? (
                <div className="row">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="col-12 mb-2">
                      <div className="d-flex align-items-center p-2 border rounded">
                        <i className={`bi ${achievement.icon} text-${achievement.color} me-3 fs-4`}></i>
                        <span className="fw-bold">{achievement.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3">Complete more courses and quizzes to earn achievements!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .timeline-item {
          position: relative;
        }
        .timeline-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 18px;
          width: 2px;
          height: calc(100% - 12px);
          background-color: #e9ecef;
        }
      `}} />
    </div>
  );
};

export default StudentPerformanceDashboard;