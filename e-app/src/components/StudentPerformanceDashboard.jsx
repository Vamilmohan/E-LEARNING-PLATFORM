import React from 'react';

const StudentPerformanceDashboard = ({ student, course, enrollments, courseProgress, quizAttempts, quizzes, onClose }) => {
  // Calculate data directly from props
  const enrollmentData = enrollments.find(e => e.userId === student.id && e.courseId === course.id);
  const enrollmentDate = enrollmentData && enrollmentData.enrolledAt
    ? new Date(enrollmentData.enrolledAt).toLocaleDateString()
    : 'Not Available';
  const progressData = courseProgress[course.id] || { progress: 0, completedTopics: [] };

  // Get quiz data for this course
  const courseQuizzes = quizzes.filter(q => q.courseId === course.id && q.published);
  const studentQuizAttempts = quizAttempts.filter(qa => qa.studentId === student.id && courseQuizzes.some(q => q.id === qa.quizId));

  const quizData = courseQuizzes.map(quiz => {
    const attempt = studentQuizAttempts.find(qa => qa.quizId === quiz.id);
    return {
      quiz,
      attempt,
      status: attempt ? 'Attempted' : 'Not Attempted',
      score: attempt ? `${attempt.score}/100` : 'N/A',
      passFail: attempt ? (attempt.score >= (quiz.passingPercentage || 70) ? 'Pass' : 'Fail') : 'N/A',
      submissionStatus: attempt ? (new Date(attempt.completedAt) <= new Date(quiz.deadline) ? 'On-time' : 'Late') : 'N/A'
    };
  });

  const getStatusBadge = () => {
    if (!progressData) return { text: 'Unknown', class: 'badge bg-secondary' };

    const progressPercent = progressData.progress || 0;
    const lastActive = enrollmentData?.lastActive ? new Date(enrollmentData.lastActive) : new Date();
    const daysSinceActive = Math.floor((new Date() - lastActive) / (1000 * 60 * 60 * 24));

    if (progressPercent >= 80 && daysSinceActive <= 7) return { text: 'Active', class: 'badge bg-success' };
    if (progressPercent >= 50 && daysSinceActive <= 14) return { text: 'Slow', class: 'badge bg-warning' };
    return { text: 'At Risk', class: 'badge bg-danger' };
  };

  const statusBadge = getStatusBadge();

  const totalLessons = course.content?.length || 0;
  const completedLessons = progressData?.completedTopics?.length || 0;
  const progressPercent = progressData?.progress || 0;

  // Calculate watch time (mock calculation based on progress)
  const totalWatchTime = Math.round((progressPercent / 100) * (totalLessons * 15)); // Assuming 15 min per lesson

  const lastActiveDate = enrollmentData?.lastActive ? new Date(enrollmentData.lastActive).toLocaleDateString() : 'Never';

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Student Performance Dashboard</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Student Information */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0 d-flex justify-content-between align-items-center">
                  Student Information
                  <span className={statusBadge.class}>{statusBadge.text}</span>
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Student Name:</strong> {student.name}</p>
                    <p><strong>Student ID:</strong> {student.id}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Course Name:</strong> {course.title}</p>
                    <p><strong>Enrollment Date:</strong> {enrollmentDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Course Progress</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Overall Progress</span>
                    <span className="fw-bold">{progressPercent}%</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${progressPercent}%` }}
                      aria-valuenow={progressPercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-6">
                    <div className="border rounded p-3">
                      <h4 className="text-primary">{completedLessons}</h4>
                      <small className="text-muted">Lessons Completed</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-3">
                      <h4 className="text-info">{totalLessons}</h4>
                      <small className="text-muted">Total Lessons</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Watch Activity */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Watch Activity</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <h4 className="text-success">{totalWatchTime} min</h4>
                      <small className="text-muted">Total Watch Time</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <h4 className="text-primary">{completedLessons}</h4>
                      <small className="text-muted">Videos Completed</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <h4 className="text-warning">{lastActiveDate}</h4>
                      <small className="text-muted">Last Active</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Performance */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Quiz Performance</h6>
              </div>
              <div className="card-body">
                {quizData.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Quiz Name</th>
                          <th>Status</th>
                          <th>Score</th>
                          <th>Pass/Fail</th>
                          <th>Submission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.quiz.title}</td>
                            <td>
                              <span className={`badge ${item.status === 'Attempted' ? 'bg-success' : 'bg-secondary'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="fw-bold">{item.score}</td>
                            <td>
                              <span className={`badge ${item.passFail === 'Pass' ? 'bg-success' : item.passFail === 'Fail' ? 'bg-danger' : 'bg-secondary'}`}>
                                {item.passFail}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${item.submissionStatus === 'On-time' ? 'bg-success' : item.submissionStatus === 'Late' ? 'bg-warning' : 'bg-secondary'}`}>
                                {item.submissionStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center py-3">No quizzes available for this course</p>
                )}
              </div>
            </div>

            {/* Assignment Tracking */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Assignment Tracking</h6>
              </div>
              <div className="card-body">
                <div className="text-center py-3">
                  <p className="text-muted mb-0">Assignment tracking feature coming soon</p>
                  <small className="text-muted">This will show submitted assignments and deadlines</small>
                </div>
              </div>
            </div>

            {/* Optional: Send Reminder */}
            {statusBadge.text === 'At Risk' && (
              <div className="alert alert-warning">
                <h6 className="alert-heading">Student Needs Attention</h6>
                <p className="mb-2">This student appears to be at risk. Consider sending a reminder to encourage progress.</p>
                <button className="btn btn-warning btn-sm">Send Reminder</button>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceDashboard;