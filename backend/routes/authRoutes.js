const express = require('express');
const { body } = require('express-validator');
const { registerStudent, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new student account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - studentId
 *               - department
 *               - program
 *               - password
 *               - confirmPassword
 *             example:
 *               firstName: "John"
 *               middleName: "Doe"
 *               lastName: "Smith"
 *               gender: "Male"
 *               dateOfBirth: "2003-04-12"
 *               email: "john.smith@university.edu"
 *               phone: "+1 555-0199"
 *               studentId: "STU2026-999"
 *               department: "Computer Science"
 *               program: "Software Engineering"
 *               yearOfStudy: 1
 *               password: "Password123!"
 *               confirmPassword: "Password123!"
 *             properties:
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other, Prefer not to say]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               studentId:
 *                 type: string
 *               department:
 *                 type: string
 *               program:
 *                 type: string
 *               yearOfStudy:
 *                 type: integer
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Validation error or duplicate email/ID
 */
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address (e.g. name@university.edu)'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
      .withMessage('Please provide a valid phone number format'),
    body('studentId')
      .trim()
      .notEmpty()
      .withMessage('Student ID is required (e.g. STU2026-001)'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('program').trim().notEmpty().withMessage('Program is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[a-zA-Z]/)
      .withMessage('Password must contain at least one letter'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match. Please re-enter your password.');
      }
      return true;
    }),
  ],
  registerStudent
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: "admin@university.edu"
 *               password: "AdminPassword123!"
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid email or password
 */
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently logged in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, getMe);

module.exports = router;

