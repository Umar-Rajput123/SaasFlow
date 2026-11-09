const User = require('../models/User');
const Project = require('../models/Project');
const { SUBSCRIPTION_PLANS, FREE_PROJECT_LIMIT } = require('../utils/constants');

// @desc    Get current subscription plan and usage details
// @route   GET /api/subscription
// @access  Private
const getSubscriptionStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const projectCount = await Project.countDocuments({ owner: userId });
    const isPro = user.subscriptionPlan === 'pro';

    const maxProjects = isPro ? null : FREE_PROJECT_LIMIT;
    const remainingSlots = isPro ? null : Math.max(0, FREE_PROJECT_LIMIT - projectCount);
    const isLimitReached = !isPro && projectCount >= FREE_PROJECT_LIMIT;

    res.json({
      success: true,
      subscription: {
        plan: user.subscriptionPlan,
        isPro,
        projectCount,
        maxProjects: isPro ? 'Unlimited' : FREE_PROJECT_LIMIT,
        numericMax: maxProjects,
        remainingSlots: isPro ? 'Unlimited' : remainingSlots,
        numericRemaining: remainingSlots,
        isLimitReached,
        planDetails: isPro ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE,
        allPlans: SUBSCRIPTION_PLANS,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate subscription upgrade / plan change
// @route   POST /api/subscription/upgrade
// @access  Private
const upgradeSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { plan = 'pro', paymentMethod = 'simulated_card' } = req.body;

    const validPlans = ['free', 'pro'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan specified. Choose "free" or "pro".',
      });
    }

    const user = await User.findById(userId);
    user.subscriptionPlan = plan;
    await user.save();

    const projectCount = await Project.countDocuments({ owner: userId });
    const isPro = plan === 'pro';

    res.json({
      success: true,
      message:
        plan === 'pro'
          ? '🎉 Congratulations! You have successfully upgraded to SaaSFlow Pro!'
          : 'Your account has been switched to the Free plan.',
      subscription: {
        plan: user.subscriptionPlan,
        isPro,
        projectCount,
        maxProjects: isPro ? 'Unlimited' : FREE_PROJECT_LIMIT,
        remainingSlots: isPro ? 'Unlimited' : Math.max(0, FREE_PROJECT_LIMIT - projectCount),
        planDetails: isPro ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE,
      },
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptionStatus,
  upgradeSubscription,
};
