import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
        <FileQuestion size={36} />
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md">
          The requested university registry portal page could not be located.
        </p>
      </div>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

