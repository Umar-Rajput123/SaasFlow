import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IoRocketOutline,
  IoCheckmarkCircle,
  IoFlashOutline,
  IoShieldCheckmarkOutline,
  IoStatsChartOutline,
  IoLayersOutline,
  IoTimeOutline,
  IoArrowForward,
  IoStar,
} from 'react-icons/io5';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <IoRocketOutline className="w-5 h-5" />
            </div>
            <span>
              SaaS<span className="text-indigo-600">Flow</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-indigo-600 transition-colors">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">
              Reviews
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-200 transition-all"
              >
                Go to Dashboard
                <IoArrowForward className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glow background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Production MERN Stack Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Smart Project Management <br className="hidden sm:block" />
            built for <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Agile SaaS Teams</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Organize roadmaps, prioritize high-impact deliverables, track deadlines, and scale effortlessly from our Free tier to Pro unlimited workspaces.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
            >
              Start Free (No Card Needed)
              <IoArrowForward className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all flex items-center justify-center"
            >
              Sign In Demo Account
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <IoCheckmarkCircle className="w-4 h-4 text-emerald-500" />
              Free 3 Projects Forever
            </div>
            <div className="flex items-center gap-2">
              <IoCheckmarkCircle className="w-4 h-4 text-emerald-500" />
              JWT Authenticated & Encrypted
            </div>
            <div className="flex items-center gap-2">
              <IoCheckmarkCircle className="w-4 h-4 text-emerald-500" />
              100% Ownership Security
            </div>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-2xl shadow-indigo-500/10">
            <div className="rounded-xl border border-slate-100 bg-slate-900 p-4 text-white">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="ml-2 text-xs font-mono text-slate-400">app.saasflow.dev/dashboard</span>
                </div>
                <div className="text-xs text-indigo-400 font-semibold bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800">
                  Live SaaS Demo
                </div>
              </div>

              {/* Mockup content */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">Total Projects</span>
                  <p className="text-2xl font-bold text-white mt-1">12</p>
                  <span className="text-[11px] text-emerald-400">↑ 24% this month</span>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">In Progress</span>
                  <p className="text-2xl font-bold text-amber-400 mt-1">5</p>
                  <span className="text-[11px] text-slate-400">Active milestones</span>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">Completed</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">7</p>
                  <span className="text-[11px] text-emerald-400">On schedule</span>
                </div>
                <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-4 rounded-xl border border-indigo-500">
                  <span className="text-xs text-indigo-200">Current Plan</span>
                  <p className="text-2xl font-bold text-white mt-1">PRO PLAN</p>
                  <span className="text-[11px] text-amber-300">★ Unlimited Workspaces</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Powerful Core Features
            </h2>
            <p className="text-3xl font-extrabold text-slate-900">
              Everything you need to deliver projects on time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: IoLayersOutline,
                title: 'Project Lifecycle Management',
                description:
                  'Seamlessly navigate projects across Planning, In Progress, and Completed states with instant visual badges and status updates.',
              },
              {
                icon: IoShieldCheckmarkOutline,
                title: 'Strict Ownership Authorization',
                description:
                  'Backend-guaranteed privacy. Each user only has access to their own workspace. Zero data leaks across accounts.',
              },
              {
                icon: IoFlashOutline,
                title: 'Enforced Subscription Limits',
                description:
                  'Free tier capped at 3 projects, fully verified at the database level. Simulated seamless 1-click upgrade to Pro for unlimited scale.',
              },
              {
                icon: IoStatsChartOutline,
                title: 'Live KPI Dashboard',
                description:
                  'Aggregated metrics on project completion rates, priority distribution, remaining slots, and recent project activities.',
              },
              {
                icon: IoTimeOutline,
                title: 'Deadline & Priority Engine',
                description:
                  'Assign Low, Medium, and High priorities alongside start dates and due dates to keep critical deliverables top of mind.',
              },
              {
                icon: IoRocketOutline,
                title: 'Clean Modern MERN Stack',
                description:
                  'Built with Express 5, React 19, Tailwind CSS, MongoDB, Mongoose, and JWT for production-grade speed and reliability.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Transparent Pricing
            </h2>
            <p className="text-3xl font-extrabold text-slate-900">
              Start Free, upgrade when your team grows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-full">
                  FREE PLAN
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-slate-500 text-sm">/ forever</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Perfect for solo developers and quick side projects.
                </p>

                <div className="my-6 border-t border-slate-100"></div>

                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Maximum <strong>3 projects</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Basic project management & status tags</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Personal KPI dashboard</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Secure JWT authentication</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="block w-full py-3 text-center text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-indigo-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl border border-indigo-700 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-400 text-slate-900 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                POPULAR
              </div>

              <div>
                <span className="px-3 py-1 text-xs font-bold text-indigo-300 bg-indigo-800/80 rounded-full border border-indigo-600">
                  PRO PLAN
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$19</span>
                  <span className="text-indigo-200 text-sm">/ month</span>
                </div>
                <p className="text-sm text-indigo-200 mt-2">
                  Built for power users and growing SaaS teams who need unlimited capacity.
                </p>

                <div className="my-6 border-t border-indigo-800"></div>

                <ul className="space-y-3 text-sm text-indigo-100">
                  <li className="flex items-center gap-2.5">
                    <IoCheckmarkCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span><strong>Unlimited</strong> projects & workspaces</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IoCheckmarkCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Advanced dashboard analytics & KPIs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IoCheckmarkCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Priority deadline alerts & custom tagging</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IoCheckmarkCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Portfolio simulated instant upgrade</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="block w-full py-3 text-center text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-1 text-amber-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <IoStar key={i} className="w-5 h-5" />
            ))}
          </div>
          <blockquote className="text-xl sm:text-2xl font-semibold text-slate-800 max-w-3xl mx-auto">
            "SaaSFlow is the cleanest project management boilerplate and SaaS architecture I have reviewed. The strict ownership authorization and backend limit enforcement make it production-ready."
          </blockquote>
          <div className="mt-6">
            <p className="text-sm font-bold text-slate-900">Alexandre Rivera</p>
            <p className="text-xs text-slate-500">Lead Architect at CloudScale Systems</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs">
              <IoRocketOutline className="w-3.5 h-3.5" />
            </div>
            SaaSFlow
          </div>
          <p>© {new Date().getFullYear()} SaaSFlow Platform. Built with MERN Stack for Portfolio & Production.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Register
            </Link>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
