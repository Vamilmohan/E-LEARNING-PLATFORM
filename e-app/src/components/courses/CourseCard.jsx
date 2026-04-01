
import React from "react";

// userRole: 'student' | 'instructor' | 'admin'
// progress: number (0-100, only for enrolled students)
export default function CourseCard({course, onView, onDelete, onEnroll, isEnrolled = false, userRole = "student", progress = null}) {
    return(
        <div className="card h-100 shadow-sm border-0">
            <div className="bg-light d-flex align-items-center justify-content-center" style={{height:'160px'}}>
                {course.thumbnail ?(
                    <img src={course.thumbnail} alt={course.title} className="card-img-top h-100 object-fit-cover"  />
                ):(
                    <i className="bi bi-play-btn-fill display-1 text-secondary"></i>
                )}
            </div>
                
            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-dark">{course.title}</h5>
                <p className="text-muted small mb-2">By {course.instructorName}</p>

                <p className="card-text text-secondary small flex-grow-1">
                    {course.description?.substring(0,80)}...
                </p>

                <div className="d-flex flex-column gap-2 mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-info-subtle text-info-emphasis px-2 py-1">
                            <i className="bi bi-clock me-1"></i>{course.duration || 'N/A'}
                        </span>
                        <button className="btn btn-primary btn-sm px-3" onClick={()=>onView(course)}>
                            View Course
                        </button>
                        {onDelete && (
                            <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => onDelete(course.id)}>
                                <i className="bi bi-trash"></i>
                            </button>
                        )}
                    </div>

                    {/* Student: Not enrolled */}
                    {userRole === 'student' && !isEnrolled && onEnroll && (
                        <div className="mt-2">
                            <div className="alert alert-info py-2 mb-2" style={{fontSize:'0.95rem'}}>
                                Please enroll to track progress.
                            </div>
                            <button
                                className="btn btn-primary w-100"
                                onClick={() => onEnroll(course.id)}
                            >
                                <i className="bi bi-person-plus me-2"></i>Enroll Now
                            </button>
                        </div>
                    )}

                    {/* Student: Enrolled */}
                    {userRole === 'student' && isEnrolled && (
                        <div className="d-flex align-items-center gap-3 mt-2 flex-wrap">
                            {progress !== null && (
                                <span
                                    className="fw-bold px-3 py-1 rounded"
                                    style={{
                                        backgroundColor:
                                            progress >= 80 ? '#d1e7dd' :
                                            progress >= 50 ? '#fff3cd' :
                                            '#f8d7da',
                                        color:
                                            progress >= 80 ? '#198754' :
                                            progress >= 50 ? '#856404' :
                                            '#842029',
                                        fontSize: '1.1rem',
                                        minWidth: '70px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {progress}% Complete
                                </span>
                            )}
                            <button className="btn btn-primary btn-sm px-3">Continue Learning</button>
                            <button className="btn btn-outline-primary btn-sm px-3">View Quizzes</button>
                        </div>
                    )}

                    {/* Instructor/Admin: Only view */}
                    {(userRole === 'instructor' || userRole === 'admin') && (
                        <div className="mt-2 text-muted small text-center">Course preview only</div>
                    )}
                </div>
            </div>

        </div>
    );
}