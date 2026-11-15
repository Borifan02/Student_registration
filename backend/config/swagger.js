const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Registration Management System API',
      version: '1.0.0',
      description:
        'RESTful API documentation for university Student Registration Management System, built with Express, Mongoose, and JWT authentication.',
      contact: {
        name: 'HCI Course Development Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from login in the format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '6644f12ab34c56d7890ef123' },
            firstName: { type: 'string', example: 'Alex' },
            middleName: { type: 'string', example: 'Taylor' },
            lastName: { type: 'string', example: 'Johnson' },
            fullName: { type: 'string', example: 'Alex Taylor Johnson' },
            email: { type: 'string', format: 'email', example: 'alex.johnson@university.edu' },
            phone: { type: 'string', example: '+1-555-0199' },
            studentId: { type: 'string', example: 'STU2026-001' },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other', 'Prefer not to say'], example: 'Male' },
            dateOfBirth: { type: 'string', format: 'date', example: '2003-05-14' },
            department: { type: 'string', example: 'Computer Science' },
            program: { type: 'string', example: 'Software Engineering' },
            yearOfStudy: { type: 'integer', example: 2 },
            role: { type: 'string', enum: ['student', 'admin'], example: 'student' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Registration: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6644f12ab34c56d7890ef456' },
            studentId: { type: 'string', example: 'STU2026-001' },
            userId: { type: 'string', example: '6644f12ab34c56d7890ef123' },
            academicYear: { type: 'string', example: '2026-2027' },
            semester: { type: 'string', example: 'Semester 1' },
            department: { type: 'string', example: 'Computer Science' },
            program: { type: 'string', example: 'Software Engineering' },
            status: { type: 'string', enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], example: 'Pending' },
            notes: { type: 'string', example: 'Full-time registration request.' },
            rejectionReason: { type: 'string', nullable: true, example: null },
            submittedAt: { type: 'string', format: 'date-time' },
            reviewedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

