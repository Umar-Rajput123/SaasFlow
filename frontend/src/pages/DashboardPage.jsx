import React, { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { StatusBadge, PriorityBadge, PlanBadge } from '../components/Badge';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  IoFolderOpenOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoLayersOutline,
  IoAdd,
  IoArrowForward,
  IoFlash,
  IoCalendarOutline,
  IoSparkles,
} from 'react-icons/io5';

const DashboardPage = () => {
  const { user, isPro } = useAuth();
  const { stats, statsLoading, fetchStats, projects, fetchProjects } = useProjects();
  const { onOpenUpgrade } = useOutletContext() || {};

  useEffect(() => {
    fetchStats();
    fetchProjects({ sortBy: 'updatedAt', order: 'desc' });
  }, [fetchStats, fetchProjects]);

  const total = stats?.totalProjects ?? 0;
  const completed = stats?.completedProjects ?? 0;
  const inProgress = stats?.inProgressProjects ?? 0;
  const remainingSlots = stats?.remainingSlots ?? (isPro ? 'Unlimited' : 3);
  const isLimitReached = !isPro && total >= 3;

  const recentProjects = projects.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
            <IoSparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Productivity Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Developer'}! 👋
          </h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Here is your SaaS workspace overview. Track progress, monitor deadlines, and coordinate active milestones.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-sm font-bold shadow-md shadow-slate-900/10 transition-all cursor-pointer"
          >
            <IoAdd className="w-5 h-5" />
            Create Project
          </Link>
          {!isPro && (
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-900/60 hover:bg-indigo-900/80 text-amber-300 rounded-xl text-sm font-bold border border-indigo-400/30 transition-all cursor-pointer"
            >
              <IoFlash className="w-4 h-4" />
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Total Projects Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <IoFolderOpenOutline className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Workspace
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">Total Projects</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-extrabold text-slate-900">{total}</span>
                <span className="text-xs font-semibold text-indigo-600">Active</span>
              </div>
            </div>

            {/* In Progress Projects Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <IoTimeOutline className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">In Progress</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-extrabold text-amber-600">{inProgress}</span>
                <span className="text-xs font-semibold text-amber-600">Ongoing</span>
              </div>
            </div>

            {/* Completed Projects Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <IoCheckmarkCircleOutline className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Finished
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">Completed Projects</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-extrabold text-emerald-600">{completed}</span>
                <span className="text-xs font-semibold text-emerald-600">
                  {total > 0 ? `${Math.round((completed / total) * 100)}% rate` : '0%'}
                </span>
              </div>
            </div>

            {/* Remaining Slots Card */}
            <div
              className={`p-6 rounded-2xl border transition-all ${
                isPro
                  ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-700 shadow-md'
                  : isLimitReached
                  ? 'bg-rose-50/70 border-rose-200 text-slate-900'
                  : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isPro
                      ? 'bg-white/10 text-amber-300'
                      : isLimitReached
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <IoLayersOutline className="w-6 h-6" />
                </div>
                <PlanBadge plan={user?.subscriptionPlan} />
              </div>
              <p
                className={`text-xs font-medium ${
                  isPro ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                Remaining Project Slots
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span
                  className={`text-3xl font-extrabold ${
                    isPro
                      ? 'text-white'
                      : isLimitReached
                      ? 'text-rose-600'
                      : 'text-slate-900'
                  }`}
                >
                  {remainingSlots}
                </span>
                {!isPro && (
                  <span className="text-xs text-slate-400">of 3 allowed</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Subscription Alert Card if Free limit reached or close */}
      {!isPro && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isLimitReached
              ? 'bg-amber-50/80 border-amber-200'
              : 'bg-indigo-50/60 border-indigo-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <IoFlash className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {isLimitReached
                  ? 'Project Creation Cap Reached (3 / 3)'
                  : `Free Plan Active: ${total} of 3 Projects Used`}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {isLimitReached
                  ? 'You have used all 3 available free projects. Upgrade to Pro for unlimited project creation.'
                  : 'Upgrade to SaaSFlow Pro to unlock unlimited projects, advanced reporting, and priority workflows.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenUpgrade}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <IoFlash className="w-3.5 h-3.5 text-amber-300" />
            Upgrade to Pro Now
          </button>
        </div>
      )}

      {/* Recent Projects Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quick access to your most recently updated projects
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all projects
            <IoArrowForward className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
              <IoFolderOpenOutline className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No projects yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              Get started by creating your very first project to begin tracking milestones and deadlines.
            </p>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all"
            >
              <IoAdd className="w-4 h-4" />
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentProjects.map((project) => (
              <div
                key={project._id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 px-3 rounded-2xl transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {project.title}
                    </Link>
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                  {project.dueDate && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <IoCalendarOutline className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  <Link
                    to={`/projects/${project._id}`}
                    className="px-3 py-1.5 font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
