const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free Plan',
    maxProjects: 3,
    price: 0,
    features: [
      'Up to 3 projects',
      'Basic project management',
      'Standard dashboard stats',
      'Community support',
    ],
  },
  PRO: {
    id: 'pro',
    name: 'Pro Plan',
    maxProjects: Infinity,
    price: 19,
    features: [
      'Unlimited projects',
      'Advanced dashboard analytics',
      'Priority project management',
      'Priority customer support',
      'Custom project tags & exports',
    ],
  },
};

const FREE_PROJECT_LIMIT = 3;

module.exports = {
  SUBSCRIPTION_PLANS,
  FREE_PROJECT_LIMIT,
};
