const Project = require('../models/Project');
const { FREE_PROJECT_LIMIT } = require('../utils/constants');

// @desc    Create a new project (Enforces Free vs Pro subscription limit)
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userPlan = req.user.subscriptionPlan || 'free';

    // Backend-enforced subscription check
    if (userPlan !== 'pro') {
      const existingCount = await Project.countDocuments({ owner: userId });
      if (existingCount >= FREE_PROJECT_LIMIT) {
        return res.status(403).json({
          success: false,
          limitReached: true,
          message: `Free plan limit reached (${FREE_PROJECT_LIMIT} projects max). Please upgrade to Pro for unlimited project creation.`,
          currentCount: existingCount,
          maxProjects: FREE_PROJECT_LIMIT,
        });
      }
    }

    const { title, description, status, priority, startDate, dueDate } = req.body;

    const project = await Project.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Planning',
      priority: priority || 'Medium',
      startDate: startDate || new Date(),
      dueDate: dueDate || null,
      owner: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for authenticated user with search, filter & sorting
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { search, status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { owner: userId };

    // Search query by title or description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Sorting
    const sortOptions = {};
    const sortField = ['title', 'status', 'priority', 'dueDate', 'createdAt'].includes(sortBy)
      ? sortBy
      : 'createdAt';
    sortOptions[sortField] = order === 'asc' ? 1 : -1;

    const projects = await Project.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details (Strict ownership check)
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Ownership check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this project.',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project (Strict ownership check)
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Ownership check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only modify projects you own.',
      });
    }

    const { title, description, status, priority, startDate, dueDate } = req.body;

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (status !== undefined) project.status = status;
    if (priority !== undefined) project.priority = priority;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;

    const updatedProject = await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully.',
      project: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project (Strict ownership check)
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Ownership check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete projects you own.',
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
