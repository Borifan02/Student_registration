import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FormInput from '../components/FormInput';
import {
  User,
  GraduationCap,
  Save,
  ArrowLeft,
  CheckCircle,
  Shield,
  Phone,
  Mail,
  Calendar,
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

export const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    department: 'Computer Science',
    program: 'Software Engineering',
    yearOfStudy: '1',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getProfile();
        if (res.data?.success && res.data.user) {
          const u = res.data.user;
          setFormData({
            firstName: u.firstName || '',
            middleName: u.middleName || '',
            lastName: u.lastName || '',
            phone: u.phone || '',
            gender: u.gender || 'Prefer not to say',
            dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '',
            department: u.department || 'Computer Science',
            program: u.program || 'Software Engineering',
            yearOfStudy: String(u.yearOfStudy || '1'),
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        showToast('Could not fetch student profile details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'department' && PROGRAMS_BY_DEPT[value]) {
        updated.program = PROGRAMS_BY_DEPT[value][0] || '';
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Please provide a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix highlighted errors before saving.', 'warning');
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const res = await studentApi.updateProfile(formData);
      if (res.data?.success) {
        showToast('Profile updated successfully!', 'success');
        updateUser(res.data.user);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      showToast(msg, 'error');
      setErrors({ general: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 animate-pulse space-y-6">
        <div className="h-28 bg-slate-200 rounded-3xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <User size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Student Profile Management</h1>
              <p className="text-xs text-blue-200 mt-1">
                Maintain accurate personal and academic records for university registration
              </p>
            </div>
          </div>
        </div>

        {/* Read-Only Verified Badges Banner */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <Shield size={18} className="text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-400 block font-medium">Student Identification:</span>
              <span className="font-mono font-bold text-slate-900">{user?.studentId}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <Mail size={18} className="text-blue-600 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-slate-400 block font-medium">Primary University Email:</span>
              <span className="font-semibold text-slate-900 truncate block">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                id="profile-first"
                name="firstName"
                label="First Name"
                required
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <FormInput
                id="profile-middle"
                name="middleName"
                label="Middle Name"
                value={formData.middleName}
                onChange={handleChange}
              />
              <FormInput
                id="profile-last"
                name="lastName"
                label="Last Name"
                required
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="profile-phone"
                name="phone"
                label="Contact Phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                helperText="Official university contact line"
              />

              <FormInput
                id="profile-gender"
                name="gender"
                label="Gender"
                type="select"
                value={formData.gender}
                onChange={handleChange}
                options={['Male', 'Female', 'Other', 'Prefer not to say']}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                id="profile-dept"
                name="department"
                label="Department"
                type="select"
                required
                value={formData.department}
                onChange={handleChange}
                options={DEPARTMENTS}
              />

              <FormInput
                id="profile-prog"
                name="program"
                label="Program"
                type="select"
                required
                value={formData.program}
                onChange={handleChange}
                options={PROGRAMS_BY_DEPT[formData.department] || []}
              />

              <FormInput
                id="profile-year"
                name="yearOfStudy"
                label="Year of Study"
                type="select"
                required
                value={formData.yearOfStudy}
                onChange={handleChange}
                options={[
                  { value: '1', label: 'Year 1' },
                  { value: '2', label: 'Year 2' },
                  { value: '3', label: 'Year 3' },
                  { value: '4', label: 'Year 4' },
                  { value: '5', label: 'Year 5' },
                ]}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Updates'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
