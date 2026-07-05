import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl text-blue-600">TechSpec</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/catalog" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Catálogo</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="text-gray-500 hover:text-blue-600 relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link to="/login" className="text-gray-500 hover:text-blue-600 flex items-center">
              <User className="h-6 w-6 mr-1" />
              <span className="text-sm font-medium">Ingresar</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
