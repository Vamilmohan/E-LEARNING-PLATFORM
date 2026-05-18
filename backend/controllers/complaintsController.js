const Complaint = require('../models/Complaint');

exports.getComplaints = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      return res.json(complaints);
    }
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('getComplaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const { complaint } = req.body;
    if (!complaint) {
      return res.status(400).json({ message: 'Complaint text is required' });
    }
    const createdComplaint = await Complaint.create({
      userId: req.user.id,
      userName: req.user.name,
      complaint,
    });
    res.status(201).json(createdComplaint);
  } catch (error) {
    console.error('createComplaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminMessage } = req.body;
    if (!['pending', 'solved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    complaint.status = status;
    if (typeof adminMessage === 'string') {
      complaint.adminMessage = adminMessage;
    }
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    console.error('updateComplaintStatus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
