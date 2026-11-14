import React from 'react';
import { Check, Clock, Eye, X, AlertTriangle } from 'lucide-react';

export const Timeline = ({ registration }) => {
  if (!registration) return null;

  const status = registration.status || 'Pending';
  const isRejected = status === 'Rejected';
  const isApproved = status === 'Approved';
  const isUnderReview = status === 'Under Review' || isApproved || isRejected;

  const steps = [
    {
      title: 'Application Submitted',
      description: `Submitted by student on ${new Date(registration.submittedAt || registration.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}`,
      completed: true,
      current: status === 'Pending',
      icon: Check,
      color: 'bg-emerald-600 text-white',
    },
    {
      title: 'Administrative Verification',
      description: isUnderReview
        ? 'Application prerequisites and departmental credentials examined.'
        : 'Awaiting review by academic registry.',
      completed: isUnderReview,
      current: status === 'Under Review',
      icon: isUnderReview ? (status === 'Under Review' ? Eye : Check) : Clock,
      color: isUnderReview
        ? status === 'Under Review'
          ? 'bg-blue-600 text-white'
          : 'bg-emerald-600 text-white'
        : 'bg-slate-200 text-slate-500',
    },
    {
      title: isRejected ? 'Registration Rejected' : 'Official Approval',
      description: isRejected
        ? `Application rejected: "${registration.rejectionReason || 'See remarks below'}"`
        : isApproved
        ? `Officially approved on ${new Date(registration.reviewedAt || registration.updatedAt).toLocaleDateString()}`
        : 'Final decision pending completion of administrative review.',
      completed: isApproved || isRejected,
      current: isApproved || isRejected,
      icon: isRejected ? X : isApproved ? Check : Clock,
      color: isRejected
        ? 'bg-rose-600 text-white'
        : isApproved
        ? 'bg-emerald-600 text-white'
        : 'bg-slate-200 text-slate-500',
    },
  ];

  return (
    <div className="py-2">
      <nav aria-label="Registration Progress">
        <ol className="relative border-l-2 border-slate-200 ml-4 space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <li key={idx} className="relative pl-6">
                <span
                  className={`absolute -left-[17px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${step.color} shadow-sm`}
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{step.title}</h4>
                    {step.current && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Current Stage
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Timeline;
