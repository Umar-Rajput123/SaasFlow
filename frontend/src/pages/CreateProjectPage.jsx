import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import {
  IoArrowBack,
  IoAlertCircle,
  IoFlash,
  IoCheckmarkCircle,
} from 'react-icons/io5';

const CreateProjectPage = () => {
  const { isPro } = useAuth();
  const { projects, fetchProjects, createProject } = useProjects();
  const { onOpenUpgrade } = useOutletContext() || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const currentCount = projects.length;
  const isLimitReached = !isPro && currentCount >= 3;

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

    if (isLimitReached) {
      setError('Free plan project limit reached (3 max). Please upgrade to Pro.');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please provide a project title');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createProject({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      });

      if (result.success) {
        navigate(`/projects/${result.project._id}`);
      } else if (result.limitReached) {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <IoArrowBack className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create New Project</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Define objectives, set milestones, and organize upcoming work
        </p>
      </div>

      {/* Limit Reached Warning Banner */}
      {isLimitReached && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <IoFlash className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Free Plan Limit Reached (3 / 3 Projects)</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                You have reached the maximum allowed projects on the Free plan. Upgrade to SaaSFlow Pro to create unlimited projects.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenUpgrade}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs font-medium">
            <IoAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Mobile App Redesign 2.0"
              value={formData.title}
              onChange={handleChange}
              disabled={isLimitReached || submitting}
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Provide context, key goals, and scope for this project..."
              value={formData.description}
              onChange={handleChange}
              disabled={isLimitReached || submitting}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isLimitReached || submitting}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-500 disabled:opacity-50 font-medium"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isLimitReached || submitting}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-500 disabled:opacity-50 font-medium"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Start Date & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={isLimitReached || submitting}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={isLimitReached || submitting}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLimitReached || submitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating Project...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
