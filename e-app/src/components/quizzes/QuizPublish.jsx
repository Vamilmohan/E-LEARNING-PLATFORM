import React, { useState } from 'react';

const QuizPublish = ({ quiz, courses, onClose, onPublish }) => {
  const [publishData, setPublishData] = useState({
    deadline: '',
    deadlineTime: '23:59',
    maxAttempts: 1,
    passingPercentage: 40,
    hasPassingPercentage: true,
    showScoreToStudent: true,
    allowMultipleAttempts: false,
    timeLimit: 0, // in minutes, 0 means no limit
    hasTimeLimit: false
  });

  const safeCourses = Array.isArray(courses) ? courses : [];

  const formatDeadlineDisplay = () => {
    if (!publishData.deadline) return '';
    const date = new Date(publishData.deadline);
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!publishData.deadline) {
      alert('Please set a deadline for the quiz.');
      return;
    }

    const deadlineDate = new Date(publishData.deadline);
    if (deadlineDate <= new Date()) {
      alert('Deadline must be in the future.');
      return;
    }

    if (publishData.hasPassingPercentage && (publishData.passingPercentage < 0 || publishData.passingPercentage > 100)) {
      alert('Passing percentage must be between 0 and 100.');
      return;
    }

    onPublish({
      ...publishData,
      published: true,
      publishedAt: new Date().toISOString()
    });
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Publish Quiz: {quiz.title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Deadline (Date)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={publishData.deadline.split('T')[0] || ''}
                    onChange={(e) => {
                      const currentTime = publishData.deadline.split('T')[1] || '23:59:00';
                      setPublishData({
                        ...publishData,
                        deadline: `${e.target.value}T${currentTime}`
                      });
                    }}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Deadline Time (IST)</label>
                  <input
                    type="time"
                    className="form-control"
                    value={publishData.deadline.split('T')[1]?.substring(0, 5) || '23:59'}
                    onChange={(e) => {
                      const currentDate = publishData.deadline.split('T')[0] || new Date().toISOString().split('T')[0];
                      setPublishData({
                        ...publishData,
                        deadline: `${currentDate}T${e.target.value}:00`
                      });
                    }}
                    required
                  />
                  <div className="form-text">
                    Time in Indian Standard Time (IST, UTC+5:30)
                  </div>
                </div>
              </div>

              {publishData.deadline && (
                <div className="alert alert-info mb-3">
                  <strong>Deadline Preview (IST):</strong><br/>
                  {formatDeadlineDisplay()}
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Maximum Attempts</label>
                  <select
                    className="form-select"
                    value={publishData.maxAttempts}
                    onChange={(e) => setPublishData({
                      ...publishData,
                      maxAttempts: parseInt(e.target.value),
                      allowMultipleAttempts: parseInt(e.target.value) > 1
                    })}
                  >
                    <option value={1}>1 Attempt</option>
                    <option value={2}>2 Attempts</option>
                    <option value={3}>3 Attempts</option>
                    <option value={5}>5 Attempts</option>
                    <option value={10}>10 Attempts</option>
                    <option value={999}>Unlimited</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="hasPassingPercentage"
                      checked={publishData.hasPassingPercentage}
                      onChange={(e) => setPublishData({
                        ...publishData,
                        hasPassingPercentage: e.target.checked
                      })}
                    />
                    <label className="form-check-label fw-bold" htmlFor="hasPassingPercentage">
                      Set Passing Percentage
                    </label>
                  </div>
                </div>
              </div>

              {publishData.hasPassingPercentage && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Passing Percentage Required</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="100"
                      value={publishData.passingPercentage}
                      onChange={(e) => setPublishData({
                        ...publishData,
                        passingPercentage: parseInt(e.target.value) || 0
                      })}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="form-text">
                    Students need to score at least this percentage to pass the quiz.
                  </div>
                </div>
              )}

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showScore"
                    checked={publishData.showScoreToStudent}
                    onChange={(e) => setPublishData({
                      ...publishData,
                      showScoreToStudent: e.target.checked
                    })}
                  />
                  <label className="form-check-label fw-bold" htmlFor="showScore">
                    Show score to student after completion
                  </label>
                  <div className="form-text">
                    If unchecked, students will only see if they passed/failed without specific scores.
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="hasTimeLimit"
                      checked={publishData.hasTimeLimit}
                      onChange={(e) => setPublishData({
                        ...publishData,
                        hasTimeLimit: e.target.checked,
                        timeLimit: e.target.checked ? 30 : 0
                      })}
                    />
                    <label className="form-check-label fw-bold" htmlFor="hasTimeLimit">
                      Set Time Limit
                    </label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  {publishData.hasTimeLimit && (
                    <div>
                      <label className="form-label fw-bold">Time Limit (minutes)</label>
                      <select
                        className="form-select"
                        value={publishData.timeLimit}
                        onChange={(e) => setPublishData({
                          ...publishData,
                          timeLimit: parseInt(e.target.value)
                        })}
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                        <option value={180}>3 hours</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="alert alert-info">
                <h6><i className="bi bi-info-circle me-2"></i>Quiz Summary</h6>
                <p className="mb-1"><strong>Title:</strong> {quiz.title}</p>
                <p className="mb-1"><strong>Total Questions:</strong> {quiz.totalQuestions}</p>
                <p className="mb-0"><strong>Course:</strong> {safeCourses.find(c => c.id === quiz.courseId)?.title || quiz.courseId}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                <i className="bi bi-upload me-2"></i>Publish Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizPublish;