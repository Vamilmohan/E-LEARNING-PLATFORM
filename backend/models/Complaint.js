const mongoose = require('mongoose');
const applyJsonTransform = require('./plugins/toJSONTransform');

const complaintSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    complaint: { type: String, required: true },
    adminMessage: { type: String, default: "" },
    status: { type: String, enum: ['pending', 'solved'], default: 'pending' },
  },
  { timestamps: true },
);

applyJsonTransform(complaintSchema);

module.exports = mongoose.model('Complaint', complaintSchema);
