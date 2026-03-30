import React from 'react';

const QuizAnalytics = ({ quizzes, courses, quizAttempts = [] }) => {
  // Safety checks - ensure data is always arrays
  const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeQuizAttempts = Array.isArray(quizAttempts) ? quizAttempts : [];

  // Calculate real analytics from quiz attempts
  const analytics = safeQuizzes.map(quiz => {
    const quizAttemptsForThisQuiz = safeQuizAttempts.filter(attempt => attempt.quizId === quiz.id);
    const totalAttempts = quizAttemptsForThisQuiz.length;
    const uniqueStudents = new Set(quizAttemptsForThisQuiz.map(a => a.studentId)).size;
    
    // Calculate average score
    const averageScore = totalAttempts > 0 
      ? Math.round(quizAttemptsForThisQuiz.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts)
      : 0;
    
    // Calculate pass rate
    const passRate = totalAttempts > 0
      ? Math.round((quizAttemptsForThisQuiz.filter(attempt => {
          if (quiz.hasPassingPercentage && quiz.passingPercentage) {
            return attempt.score >= quiz.passingPercentage;
          }
          return attempt.score >= 70; // Default passing score
        }).length / totalAttempts) * 100)
      : 0;

    return {
      ...quiz,
      totalAttempts,
      averageScore,
      passRate,
      uniqueStudents,
      attempts: quizAttemptsForThisQuiz.map(attempt => ({
        studentId: attempt.studentId,
        studentName: `Student ${attempt.studentId}`, // In real app, get from user data
        score: attempt.score,
        attempts: safeQuizAttempts.filter(a => a.quizId === quiz.id && a.studentId === attempt.studentId).length,
        completedAt: attempt.completedAt
      }))
    };
  });

  return (
    <div>
      <h4 className="mb-4 fw-bold">Quiz Analytics</h4>

      {analytics.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bar-chart display-4 text-muted mb-3"></i>
          <h5 className="text-muted">No analytics available</h5>
          <p className="text-muted">Publish quizzes and wait for student attempts to see analytics</p>
        </div>
      ) : (
        <div className="row">
          {analytics.map(quiz => (
            <div key={quiz.id} className="col-12 mb-4">
              <div className="card shadow border-0">
                <div className="card-header bg-primary text-white">
                  <h6 className="mb-0">{quiz.title}</h6>
                </div>
                <div className="card-body">
                  {/* Summary Stats */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="display-6 fw-bold text-primary">{quiz.totalAttempts}</div>
                        <small className="text-muted">Total Attempts</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="display-6 fw-bold text-success">{quiz.averageScore}%</div>
                        <small className="text-muted">Average Score</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="display-6 fw-bold text-info">{quiz.passRate}%</div>
                        <small className="text-muted">Pass Rate</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="display-6 fw-bold text-warning">{quiz.uniqueStudents}</div>
                        <small className="text-muted">Unique Students</small>
                      </div>
                    </div>
                  </div>

                  {/* Student Attempts Table */}
                  <h6 className="mb-3">Recent Attempts</h6>
                  {quiz.attempts.length === 0 ? (
                    <div className="text-center py-3">
                      <p className="text-muted mb-0">No attempts yet</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Student Name</th>
                            <th>Score</th>
                            <th>Attempts</th>
                            <th>Completed At</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quiz.attempts.slice(0, 10).map((attempt, index) => (
                            <tr key={index}>
                              <td>{attempt.studentName}</td>
                              <td>
                                <span className={`badge ${
                                  attempt.score >= (quiz.hasPassingPercentage && quiz.passingPercentage ? quiz.passingPercentage : 70)
                                    ? 'bg-success' :
                                  attempt.score >= 50 ? 'bg-warning' : 'bg-danger'
                                }`}>
                                  {attempt.score}%
                                </span>
                              </td>
                              <td>{attempt.attempts}</td>
                              <td>{new Date(attempt.completedAt).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${
                                  attempt.score >= (quiz.hasPassingPercentage && quiz.passingPercentage ? quiz.passingPercentage : 70)
                                    ? 'bg-success' : 'bg-danger'
                                }`}>
                                  {attempt.score >= (quiz.hasPassingPercentage && quiz.passingPercentage ? quiz.passingPercentage : 70) ? 'Passed' : 'Failed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {quiz.attempts.length > 10 && (
                    <div className="text-center mt-3">
                      <button className="btn btn-outline-primary btn-sm">
                        View All Attempts
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizAnalytics;