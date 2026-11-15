const User = require('../models/User');
const Registration = require('../models/Registration');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
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

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
const updateStudentProfile = async (req, res) => {
  const { firstName, middleName, lastName, phone, gender, dateOfBirth, department, program, yearOfStudy } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    if (firstName) user.firstName = firstName.trim();
    if (middleName !== undefined) user.middleName = middleName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phone) user.phone = phone.trim();
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (department) user.department = department.trim();
    if (program) user.program = program.trim();
    if (yearOfStudy) user.yearOfStudy = Number(yearOfStudy);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
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
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: err.message,
    });
  }
};

// @desc    Get student dashboard summary
// @route   GET /api/student/dashboard
// @access  Private (Student)
const getStudentDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    // Fetch registrations
    const registrations = await Registration.find({ userId: user._id })
      .sort({ submittedAt: -1 })
      .lean();

    const latestRegistration = registrations[0] || null;

    // Calculate profile completion percentage
    let completedFields = 0;
    const keyFields = ['firstName', 'lastName', 'email', 'phone', 'studentId', 'gender', 'dateOfBirth', 'department', 'program', 'yearOfStudy'];
    keyFields.forEach((field) => {
      if (user[field]) completedFields += 1;
    });
    const profileCompletion = Math.round((completedFields / keyFields.length) * 100);

    // Dynamic notifications list
    const notifications = [];

    if (profileCompletion < 100) {
      notifications.push({
        id: 'note-profile',
        type: 'warning',
        title: 'Complete Your Profile',
        message: `Your profile is ${profileCompletion}% complete. Add all details for smoother processing.`,
        date: new Date(),
      });
    }

    if (!latestRegistration) {
      notifications.push({
        id: 'note-no-reg',
        type: 'info',
        title: 'Academic Registration Open',
        message: 'You have not submitted a registration application for the current academic session.',
        date: new Date(),
      });
    } else if (latestRegistration.status === 'Approved') {
      notifications.push({
        id: 'note-approved',
        type: 'success',
        title: 'Registration Approved!',
        message: `Your registration for ${latestRegistration.academicYear} (${latestRegistration.semester}) has been officially approved.`,
        date: latestRegistration.reviewedAt || latestRegistration.updatedAt,
      });
    } else if (latestRegistration.status === 'Rejected') {
      notifications.push({
        id: 'note-rejected',
        type: 'error',
        title: 'Registration Rejected',
        message: `Reason: ${latestRegistration.rejectionReason || 'Please review administrative remarks and resubmit.'}`,
        date: latestRegistration.reviewedAt || latestRegistration.updatedAt,
      });
    } else if (latestRegistration.status === 'Under Review') {
      notifications.push({
        id: 'note-review',
        type: 'info',
        title: 'Under Administrative Review',
        message: `Your application for ${latestRegistration.academicYear} is currently being verified by the department.`,
        date: latestRegistration.updatedAt,
      });
    } else {
      notifications.push({
        id: 'note-pending',
        type: 'info',
        title: 'Application Pending',
        message: 'Your registration was submitted successfully and is queued for verification.',
        date: latestRegistration.submittedAt,
      });
    }

    res.status(200).json({
      success: true,
      summary: {
        user,
        profileCompletion,
        totalRegistrations: registrations.length,
        latestRegistration,
        notifications,
      },
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard details.',
      error: err.message,
    });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
};

