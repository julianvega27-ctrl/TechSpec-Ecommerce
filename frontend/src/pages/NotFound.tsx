import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary font-geist mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 font-geist mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto font-geist">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded font-geist font-medium hover:bg-cyan-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
