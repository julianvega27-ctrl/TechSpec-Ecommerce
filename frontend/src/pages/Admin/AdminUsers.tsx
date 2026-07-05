import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await axios.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role', error);
      alert('Error al actualizar rol');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">USUARIOS</h1>
      </div>
      
      {loading ? (
        <div className="mono-data text-center py-10">Cargando usuarios...</div>
      ) : (
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
              <tr>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">NOMBRE</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">EMAIL</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ROL</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">REGISTRO</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[var(--color-outline-subtle)] last:border-b-0">
                  <td className="py-4 px-6 text-[var(--color-obsidian)] font-bold">{u.name}</td>
                  <td className="py-4 px-6 text-[var(--color-obsidian-light)]">{u.email}</td>
                  <td className="py-4 px-6">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-1 bg-[var(--color-surface-container)] text-sm outline-none"
                    >
                      <option value="CLIENT">CLIENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 mono-data text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
