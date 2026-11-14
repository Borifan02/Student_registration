require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Registration = require('../models/Registration');

const seedDatabase = async () => {
  console.log('[Seed] Clearing existing users and registrations...');
  await User.deleteMany({});
  await Registration.deleteMany({});

  console.log('[Seed] Creating Administrator account...');
  const admin = await User.create({
    firstName: 'Admin',
    middleName: 'Security',
    lastName: 'Director',
    email: 'admin@university.edu',
    phone: '+1 (555) 010-0001',
    studentId: 'ADM-2026',
    gender: 'Prefer not to say',
    dateOfBirth: new Date('1985-04-12'),
    department: 'Academic Affairs & Registry',
    program: 'System Administration',
    yearOfStudy: 1,
    password: 'AdminPassword123!',
    role: 'admin',
  });

  console.log('[Seed] Creating Sample Students...');
  const student1 = await User.create({
    firstName: 'Alex',
    middleName: 'Taylor',
    lastName: 'Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 019-2831',
    studentId: 'STU2026-001',
    gender: 'Male',
    dateOfBirth: new Date('2003-05-14'),
    department: 'Computer Science',
    program: 'Software Engineering',
    yearOfStudy: 2,
    password: 'StudentPassword123!',
    role: 'student',
  });

  const student2 = await User.create({
    firstName: 'Sophia',
    middleName: 'Maria',
    lastName: 'Garcia',
    email: 'sophia.garcia@university.edu',
    phone: '+1 (555) 019-5482',
    studentId: 'STU2026-002',
    gender: 'Female',
    dateOfBirth: new Date('2002-09-22'),
    department: 'Electrical Engineering',
    program: 'Robotics and Automation',
    yearOfStudy: 3,
    password: 'StudentPassword123!',
    role: 'student',
  });

  const student3 = await User.create({
    firstName: 'David',
    middleName: 'Kim',
    lastName: 'Chen',
    email: 'david.chen@university.edu',
    phone: '+1 (555) 019-9134',
    studentId: 'STU2026-003',
    gender: 'Male',
    dateOfBirth: new Date('2004-01-30'),
    department: 'Information Systems',
    program: 'Cybersecurity',
    yearOfStudy: 1,
    password: 'StudentPassword123!',
    role: 'student',
  });

  const student4 = await User.create({
    firstName: 'Amara',
    middleName: 'Chloe',
    lastName: 'Ndiaye',
    email: 'amara.ndiaye@university.edu',
    phone: '+1 (555) 019-7721',
    studentId: 'STU2026-004',
    gender: 'Female',
    dateOfBirth: new Date('2001-11-08'),
    department: 'Business & Economics',
    program: 'Data Analytics for Business',
    yearOfStudy: 4,
    password: 'StudentPassword123!',
    role: 'student',
  });

  const student5 = await User.create({
    firstName: 'Liam',
    middleName: 'Patrick',
    lastName: "O'Connor",
    email: 'liam.patrick@university.edu',
    phone: '+1 (555) 019-4412',
    studentId: 'STU2026-005',
    gender: 'Male',
    dateOfBirth: new Date('2004-08-19'),
    department: 'Computer Science',
    program: 'Artificial Intelligence',
    yearOfStudy: 1,
    password: 'StudentPassword123!',
    role: 'student',
  });

  console.log('[Seed] Creating Registration Applications across various statuses...');

  // Student 1: Approved registration
  await Registration.create({
    studentId: student1.studentId,
    userId: student1._id,
    academicYear: '2026-2027',
    semester: 'Semester 1',
    department: student1.department,
    program: student1.program,
    status: 'Approved',
    notes: 'Full course load requested with honors thesis preparation.',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    reviewedBy: admin._id,
    statusHistory: [
      {
        status: 'Pending',
        changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        changedBy: student1._id,
        note: 'Initial submission by student.',
      },
      {
        status: 'Under Review',
        changedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        changedBy: admin._id,
        note: 'Department prerequisites verified.',
      },
      {
        status: 'Approved',
        changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        changedBy: admin._id,
        note: 'All criteria satisfied. Academic registration verified.',
      },
    ],
  });

  // Student 2: Pending registration
  await Registration.create({
    studentId: student2.studentId,
    userId: student2._id,
    academicYear: '2026-2027',
    semester: 'Semester 1',
    department: student2.department,
    program: student2.program,
    status: 'Pending',
    notes: 'Applying for dual lab sessions in embedded robotics.',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        status: 'Pending',
        changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        changedBy: student2._id,
        note: 'Submitted by student, awaiting administrative review.',
      },
    ],
  });

  // Student 3: Under Review registration
  await Registration.create({
    studentId: student3.studentId,
    userId: student3._id,
    academicYear: '2026-2027',
    semester: 'Semester 1',
    department: student3.department,
    program: student3.program,
    status: 'Under Review',
    notes: 'Requesting permission to enroll in advanced cryptography module.',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reviewedBy: admin._id,
    statusHistory: [
      {
        status: 'Pending',
        changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        changedBy: student3._id,
        note: 'Submitted by student.',
      },
      {
        status: 'Under Review',
        changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        changedBy: admin._id,
        note: 'Checking prerequisites with cybersecurity department head.',
      },
    ],
  });

  // Student 4: Rejected registration
  await Registration.create({
    studentId: student4.studentId,
    userId: student4._id,
    academicYear: '2026-2027',
    semester: 'Semester 1',
    department: student4.department,
    program: student4.program,
    status: 'Rejected',
    notes: 'Senior year capstone project registration.',
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reviewedBy: admin._id,
    rejectionReason:
      'Missing prerequisite signatures from academic advisor for the selected elective modules. Please schedule an advising appointment and resubmit.',
    statusHistory: [
      {
        status: 'Pending',
        changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        changedBy: student4._id,
        note: 'Submitted by student.',
      },
      {
        status: 'Rejected',
        changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        changedBy: admin._id,
        note: 'Missing prerequisite signatures from academic advisor.',
      },
    ],
  });

  console.log('[Seed] Database seeded successfully!');
  console.log('-------------------------------------------------------');
  console.log('Default Credentials:');
  console.log('Administrator: admin@university.edu / AdminPassword123!');
  console.log('Student 1 (Approved): alex.johnson@university.edu / StudentPassword123!');
  console.log('Student 2 (Pending): sophia.garcia@university.edu / StudentPassword123!');
  console.log('Student 3 (Under Review): david.chen@university.edu / StudentPassword123!');
  console.log('Student 4 (Rejected): amara.ndiaye@university.edu / StudentPassword123!');
  console.log('Student 5 (No Reg): liam.patrick@university.edu / StudentPassword123!');
  console.log('-------------------------------------------------------');
};

const runStandaloneSeed = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding data:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  runStandaloneSeed();
}

module.exports = { seedDatabase };
