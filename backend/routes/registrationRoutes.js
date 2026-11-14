const express = require('express');
const { body } = require('express-validator');
const {
  submitRegistration,
  getMyRegistrations,
  getRegistrationById,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Submit a new academic registration application
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - academicYear
 *               - semester
 *             properties:
 *               academicYear:
 *                 type: string
 *                 example: "2026-2027"
 *               semester:
 *                 type: string
 *                 example: "Semester 1"
 *               department:
 *                 type: string
 *               program:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Validation error or duplicate application
 */
router.post(
  '/',
  authorize('student'),
  [
    body('academicYear')
      .trim()
      .notEmpty()
      .withMessage('Academic Year is required (e.g. 2026-2027)'),
    body('semester')
      .trim()
      .isIn(['Semester 1', 'Semester 2', 'Summer Session'])
      .withMessage('Valid semester is required (Semester 1, Semester 2, Summer Session)'),
  ],
  submitRegistration
);

/**
 * @swagger
 * /api/registrations/my:
 *   get:
 *     summary: Get all registration applications for the current student
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user registrations
 */
router.get('/my', authorize('student'), getMyRegistrations);

/**
 * @swagger
 * /api/registrations/{id}:
 *   get:
 *     summary: Get a specific registration record by ID
 *     tags: [Registrations]
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
 *         description: Registration details
 *       403:
 *         description: Forbidden if accessing another student's record
 *       404:
 *         description: Not found
 */
router.get('/:id', getRegistrationById);

module.exports = router;
