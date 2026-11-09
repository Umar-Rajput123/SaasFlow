const Project = require('../models/Project');
const User = require('../models/User');
const { FREE_PROJECT_LIMIT, SUBSCRIPTION_PLANS } = require('../utils/constants');

// @desc    Get aggregated dashboard stats for authenticated user
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const isPro = user.subscriptionPlan === 'pro';

    // Parallel aggregate queries for high performance
    const [
      totalProjects,
      completedProjects,
      inProgressProjects,
      planningProjects,
      recentProjects,
      priorityStats,
    ] = await Promise.all([
      Project.countDocuments({ owner: userId }),
      Project.countDocuments({ owner: userId, status: 'Completed' }),
      Project.countDocuments({ owner: userId, status: 'In Progress' }),
      Project.countDocuments({ owner: userId, status: 'Planning' }),
      Project.find({ owner: userId }).sort({ updatedAt: -1 }).limit(5),
      Project.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    const remainingSlots = isPro
      ? 'Unlimited'
      : Math.max(0, FREE_PROJECT_LIMIT - totalProjects);

    const priorityBreakdown = {
      Low: 0,
      Medium: 0,
      High: 0,
    };
    priorityStats.forEach((item) => {
      if (item._id && priorityBreakdown[item._id] !== undefined) {
        priorityBreakdown[item._id] = item.count;
      }
    });

    const completionRate =
      totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        planningProjects,
        remainingSlots,
        numericRemainingSlots: isPro ? null : Math.max(0, FREE_PROJECT_LIMIT - totalProjects),
        maxAllowedSlots: isPro ? 'Unlimited' : FREE_PROJECT_LIMIT,
        completionRate,
        priorityBreakdown,
        isPro,
        subscriptionPlan: user.subscriptionPlan,
        isLimitReached: !isPro && totalProjects >= FREE_PROJECT_LIMIT,
        planDetails: isPro ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE,
      },
      recentProjects,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
