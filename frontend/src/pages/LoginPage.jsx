import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IoRocketOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoAlertCircle,
  IoFlashOutline,
} from 'react-icons/io5';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Please provide your email');
      return;
    }
    if (!formData.password) {
      setError('Please provide your password');
      return;
    }

    setSubmitting(true);
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  // Instant Demo Account Login / Setup helper
  const handleDemoLogin = async (role = 'free') => {
    setSubmitting(true);
    setError('');
    const demoEmail = role === 'pro' ? 'pro@saasflow.dev' : 'demo@saasflow.dev';
    const demoPassword = 'password123';

    try {
      // First attempt to login
      await login({ email: demoEmail, password: demoPassword });
      navigate('/dashboard');
    } catch (err) {
      // If user doesn't exist yet, auto-register for demo convenience
      try {
        await register({
          name: role === 'pro' ? 'Pro Manager' : 'Demo User',
          email: demoEmail,
          password: demoPassword,
        });
        navigate('/dashboard');
      } catch (regErr) {
        setError(regErr.response?.data?.message || 'Failed to initialize demo account');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-slate-900 tracking-tight mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <IoRocketOutline className="w-5 h-5" />
          </div>
          <span>
            SaaS<span className="text-indigo-600">Flow</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to access your projects and agile dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl border border-slate-100 sm:px-10">
          {/* Expired session banner */}
          {isExpired && !error && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium">
              Your previous session has expired. Please log in again.
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs font-medium">
              <IoAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Autofill Pill */}
          <div className="mb-6 p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-indigo-900 font-medium">
              <IoFlashOutline className="w-4 h-4 text-indigo-600" />
              <span>Evaluation Mode:</span>
            </div>
            <button
              type="button"
              onClick={() => handleDemoLogin('free')}
              disabled={submitting}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              1-Click Demo Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <IoMailOutline className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <IoLockClosedOutline className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Your account password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 rounded-md"
                >
                  {showPassword ? <IoEyeOffOutline className="w-4 h-4" /> : <IoEyeOutline className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
