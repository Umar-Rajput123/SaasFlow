import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoRocketOutline, IoArrowBack, IoHomeOutline } from 'react-icons/io5';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
        <IoRocketOutline className="w-8 h-8" />
      </div>

      <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-3 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        Sorry, the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all"
        >
          <IoHomeOutline className="w-4 h-4" />
          {isAuthenticated ? 'Go to Dashboard' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
