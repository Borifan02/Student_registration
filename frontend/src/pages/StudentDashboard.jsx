import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import StatCard from '../components/StatCard';
import {
  GraduationCap,
  FilePlus,
  History,
  User,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getDashboard();
      if (res.data?.success) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      showToast('Could not load latest dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-6">
        <div className="h-32 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-200 rounded-2xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  const latestReg = summary?.latestRegistration;
  const profileCompletion = summary?.profileCompletion || 100;
  const notifications = summary?.notifications || [];

  return (
    <div className="space-y-8 py-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-900 to-blue-900 text-white p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
              <GraduationCap size={14} />
              <span>Academic Year 2026-2027</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.firstName} {user?.lastName}!
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              Student ID: <span className="font-mono font-bold text-white">{user?.studentId}</span> | Department of {user?.department || 'General Studies'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/register-courses"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-colors"
            >
              <FilePlus size={16} />
              <span>{latestReg ? 'Submit New Application' : 'Apply for Registration'}</span>
            </Link>

            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
            >
              <User size={16} />
              <span>View Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Completion Alert (HCI Usability) */}
      {profileCompletion < 100 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                Profile Completion: {profileCompletion}%
              </p>
              <p className="text-xs text-amber-800">
                Please complete your personal and contact details to ensure swift application review.
              </p>
            </div>
          </div>
          <Link
            to="/student/profile"
            className="shrink-0 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Update Profile
          </Link>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Current Registration"
          value={latestReg ? latestReg.status : 'Not Registered'}
          subtitle={
            latestReg
              ? `${latestReg.academicYear} • ${latestReg.semester}`
              : 'Submit an application below'
          }
          icon={latestReg?.status === 'Approved' ? CheckCircle2 : Clock}
          variant={
            latestReg?.status === 'Approved'
              ? 'emerald'
              : latestReg?.status === 'Rejected'
              ? 'rose'
              : latestReg?.status === 'Under Review'
              ? 'blue'
              : 'amber'
          }
        />

        <StatCard
          title="Registered Department"
          value={user?.department || 'N/A'}
          subtitle={user?.program || 'Undergraduate Track'}
          icon={BookOpen}
          variant="blue"
        />

        <StatCard
          title="Academic Level"
          value={`Year ${user?.yearOfStudy || 1}`}
          subtitle="Full-time enrolled student"
          icon={GraduationCap}
          variant="slate"
        />
      </div>

      {/* Main Grid: Status Tracking & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Registration Status & Stepper */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Registration Application Status
                </h2>
                <p className="text-xs text-slate-500">
                  Tracking your active application through registry verification
                </p>
              </div>

              {latestReg && <StatusBadge status={latestReg.status} size="lg" />}
            </div>

            {latestReg ? (
              <div className="space-y-6">
                {/* Details summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Session</span>
                    <span className="font-semibold text-slate-800">{latestReg.academicYear}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Semester</span>
                    <span className="font-semibold text-slate-800">{latestReg.semester}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Submitted</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(latestReg.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Program</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {latestReg.program}
                    </span>
                  </div>
                </div>

                {/* Rejection notice if rejected */}
                {latestReg.status === 'Rejected' && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wide">
                      <AlertCircle size={16} />
                      <span>Administrative Feedback (Action Required)</span>
                    </div>
                    <p className="text-xs text-rose-700 leading-relaxed font-medium">
                      "{latestReg.rejectionReason || 'Please contact registry office for guidance.'}"
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/student/register-courses"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
                      >
                        <span>Resubmit Registration Application</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Visual Timeline Stepper */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Lifecycle Timeline
                  </h3>
                  <Timeline registration={latestReg} />
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <FilePlus size={32} />
                </div>
                <div className="max-w-sm mx-auto space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    No Registration Submitted Yet
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submit your academic registration details for the upcoming semester to enroll in courses.
                  </p>
                </div>
                <Link
                  to="/student/register-courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-colors"
                >
                  <FilePlus size={16} />
                  <span>Start Registration</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Notifications & Quick Access */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Bell size={18} className="text-blue-600" />
                <span>Registry Notifications</span>
              </div>
              <span className="text-xs text-slate-400">{notifications.length} alerts</span>
            </div>

            <div className="space-y-3">
              {notifications.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
                >
                  <p className="text-xs font-bold text-slate-800">{note.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{note.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Portals
            </h3>

            <div className="space-y-2">
              <Link
                to="/student/history"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <History size={16} className="text-slate-500" />
                  <span>Registration History</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>

              <Link
                to="/student/profile"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User size={16} className="text-slate-500" />
                  <span>Update Profile Details</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
