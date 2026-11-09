const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation rules
const projectRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['Planning', 'In Progress', 'Completed'])
    .withMessage('Status must be Planning, In Progress, or Completed'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('startDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('dueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

router.use(protect); // All project routes require authentication

router.route('/')
  .post(projectRules, validate, createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProjectById)
  .put(projectRules, validate, updateProject)
  .delete(deleteProject);

module.exports = router;
