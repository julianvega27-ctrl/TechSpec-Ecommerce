import React from 'react';
import { Link, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="p-10 text-center mono-data">Cargando...</div>;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return (
    <div className="flex h-screen bg-[var(--color-surface)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--color-outline-subtle)] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-outline-subtle)]">
          <span className="font-bold text-xl text-[var(--color-obsidian)] tracking-tight">TECH<span className="text-[var(--color-primary)]">ADMIN</span></span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            <li>
              <Link to="/admin/dashboard" className="flex items-center px-6 py-3 text-[var(--color-primary)] bg-[var(--color-surface-container)] font-medium border-r-2 border-[var(--color-primary)]">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="flex items-center px-6 py-3 text-[var(--color-obsidian-light)] hover:bg-[var(--color-surface-container)] transition-colors">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="flex items-center px-6 py-3 text-[var(--color-obsidian-light)] hover:bg-[var(--color-surface-container)] transition-colors">
                Categorías
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center px-6 py-3 text-[var(--color-obsidian-light)] hover:bg-[var(--color-surface-container)] transition-colors">
                Órdenes
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center px-6 py-3 text-[var(--color-obsidian-light)] hover:bg-[var(--color-surface-container)] transition-colors">
                Usuarios
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-[var(--color-outline-subtle)]">
          <Link to="/" className="text-sm label-caps text-[var(--color-outline)] hover:text-[var(--color-obsidian)]">
            ← Volver a Tienda
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-[var(--color-outline-subtle)] flex items-center justify-between px-8">
          <h2 className="label-caps text-[var(--color-outline)]">PANEL DE CONTROL</h2>
          <div className="flex items-center gap-4">
            <span className="mono-data text-sm">ADMIN: system_root</span>
            <div className="w-8 h-8 rounded-[var(--radius-soft)] bg-[var(--color-surface-container)] flex items-center justify-center border border-[var(--color-outline-subtle)]">
              <span className="label-caps">SR</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-surface)]">
          {/* We use Outlet if we were setting up real routes, but for mock purposes we will just render Dashboard directly here or assume React Router is configured */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
