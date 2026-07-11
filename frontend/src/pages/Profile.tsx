import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (user) {
      setName(user.name);
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
      await axios.put('/users/profile', { name });
      setMessage('Perfil actualizado correctamente');
      setIsEditing(false);
      // Actualizamos el nombre localmente en el contexto si fuera necesario, 
      // pero por ahora el context lo maneja o requiere recargar,
      // asumiendo que user.name se actualizará o se mostrará `name`
    } catch (error) {
      setMessage('Error al actualizar el perfil');
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
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-obsidian)]">PERFIL DE USUARIO</h1>
      </div>

      <div className="grid-container">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 border-r border-[var(--color-outline-subtle)] pr-6 mb-8 md:mb-0">
          <ul className="space-y-4">
            <li>
              <span className="text-[var(--color-primary)] font-medium block">Información Personal</span>
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
              <Link to="/security" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Contraseña</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-[var(--color-error)] mt-8 block cursor-pointer bg-transparent border-none p-0 text-left w-full">Cerrar Sesión</button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 lg:col-span-6">
          <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-8">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--color-outline-subtle)] pb-2">
              <h3 className="label-caps">DATOS DE CONTACTO</h3>
              {!isEditing && (
                <Button variant="secondary" onClick={() => setIsEditing(true)}>EDITAR</Button>
              )}
            </div>

            {message && <div className="mb-4 p-3 bg-gray-50 text-[var(--color-primary)] rounded text-sm font-medium">{message}</div>}

            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <p className="label-caps text-[var(--color-obsidian-light)] mb-1">NOMBRE COMPLETO</p>
                  <p className="text-lg font-medium text-[var(--color-obsidian)]">{user.name}</p>
                </div>
                <div>
                  <p className="label-caps text-[var(--color-obsidian-light)] mb-1">CORREO ELECTRÓNICO</p>
                  <p className="text-lg font-medium text-[var(--color-obsidian)]">{user.email}</p>
                </div>
                {user.role === 'ADMIN' && (
                  <div>
                    <p className="label-caps text-[var(--color-obsidian-light)] mb-1">ROL</p>
                    <p className="text-lg font-medium text-[var(--color-obsidian)]">{user.role}</p>
                  </div>
                )}
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <Input label="NOMBRE COMPLETO" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <Input label="CORREO ELECTRÓNICO" type="email" value={user.email} disabled />
                {user.role === 'ADMIN' && (
                  <Input label="ROL" type="text" value={user.role} disabled />
                )}

                <div className="pt-4 border-t border-[var(--color-outline-subtle)] flex gap-4">
                  <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); setName(user.name); }}>
                    CANCELAR
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
