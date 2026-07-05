import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar categoría?')) return;
    try {
      await axios.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category', error);
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">CATEGORÍAS</h1>
        <Button>NUEVA CATEGORÍA</Button>
      </div>
      
      {loading ? (
        <div className="mono-data text-center py-10">Cargando categorías...</div>
      ) : (
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
              <tr>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ID</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">NOMBRE</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ACTIVA</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)] text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b border-[var(--color-outline-subtle)] last:border-b-0">
                  <td className="py-4 px-6 text-[var(--color-obsidian-light)] mono-data text-sm">{c.id}</td>
                  <td className="py-4 px-6 text-[var(--color-obsidian)] font-bold">{c.name}</td>
                  <td className="py-4 px-6">
                    {c.isActive ? (
                      <span className="text-[var(--color-primary)] font-bold">Sí</span>
                    ) : (
                      <span className="text-[var(--color-error)]">No</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">Editar</button>
                    <button onClick={() => handleDelete(c.id)} className="text-[var(--color-error)] text-sm font-medium hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
