import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FormInput from '../components/FormInput';
import {
  UserPlus,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Information Systems',
  'Business & Economics',
  'Mechanical Engineering',
  'Biomedical Sciences',
];

const PROGRAMS_BY_DEPT = {
  'Computer Science': [
    'Software Engineering',
    'Artificial Intelligence',
    'Data Science',
    'General Computer Science',
  ],
  'Electrical Engineering': [
    'Robotics and Automation',
    'Telecommunications',
    'Power Systems Engineering',
  ],
  'Information Systems': [
    'Cybersecurity',
    'Cloud Computing Infrastructure',
    'Enterprise Information Systems',
  ],
  'Business & Economics': [
    'Data Analytics for Business',
    'Finance and Accounting',
    'Technology Management',
  ],
  'Mechanical Engineering': [
    'Aerospace Systems',
    'Automotive Engineering',
    'Mechatronics',
  ],
  'Biomedical Sciences': [
    'Bioinformatics',
    'Medical Technology Systems',
  ],
};

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    email: '',
    phone: '',
    studentId: '',
    department: 'Computer Science',
    program: 'Software Engineering',
    yearOfStudy: '1',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password strength calculator
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' };
    return { score, label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'department' && PROGRAMS_BY_DEPT[value]) {
        updated.program = PROGRAMS_BY_DEPT[value][0] || '';
      }
      return updated;
    });

    // Clear specific field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid university or personal email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g. +1 555-0199)';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (formData.studentId.trim().length < 4) {
      newErrors.studentId = 'Student ID must be at least 4 characters';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain both letters and numbers';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct the highlighted form errors before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await register(formData);
      if (res.success) {
        showToast('Registration successful! Welcome to the portal.', 'success');
        navigate('/student/dashboard', { replace: true });
      } else {
        showToast(res.message || 'Registration failed.', 'error');
        setErrors({ general: res.message });
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Server error occurred during registration.';
      const serverField = err.response?.data?.field;
      if (serverField) {
        setErrors({ [serverField]: serverMessage, general: serverMessage });
      } else {
        setErrors({ general: serverMessage });
      }
      showToast(serverMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 p-8 text-white relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <UserPlus size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Student Account Registration</h1>
              <p className="text-xs text-blue-200 mt-1">
                Fill in your personal, academic, and security information to register for the academic session
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8">
          {errors.general && (
            <div
              className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2"
              role="alert"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Section 1: Personal Information */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-base font-bold text-navy-900">1. Personal Information</h2>
                <p className="text-xs text-slate-500">Legal identification as recognized by university records</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  required
                  placeholder="e.g. Alex"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  helperText="Primary given name"
                />

                <FormInput
                  id="middleName"
                  name="middleName"
                  label="Middle Name"
                  placeholder="e.g. Taylor"
                  value={formData.middleName}
                  onChange={handleChange}
                  helperText="Optional"
                />

                <FormInput
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  required
                  placeholder="e.g. Johnson"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  helperText="Family surname"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="gender"
                  name="gender"
                  label="Gender"
                  type="select"
                  value={formData.gender}
                  onChange={handleChange}
                  options={['Male', 'Female', 'Other', 'Prefer not to say']}
                  helperText="Required for demographic records"
                />

                <FormInput
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                  helperText="For age and identity verification"
                />
              </div>
            </div>

            {/* Section 2: Contact & Identification */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-base font-bold text-navy-900">2. Contact & Student Identification</h2>
                <p className="text-xs text-slate-500">Official contact methods and institutional student identification</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  required
                  placeholder="e.g. name@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText="Will be used for portal login"
                />

                <FormInput
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="+1 (555) 019-2831"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  helperText="For SMS & registry updates"
                />

                <FormInput
                  id="studentId"
                  name="studentId"
                  label="Student ID"
                  required
                  placeholder="e.g. STU2026-009"
                  value={formData.studentId}
                  onChange={handleChange}
                  error={errors.studentId}
                  helperText="Unique university student number"
                />
              </div>
            </div>

            {/* Section 3: Academic Affiliation */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-base font-bold text-navy-900">3. Academic Program Affiliation</h2>
                <p className="text-xs text-slate-500">Your department and degree program track</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  id="department"
                  name="department"
                  label="Department"
                  type="select"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  options={DEPARTMENTS}
                  helperText="Academic faculty / division"
                />

                <FormInput
                  id="program"
                  name="program"
                  label="Program"
                  type="select"
                  required
                  value={formData.program}
                  onChange={handleChange}
                  options={PROGRAMS_BY_DEPT[formData.department] || []}
                  helperText="Specific major or course of study"
                />

                <FormInput
                  id="yearOfStudy"
                  name="yearOfStudy"
                  label="Year of Study"
                  type="select"
                  required
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  options={[
                    { value: '1', label: 'Year 1 (Freshman)' },
                    { value: '2', label: 'Year 2 (Sophomore)' },
                    { value: '3', label: 'Year 3 (Junior)' },
                    { value: '4', label: 'Year 4 (Senior)' },
                    { value: '5', label: 'Year 5 (Graduate/Advanced)' },
                  ]}
                  helperText="Current academic year tier"
                />
              </div>
            </div>

            {/* Section 4: Security Credentials */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-base font-bold text-navy-900">4. Account Security</h2>
                <p className="text-xs text-slate-500">Create a resilient password to protect your registration records</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    required
                    placeholder="Min 6 characters with letters and numbers"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    helperText="Must contain letters and numbers"
                  />

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Strength: <strong className="text-slate-700">{strength.label}</strong></span>
                        <span>{strength.score}/5</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300 ${strength.width}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  helperText="Must match password exactly"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <UserPlus size={18} />
                )}
                <span>{isSubmitting ? 'Registering Account...' : 'Complete Student Registration'}</span>
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Sign in here</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

