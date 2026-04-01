import React,{useState} from "react";
import CourseCard from "./CourseCard";

export default function CourseList({courses,onViewCourse,onEnrollCourse,enrolledCourseIds=[]}){
    const [searchTerm,setSearchTerm]=useState("");
    const filtered=courses.filter(c=>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="input-group mb-4 shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search for courses or instructors..."
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>

            <div className="row g-4">
                {filtered.length > 0 ? (
                    filtered.map(course => (
                        <div key={course.id} className="col-md-6 col-lg-4">
                        <CourseCard course={course} onView={onViewCourse} onEnroll={onEnrollCourse} isEnrolled={enrolledCourseIds.includes(course.id)} />
                        </div>
                    ))
                    ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-emoji-frown display-1 text-muted"></i>
                        <p className="mt-3 text-muted">No courses found matching "{searchTerm}"</p>
                    </div>
                    )}
            </div>
        </div>
    );
}