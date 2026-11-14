import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import ConfirmModal from '../components/ConfirmModal';
import FormInput from '../components/FormInput';
import {
  Shield,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  GraduationCap,
  AlertTriangle,
} from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Electrical Engineering',
  'Information Systems',
  'Business & Economics',
  'Mechanical Engineering',
  'Biomedical Sciences',
];

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Table & Filters state
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [tableLoading, setTableLoading] = useState(true);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetailsModal, setStudentDetailsModal] = useState(false);
  const [studentDetailsLoading, setStudentDetailsLoading] = useState(false);
  const [studentFullDetails, setStudentFullDetails] = useState(null);

  // Approve / Reject modal
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null, // 'approve' | 'reject' | 'delete' | 'under_review'
    registrationId: null,
    studentId: null,
    studentName: '',
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch admin statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await adminApi.getStats();
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
      showToast('Failed to load system statistics.', 'error');
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch paginated student list
  const fetchStudents = useCallback(async () => {
    try {
      setTableLoading(true);
      const params = {
        page,
        limit,
        search,
        department: selectedDept === 'All Departments' ? '' : selectedDept,
        sortBy,
        sortOrder,
      };
      const res = await adminApi.getStudents(params);
      if (res.data?.success) {
        setStudents(res.data.students);
        setTotalStudents(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      showToast('Failed to load students list.', 'error');
    } finally {
      setTableLoading(false);
    }
  }, [page, limit, search, selectedDept, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Open Student Details Modal
  const handleViewDetails = async (studentId) => {
    try {
      setStudentDetailsModal(true);
      setStudentDetailsLoading(true);
      const res = await adminApi.getStudentById(studentId);
      if (res.data?.success) {
        setStudentFullDetails(res.data);
      }
    } catch (err) {
      showToast('Could not load student details.', 'error');
      setStudentDetailsModal(false);
    } finally {
      setStudentDetailsLoading(false);
    }
  };

  // Trigger quick status updates
  const openApproveModal = (student) => {
    if (!student.latestRegistration) {
      showToast('This student has not submitted any registration yet.', 'warning');
      return;
    }
    setActionModal({
      isOpen: true,
      type: 'approve',
      registrationId: student.latestRegistration.id,
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
    });
  };

  const openRejectModal = (student) => {
    if (!student.latestRegistration) {
      showToast('This student has not submitted any registration yet.', 'warning');
      return;
    }
    setRejectionReason('');
    setActionModal({
      isOpen: true,
      type: 'reject',
      registrationId: student.latestRegistration.id,
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
    });
  };

  const openUnderReviewModal = (student) => {
    if (!student.latestRegistration) return;
    setActionModal({
      isOpen: true,
      type: 'under_review',
      registrationId: student.latestRegistration.id,
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
    });
  };

  const openDeleteModal = (student) => {
    setActionModal({
      isOpen: true,
      type: 'delete',
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
    });
  };

  // Perform confirmed action
  const handleConfirmAction = async () => {
    setActionLoading(true);

    try {
      if (actionModal.type === 'approve') {
        await adminApi.updateStatus(actionModal.registrationId, {
          status: 'Approved',
          note: 'Approved by Administrator.',
        });
        showToast(`Registration for ${actionModal.studentName} has been approved.`, 'success');
      } else if (actionModal.type === 'under_review') {
        await adminApi.updateStatus(actionModal.registrationId, {
          status: 'Under Review',
          note: 'Set to Under Review by Administrator.',
        });
        showToast(`Registration for ${actionModal.studentName} marked Under Review.`, 'info');
      } else if (actionModal.type === 'reject') {
        if (!rejectionReason.trim()) {
          showToast('Please provide a rejection reason.', 'warning');
          setActionLoading(false);
          return;
        }
        await adminApi.updateStatus(actionModal.registrationId, {
          status: 'Rejected',
          rejectionReason: rejectionReason.trim(),
        });
        showToast(`Registration for ${actionModal.studentName} has been rejected.`, 'info');
      } else if (actionModal.type === 'delete') {
        await adminApi.deleteStudent(actionModal.studentId);
        showToast(`Student ${actionModal.studentName} deleted successfully.`, 'success');
      }

      setActionModal({ isOpen: false, type: null, registrationId: null, studentId: null, studentName: '' });
      fetchStats();
      fetchStudents();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-navy-900 text-white p-6 md:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <Shield size={14} />
            <span>Academic Registry Control Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Monitor real-time enrollment statistics, manage student records, and evaluate registration applications.
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            fetchStudents();
            showToast('Refreshed registry metrics and records.', 'info');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 text-xs font-semibold self-start md:self-auto transition-colors"
        >
          <RefreshCw size={14} className={tableLoading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={stats ? stats.totalStudents : 0}
          subtitle="Registered accounts"
          icon={Users}
          variant="slate"
        />

        <StatCard
          title="Pending Review"
          value={stats ? stats.pendingCount : 0}
          subtitle="Action required"
          icon={Clock}
          variant="amber"
        />

        <StatCard
          title="Under Review"
          value={stats ? stats.underReviewCount : 0}
          subtitle="In verification"
          icon={Eye}
          variant="blue"
        />

        <StatCard
          title="Approved"
          value={stats ? stats.approvedCount : 0}
          subtitle="Officially enrolled"
          icon={CheckCircle2}
          variant="emerald"
        />

        <StatCard
          title="Rejected"
          value={stats ? stats.rejectedCount : 0}
          subtitle="Feedback dispatched"
          icon={XCircle}
          variant="rose"
        />
      </div>

      {/* Main Student Management Section */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden space-y-4">
        {/* Table Controls (Search, Filters, Sorting) */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Registry & Applications</h2>
              <p className="text-xs text-slate-500">
                Found {totalStudents} registered students across all faculties
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Show:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Live Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by student name, ID, or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
              />
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-slate-700 cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <Filter size={15} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split(':');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-slate-700 cursor-pointer"
              >
                <option value="createdAt:desc">Newest Registered</option>
                <option value="createdAt:asc">Oldest Registered</option>
                <option value="lastName:asc">Student Name (A-Z)</option>
                <option value="lastName:desc">Student Name (Z-A)</option>
                <option value="studentId:asc">Student ID (Ascending)</option>
              </select>
              <SlidersHorizontal size={15} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Student ID</th>
                <th className="py-3 px-5">Student Name</th>
                <th className="py-3 px-5">Email & Contact</th>
                <th className="py-3 px-5">Department & Program</th>
                <th className="py-3 px-5">Latest Status</th>
                <th className="py-3 px-5">Registered Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {tableLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading student records...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No student records match the search or filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const reg = student.latestRegistration;

                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Student ID */}
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                        {student.studentId || 'N/A'}
                      </td>

                      {/* Full Name */}
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {student.firstName} {student.middleName} {student.lastName}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Year {student.yearOfStudy || 1}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5 text-slate-600">
                        <span>{student.email}</span>
                        <span className="block text-[10px] text-slate-400">{student.phone}</span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-5">
                        <span className="font-medium text-slate-800 block">{student.department}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                          {student.program}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        {reg ? (
                          <StatusBadge status={reg.status} size="sm" />
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No submission</span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-5 text-slate-500">
                        {new Date(student.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => handleViewDetails(student._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Student Dossier"
                            aria-label={`View details for ${student.firstName} ${student.lastName}`}
                          >
                            <Eye size={15} />
                          </button>

                          {/* Quick Under Review */}
                          {reg && reg.status === 'Pending' && (
                            <button
                              onClick={() => openUnderReviewModal(student)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Mark Under Review"
                              aria-label={`Mark under review for ${student.firstName}`}
                            >
                              <Clock size={15} />
                            </button>
                          )}

                          {/* Quick Approve */}
                          {reg && reg.status !== 'Approved' && (
                            <button
                              onClick={() => openApproveModal(student)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Approve Registration"
                              aria-label={`Approve registration for ${student.firstName}`}
                            >
                              <Check size={15} />
                            </button>
                          )}

                          {/* Quick Reject */}
                          {reg && reg.status !== 'Rejected' && (
                            <button
                              onClick={() => openRejectModal(student)}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Reject Registration"
                              aria-label={`Reject registration for ${student.firstName}`}
                            >
                              <X size={15} />
                            </button>
                          )}

                          {/* Delete Student */}
                          <button
                            onClick={() => openDeleteModal(student)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete Student Record"
                            aria-label={`Delete record for ${student.firstName} ${student.lastName}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing Page <strong className="text-slate-800">{page}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong> (Total: {totalStudents} records)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation & Action Modal */}
      <ConfirmModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: null, registrationId: null, studentId: null, studentName: '' })}
        onConfirm={handleConfirmAction}
        title={
          actionModal.type === 'approve'
            ? 'Approve Registration Application'
            : actionModal.type === 'under_review'
            ? 'Mark Application Under Review'
            : actionModal.type === 'reject'
            ? 'Reject Registration Application'
            : 'Permanently Delete Student Record'
        }
        message={
          actionModal.type === 'approve'
            ? `Are you sure you want to approve the academic registration for ${actionModal.studentName}? The student will receive official approval feedback immediately.`
            : actionModal.type === 'under_review'
            ? `Move ${actionModal.studentName}'s application to 'Under Review' status while checking departmental qualifications?`
            : actionModal.type === 'reject'
            ? `Provide an informative rejection reason for ${actionModal.studentName}. This reason will be prominently displayed on their dashboard so they can remediate and resubmit.`
            : `Are you sure you want to delete ${actionModal.studentName}'s account and all associated registration records? This action is permanent and cannot be undone.`
        }
        confirmText={
          actionModal.type === 'approve'
            ? 'Confirm Approval'
            : actionModal.type === 'under_review'
            ? 'Set Under Review'
            : actionModal.type === 'reject'
            ? 'Confirm Rejection'
            : 'Yes, Delete Permanently'
        }
        cancelText="Cancel"
        variant={
          actionModal.type === 'approve'
            ? 'success'
            : actionModal.type === 'delete'
            ? 'danger'
            : actionModal.type === 'reject'
            ? 'warning'
            : 'primary'
        }
        isLoading={actionLoading}
      >
        {actionModal.type === 'reject' && (
          <div className="mt-2 space-y-1 text-left">
            <label className="block text-xs font-semibold text-slate-700">
              Rejection Reason & Guidance <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Missing prerequisite course approval; please upload signed advisor approval..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none"
              required
            />
          </div>
        )}
      </ConfirmModal>

      {/* Student Details Dossier Modal */}
      {studentDetailsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Student Profile Dossier</h3>
                  <p className="text-xs text-slate-500">Registry records and historical audit</p>
                </div>
              </div>

              <button
                onClick={() => setStudentDetailsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {studentDetailsLoading ? (
              <div className="py-12 text-center text-slate-400">Loading student dossier...</div>
            ) : studentFullDetails ? (
              <div className="space-y-6 text-xs">
                {/* Personal Information */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Full Name</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {studentFullDetails.student.firstName} {studentFullDetails.student.middleName} {studentFullDetails.student.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Student ID</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {studentFullDetails.student.studentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Email</span>
                    <span className="font-semibold text-slate-900">
                      {studentFullDetails.student.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Phone</span>
                    <span className="font-semibold text-slate-900">
                      {studentFullDetails.student.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Gender</span>
                    <span className="font-semibold text-slate-900">
                      {studentFullDetails.student.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Date of Birth</span>
                    <span className="font-semibold text-slate-900">
                      {studentFullDetails.student.dateOfBirth
                        ? new Date(studentFullDetails.student.dateOfBirth).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Academic Affiliation */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-400 block font-medium">Department</span>
                    <span className="font-bold text-blue-950">
                      {studentFullDetails.student.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Degree Track</span>
                    <span className="font-bold text-blue-950">
                      {studentFullDetails.student.program}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Academic Tier</span>
                    <span className="font-bold text-blue-950">
                      Year {studentFullDetails.student.yearOfStudy}
                    </span>
                  </div>
                </div>

                {/* Registrations List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Academic Registration History ({studentFullDetails.registrations.length})
                  </h4>

                  {studentFullDetails.registrations.length === 0 ? (
                    <p className="text-slate-400 italic">No registrations submitted yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {studentFullDetails.registrations.map((r) => (
                        <div
                          key={r._id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">
                              {r.academicYear} • {r.semester}
                            </span>
                            <StatusBadge status={r.status} size="sm" />
                          </div>

                          {r.notes && (
                            <p className="text-slate-500 italic">Notes: "{r.notes}"</p>
                          )}

                          {r.rejectionReason && (
                            <p className="text-rose-600 font-medium">
                              Rejection Reason: {r.rejectionReason}
                            </p>
                          )}

                          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                            <span>Submitted: {new Date(r.submittedAt).toLocaleDateString()}</span>
                            {r.reviewedBy && (
                              <span>Reviewed by: {r.reviewedBy.firstName} {r.reviewedBy.lastName}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setStudentDetailsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
