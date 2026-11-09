import React, { useState } from 'react';
import Modal from './Modal';
import { useProjects } from '../context/ProjectContext';
import { IoCheckmarkCircle, IoFlash, IoShieldCheckmark } from 'react-icons/io5';

const UpgradeModal = ({ isOpen, onClose }) => {
  const { upgradeSubscription } = useProjects();
  const [upgrading, setUpgrading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await upgradeSubscription('pro');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to SaaSFlow Pro" maxWidth="max-w-md">
      <div className="space-y-5">
        {/* Banner */}
        <div className="text-center p-4 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-md">
          <div className="inline-flex p-2 bg-white/20 rounded-full mb-2">
            <IoFlash className="w-6 h-6 text-amber-300" />
          </div>
          <h4 className="text-xl font-bold">Supercharge Your Productivity</h4>
          <p className="text-indigo-100 text-xs mt-1">
            Unlimited projects, priority tags, and advanced analytics
          </p>

          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold">
              {billingCycle === 'monthly' ? '$19' : '$15'}
            </span>
            <span className="text-indigo-200 text-xs">/ user / month</span>
          </div>

          <div className="mt-2 inline-flex bg-indigo-900/40 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 rounded-md transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            What's included in Pro:
          </h5>
          <ul className="space-y-2 text-sm text-slate-600">
            {[
              'Unlimited project creation (bypass 3-project cap)',
              'Advanced dashboard metrics & completion rates',
              'Priority deadline tracking & urgent flags',
              'Simulated Instant Activation (Portfolio Edition)',
              'Priority 24/7 technical support',
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <IoCheckmarkCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Portfolio Simulated Payment Note */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 flex items-start gap-2.5">
          <IoShieldCheckmark className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <span className="font-semibold">Simulated Payment:</span> No actual credit card charge will be made. Clicking below will instantly activate the Pro plan on your account.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={upgrading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {upgrading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Activating Pro...
              </>
            ) : (
              <>
                <IoFlash className="w-4 h-4 text-amber-300" />
                Confirm Upgrade to Pro
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
