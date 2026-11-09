import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import Modal from '../components/Modal';
import {
  IoArrowBack,
  IoCreateOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoFlameOutline,
} from 'react-icons/io5';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProjectById, updateProject, deleteProject } = useProjects();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(id);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id, fetchProjectById]);

  // Quick status changer handler
  const handleQuickStatusChange = async (newStatus) => {
    if (!project || project.status === newStatus) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateProject(id, { status: newStatus });
      setProject(updated.project);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      navigate('/projects');
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  // Due date countdown calculation
  const getDeadlineStatus = (dueDate, status) => {
    if (!dueDate) return null;
    if (status === 'Completed') {
      return { text: 'Completed', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'}`,
        color: 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse',
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due Today',
        color: 'text-amber-700 bg-amber-50 border-amber-200 font-bold',
      };
    } else {
      return {
        text: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} remaining`,
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      };
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-slate-500">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h3 className="text-lg font-bold text-slate-800">Project Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The project you requested either does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/projects"
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const deadline = getDeadlineStatus(project.dueDate, project.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Project"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete project{' '}
            <strong className="text-slate-900 font-semibold">"{project.title}"</strong>? All
            associated data will be permanently removed.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete Project'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <IoArrowBack className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${project._id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all"
          >
            <IoCreateOutline className="w-4 h-4 text-slate-500" />
            Edit Project
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <IoTrashOutline className="w-4 h-4 text-rose-500" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Project Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            {deadline && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${deadline.color}`}
              >
                <IoTimeOutline className="w-3.5 h-3.5" />
                {deadline.text}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {project.title}
          </h1>
        </div>

        {/* Quick Status Workflow Controller */}
        <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-slate-800">Lifecycle Phase: </span>
            <span className="text-slate-500">Quickly toggle current project status</span>
          </div>

          <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {['Planning', 'In Progress', 'Completed'].map((phase) => (
              <button
                key={phase}
                type="button"
                onClick={() => handleQuickStatusChange(phase)}
                disabled={updatingStatus}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  project.status === phase
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Project Scope & Description
          </h3>
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {project.description || (
              <span className="text-slate-400 italic">No description provided for this project.</span>
            )}
          </div>
        </div>

        {/* Timestamps & Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Start Date</span>
            <span className="font-semibold text-slate-800">
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : 'Not specified'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Target Due Date</span>
            <span className="font-semibold text-slate-800">
              {project.dueDate
                ? new Date(project.dueDate).toLocaleDateString()
                : 'No deadline'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Created At</span>
            <span className="font-semibold text-slate-800">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Last Updated</span>
            <span className="font-semibold text-slate-800">
              {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
