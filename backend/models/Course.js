const mongoose = require('mongoose');
const applyJsonTransform = require('./plugins/toJSONTransform');

const topicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  type: { type: String, default: 'url' },
  videoUrl: { type: String, default: '' },
  topicDesc: { type: String, default: '' },
});

const materialSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'pdf'], default: 'text' },
  value: { type: String, default: '' },
  name: { type: String, default: '' },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    thumbnail: { type: String, default: '' },
    duration: { type: String, default: '' },
    content: { type: [topicSchema], default: [] },
    materials: { type: [materialSchema], default: [] },
    instructorId: { type: String, required: true },
    instructorName: { type: String, required: true },
    isMandatory: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

applyJsonTransform(courseSchema);
applyJsonTransform(topicSchema);

module.exports = mongoose.model('Course', courseSchema);
