import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { ProjectCardSkeleton, TableRowSkeleton } from '../components/SkeletonLoader';
import Modal from '../components/Modal';
import {
  IoAdd,
  IoSearchOutline,
  IoFilterOutline,
  IoGridOutline,
  IoListOutline,
  IoCalendarOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoFolderOpenOutline,
  IoFlash,
  IoCheckmarkCircle,
} from 'react-icons/io5';

const ProjectsPage = () => {
  const { isPro } = useAuth();
  const { projects, loading, fetchProjects, deleteProject } = useProjects();
  const { onOpenUpgrade } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects({
      search,
      status: statusFilter,
      priority: priorityFilter,
      sortBy,
      order,
    });
  }, [fetchProjects, statusFilter, priorityFilter, sortBy, order]);

  // Handle live search debounce or instant filter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects({
      search,
      status: statusFilter,
      priority: priorityFilter,
      sortBy,
      order,
    });
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      await deleteProject(projectToDelete._id);
      setProjectToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const isLimitReached = !isPro && projects.length >= 3;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Delete Project"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete{' '}
            <strong className="text-slate-900 font-semibold">"{projectToDelete?.title}"</strong>?
            This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setProjectToDelete(null)}
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

      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your project milestones, deadlines, and deliverables
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isLimitReached ? (
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <IoFlash className="w-4 h-4 text-amber-300" />
              Upgrade to Add More
            </button>
          ) : (
            <Link
              to="/projects/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <IoAdd className="w-4 h-4" />
              Create Project
            </Link>
          )}
        </div>
      </div>

      {/* Controls Bar: Search, Filters, View Mode */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 justify-between">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <IoSearchOutline className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or description... (Press Enter)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </form>

          {/* Filters & Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Sort Field */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:border-indigo-500"
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="title">Project Title</option>
              <option value="priority">Priority</option>
            </select>

            {/* Sort Order */}
            <button
              type="button"
              onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium transition-colors"
              title="Toggle sort direction"
            >
              {order === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>

            {/* View Mode Toggle */}
            <div className="inline-flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <IoGridOutline className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <IoListOutline className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Badges */}
        {(statusFilter !== 'All' || priorityFilter !== 'All' || search) && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span>Filters:</span>
            {statusFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter('All')}
                  className="hover:text-rose-500 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {priorityFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium">
                Priority: {priorityFilter}
                <button
                  onClick={() => setPriorityFilter('All')}
                  className="hover:text-rose-500 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium">
                Search: "{search}"
                <button
                  onClick={() => setSearch('')}
                  className="hover:text-rose-500 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setStatusFilter('All');
                setPriorityFilter('All');
                setSearch('');
              }}
              className="text-xs text-indigo-600 hover:underline font-semibold ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Projects Display: Grid or Table */}
      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
            <table className="w-full">
              <tbody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        )
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <IoFolderOpenOutline className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            {search || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'Try modifying your search or filter settings to view more projects.'
              : 'You have not created any projects yet. Click below to add your first one.'}
          </p>

          {search || statusFilter !== 'All' || priorityFilter !== 'All' ? (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setPriorityFilter('All');
              }}
              className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          ) : (
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <IoAdd className="w-4 h-4" />
              Create Project
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-6 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <StatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>

                <Link
                  to={`/projects/${project._id}`}
                  className="block text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1"
                >
                  {project.title}
                </Link>

                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <IoCalendarOutline className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {project.dueDate
                      ? new Date(project.dueDate).toLocaleDateString()
                      : 'No due date'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/projects/${project._id}/edit`}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit project"
                  >
                    <IoCreateOutline className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setProjectToDelete(project)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <IoTrashOutline className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/projects/${project._id}`}
                    className="font-bold text-indigo-600 hover:text-indigo-800 ml-1"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200/80 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Project Title</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/projects/${project._id}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                      >
                        {project.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {project.description || 'No description'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={project.priority} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${project._id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <IoCreateOutline className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/projects/${project._id}`}
                          className="px-2 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
