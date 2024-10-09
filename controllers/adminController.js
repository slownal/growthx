const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Assignment = require('../models/assignment');

// Register a new admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, password: hashedPassword, role: 'admin' });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering admin', error });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// View assignments tagged to the admin
exports.getAssignments = async (req, res) => {
  const adminId = req.user.id;

  try {
    const assignments = await Assignment.find({ admin: adminId }).populate('userId', 'name');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error });
  }
};

// Accept assignment
exports.acceptAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findByIdAndUpdate(id, { status: 'accepted' });
    res.json({ message: 'Assignment accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting assignment', error });
  }
};

// Reject assignment
exports.rejectAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findByIdAndUpdate(id, { status: 'rejected' });
    res.json({ message: 'Assignment rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting assignment', error });
  }
};
