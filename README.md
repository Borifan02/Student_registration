# Student Registration Management System (UniReg Portal)

[![Architecture](https://img.shields.io/badge/Architecture-MERN%20Full--Stack-blue.svg)](#technology-stack)
[![HCI-Standards](https://img.shields.io/badge/HCI%20Standards-WCAG%202.1%20AA%20Compliant-emerald.svg)](#human-computer-interaction-hci-principles)
[![API-Docs](https://img.shields.io/badge/API%20Docs-Swagger%20%2F%20OpenAPI%203.0-blueviolet.svg)](#swagger-api-documentation)
[![Automated-Tests](https://img.shields.io/badge/Test%20Suite-13%2F13%20Scenarios%20Passing-success.svg)](#testing-and-verification)

A production-quality, responsive Student Registration Management System engineered for academic institutions. Developed for a university-level **Human-Computer Interaction (HCI)** course, this system demonstrates best practices in usability, error prevention, real-time status visibility, role-based authorization, and modern full-stack web engineering.

---

## 1. System Features & Modules

### 🎓 Student Portal
1. **Interactive Account Registration**: Comprehensive, validated multi-section form with real-time feedback, password strength scoring, and duplicate prevention.
2. **Secure JWT Authentication**: Role-based authentication protecting student data, with auto-session persistence and logout handling.
3. **Personalized Student Dashboard**: Overview banner, profile completion percentage tracker, real-time application status badge, and dynamic notifications.
4. **Academic Registration Application**: Guided course and semester enrollment with error prevention checks ensuring no duplicate submissions for the same semester.
5. **Visual Progress Stepper & Timeline**: Clear visual status indicator for all stages: `Pending` ➔ `Under Review` ➔ `Approved` / `Rejected`.
6. **Detailed Feedback & Remediation**: Specific administrative remarks and actionable guidance rendered if an application requires revision.
7. **Profile Management**: Inspect and update contact details and academic track information.
8. **Audit History**: Complete historical record of all past applications and administrative determinations.

### 🛡️ Administrator Portal
1. **Administrative Control Center**: Executive dashboard displaying real-time metrics (Total Students, Pending, Under Review, Approved, Rejected) and department breakdowns.
2. **Student Management Table**: Responsive, searchable, filterable table with multi-criteria sorting and pagination.
3. **Student Dossier Inspector**: Modal drawer detailing student identification, contact info, and registration history.
4. **Application Evaluation Workflow**:
   - One-click **Approve** action with status confirmation.
   - **Mark Under Review** for in-progress departmental verifications.
   - **Reject with Mandatory Reason**: Enforces clear feedback for student remediation.
5. **Audited Deletion**: Safe deletion of inappropriate or duplicate student records with defensive safety confirmations.

---

## 2. Human-Computer Interaction (HCI) Principles

The application implements core HCI principles rooted in **Jakob Nielsen's 10 Usability Heuristics** and **WCAG 2.1 AA Accessibility Guidelines**:

| HCI Principle | Concrete Implementation in UniReg Portal |
| :--- | :--- |
| **Visibility of System Status** | Real-time status badges (`Pending`, `Under Review`, `Approved`, `Rejected`), lifecycle timeline steppers, loading spinners, and non-blocking toast notifications. |
| **Match Between System and Real World** | Authentic university academic terms (Academic Year, Semester, Department, Program, Student ID, Registry Review). |
| **User Control & Freedom** | Confirmation dialogs (`ConfirmModal`) before critical or destructive actions (submitting registrations, rejecting, deleting records) with Escape-key dismissibility. |
| **Consistency & Standards** | Unified institutional Navy Blue (`#0F172A`, `#1E3A8A`) and Light Blue theme, consistent button states, standard form input styling, and familiar icon metaphors via Lucide React. |
| **Error Prevention** | Proactive client-side validation, server-side express-validator checks, duplicate submission blocking per semester, and disabled buttons during requests. |
| **Recognition Over Recall** | Quick-fill demo account shortcuts on the login screen, pre-filled department/program dropdowns, and persistent visible field labels. |
| **Flexibility & Efficiency** | Live instant search bar, department dropdown filters, and quick sorting on the student management table. |
| **Aesthetic & Minimalist Design** | Clean typography (Inter font), high white space, absence of distracting gradients, clear visual hierarchy. |
| **Help Users Recognize & Recover from Errors** | Accessible error messages attached directly to invalid inputs with `role="alert"`, descriptive server error messages, and explicit rejection guidance. |
| **Accessibility (WCAG 2.1 AA)** | Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`), keyboard focus rings (`focus:ring-2`), and high contrast color ratios. |

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS (Navy blue `#0F172A`, white, and accent blue theme)
- **Routing**: React Router DOM 6 (with role-based route guards)
- **API Client**: Axios (configured with request & response interceptors)
- **Icons**: Lucide React
- **Notifications**: Custom Accessible Toast Notification system

### Backend
- **Runtime**: Node.js & Express.js
- **Architecture**: Clean Modular RESTful API
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS
- **Validation**: Server-side `express-validator`
- **Documentation**: Swagger UI & OpenAPI 3.0 (`swagger-ui-express`, `swagger-jsdoc`)
- **Logging**: Morgan HTTP request logger

### Database & Resilience
- **Database**: MongoDB with Mongoose ODM
- **Resilient Zero-Config Architecture**: Automatic connection to standard external MongoDB (`mongodb://localhost:27017/student_registration` or Atlas URI), with automatic seamless fallback to embedded MongoDB (`mongodb-memory-server`) if external MongoDB is not running. Automatically auto-seeds default accounts on first run!

---

## 4. Default Demonstration Credentials

Pre-seeded accounts are provided for instant evaluation:

| Role | Email Address | Password | Student ID / Status |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@university.edu` | `AdminPassword123!` | System Registry Officer |
| **Student 1 (Approved)** | `alex.johnson@university.edu` | `StudentPassword123!` | `STU2026-001` (Approved) |
| **Student 2 (Pending)** | `sophia.garcia@university.edu` | `StudentPassword123!` | `STU2026-002` (Pending) |
| **Student 3 (Under Review)**| `david.chen@university.edu` | `StudentPassword123!` | `STU2026-003` (Under Review) |
| **Student 4 (Rejected)** | `amara.ndiaye@university.edu` | `StudentPassword123!` | `STU2026-004` (Rejected with Reason) |
| **Student 5 (Fresh)** | `liam.patrick@university.edu` | `StudentPassword123!` | `STU2026-005` (No registration yet) |

> 💡 **HCI Tip**: On the Login screen, click **"Quick Demo Fill"** to instantly test either the Student or Administrator portal with a single click.

---

## 5. Execution Instructions (Ubuntu Linux & macOS / Windows)

### Prerequisites
- **Node.js**: Version 18.x, 20.x, or 24.x
- **npm**: Version 9.x or higher
- Optional: Local MongoDB instance (not required, as the embedded server automatically activates if external MongoDB is offline).

### Step 1: Clone or Navigate to the Project
```bash
cd /home/borifan/Registration_system
```

### Step 2: Install Backend & Frontend Dependencies
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables
Environment files have already been prepared. If needed:
```bash
cd /home/borifan/Registration_system/backend
cp .env.example .env
```
Default `.env` settings:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/student_registration
JWT_SECRET=super_secret_jwt_key_student_reg_hci_2026_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Step 4: Run the Backend Server
```bash
cd /home/borifan/Registration_system/backend
npm start
```
*The backend server will launch on `http://localhost:5000` and automatically populate default accounts if the database is fresh.*

### Step 5: Run the Frontend Development Server
In a second terminal:
```bash
cd /home/borifan/Registration_system/frontend
npm run dev
```
*The frontend portal will be accessible at `http://localhost:5173`.*

---

## 6. Swagger API Documentation

Interactive Swagger API documentation is available at:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

Includes full parameter definitions, schema objects, sample requests, and Bearer token authorization testing for:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`
- `GET  /api/student/dashboard`
- `GET  /api/student/profile`
- `PUT  /api/student/profile`
- `POST /api/registrations`
- `GET  /api/registrations/my`
- `GET  /api/registrations/:id`
- `GET  /api/admin/stats`
- `GET  /api/admin/students`
- `GET  /api/admin/students/:id`
- `PATCH /api/admin/registrations/:id/status`
- `DELETE /api/admin/students/:id`

---

## 7. Testing and Verification

The system includes an automated test script verifying all 13 core requirements:

```bash
cd /home/borifan/Registration_system/backend
node tests/test_all_scenarios.js
```

### Verified Test Matrix:
1. ✅ **Successful student registration** (Validates personal, academic & password requirements)
2. ✅ **Duplicate email prevention** (Returns 400 error with descriptive message)
3. ✅ **Duplicate Student ID prevention** (Ensures unique institutional numbers)
4. ✅ **Valid credentials login** (Authenticates students and administrators, issues JWT)
5. ✅ **Incorrect credentials rejection** (Returns 401 Unauthorized safely)
6. ✅ **Invalid form submission handling** (Catches malformed email, short password, mismatch)
7. ✅ **Student dashboard access** (Returns profile completion score & dynamic notifications)
8. ✅ **Role-based authorization** (Blocks non-admin users from admin endpoints with 403 Forbidden)
9. ✅ **Registration application submission** (Persists registration, establishes status history)
10. ✅ **Administrator approval** (Transitions status to Approved with timestamp & reviewer ID)
11. ✅ **Administrator rejection with reason** (Enforces and stores remediation guidance)
12. ✅ **Registration status updates** (Transitions application to Under Review)
13. ✅ **API Health & Swagger Documentation** (200 OK responses on API endpoints)

---

## 8. Directory Structure

```
Registration_system/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Resilient MongoDB connector & fallback
│   │   └── swagger.js            # Swagger OpenAPI 3.0 configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication controller
│   │   ├── studentController.js  # Student dashboard & profile controller
│   │   ├── registrationController.js # Academic registration application controller
│   │   └── adminController.js    # Administrative management & stats controller
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT bearer token protection
│   │   ├── roleMiddleware.js     # Role-based access control (RBAC)
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── User.js               # Mongoose schema for Students & Admins
│   │   └── Registration.js       # Mongoose schema for Applications & Status History
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── studentRoutes.js      # /api/student routes
│   │   ├── registrationRoutes.js # /api/registrations routes
│   │   └── adminRoutes.js        # /api/admin routes
│   ├── seed/
│   │   └── seedData.js           # Database seed script for default demo accounts
│   ├── tests/
│   │   └── test_all_scenarios.js # 13-scenario automated test suite
│   ├── libs/                     # Local OpenSSL compatibility libraries
│   ├── .env                      # Active environment configuration
│   ├── .env.example              # Example environment template
│   ├── server.js                 # Express application entrypoint
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Institutional registry favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation header with responsive menu & role badges
│   │   │   ├── Sidebar.jsx       # Portal sidebar with active states
│   │   │   ├── Footer.jsx        # Institutional footer with accessibility references
│   │   │   ├── ProtectedRoute.jsx# Role-based route guard
│   │   │   ├── FormInput.jsx     # Accessible input with labels, errors, and password toggle
│   │   │   ├── StatusBadge.jsx   # Visual status badge with distinct semantic styling
│   │   │   ├── ConfirmModal.jsx  # Confirmation dialog for critical actions
│   │   │   ├── Toast.jsx         # Non-blocking accessible toast notifications
│   │   │   ├── Timeline.jsx      # Visual registration lifecycle progress tracker
│   │   │   └── StatCard.jsx      # Metric dashboard card component
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context & session manager
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Institutional landing page
│   │   │   ├── Login.jsx         # Portal login with quick-fill demo accounts
│   │   │   ├── Register.jsx      # Student account creation form with password meter
│   │   │   ├── StudentDashboard.jsx # Personalized student dashboard & status tracker
│   │   │   ├── StudentProfile.jsx   # Student profile viewer and updater
│   │   │   ├── RegistrationForm.jsx # Academic course registration submission form
│   │   │   ├── RegistrationHistory.jsx # Historical applications & rejection feedback
│   │   │   ├── AdminDashboard.jsx   # Administrative dashboard with student table & stats
│   │   │   └── NotFound.jsx         # Accessible 404 page
│   │   ├── services/
│   │   │   └── api.js            # Axios client with request/response interceptors
│   │   ├── App.jsx               # Application routing tree
│   │   ├── main.jsx              # Application bootstrap
│   │   └── index.css             # Tailwind base & custom utility classes
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 9. License

Developed for academic coursework in Human-Computer Interaction (HCI) and Advanced Web Engineering.
