import React from 'react';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-900 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-navy-800">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap size={18} />
              </div>
              <span className="font-bold text-base">UniReg Academic Registry</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Student Registration Management System engineered with human-computer interaction
              principles, accessible UI workflows, role-based authorization, and real-time status tracking.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Student Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/login" className="hover:text-blue-400 transition-colors">
                  Student Sign In
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-blue-400 transition-colors">
                  Create Student Account
                </a>
              </li>
              <li>
                <a href="/student/dashboard" className="hover:text-blue-400 transition-colors">
                  Track Application Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Administrative
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/login" className="hover:text-blue-400 transition-colors">
                  Registry Officer Login
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1">
                <ShieldCheck size={14} />
                <span>RBAC Protected</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} University Registry & Academic Affairs. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Academic Registry & Student Information Management.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

