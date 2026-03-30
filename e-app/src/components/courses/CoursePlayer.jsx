import React,{useState} from "react";

export default function CoursePlayer({course,onBack,onEnroll,isEnrolled}){
    const [currentVideo,setCurrentVideo]=useState(course.content?.[0] ||null);

    const getEmbedUrl=(url)=>{
        if(!url) return "";
        const regExp=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match=url.match(regExp);
        return(match && match[2].length===11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    };

    return (
    <div className="container-fluid p-0">
      {/* Back Button */}
      <button className="btn btn-link text-decoration-none mb-3 ps-0" onClick={onBack}>
        <i className="bi bi-arrow-left me-2"></i> Back to Courses
      </button>

      <div className="row g-4">
        {/* LEFT: The Video Player */}
        <div className="col-lg-8">
          <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden bg-black">
            {currentVideo ? (
              <iframe 
                src={getEmbedUrl(currentVideo.videoUrl)} 
                title={currentVideo.topic} 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="d-flex align-items-center justify-content-center text-white">
                <p>No video available for this course.</p>
              </div>
            )}
          </div>
          <h3 className="mt-4 fw-bold">{course.title}</h3>
          <p className="text-secondary">{course.description}</p>
          <div className="mt-4">
            {isEnrolled ? (
              <button className="btn btn-success btn-lg w-100" disabled>
                <i className="bi bi-check-circle me-2"></i>Enrolled
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-lg w-100"
                onClick={() => {
                  if (onEnroll) {
                    onEnroll(course.id);
                    alert('Successfully enrolled in ' + course.title);
                  }
                }}
              >
                <i className="bi bi-person-plus me-2"></i>Enroll Now
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: The Content List (Playlist) */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Course Content</h5>
            </div>
            <div className="list-group list-group-flush overflow-auto" style={{maxHeight: '450px'}}>
              {course.content?.map((item, index) => (
                <button 
                  key={index}
                  className={`list-group-item list-group-item-action py-3 border-start border-4 ${currentVideo?.topic === item.topic ? 'border-primary bg-light fw-bold' : 'border-transparent'}`}
                  onClick={() => setCurrentVideo(item)}
                >
                  <div className="d-flex align-items-center">
                    <i className={`bi ${currentVideo?.topic === item.topic ? 'bi-play-circle-fill text-primary' : 'bi-play-circle text-muted'} me-3 fs-5`}></i>
                    <span>{item.topic}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}