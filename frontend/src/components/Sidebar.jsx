import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import {
  IoGridOutline,
  IoFolderOpenOutline,
  IoAddCircleOutline,
  IoCardOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoClose,
  IoRocketOutline,
  IoFlash,
} from 'react-icons/io5';

const Sidebar = ({ isOpen, onClose, onOpenUpgrade }) => {
  const { user, logout, isPro } = useAuth();
  const { stats } = useProjects();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: IoGridOutline },
    { name: 'All Projects', path: '/projects', icon: IoFolderOpenOutline },
    { name: 'New Project', path: '/projects/new', icon: IoAddCircleOutline },
    { name: 'Subscription', path: '/subscription', icon: IoCardOutline },
    { name: 'Profile', path: '/profile', icon: IoPersonOutline },
  ];

  const currentCount = stats?.totalProjects ?? 0;
  const maxProjects = 3;
  const percentUsed = isPro ? 100 : Math.min(100, Math.round((currentCount / maxProjects) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 font-bold text-lg text-slate-900 tracking-tight"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <IoRocketOutline className="w-5 h-5" />
            </div>
            <span>
              SaaS<span className="text-indigo-600">Flow</span>
            </span>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/projects' ? false : true}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer: Usage / Subscription Card */}
        <div className="p-4 border-t border-slate-100">
          {isPro ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Pro Plan
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400/20 text-amber-300 rounded-md border border-amber-400/30">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                Unlimited projects & workspaces active.
              </p>
              <div className="text-[11px] text-indigo-200">
                {currentCount} total active {currentCount === 1 ? 'project' : 'projects'}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800">Project Limit</span>
                <span className="text-xs font-bold text-indigo-600">
                  {currentCount} / {maxProjects}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentCount >= maxProjects
                      ? 'bg-rose-500'
                      : currentCount >= 2
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 mb-3">
                {currentCount >= maxProjects
                  ? 'Limit reached. Upgrade to add more projects.'
                  : `${maxProjects - currentCount} project slots remaining on Free plan.`}
              </p>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUpgrade();
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <IoFlash className="w-3.5 h-3.5 text-amber-300" />
                Upgrade to Pro
              </button>
            </div>
          )}

          {/* Quick logout */}
          <button
            type="button"
            onClick={logout}
            className="w-full mt-3 flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <IoLogOutOutline className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
