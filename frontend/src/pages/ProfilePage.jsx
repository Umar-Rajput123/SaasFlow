import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { authService } from '../services/api';
import { PlanBadge } from '../components/Badge';
import {
  IoPersonOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoCalendarOutline,
  IoLogOutOutline,
} from 'react-icons/io5';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useProjects();

  // Name update form
  const [name, setName] = useState(user?.name || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  // Password change form
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });

    if (!name.trim()) {
      setProfileMsg({ text: 'Name cannot be empty', type: 'error' });
      return;
    }

    setUpdatingProfile(true);
    try {
      const data = await authService.updateProfile({ name: name.trim() });
      if (data.success) {
        updateUser({ name: data.user.name });
        setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
        showToast('Profile name updated!', 'success');
      }
    } catch (err) {
      setProfileMsg({
        text: err.response?.data?.message || 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (!passwords.currentPassword) {
      setPasswordMsg({ text: 'Please enter your current password', type: 'error' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters long', type: 'error' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const data = await authService.updateProfile({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (data.success) {
        setPasswordMsg({ text: 'Password changed successfully!', type: 'success' });
        showToast('Password changed successfully!', 'success');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordMsg({
        text: err.response?.data?.message || 'Failed to change password',
        type: 'error',
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    return n
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal details, credentials, and account settings
        </p>
      </div>

      {/* User Summary Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-indigo-200">
            {getInitials(user?.name)}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
              <PlanBadge plan={user?.subscriptionPlan} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
              <IoCalendarOutline className="w-3.5 h-3.5" />
              <span>
                Member since{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Recent'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
        >
          <IoLogOutOutline className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update General Info Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your display name
            </p>
          </div>

          {profileMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <IoCheckmarkCircle className="w-4 h-4 shrink-0" />
              ) : (
                <IoAlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <IoPersonOutline className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <IoMailOutline className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Email cannot be modified once registered
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Change your password to keep your account secure
            </p>
          </div>

          {passwordMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <IoCheckmarkCircle className="w-4 h-4 shrink-0" />
              ) : (
                <IoAlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <IoLockClosedOutline className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
                  }
                  required
                  placeholder="Enter current password"
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <IoLockClosedOutline className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  required
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <IoLockClosedOutline className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  required
                  placeholder="Re-enter new password"
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
