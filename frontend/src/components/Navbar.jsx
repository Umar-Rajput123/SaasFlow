import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlanBadge } from './Badge';
import {
  IoMenu,
  IoNotificationsOutline,
  IoSearchOutline,
  IoChevronDown,
  IoPersonOutline,
  IoCardOutline,
  IoLogOutOutline,
  IoFlashOutline,
} from 'react-icons/io5';

const Navbar = ({ onToggleSidebar, onOpenUpgrade }) => {
  const { user, logout, isPro } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Global quick search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle navigation"
        >
          <IoMenu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-md w-full relative">
          <IoSearchOutline className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </form>
      </div>

      {/* Right: Plan badge, upgrade CTA, notifications & user profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Plan Badge */}
        <div className="hidden sm:block">
          <PlanBadge plan={user?.subscriptionPlan} />
        </div>

        {/* Upgrade shortcut button for Free users */}
        {!isPro && (
          <button
            type="button"
            onClick={onOpenUpgrade}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-xs shadow-indigo-200 hover:shadow-md transition-all cursor-pointer"
          >
            <IoFlashOutline className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Upgrade</span> to Pro
          </button>
        )}

        {/* Simulated Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl relative transition-colors"
            aria-label="Notifications"
          >
            <IoNotificationsOutline className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-scaleUp">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Notifications
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                  2 new
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-semibold text-slate-800">Welcome to SaaSFlow!</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Start by creating your first project from the dashboard.
                  </p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-semibold text-slate-800">Free Plan Active</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    You can manage up to 3 projects. Upgrade for unlimited workspaces.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-700 leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {user?.subscriptionPlan === 'pro' ? 'Pro Member' : 'Free Member'}
              </p>
            </div>
            <IoChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scaleUp">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <div className="mt-1.5 sm:hidden">
                  <PlanBadge plan={user?.subscriptionPlan} />
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <IoPersonOutline className="w-4 h-4 text-slate-400" />
                  My Profile
                </Link>
                <Link
                  to="/subscription"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <IoCardOutline className="w-4 h-4 text-slate-400" />
                  Subscription & Billing
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <IoLogOutOutline className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
