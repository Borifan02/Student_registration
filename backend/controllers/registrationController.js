const { validationResult } = require('express-validator');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Submit a new academic registration application
// @route   POST /api/registrations
// @access  Private (Student)
const submitRegistration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const { academicYear, semester, department, program, notes } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account record not found.',
      });
    }

    // HCI Error Prevention: Check for existing registration in same year and semester
    const existingRegistration = await Registration.findOne({
      userId: user._id,
      academicYear,
      semester,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted a registration application for ${academicYear} (${semester}) with status: ${existingRegistration.status}. Duplicate submissions are not allowed.`,
        existingId: existingRegistration._id,
      });
    }

    const newRegistration = await Registration.create({
      studentId: user.studentId,
      userId: user._id,
      academicYear,
      semester,
      department: department || user.department,
      program: program || user.program,
      notes: notes ? notes.trim() : '',
      status: 'Pending',
      submittedAt: new Date(),
      statusHistory: [
        {
          status: 'Pending',
          changedAt: new Date(),
          changedBy: user._id,
          note: 'Application submitted by student.',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Registration application submitted successfully! Your application is now Pending administrative review.',
      registration: newRegistration,
    });
  } catch (err) {
    console.error('Registration submission error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to submit registration application.',
      error: err.message,
    });
  }
};

// @desc    Get current student's registration history
// @route   GET /api/registrations/my
// @access  Private (Student)
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registration history.',
      error: err.message,
    });
  }
};

// @desc    Get single registration by ID
// @route   GET /api/registrations/:id
// @access  Private (Student or Admin)
const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('userId', 'firstName middleName lastName email phone studentId department program yearOfStudy')
      .populate('reviewedBy', 'firstName lastName email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration application record not found.',
      });
    }

    // Role check: Only owner or admin can view
    if (
      req.user.role !== 'admin' &&
      registration.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own registration records.',
      });
    }

    res.status(200).json({
      success: true,
      registration,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registration record.',
      error: err.message,
    });
  }
};

module.exports = {
  submitRegistration,
  getMyRegistrations,
  getRegistrationById,
};

