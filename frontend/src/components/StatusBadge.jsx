import React from 'react';
import { Clock, Eye, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const normalized = (status || 'Pending').toLowerCase().trim();

  let config = {
    label: status || 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock,
  };

  if (normalized === 'approved') {
    config = {
      label: 'Approved',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
    };
  } else if (normalized === 'under review') {
    config = {
      label: 'Under Review',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
      icon: Eye,
    };
  } else if (normalized === 'rejected') {
    config = {
      label: 'Rejected',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      icon: XCircle,
    };
  } else if (normalized === 'pending') {
    config = {
      label: 'Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      icon: Clock,
    };
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      role="status"
      aria-label={`Registration Status: ${config.label}`}
    >
      <Icon size={iconSize} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
