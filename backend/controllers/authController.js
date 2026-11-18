const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      studentId: user.studentId,
      email: user.email,
    },
    process.env.JWT_SECRET || 'super_secret_jwt_key_student_reg_hci_2026_secure',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const {
    firstName,
    middleName,
    lastName,
    gender,
    dateOfBirth,
    email,
    phone,
    studentId,
    department,
    program,
    yearOfStudy,
    password,
    confirmPassword,
  } = req.body;

  // Passwords match validation
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match. Please ensure both fields match.',
    });
  }

  // Check existing email
  const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingEmail) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address already exists.',
      field: 'email',
    });
  }

  // Check existing student ID
  const existingId = await User.findOne({ studentId: studentId.trim().toUpperCase() });
  if (existingId) {
    return res.status(400).json({
      success: false,
      message: 'A student account with this Student ID already exists.',
      field: 'studentId',
    });
  }

  try {
    const user = await User.create({
      firstName,
      middleName: middleName || '',
      lastName,
      gender,
      dateOfBirth,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      studentId: studentId.trim().toUpperCase(),
      department,
      program,
      yearOfStudy: Number(yearOfStudy) || 1,
      password,
      role: 'student',
    });

    const token = generateToken(user);

    // Return sanitized user object
    const userProfile = {
      id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      studentId: user.studentId,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      department: user.department,
      program: user.program,
      yearOfStudy: user.yearOfStudy,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'Student account registered successfully! Welcome to the portal.',
      token,
      user: userProfile,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
      error: err.message,
    });
  }
};

// @desc    Authenticate user (student or admin) & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);

    const userProfile = {
      id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      studentId: user.studentId,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      department: user.department,
      program: user.program,
      yearOfStudy: user.yearOfStudy,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      message: `Login successful. Welcome back, ${user.firstName}!`,
      token,
      user: userProfile,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
      error: err.message,
    });
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
      error: err.message,
    });
  }
};

module.exports = {
  registerStudent,
  loginUser,
  getMe,
};

