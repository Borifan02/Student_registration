const User = require('../models/User');
const Registration = require('../models/Registration');

// @desc    Get administrative dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRegistrations = await Registration.countDocuments();
    const pendingCount = await Registration.countDocuments({ status: 'Pending' });
    const underReviewCount = await Registration.countDocuments({ status: 'Under Review' });
    const approvedCount = await Registration.countDocuments({ status: 'Approved' });
    const rejectedCount = await Registration.countDocuments({ status: 'Rejected' });

    // Registrations breakdown by department
    const departmentBreakdown = await Registration.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Status distribution
    const statusDistribution = [
      { name: 'Pending', value: pendingCount, color: '#F59E0B' },
      { name: 'Under Review', value: underReviewCount, color: '#3B82F6' },
      { name: 'Approved', value: approvedCount, color: '#10B981' },
      { name: 'Rejected', value: rejectedCount, color: '#EF4444' },
    ];

    // Recent registrations
    const recentRegistrations = await Registration.find()
      .populate('userId', 'firstName middleName lastName email studentId department program')
      .sort({ submittedAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRegistrations,
        pendingCount,
        underReviewCount,
        approvedCount,
        rejectedCount,
        statusDistribution,
        departmentBreakdown,
        recentRegistrations,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative statistics.',
      error: err.message,
    });
  }
};

// @desc    Get all students with search, filter, sort, pagination
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
  try {
    const {
      search = '',
      department = '',
      yearOfStudy = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { role: 'student' };

    // Search query across studentId, firstName, lastName, email
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { studentId: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { department: regex },
      ];
    }

    if (department) {
      query.department = department;
    }

    if (yearOfStudy) {
      query.yearOfStudy = Number(yearOfStudy);
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [students, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query),
    ]);

    // Attach latest registration status to each student for table view
    const studentIds = students.map((s) => s._id);
    const registrations = await Registration.find({ userId: { $in: studentIds } })
      .sort({ submittedAt: -1 })
      .lean();

    const studentsWithRegistration = students.map((student) => {
      const studentRegs = registrations.filter(
        (r) => r.userId.toString() === student._id.toString()
      );
      const latestReg = studentRegs[0] || null;
      return {
        ...student,
        latestRegistration: latestReg
          ? {
              id: latestReg._id,
              status: latestReg.status,
              academicYear: latestReg.academicYear,
              semester: latestReg.semester,
              submittedAt: latestReg.submittedAt,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
      students: studentsWithRegistration,
    });
  } catch (err) {
    console.error('Get all students error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students list.',
      error: err.message,
    });
  }
};

// @desc    Get detailed student information with history
// @route   GET /api/admin/students/:id
// @access  Private (Admin)
const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    const registrations = await Registration.find({ userId: student._id })
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      student,
      registrations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve student details.',
      error: err.message,
    });
  }
};

// @desc    Get all registrations with search, filter, and pagination
// @route   GET /api/admin/registrations
// @access  Private (Admin)
const getAllRegistrations = async (req, res) => {
  try {
    const {
      search = '',
      status = '',
      department = '',
      semester = '',
      page = 1,
      limit = 10,
      sortBy = 'submittedAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (department) {
      query.department = department;
    }

    if (semester) {
      query.semester = semester;
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ studentId: regex }, { department: regex }, { program: regex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [registrations, total] = await Promise.all([
      Registration.find(query)
        .populate('userId', 'firstName middleName lastName email phone studentId department program')
        .populate('reviewedBy', 'firstName lastName email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Registration.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
      registrations,
    });
  } catch (err) {
    console.error('Get registrations error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations.',
      error: err.message,
    });
  }
};

// @desc    Approve, reject, or update status of a registration
// @route   PATCH /api/admin/registrations/:id/status
// @access  Private (Admin)
const updateRegistrationStatus = async (req, res) => {
  const { status, rejectionReason, note } = req.body;

  const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  if (status === 'Rejected' && (!rejectionReason || !rejectionReason.trim())) {
    return res.status(400).json({
      success: false,
      message: 'A rejection reason is required when rejecting a registration request.',
      field: 'rejectionReason',
    });
  }

  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration application not found.',
      });
    }

    const previousStatus = registration.status;
    registration.status = status;
    registration.reviewedAt = new Date();
    registration.reviewedBy = req.user._id;

    if (status === 'Rejected') {
      registration.rejectionReason = rejectionReason.trim();
    } else if (status === 'Approved') {
      registration.rejectionReason = null;
    }

    // Append to status history for transparency & audit trail
    registration.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user._id,
      note: note || (status === 'Rejected' ? `Rejected: ${rejectionReason}` : `Status changed from ${previousStatus} to ${status}`),
    });

    await registration.save();

    const updated = await Registration.findById(registration._id)
      .populate('userId', 'firstName middleName lastName email phone studentId department program')
      .populate('reviewedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: `Registration status successfully updated to '${status}'.`,
      registration: updated,
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration status.',
      error: err.message,
    });
  }
};

// @desc    Delete student record and associated registrations
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin)
const deleteStudentRecord = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    // Prevent admin from deleting themselves
    if (student._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Security error: You cannot delete your own administrative account.',
      });
    }

    // Delete associated registrations
    const deletedRegistrations = await Registration.deleteMany({ userId: student._id });

    // Delete user
    await User.findByIdAndDelete(student._id);

    res.status(200).json({
      success: true,
      message: `Student '${student.firstName} ${student.lastName}' (${student.studentId || student.email}) and ${deletedRegistrations.deletedCount} associated registration records have been permanently removed.`,
    });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student record.',
      error: err.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAllStudents,
  getStudentById,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteStudentRecord,
};
