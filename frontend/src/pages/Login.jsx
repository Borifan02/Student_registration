import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FormInput from '../components/FormInput';
import { GraduationCap, LogIn, Shield, User, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.firstName}!`, 'success');
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      } else {
        setErrors({ general: res.message || 'Invalid credentials' });
        showToast(res.message || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to log in. Please check your connection.';
      setErrors({ general: msg });
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@university.edu');
      setPassword('AdminPassword123!');
      setErrors({});
    } else {
      setEmail('alex.johnson@university.edu');
      setPassword('StudentPassword123!');
      setErrors({});
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-navy-900 p-8 text-center text-white relative">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-blue-600 items-center justify-center mb-3 shadow-md">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">University Portal Login</h1>
          <p className="text-xs text-blue-200 mt-1">
            Access your student registration or administrator dashboard
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {/* Quick Demo Fill Buttons (HCI Convenience) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
              Quick Demo Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('student')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 transition-colors shadow-xs"
              >
                <User size={13} />
                <span>Alex (Student)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 transition-colors shadow-xs"
              >
                <Shield size={13} />
                <span>Registry Admin</span>
              </button>
            </div>
          </div>

          {errors.general && (
            <div
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
              role="alert"
            >
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormInput
              id="login-email"
              name="email"
              label="Email Address"
              type="email"
              required
              placeholder="e.g. name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              helperText="Enter your registered academic or administrative email"
            />

            <FormInput
              id="login-password"
              name="password"
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-colors shadow-md shadow-blue-600/20"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* Registration Redirect */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>New university student without an account? </span>
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Create Account</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

