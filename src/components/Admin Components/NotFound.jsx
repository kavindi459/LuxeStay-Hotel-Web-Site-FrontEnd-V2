import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white text-center px-4">
      <h1 className="text-7xl font-bold text-red-600 animate-bounce">404</h1>
      <p className="text-2xl mt-4 animate-fade-in">
        Oops! Page not found.
      </p>
      <p className="mt-2 animate-fade-in delay-200">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/admin/dashboard"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 animate-fade-in delay-500"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
