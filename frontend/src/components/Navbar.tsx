import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-[var(--color-outline-subtle)] sticky top-0 z-50">
      <div className="page-wrapper py-0">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl text-[var(--color-obsidian)] tracking-tight">TECH<span className="text-[var(--color-primary)]">SPEC</span></span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/catalog" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-primary)] px-3 py-2 text-sm font-medium transition-colors">Catálogo</Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-primary)] relative transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs rounded-[var(--radius-badge)] h-4 w-4 flex items-center justify-center mono-data font-bold">
                0
              </span>
            </Link>
            {user ? (
              <Link to="/profile" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-primary)] flex items-center transition-colors">
                <User className="h-5 w-5 mr-2" />
                <span className="label-caps">Mi perfil</span>
              </Link>
            ) : (
              <Link to="/login" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-primary)] flex items-center transition-colors">
                <User className="h-5 w-5 mr-2" />
                <span className="label-caps">Ingresar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
