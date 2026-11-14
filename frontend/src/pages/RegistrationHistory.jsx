import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationApi } from '../services/api';
import { useToast } from '../components/Toast';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import {
  History,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Eye,
  ChevronDown,
  ChevronUp,
  Printer,
} from 'lucide-react';

export const RegistrationHistory = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await registrationApi.getMyRegistrations();
      if (res.data?.success) {
        setRegistrations(res.data.registrations);
        if (res.data.registrations.length > 0) {
          setExpandedId(res.data.registrations[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
      showToast('Could not load registration history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="py-8 space-y-4 max-w-4xl mx-auto animate-pulse">
        <div className="h-20 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <History size={20} />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
              Registration History & Feedback
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Audit trail of all your submitted academic registration requests and official decisions
          </p>
        </div>

        <Link
          to="/student/register-courses"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>New Application</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Prior Submissions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't submitted any registration applications yet. Start by filling out your first form.
            </p>
          </div>
          <Link
            to="/student/register-courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
          >
            Submit Academic Registration
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const isExpanded = expandedId === reg._id;

            return (
              <div
                key={reg._id}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Summary Row */}
                <div
                  onClick={() => toggleExpand(reg._id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50/70 transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(reg._id);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-slate-900">
                        {reg.academicYear} • {reg.semester}
                      </h3>
                      <StatusBadge status={reg.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {reg.department} — {reg.program}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 self-end sm:self-auto">
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>
                        {new Date(reg.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </span>

                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-6 animate-in fade-in duration-150">
                    {/* Rejection Notice if rejected */}
                    {reg.status === 'Rejected' && reg.rejectionReason && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                          <AlertCircle size={15} />
                          <span>Rejection Reason & Required Remediation</span>
                        </div>
                        <p className="text-xs text-rose-700 leading-relaxed font-medium">
                          {reg.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* Notes submitted by student */}
                    {reg.notes && (
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
                        <span className="font-semibold text-slate-700 block mb-0.5">
                          Student Notes & Requests:
                        </span>
                        <p className="text-slate-600 leading-relaxed">{reg.notes}</p>
                      </div>
                    )}

                    {/* Timeline stepper */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Status History & Tracking
                      </h4>
                      <Timeline registration={reg} />
                    </div>

                    {/* Reviewer Details */}
                    {reg.reviewedBy && (
                      <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span>
                          Reviewed by Registry Officer:{' '}
                          <strong className="text-slate-700 font-medium">
                            {reg.reviewedBy.firstName} {reg.reviewedBy.lastName}
                          </strong>
                        </span>
                        {reg.reviewedAt && (
                          <span>
                            Date: {new Date(reg.reviewedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RegistrationHistory;
