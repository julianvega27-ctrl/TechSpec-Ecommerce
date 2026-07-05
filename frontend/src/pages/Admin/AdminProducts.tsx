import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      await axios.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product', error);
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">PRODUCTOS</h1>
        <Button>NUEVO PRODUCTO</Button>
      </div>
      
      {loading ? (
        <div className="mono-data text-center py-10">Cargando productos...</div>
      ) : (
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
              <tr>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">NOMBRE</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">MARCA</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">PRECIO</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">STOCK</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)] text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-[var(--color-outline-subtle)] last:border-b-0">
                  <td className="py-4 px-6 text-[var(--color-obsidian)]">{p.name}</td>
                  <td className="py-4 px-6 text-[var(--color-obsidian-light)]">{p.brand}</td>
                  <td className="py-4 px-6 mono-data">${Number(p.price).toFixed(2)}</td>
                  <td className="py-4 px-6 mono-data">{p.stock}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="text-[var(--color-error)] text-sm font-medium hover:underline">Eliminar</button>
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

export default AdminProducts;
