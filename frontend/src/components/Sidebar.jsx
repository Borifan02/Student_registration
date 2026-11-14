import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FilePlus,
  History,
  User,
  Shield,
  Users,
  CheckSquare,
  LogOut,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isStudent, isAdmin, logout } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { to: '/student/register-courses', icon: FilePlus, label: 'Academic Registration' },
    { to: '/student/history', icon: History, label: 'Registration History' },
    { to: '/student/profile', icon: User, label: 'Student Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Overview & Stats' },
  ];

  const links = isStudent ? studentLinks : adminLinks;

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 hidden lg:flex flex-col min-h-[calc(100vh-4rem)]">
      {/* User Quick Info */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shadow-sm">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {user?.fullName}
            </h3>
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 capitalize">
              {isAdmin ? 'System Admin' : user?.studentId || 'Student'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-4 space-y-1.5" aria-label="Sidebar Navigation">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          {isAdmin ? 'Administration' : 'Academic Portal'}
        </div>

        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer logout button */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
