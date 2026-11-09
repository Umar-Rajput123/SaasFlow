import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    Planning: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/10',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
  };

  const dots = {
    Planning: 'bg-sky-500',
    'In Progress': 'bg-amber-500 animate-pulse',
    Completed: 'bg-emerald-500',
  };

  const defaultStyle = 'bg-slate-50 text-slate-700 border-slate-200';
  const currentStyle = styles[status] || defaultStyle;
  const currentDot = dots[status] || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs ${currentStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentDot}`}></span>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const defaultStyle = 'bg-slate-100 text-slate-600 border-slate-200';
  const currentStyle = styles[priority] || defaultStyle;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${currentStyle}`}
    >
      {priority} Priority
    </span>
  );
};

export const PlanBadge = ({ plan, className = '' }) => {
  const isPro = plan === 'pro';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
        isPro
          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-200'
          : 'bg-slate-100 text-slate-700 border border-slate-200'
      } ${className}`}
    >
      {isPro ? (
        <>
          <span className="text-amber-300">★</span> PRO PLAN
        </>
      ) : (
        'FREE PLAN'
      )}
    </span>
  );
};
