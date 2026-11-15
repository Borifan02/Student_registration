const express = require('express');
const { body } = require('express-validator');
const {
  getAdminStats,
  getAllStudents,
  getStudentById,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteStudentRecord,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth protection & admin authorization to all admin routes
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get administrative statistics and metrics
 *     tags: [Administrator Portal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/stats', getAdminStats);

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get paginated, searchable, filterable list of students
 *     tags: [Administrator Portal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated student records
 */
router.get('/students', getAllStudents);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   get:
 *     summary: Get single student profile with registration history
 *     tags: [Administrator Portal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details
 */
router.get('/students/:id', getStudentById);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   delete:
 *     summary: Delete student and their associated registration records
 *     tags: [Administrator Portal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student removed successfully
 */
router.delete('/students/:id', deleteStudentRecord);

/**
 * @swagger
 * /api/admin/registrations:
 *   get:
 *     summary: Get all registration applications with filters
 *     tags: [Administrator Portal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registrations
 */
router.get('/registrations', getAllRegistrations);

/**
 * @swagger
 * /api/admin/registrations/{id}/status:
 *   patch:
 *     summary: Update registration status (Approve, Reject, Under Review)
 *     tags: [Administrator Portal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             example:
 *               status: "Approved"
 *               note: "Academic criteria verified and approved."
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Under Review, Approved, Rejected]
 *               rejectionReason:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch(
  '/registrations/:id/status',
  [
    body('status')
      .isIn(['Pending', 'Under Review', 'Approved', 'Rejected'])
      .withMessage('Valid status is required (Pending, Under Review, Approved, Rejected)'),
  ],
  updateRegistrationStatus
);

module.exports = router;

