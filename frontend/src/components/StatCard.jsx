import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue', // 'blue' | 'emerald' | 'amber' | 'rose' | 'slate'
}) => {
  const variantStyles = {
    blue: {
      bg: 'bg-blue-50/70 text-blue-600',
      border: 'border-blue-100',
      text: 'text-blue-950',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600',
      border: 'border-emerald-100',
      text: 'text-emerald-950',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-600',
      border: 'border-amber-100',
      text: 'text-amber-950',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-600',
      border: 'border-rose-100',
      text: 'text-rose-950',
    },
    slate: {
      bg: 'bg-slate-100 text-slate-600',
      border: 'border-slate-200',
      text: 'text-slate-900',
    },
  };

  const style = variantStyles[variant] || variantStyles.blue;

  return (
    <div
      className={`rounded-2xl border ${style.border} bg-white p-5 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-extrabold tracking-tight ${style.text}`}>
            {value}
          </p>
        </div>

        {Icon && (
          <div className={`p-3.5 rounded-2xl ${style.bg} shrink-0`}>
            <Icon size={24} />
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;

