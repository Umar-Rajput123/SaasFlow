const express = require('express');
const { body } = require('express-validator');
const {
  getSubscriptionStatus,
  upgradeSubscription,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getSubscriptionStatus);

router.post(
  '/upgrade',
  [
    body('plan')
      .optional()
      .isIn(['free', 'pro'])
      .withMessage('Plan must be either "free" or "pro"'),
  ],
  validate,
  upgradeSubscription
);

module.exports = router;
