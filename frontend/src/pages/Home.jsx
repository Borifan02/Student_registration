import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  FileText,
  UserCheck,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();

  return (
    <div className="space-y-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white shadow-xl px-6 py-16 md:px-16 md:py-20">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles size={14} />
            <span>Academic Year 2026-2027 Registration Active</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Streamlined Academic Registration Portal
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
            A comprehensive, human-centered student registration management system designed for seamless
            course enrollment, transparent administrative review, and real-time status tracking.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <span>Go to Your {isAdmin ? 'Admin' : 'Student'} Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <UserCheck size={18} />
                  <span>Student Registration</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-800/90 hover:bg-navy-700 text-slate-200 border border-slate-700 font-semibold transition-all focus:ring-2 focus:ring-slate-400 focus:outline-none"
                >
                  <span>Portal Login</span>
                </Link>
              </>
            )}

            <a
              href="/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-blue-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <FileText size={16} />
              <span>Swagger API Docs ↗</span>
            </a>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-10 opacity-10 hidden lg:block pointer-events-none">
          <GraduationCap size={280} />
        </div>
      </section>

      {/* Quick Credentials / Evaluator Banner */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
              <ShieldCheck size={20} className="text-blue-600" />
              <span>Demonstration & Evaluation Access</span>
            </div>
            <p className="mt-1 text-xs text-blue-800 leading-relaxed">
              Default pre-seeded university accounts are available for instant testing.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-blue-200 text-xs shadow-xs">
              <span className="font-semibold text-slate-800 block">Administrator:</span>
              <span className="text-slate-600">admin@university.edu</span> / <span className="font-mono text-slate-700">AdminPassword123!</span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-white border border-blue-200 text-xs shadow-xs">
              <span className="font-semibold text-slate-800 block">Sample Student:</span>
              <span className="text-slate-600">alex.johnson@university.edu</span> / <span className="font-mono text-slate-700">StudentPassword123!</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Academic Workflow */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900">
            Intuitive 4-Stage Registration Lifecycle
          </h2>
          <p className="text-sm text-slate-600">
            Engineered using HCI usability principles to minimize friction, eliminate ambiguity, and provide continuous status visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Account Creation',
              desc: 'Students create an account with academic identity, departmental affiliation, and secure credentials.',
              icon: UserCheck,
            },
            {
              step: '02',
              title: 'Application Submission',
              desc: 'Select academic session, semester, department program, and optional special requests.',
              icon: FileText,
            },
            {
              step: '03',
              title: 'Registry Review',
              desc: 'Academic registry officers verify qualifications, course requirements, and departmental capacity.',
              icon: Clock,
            },
            {
              step: '04',
              title: 'Official Confirmation',
              desc: 'Real-time status updates with constructive feedback, official approval, or actionable rejection guidance.',
              icon: CheckCircle,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-blue-200">{item.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HCI Principles Showcase */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 md:p-12">
        <div className="max-w-3xl space-y-4 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            HCI & Design Principles
          </span>
          <h2 className="text-3xl font-extrabold">Engineered for Usability & Accessibility</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every screen was designed adhering to Jakob Nielsen’s Usability Heuristics and WCAG 2.1 AA accessibility guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <h3 className="font-semibold text-white text-base">Error Prevention & Recovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time form validation prevents duplicate registrations and provides informative error hints with inline recovery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <h3 className="font-semibold text-white text-base">Visibility of System Status</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visual status timelines, clear badges, and non-blocking toast notifications ensure users always know current progress.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <h3 className="font-semibold text-white text-base">Accessible Design Standards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High contrast color ratios, explicit keyboard focus rings, semantic HTML elements, and full screen-reader ARIA markup.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

