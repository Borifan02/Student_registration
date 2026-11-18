const API_BASE = 'http://localhost:5000/api';

const results = [];

function recordTest(id, name, passed, details = '') {
  results.push({ id, name, passed, details });
  const statusIcon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${statusIcon}] Scenario ${id}: ${name} ${details ? `(${details})` : ''}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting Full System Test Suite (All 13 Scenarios)');
  console.log('====================================================\n');

  let studentToken = null;
  let adminToken = null;
  let studentUserId = null;
  let newStudentId = `STU2026-TEST-${Date.now().toString().slice(-4)}`;
  let testEmail = `test.student.${Date.now()}@university.edu`;
  let newRegId = null;

  // Scenario 1: Successful student registration
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Marcus',
        middleName: 'Lee',
        lastName: 'Aurelius',
        gender: 'Male',
        dateOfBirth: '2004-03-15',
        email: testEmail,
        phone: '+1 555-0199',
        studentId: newStudentId,
        department: 'Computer Science',
        program: 'Software Engineering',
        yearOfStudy: 1,
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.token) {
      studentToken = data.token;
      studentUserId = data.user.id;
      recordTest(1, 'Successful student registration', true, `Created ID ${newStudentId}`);
    } else {
      recordTest(1, 'Successful student registration', false, data.message);
    }
  } catch (err) {
    recordTest(1, 'Successful student registration', false, err.message);
  }

  // Scenario 2: Registration with an existing email
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Duplicate',
        lastName: 'Email',
        email: testEmail, // Existing
        phone: '+1 555-0199',
        studentId: `DIFF-${Date.now()}`,
        department: 'Computer Science',
        program: 'Software Engineering',
        yearOfStudy: 1,
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      }),
    });
    const data = await res.json();
    if (res.status === 400 && data.message.includes('email address already exists')) {
      recordTest(2, 'Registration with existing email', true, 'Correctly rejected duplicate email');
    } else {
      recordTest(2, 'Registration with existing email', false, `Status ${res.status}: ${data.message}`);
    }
  } catch (err) {
    recordTest(2, 'Registration with existing email', false, err.message);
  }

  // Scenario 3: Registration with an existing student ID
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Duplicate',
        lastName: 'ID',
        email: `new.unique.${Date.now()}@university.edu`,
        phone: '+1 555-0199',
        studentId: newStudentId, // Existing
        department: 'Computer Science',
        program: 'Software Engineering',
        yearOfStudy: 1,
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      }),
    });
    const data = await res.json();
    if (res.status === 400 && data.message.includes('Student ID already exists')) {
      recordTest(3, 'Registration with existing student ID', true, 'Correctly rejected duplicate student ID');
    } else {
      recordTest(3, 'Registration with existing student ID', false, `Status ${res.status}: ${data.message}`);
    }
  } catch (err) {
    recordTest(3, 'Registration with existing student ID', false, err.message);
  }

  // Scenario 4: Login with valid credentials (Student & Admin)
  try {
    // Student login
    const sRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'ValidPassword123!' }),
    });
    const sData = await sRes.json();

    // Admin login
    const aRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@university.edu', password: 'AdminPassword123!' }),
    });
    const aData = await aRes.json();

    if (sRes.status === 200 && aRes.status === 200 && aData.user.role === 'admin') {
      adminToken = aData.token;
      recordTest(4, 'Login with valid credentials', true, 'Both student & admin authenticated');
    } else {
      recordTest(4, 'Login with valid credentials', false, `${sData.message} / ${aData.message}`);
    }
  } catch (err) {
    recordTest(4, 'Login with valid credentials', false, err.message);
  }

  // Scenario 5: Login with incorrect credentials (both wrong password & wrong email return generic message)
  try {
    const wrongPwdRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'WrongPassword999!' }),
    });
    const wrongPwdData = await wrongPwdRes.json();

    const wrongEmailRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent.user.999@university.edu', password: 'SomePassword123!' }),
    });
    const wrongEmailData = await wrongEmailRes.json();

    if (
      wrongPwdRes.status === 401 &&
      wrongPwdData.message === 'Invalid email or password' &&
      wrongEmailRes.status === 401 &&
      wrongEmailData.message === 'Invalid email or password'
    ) {
      recordTest(5, 'Login with incorrect credentials', true, 'Both wrong email and wrong password return "Invalid email or password"');
    } else {
      recordTest(5, 'Login with incorrect credentials', false, `Expected "Invalid email or password", got: ${wrongPwdData.message} / ${wrongEmailData.message}`);
    }
  } catch (err) {
    recordTest(5, 'Login with incorrect credentials', false, err.message);
  }

  // Scenario 6: Invalid form submissions (empty fields, bad email, mismatch passwords)
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: '',
        email: 'not-an-email',
        password: '123',
        confirmPassword: '456',
      }),
    });
    const data = await res.json();
    if (res.status === 400 && data.errors && data.errors.length > 0) {
      recordTest(6, 'Invalid form submissions handling', true, `Caught ${data.errors.length} validation violations`);
    } else {
      recordTest(6, 'Invalid form submissions handling', false, 'Server did not reject invalid fields');
    }
  } catch (err) {
    recordTest(6, 'Invalid form submissions handling', false, err.message);
  }

  // Scenario 7: Student dashboard access
  try {
    const res = await fetch(`${API_BASE}/student/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.summary) {
      recordTest(7, 'Student dashboard access', true, `Summary loaded (Profile ${data.summary.profileCompletion}%)`);
    } else {
      recordTest(7, 'Student dashboard access', false, `Status ${res.status}: ${data.message}`);
    }
  } catch (err) {
    recordTest(7, 'Student dashboard access', false, err.message);
  }

  // Scenario 8: Unauthorized administrator access (Student attempting admin endpoint)
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${studentToken}` }, // Student token passed to admin route
    });
    const data = await res.json();
    if (res.status === 403) {
      recordTest(8, 'Unauthorized administrator access blocked', true, '403 Forbidden returned to student');
    } else {
      recordTest(8, 'Unauthorized administrator access blocked', false, `Expected 403, got ${res.status}`);
    }
  } catch (err) {
    recordTest(8, 'Unauthorized administrator access blocked', false, err.message);
  }

  // Scenario 9: Successful registration application submission
  try {
    const res = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        academicYear: '2026-2027',
        semester: 'Semester 1',
        department: 'Computer Science',
        program: 'Software Engineering',
        notes: 'Requesting permission for senior capstone credits.',
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.registration) {
      newRegId = data.registration._id;
      recordTest(9, 'Successful registration application submission', true, `Registration ID: ${newRegId}`);
    } else {
      recordTest(9, 'Successful registration application submission', false, data.message);
    }
  } catch (err) {
    recordTest(9, 'Successful registration application submission', false, err.message);
  }

  // Scenario 10: Administrator approval
  try {
    const res = await fetch(`${API_BASE}/admin/registrations/${newRegId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'Approved',
        note: 'All criteria satisfied.',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.registration.status === 'Approved') {
      recordTest(10, 'Administrator approval', true, 'Application status updated to Approved');
    } else {
      recordTest(10, 'Administrator approval', false, data.message);
    }
  } catch (err) {
    recordTest(10, 'Administrator approval', false, err.message);
  }

  // Scenario 11: Administrator rejection with feedback reason
  try {
    const res = await fetch(`${API_BASE}/admin/registrations/${newRegId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'Rejected',
        rejectionReason: 'Prerequisite verification failed: Missing Calculus III credit.',
      }),
    });
    const data = await res.json();
    if (
      res.status === 200 &&
      data.registration.status === 'Rejected' &&
      data.registration.rejectionReason.includes('Calculus III')
    ) {
      recordTest(11, 'Administrator rejection with reason', true, 'Rejection reason successfully stored & returned');
    } else {
      recordTest(11, 'Administrator rejection with reason', false, data.message);
    }
  } catch (err) {
    recordTest(11, 'Administrator rejection with reason', false, err.message);
  }

  // Scenario 12: Registration status updates (Under Review transition)
  try {
    const res = await fetch(`${API_BASE}/admin/registrations/${newRegId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'Under Review',
        note: 'Faculty coordinator reviewing syllabus equivalency.',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.registration.status === 'Under Review') {
      recordTest(12, 'Registration status updates', true, 'Successfully transitioned to Under Review');
    } else {
      recordTest(12, 'Registration status updates', false, data.message);
    }
  } catch (err) {
    recordTest(12, 'Registration status updates', false, err.message);
  }

  // Scenario 13: Swagger API Docs & Health Check
  try {
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    const swaggerRes = await fetch('http://localhost:5000/api-docs/');
    
    if (healthRes.status === 200 && healthData.status === 'healthy' && swaggerRes.status === 200) {
      recordTest(13, 'Swagger Docs & API Health Check', true, 'OpenAPI docs & /api/health responding 200 OK');
    } else {
      recordTest(13, 'Swagger Docs & API Health Check', false, `Health status: ${healthRes.status}, Swagger: ${swaggerRes.status}`);
    }
  } catch (err) {
    recordTest(13, 'Swagger Docs & API Health Check', false, err.message);
  }

  // Summary
  const passedCount = results.filter((r) => r.passed).length;
  console.log('\n====================================================');
  console.log(`📊 Test Suite Completed: ${passedCount}/${results.length} Scenarios Passed`);
  console.log('====================================================');

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

runTests();

