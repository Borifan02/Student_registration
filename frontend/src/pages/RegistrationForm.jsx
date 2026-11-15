import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FormInput from '../components/FormInput';
import ConfirmModal from '../components/ConfirmModal';
import {
  FilePlus,
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  HelpCircle,
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

export const RegistrationForm = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    academicYear: '2026-2027',
    semester: 'Semester 1',
    department: user?.department || 'Computer Science',
    program: user?.program || 'Software Engineering',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.academicYear.trim()) newErrors.academicYear = 'Academic Year is required';
    if (!formData.semester) newErrors.semester = 'Semester selection is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.program) newErrors.program = 'Program is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please complete all required fields.', 'warning');
      return;
    }
    // Open HCI confirmation dialog
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await registrationApi.submit(formData);
      if (res.data?.success) {
        showToast('Registration application submitted successfully!', 'success');
        setShowConfirmModal(false);
        navigate('/student/dashboard');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to submit registration application.';
      setErrors({ general: errorMsg });
      showToast(errorMsg, 'error');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Return link */}
      <div className="mb-6">
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
              <FilePlus size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Academic Registration Form</h1>
              <p className="text-xs text-blue-200 mt-1">
                Submit your official course and program registration for registry review
              </p>
            </div>
          </div>
        </div>

        {/* Student Summary Info Banner */}
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Applicant: </span>
            <span className="font-semibold text-slate-800">{user?.fullName}</span>
          </div>
          <div>
            <span className="text-slate-500">Student ID: </span>
            <span className="font-mono font-bold text-slate-800">{user?.studentId}</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {errors.general && (
            <div
              className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2"
              role="alert"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handlePreSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="academicYear"
                name="academicYear"
                label="Academic Year"
                type="select"
                required
                value={formData.academicYear}
                onChange={handleChange}
                error={errors.academicYear}
                options={['2026-2027', '2027-2028']}
                helperText="Select target academic session"
              />

              <FormInput
                id="semester"
                name="semester"
                label="Academic Semester"
                type="select"
                required
                value={formData.semester}
                onChange={handleChange}
                error={errors.semester}
                options={['Semester 1', 'Semester 2', 'Summer Session']}
                helperText="Current enrollment period"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="reg-department"
                name="department"
                label="Department"
                type="select"
                required
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                options={DEPARTMENTS}
                helperText="Primary faculty or department"
              />

              <FormInput
                id="reg-program"
                name="program"
                label="Degree Program"
                type="select"
                required
                value={formData.program}
                onChange={handleChange}
                error={errors.program}
                options={PROGRAMS_BY_DEPT[formData.department] || []}
                helperText="Enrolled major track"
              />
            </div>

            <FormInput
              id="notes"
              name="notes"
              label="Supporting Information / Notes for Registry"
              type="textarea"
              rows={4}
              placeholder="Provide any additional requests (e.g., dual credit request, prerequisites fulfilled, honors track notes)..."
              value={formData.notes}
              onChange={handleChange}
              helperText="Optional: Add special instructions or questions for the administrative reviewer"
            />

            {/* Error prevention notification note */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs text-blue-900">
              <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">HCI Heuristic Notice:</span>
                <p className="text-blue-800 leading-relaxed">
                  Only one registration application can be submitted per semester. Ensure your department
                  and program selections are verified before proceeding.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors shadow-lg shadow-blue-600/20"
              >
                <FilePlus size={18} />
                <span>Review & Submit Application</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal (HCI Error Prevention) */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalSubmit}
        title="Confirm Application Submission"
        message={`Are you ready to submit your registration for ${formData.academicYear} (${formData.semester}) under ${formData.program}? Once submitted, your application will be queued for administrative review.`}
        confirmText="Yes, Submit Application"
        cancelText="Review Details"
        variant="primary"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default RegistrationForm;

