import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Security: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setMessage('');
      setError('');
      await axios.put('/users/password', { currentPassword, newPassword });
      setMessage('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return <div className="page-wrapper py-8">Cargando...</div>;
  }

  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">SEGURIDAD</h1>
      </div>

      <div className="grid-container">
        {/* Sidebar Menu */}
        <aside className="col-span-12 md:col-span-3 border-r border-[var(--color-outline-subtle)] pr-6 hidden md:block">
          <ul className="space-y-4">
            <li>
              <Link to="/profile" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Información Personal</Link>
            </li>
            {user?.role === 'ADMIN' && (
              <>
                <li className="pt-2 pb-1 border-t border-[var(--color-outline-subtle)]">
                  <span className="text-xs font-bold text-[var(--color-obsidian)] label-caps">ADMINISTRACIÓN</span>
                </li>
                <li>
                  <Link to="/admin/products" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Gestión de Productos</Link>
                </li>
                <li>
                  <Link to="/admin/categories" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Gestión de Categorías</Link>
                </li>
                <li>
                  <Link to="/admin/users" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Gestión de Usuarios</Link>
                </li>
                <li>
                  <Link to="/admin/orders" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Gestión de Pedidos</Link>
                </li>
                <li className="pt-2 border-t border-[var(--color-outline-subtle)]"></li>
              </>
            )}
            <li>
              <Link to="/orders" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Historial de Órdenes</Link>
            </li>
            <li>
              <span className="text-[var(--color-primary)] font-medium block">Seguridad</span>
            </li>
            <li>
              <button onClick={handleLogout} className="text-[var(--color-error)] mt-8 block cursor-pointer bg-transparent border-none p-0 text-left w-full">Cerrar Sesión</button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 lg:col-span-6">
          <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-8">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">CAMBIAR CONTRASEÑA</h3>
            {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm font-medium">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm font-medium">{error}</div>}
            
            <form className="space-y-6" onSubmit={handleSave}>
              <Input label="CONTRASEÑA ACTUAL" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              <Input label="NUEVA CONTRASEÑA" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              
              <div className="pt-4 border-t border-[var(--color-outline-subtle)]">
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? 'GUARDANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
