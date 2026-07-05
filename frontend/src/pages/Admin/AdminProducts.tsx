import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../../components/ui/Button.tsx';
import { FormField } from '../../components/ui/FormField.tsx';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  brand: z.string().min(1, 'La marca es requerida'),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.number({ coerce: true }).min(0, 'El precio debe ser mayor a 0'),
  stock: z.number({ coerce: true }).min(0, 'El stock debe ser 0 o mayor'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  isActive: z.boolean().default(true),
  image: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      price: 0,
      stock: 0
    }
  });

  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get('/products'),
        axios.get('/categories')
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('brand', product.brand);
      setValue('description', product.description);
      setValue('price', Number(product.price));
      setValue('stock', product.stock);
      setValue('categoryId', product.categoryId);
      setValue('isActive', product.isActive);
      setPreviewImage(product.imageUrl);
    } else {
      setEditingProduct(null);
      reset();
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setPreviewImage(null);
    setEditingProduct(null);
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!editingProduct && (!data.image || data.image.length === 0)) {
      alert('La imagen es requerida para nuevos productos');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('brand', data.brand);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('categoryId', data.categoryId);
      formData.append('isActive', data.isActive.toString());

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      };

      if (editingProduct) {
        await axios.put(`/admin/products/${editingProduct.id}`, formData, { headers });
      } else {
        await axios.post('/admin/products', formData, { headers });
      }

      await fetchData();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.error || 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
    } catch (error) {
      console.error('Error deleting product', error);
      alert('Error al eliminar');
    }
  };

  const toggleStatus = async (product: any) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('isActive', String(!product.isActive));
      await axios.put(`/admin/products/${product.id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
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
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">PRODUCTOS</h1>
        <Button onClick={() => handleOpenModal()}>NUEVO PRODUCTO</Button>
      </div>
      
      {loading ? (
        <div className="mono-data text-center py-10">Cargando productos...</div>
      ) : (
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
              <tr>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">IMAGEN</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">NOMBRE</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">MARCA</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">PRECIO</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">STOCK</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ESTADO</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)] text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-[var(--color-outline-subtle)] last:border-b-0 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="py-4 px-6 text-[var(--color-obsidian)] font-medium">{p.name}</td>
                  <td className="py-4 px-6 text-[var(--color-obsidian-light)]">{p.brand}</td>
                  <td className="py-4 px-6 mono-data">${Number(p.price).toFixed(2)}</td>
                  <td className="py-4 px-6 mono-data">{p.stock}</td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => toggleStatus(p)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {p.isActive ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button onClick={() => handleOpenModal(p)} className="text-[var(--color-primary)] text-sm font-medium hover:underline">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="text-[var(--color-error)] text-sm font-medium hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">No hay productos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[var(--radius-soft)] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[var(--color-obsidian)] mb-6">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre" name="name" register={register} error={errors.name?.message} />
                <FormField label="Marca" name="brand" register={register} error={errors.brand?.message} />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[var(--color-obsidian-light)]">Descripción</label>
                <textarea
                  {...register('description')}
                  className="w-full h-24 rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-obsidian)] focus:ring-1 focus:ring-[var(--color-primary)]"
                ></textarea>
                {errors.description && <p className="text-sm text-[var(--color-error)]">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Precio" name="price" type="number" step="0.01" register={register} error={errors.price?.message} />
                <FormField label="Stock" name="stock" type="number" register={register} error={errors.stock?.message} />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-[var(--color-obsidian-light)]">Categoría</label>
                <select
                  {...register('categoryId')}
                  className="w-full rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-obsidian)] focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-sm text-[var(--color-error)]">{errors.categoryId.message}</p>}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="isActive" {...register('isActive')} className="rounded text-[var(--color-primary)]" />
                <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-obsidian)]">Producto Activo</label>
              </div>

              <div className="space-y-1 pt-2">
                <label className="block text-sm font-medium text-[var(--color-obsidian-light)]">Imagen {editingProduct && '(Opcional)'}</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-surface-container)] file:text-[var(--color-obsidian)]"
                />
              </div>

              {previewImage && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Vista Previa:</p>
                  <img src={previewImage} alt="Preview" className="h-32 object-contain border border-gray-200 rounded bg-gray-50" />
                </div>
              )}

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
    </div>
  );
};

export default AdminProducts;
