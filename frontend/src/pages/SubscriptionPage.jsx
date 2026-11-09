import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { PlanBadge } from '../components/Badge';
import {
  IoCheckmarkCircle,
  IoFlash,
  IoShieldCheckmarkOutline,
  IoHelpCircleOutline,
  IoSparkles,
} from 'react-icons/io5';

const SubscriptionPage = () => {
  const { user, isPro } = useAuth();
  const { subscription, fetchSubscription, upgradeSubscription, stats, fetchStats } = useProjects();
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  useEffect(() => {
    fetchSubscription();
    fetchStats();
  }, [fetchSubscription, fetchStats]);

  const handlePlanChange = async (targetPlan) => {
    setLoading(true);
    try {
      await upgradeSubscription(targetPlan);
      await fetchSubscription();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const projectCount = stats?.totalProjects ?? 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
          <IoSparkles className="w-3.5 h-3.5 text-amber-500" />
          Subscription & Billing
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Flexible plans for every stage
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Scale your project workflows effortlessly with transparent pricing and zero hidden fees.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="mt-6 inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Annual Billing (Save 20%)
          </button>
        </div>
      </div>

      {/* Current Active Plan Status Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Current Status:
            </span>
            <PlanBadge plan={user?.subscriptionPlan} />
          </div>
          <p className="text-xs text-slate-500">
            {isPro
              ? 'You have unlimited workspaces and full access to all Pro features.'
              : `You are currently using ${projectCount} of 3 free project slots.`}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-700 block">
            {isPro ? 'Projects: Unlimited' : `Slots: ${Math.max(0, 3 - projectCount)} Available`}
          </span>
          <span className="text-[11px] text-slate-400">Account ID: {user?._id?.substring(0, 8)}...</span>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* FREE PLAN */}
        <div
          className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
            !isPro
              ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-lg'
              : 'bg-white border-slate-200/80 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-full">
                FREE PLAN
              </span>
              {!isPro && (
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  CURRENT PLAN
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-400 text-xs font-medium">/ month</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Ideal for getting started, personal to-do lists, and lightweight tracking.
            </p>

            <div className="my-6 border-t border-slate-100"></div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Features included:
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Maximum 3 projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic project management (Status, Priority, Dates)</span>
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Personal dashboard KPIs</span>
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Community support</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            {!isPro ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl cursor-default"
              >
                Current Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handlePlanChange('free')}
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                {loading ? 'Switching...' : 'Switch back to Free (Testing)'}
              </button>
            )}
          </div>
        </div>

        {/* PRO PLAN */}
        <div
          className={`p-8 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
            isPro
              ? 'bg-gradient-to-b from-indigo-900 to-slate-900 text-white border-indigo-700 shadow-xl'
              : 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-xl'
          }`}
        >
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
            RECOMMENDED
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  isPro
                    ? 'bg-indigo-800/80 text-indigo-200 border border-indigo-600'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                PRO PLAN
              </span>
              {isPro && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  CURRENT PLAN
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mt-2">
              <span className={`text-4xl font-extrabold ${isPro ? 'text-white' : 'text-slate-900'}`}>
                {billingCycle === 'monthly' ? '$19' : '$15'}
              </span>
              <span className={`text-xs font-medium ${isPro ? 'text-indigo-200' : 'text-slate-400'}`}>
                / month {billingCycle === 'yearly' && '(billed annually)'}
              </span>
            </div>
            <p className={`text-xs mt-2 ${isPro ? 'text-indigo-200' : 'text-slate-500'}`}>
              For high-output engineering teams, agile creators, and growing businesses.
            </p>

            <div className={`my-6 border-t ${isPro ? 'border-indigo-800' : 'border-slate-100'}`}></div>

            <div className="space-y-3">
              <h5
                className={`text-xs font-bold uppercase tracking-wider ${
                  isPro ? 'text-indigo-300' : 'text-slate-400'
                }`}
              >
                Everything in Free, plus:
              </h5>
              <ul className={`space-y-2.5 text-xs ${isPro ? 'text-indigo-100' : 'text-slate-600'}`}>
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Unlimited</strong> project creation (no 3-project cap)</span>
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Advanced productivity analytics & completion rates</span>
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Priority deadline management & alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant portfolio simulated activation</span>
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>24/7 dedicated support priority queue</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            {isPro ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 px-4 text-xs font-bold text-amber-300 bg-indigo-950/80 border border-indigo-700 rounded-xl cursor-default flex items-center justify-center gap-1.5"
              >
                <IoCheckmarkCircle className="w-4 h-4 text-amber-300" />
                Active Pro Subscription
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handlePlanChange('pro')}
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Activating Pro...
                  </>
                ) : (
                  <>
                    <IoFlash className="w-4 h-4 text-amber-300" />
                    Simulate Upgrade to Pro ($19/mo)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Note */}
      <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
        <IoShieldCheckmarkOutline className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Portfolio & Evaluation Architecture: </span>
          This deployment features a fully functional simulated billing gateway ready for Stripe / LemonSqueezy webhook integration. You can click "Simulate Upgrade" to immediately test unlimited projects, or switch back to Free to test limit enforcement at any time.
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
