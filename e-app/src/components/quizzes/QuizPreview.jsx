import React, { useState } from 'react';

const QuizPreview = ({ quiz, onBack, onUpdate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(null);

  // Safety check for quiz and questions
  if (!quiz || !quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-exclamation-triangle display-4 text-warning mb-3"></i>
        <h5 className="text-muted">No questions available to preview</h5>
        <button className="btn btn-secondary mt-3" onClick={onBack}>
          <i className="bi bi-arrow-left me-2"></i>Back to Quizzes
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsEditing(false);
      setEditedQuestion(null);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsEditing(false);
      setEditedQuestion(null);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setIsEditing(false);
    setEditedQuestion(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedQuestion({ ...currentQuestion });
  };

  const handleSaveEdit = () => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[currentQuestionIndex] = editedQuestion;
    const updatedQuiz = {
      ...quiz,
      questions: updatedQuestions
    };
    onUpdate(updatedQuiz);
    setIsEditing(false);
    setEditedQuestion(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedQuestion(null);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = value;
    setEditedQuestion({
      ...editedQuestion,
      options: updatedOptions
    });
  };

  const handleCorrectAnswerChange = (value) => {
    setEditedQuestion({
      ...editedQuestion,
      correctAnswer: value
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">{quiz.title} - Preview</h4>
        <button className="btn btn-secondary" onClick={onBack}>
          <i className="bi bi-arrow-left me-2"></i>Back to Quizzes
        </button>
      </div>

      <div className="row">
        {/* Question Numbers Grid */}
        <div className="col-md-3 mb-4">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0">Questions</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`btn ${
                      index === currentQuestionIndex
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    }`}
                    onClick={() => handleQuestionClick(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question Display */}
        <div className="col-md-9">
          <div className="card shadow border-0">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h6>
              {!isEditing && (
                <button className="btn btn-sm btn-outline-primary" onClick={handleEdit}>
                  <i className="bi bi-pencil me-1"></i>Edit
                </button>
              )}
            </div>
            <div className="card-body">
              {isEditing ? (
                <div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Question Text</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editedQuestion.questionText}
                      onChange={(e) => setEditedQuestion({
                        ...editedQuestion,
                        questionText: e.target.value
                      })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Options</label>
                    {editedQuestion.options.map((option, index) => (
                      <div key={index} className="input-group mb-2">
                        <span className="input-group-text">{String.fromCharCode(65 + index)}</span>
                        <input
                          type="text"
                          className="form-control"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Correct Answer</label>
                    {editedQuestion.type === 'single' ? (
                      <select
                        className="form-select"
                        value={editedQuestion.correctAnswer}
                        onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                      >
                        <option value="">Select correct answer</option>
                        {editedQuestion.options.map((option, index) => (
                          <option key={index} value={option}>
                            {String.fromCharCode(65 + index)}) {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        {editedQuestion.options.map((option, index) => (
                          <div key={index} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={editedQuestion.correctAnswer.includes(option)}
                              onChange={(e) => {
                                const newCorrect = editedQuestion.correctAnswer.includes(option)
                                  ? editedQuestion.correctAnswer.filter(ans => ans !== option)
                                  : [...editedQuestion.correctAnswer, option];
                                handleCorrectAnswerChange(newCorrect);
                              }}
                            />
                            <label className="form-check-label">
                              {String.fromCharCode(65 + index)}) {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleSaveEdit}>
                      <i className="bi bi-check me-1"></i>Save Changes
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelEdit}>
                      <i className="bi bi-x me-1"></i>Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h5 className="mb-4">{currentQuestion.questionText}</h5>

                  <div className="mb-4">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 mb-2 rounded border ${
                          currentQuestion.correctAnswer === option ||
                          (Array.isArray(currentQuestion.correctAnswer) &&
                           currentQuestion.correctAnswer.includes(option))
                            ? 'bg-success bg-opacity-10 border-success'
                            : 'bg-light'
                        }`}
                      >
                        <strong>{String.fromCharCode(65 + index)})</strong> {option}
                        {(currentQuestion.correctAnswer === option ||
                          (Array.isArray(currentQuestion.correctAnswer) &&
                           currentQuestion.correctAnswer.includes(option))) && (
                          <i className="bi bi-check-circle text-success ms-2"></i>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary"
                      onClick={handlePrev}
                      disabled={currentQuestionIndex === 0}
                    >
                      <i className="bi bi-chevron-left me-1"></i>Previous
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleNext}
                      disabled={currentQuestionIndex === quiz.questions.length - 1}
                    >
                      Next<i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;