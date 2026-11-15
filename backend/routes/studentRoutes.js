const express = require('express');
const { body } = require('express-validator');
const {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth protection & student authorization to all student routes
router.use(protect);
router.use(authorize('student'));

/**
 * @swagger
 * /api/student/dashboard:
 *   get:
 *     summary: Get student dashboard overview with status, notifications, and profile completion
 *     tags: [Student Portal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary data
 */
router.get('/dashboard', getStudentDashboard);

/**
 * @swagger
 * /api/student/profile:
 *   get:
 *     summary: Get student profile details
 *     tags: [Student Portal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile data
 */
router.get('/profile', getStudentProfile);

/**
 * @swagger
 * /api/student/profile:
 *   put:
 *     summary: Update student profile details
 *     tags: [Student Portal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               phone: "+1 555-0199"
 *               department: "Computer Science"
 *               program: "Software Engineering"
 *               yearOfStudy: 2
 *     responses:
 *       200:
 *         description: Updated profile data
 */
router.put(
  '/profile',
  [
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
      .withMessage('Please provide a valid phone number format'),
    body('yearOfStudy')
      .optional()
      .isInt({ min: 1, max: 7 })
      .withMessage('Year of study must be between 1 and 7'),
  ],
  updateStudentProfile
);

module.exports = router;

