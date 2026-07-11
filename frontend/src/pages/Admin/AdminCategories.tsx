import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button.tsx';
import { FormField } from '../../components/ui/FormField.tsx';
import ConfirmModal from '../../components/ui/ConfirmModal';

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { isActive: true }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/admin/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setValue('name', category.name);
      setValue('description', category.description || '');
      setValue('isActive', category.isActive);
    } else {
      setEditingCategory(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingCategory(null);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingCategory) {
        await axios.put(`/admin/categories/${editingCategory.id}`, data, { headers });
      } else {
        await axios.post('/admin/categories', data, { headers });
      }

      await fetchData();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.error || 'Error al guardar la categoría');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/admin/categories/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting category', error);
      alert(error.response?.data?.error || 'Error al eliminar');
    } finally {
      setItemToDelete(null);
    }
  };

  const toggleStatus = async (category: any) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/admin/categories/${category.id}`, { isActive: !category.isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
    } catch (error) {
      console.error('Error toggling status', error);
      alert('Error al cambiar estado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">CATEGORÍAS</h1>
        <Button onClick={() => handleOpenModal()}>AGREGAR</Button>
      </div>

      {loading ? (
        <div className="mono-data text-center py-10">Cargando categorías...</div>
      ) : (
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
              <tr>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">NOMBRE</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">DESCRIPCIÓN</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ESTADO</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)] text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b border-[var(--color-outline-subtle)] last:border-b-0 hover:bg-gray-50">
                  <td className="py-4 px-6 text-[var(--color-obsidian)] font-medium">{c.name}</td>
                  <td className="py-4 px-6 text-[var(--color-obsidian-light)]">{c.description || '-'}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleStatus(c)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {c.isActive ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button onClick={() => handleOpenModal(c)} className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors p-1" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => confirmDelete(c.id)} className="text-[var(--color-error)] hover:text-red-700 transition-colors p-1" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No hay categorías registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[var(--radius-soft)] p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-[var(--color-obsidian)] mb-6">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Nombre" name="name" register={register} error={errors.name?.message} />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-[var(--color-obsidian-light)]">Descripción</label>
                <textarea
                  {...register('description')}
                  className="w-full h-24 rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-obsidian)] focus:ring-1 focus:ring-[var(--color-primary)]"
                ></textarea>
                {errors.description && <p className="text-sm text-[var(--color-error)]">{errors.description.message}</p>}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="isActive" {...register('isActive')} className="rounded text-[var(--color-primary)]" />
                <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-obsidian)]">Categoría Activa</label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-[var(--color-outline-subtle)]">
                <Button type="button" variant="secondary" onClick={handleCloseModal} disabled={saving}>Cancelar</Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Categoría"
        message="¿Estás seguro de eliminar esta categoría? Solo se permite si no tiene productos asociados."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default AdminCategories;
