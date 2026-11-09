import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
      <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
    </div>
    <div className="w-24 h-4 bg-slate-200 rounded mb-2"></div>
    <div className="w-16 h-8 bg-slate-300 rounded"></div>
  </div>
);

export const ProjectCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="w-20 h-5 bg-slate-200 rounded-full"></div>
      <div className="w-16 h-4 bg-slate-200 rounded"></div>
    </div>
    <div className="w-3/4 h-6 bg-slate-300 rounded mb-2"></div>
    <div className="w-full h-12 bg-slate-100 rounded mb-4"></div>
    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
      <div className="w-28 h-4 bg-slate-200 rounded"></div>
      <div className="w-16 h-4 bg-slate-200 rounded"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-slate-100">
    <td className="py-4 px-4">
      <div className="w-40 h-5 bg-slate-200 rounded mb-1"></div>
      <div className="w-24 h-3 bg-slate-100 rounded"></div>
    </td>
    <td className="py-4 px-4"><div className="w-20 h-6 bg-slate-200 rounded-full"></div></td>
    <td className="py-4 px-4"><div className="w-16 h-5 bg-slate-200 rounded"></div></td>
    <td className="py-4 px-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
    <td className="py-4 px-4 text-right"><div className="w-12 h-6 bg-slate-200 rounded ml-auto"></div></td>
  </tr>
);
