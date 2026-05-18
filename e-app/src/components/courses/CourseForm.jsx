import React, { useState } from "react";

// CourseForm - form to create new courses with topics and videos
export default function CourseForm({ onSubmit, onCancel }) {
  // Track if thumbnail is from URL or file upload
  const [thumbType, setThumbType] = useState("url"); // "url" or "file" //image thumbnail
  // Store duration in weeks, days, hours separately
  const [durationWeeks, setDurationWeeks] = useState(0);
  const [durationDays, setDurationDays] = useState(0);
  const [durationHours, setDurationHours] = useState(0);

  // Main course form data
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    duration: "", // Will store as "12 weeks 20 days 10 hours"
    durationBreakdown: { weeks: 0, days: 0, hours: 0 }, // For easier parsing
    content: [{ topic: "", type: "url", videoUrl: "", videoFile: "", topicDesc: "" }],
    materials: [{ type: "text", value: "" }],
  });

  // Update course data whenever duration parts change
  const handleDurationChange = (weeks, days, hours) => {
    setDurationWeeks(weeks);
    setDurationDays(days);
    setDurationHours(hours);

    const durationString = `${weeks} weeks ${days} days ${hours} hours`;
    setCourseData({
      ...courseData,
      duration: durationString,
      durationBreakdown: {
        weeks: parseInt(weeks),
        days: parseInt(days),
        hours: parseInt(hours),
      },
    });
  };

  const handleAddTopic = () => {
    setCourseData({
      ...courseData,
      content: [
        ...courseData.content,
        { topic: "", type: "url", videoUrl: "", topicDesc: "" },
      ],
    });
  };

  const handleTopicChange = (index, field, value) => {
    const updatedContent = [...courseData.content];
    updatedContent[index][field] = value;
    setCourseData({ ...courseData, content: updatedContent });
  };

  const handleFileUpload = (e, index = null, field = "thumbnail") => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (index !== null) {
        handleTopicChange(index, field, reader.result);
      } else {
        setCourseData({ ...courseData, [field]: reader.result });
      }
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(courseData);
      }}
      className="p-2"
    >
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label fw-bold small">Course Title</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) =>
              setCourseData({ ...courseData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold small">Duration</label>
          <div className="d-flex gap-2">
            <div className="flex-grow-1">
              <select
                className="form-select form-select-sm"
                value={durationWeeks}
                onChange={(e) =>
                  handleDurationChange(
                    e.target.value,
                    durationDays,
                    durationHours,
                  )
                }
              >
                {Array.from({ length: 53 }, (_, i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? "week" : "weeks"}
                  </option>
                ))}
              </select>
              <small className="text-muted d-block mt-1">Weeks</small>
            </div>
            <div className="flex-grow-1">
              <select
                className="form-select form-select-sm"
                value={durationDays}
                onChange={(e) =>
                  handleDurationChange(
                    durationWeeks,
                    e.target.value,
                    durationHours,
                  )
                }
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? "day" : "days"}
                  </option>
                ))}
              </select>
              <small className="text-muted d-block mt-1">Days</small>
            </div>
            <div className="flex-grow-1">
              <select
                className="form-select form-select-sm"
                value={durationHours}
                onChange={(e) =>
                  handleDurationChange(
                    durationWeeks,
                    durationDays,
                    e.target.value,
                  )
                }
              >
                {Array.from({ length: 25 }, (_, i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
              <small className="text-muted d-block mt-1">Hours</small>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Dropdown Logic */}
      <div className="mt-3 card p-3 bg-light border-0">
        <label className="form-label fw-bold small">Course Thumbnail</label>
        <div className="d-flex gap-3 mb-2">
          <select
            className="form-select form-select-sm w-auto"
            value={thumbType}
            onChange={(e) => setThumbType(e.target.value)}
          >
            <option value="url">External URL</option>
            <option value="file">Upload from Device</option>
          </select>
        </div>
        {thumbType === "url" ? (
          <input
            type="url"
            className="form-control"
            placeholder="https://..."
            onChange={(e) =>
              setCourseData({ ...courseData, thumbnail: e.target.value })
            }
            required
          />
        ) : (
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => handleFileUpload(e)}
            required
          />
        )}
      </div>

      <div className="mt-3">
        <label className="form-label fw-bold small">Description</label>
        <textarea
          className="form-control"
          rows="2"
          onChange={(e) =>
            setCourseData({ ...courseData, description: e.target.value })
          }
          required
        />
      </div>

      <h6 className="fw-bold mt-4">Course Curriculum</h6>
      {courseData.content.map((item, index) => (
        <div key={index} className="border rounded p-3 mb-3 bg-white shadow-sm">
          <div className="row g-2 mb-2">
            <div className="col-md-6">
              <input
                placeholder="Topic Name"
                className="form-control"
                onChange={(e) =>
                  handleTopicChange(index, "topic", e.target.value)
                }
                required
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={item.type}
                onChange={(e) =>
                  handleTopicChange(index, "type", e.target.value)
                }
              >
                <option value="url">YouTube URL</option>
                <option value="video">Local Video File</option>
              </select>
            </div>
          </div>

          <div className="mb-2">
            {item.type === "url" ? (
              <input
                type="url"
                className="form-control form-control-sm"
                placeholder="Paste YouTube URL (e.g., https://www.youtube.com/watch?v=..."
                onChange={(e) =>
                  handleTopicChange(index, "videoUrl", e.target.value)
                }
                required
              />
            ) : (
              <input
                type="file"
                className="form-control form-control-sm"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, index, "videoFile")}
                required
              />
            )}
          </div>

          <input
            placeholder="Topic Description (Optional)"
            className="form-control form-control-sm"
            onChange={(e) =>
              handleTopicChange(index, "topicDesc", e.target.value)
            }
          />
        </div>
      ))}

      <h6 className="fw-bold mt-4">Course Materials</h6>
      {courseData.materials.map((item, index) => (
        <div key={index} className="border rounded p-3 mb-3 bg-white shadow-sm">
          <div className="row g-2 mb-2">
            <div className="col-md-6">
              <select
                className="form-select"
                value={item.type}
                onChange={(e) => {
                  const updatedMaterials = [...courseData.materials];
                  updatedMaterials[index].type = e.target.value;
                  setCourseData({ ...courseData, materials: updatedMaterials });
                }}
              >
                <option value="text">Text Material</option>
                <option value="pdf">PDF / Document</option>
              </select>
            </div>
            <div className="col-md-6">
              {item.type === "text" ? (
                <textarea
                  className="form-control form-control-sm"
                  rows="3"
                  placeholder="Enter material text..."
                  value={item.value}
                  onChange={(e) => {
                    const updatedMaterials = [...courseData.materials];
                    updatedMaterials[index].value = e.target.value;
                    setCourseData({ ...courseData, materials: updatedMaterials });
                  }}
                />
              ) : (
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const updatedMaterials = [...courseData.materials];
                      updatedMaterials[index].value = reader.result;
                      updatedMaterials[index].name = file?.name || updatedMaterials[index].name;
                      setCourseData({ ...courseData, materials: updatedMaterials });
                    };
                    if (file) reader.readAsDataURL(file);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mb-4"
        onClick={() =>
          setCourseData({
            ...courseData,
            materials: [...courseData.materials, { type: "text", value: "" }],
          })
        }
      >
        + Add Material
      </button>

      <button
        type="button"
        className="btn btn-outline-primary btn-sm mb-4"
        onClick={handleAddTopic}
      >
        + Add Topic
      </button>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary w-100">
          Publish Course
        </button>
        <button
          type="button"
          className="btn btn-light w-100"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
