const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Rating = require('../models/Rating');

exports.getCourses = async (req, res) => {
  try {
    const query = req.user && req.user.role === 'admin' ? {} : { published: true };
    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('getCourses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = req.user.role === 'admin' ? {} : { instructorId: userId };
    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('getMyCourses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, duration, content, isMandatory, materials } = req.body;
    const user = req.user;
    if (!['instructor', 'admin'].includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: only instructors can create courses' });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      duration,
      content,
      materials,
      isMandatory: Boolean(isMandatory),
      instructorId: user.id,
      instructorName: user.name,
      published: true,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('createCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = req.user;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructorId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: can only update your own course' });
    }
    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    console.error('updateCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = req.user;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructorId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: can only delete your own course' });
    }

    const courseIdStr = courseId.toString();
    const quizzes = await Quiz.find({ courseId: courseIdStr }).select('_id');
    const quizIds = quizzes.map((q) => q._id.toString());

    await Promise.all([
      Course.deleteOne({ _id: courseId }),
      Enrollment.deleteMany({ courseId: courseIdStr }),
      Progress.deleteMany({ courseId: courseIdStr }),
      Rating.deleteMany({ courseId: courseIdStr }),
      Quiz.deleteMany({ courseId: courseIdStr }),
      quizIds.length ? QuizAttempt.deleteMany({ quizId: { $in: quizIds } }) : Promise.resolve(),
    ]);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('deleteCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
