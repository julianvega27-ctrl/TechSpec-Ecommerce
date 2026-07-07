import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [roleConfirmOpen, setRoleConfirmOpen] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = response.data.data || response.data;
      setUsers(payload || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmToggleRole = (user: any) => {
    if (user.id === currentUser?.id) {
      alert('No puedes cambiar tu propio rol.');
      return;
    }
    setUserToChangeRole(user);
    setRoleConfirmOpen(true);
  };

  const handleToggleRole = async () => {
    if (!userToChangeRole) return;
    
    const newRole = userToChangeRole.role === 'ADMIN' ? 'CLIENT' : 'ADMIN';
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/admin/users/${userToChangeRole.id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUsers();
    } catch (error: any) {
      console.error('Error changing role', error);
      alert(error.response?.data?.error || 'Error al cambiar el rol');
    } finally {
      setUserToChangeRole(null);
    }
  };

  const toggleStatus = async (user: any) => {
    if (user.id === currentUser?.id) {
      alert('No puedes desactivar tu propia cuenta.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/admin/users/${user.id}/role`, { isActive: !user.isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUsers();
    } catch (error: any) {
      console.error('Error toggling status', error);
      alert(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">USUARIOS</h1>
      </div>
      
      {loading ? (
        <div className="mono-data text-center py-10">Cargando usuarios...</div>
      ) : (
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
              <tr>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">NOMBRE</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">CORREO</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ROL</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ESTADO</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)] text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[var(--color-outline-subtle)] last:border-b-0 hover:bg-gray-50">
                  <td className="py-4 px-6 text-[var(--color-obsidian)] font-medium">
                    {u.name} {u.id === currentUser?.id && <span className="text-xs ml-2 text-[var(--color-primary)]">(Tú)</span>}
                  </td>
                  <td className="py-4 px-6 text-[var(--color-obsidian-light)]">{u.email}</td>
                  <td className="py-4 px-6 mono-data text-sm">{u.role}</td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => toggleStatus(u)}
                      disabled={u.id === currentUser?.id}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} ${u.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {u.isActive ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button 
                      onClick={() => confirmToggleRole(u)} 
                      disabled={u.id === currentUser?.id}
                      className={`text-sm font-medium hover:underline ${u.id === currentUser?.id ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--color-primary)]'}`}
                    >
                      Hacer {u.role === 'ADMIN' ? 'CLIENT' : 'ADMIN'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={roleConfirmOpen}
        onClose={() => {
          setRoleConfirmOpen(false);
          setUserToChangeRole(null);
        }}
        onConfirm={handleToggleRole}
        title="Cambiar Rol de Usuario"
        message={`¿Estás seguro de cambiar el rol de ${userToChangeRole?.name} a ${userToChangeRole?.role === 'ADMIN' ? 'CLIENT' : 'ADMIN'}?`}
        confirmText="Cambiar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default AdminUsers;
