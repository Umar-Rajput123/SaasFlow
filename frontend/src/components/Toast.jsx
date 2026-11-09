import React from 'react';
import { IoCheckmarkCircle, IoAlertCircle, IoClose } from 'react-icons/io5';

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-xl border border-slate-200/80 animate-slideDown max-w-md">
      {isSuccess ? (
        <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 shrink-0" />
      ) : (
        <IoAlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
      )}

      <p className="text-sm font-medium text-slate-700 flex-1">{toast.message}</p>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
      >
        <IoClose className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
