import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.put(`/admin/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error: any) {
      console.error('Error updating order status', error);
      alert(error.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-[var(--color-surface-container-high)] text-[var(--color-obsidian)]';
      case 'PROCESSING': return 'bg-[var(--color-primary)] text-white';
      case 'SHIPPED': return 'bg-blue-500 text-white';
      case 'DELIVERED': return 'bg-green-500 text-white';
      case 'CANCELED': return 'bg-[var(--color-error)] text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">ÓRDENES</h1>
      </div>
      
      {loading ? (
        <div className="mono-data text-center py-10">Cargando órdenes...</div>
      ) : (
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
              <tr>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ID ORDEN</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">CLIENTE</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">FECHA</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)] text-right">TOTAL</th>
                <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)] text-center">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-[var(--color-outline-subtle)] last:border-b-0">
                  <td className="py-4 px-6 text-[var(--color-obsidian)] mono-data text-sm truncate max-w-[100px]">{o.id}</td>
                  <td className="py-4 px-6 text-[var(--color-obsidian-light)]">
                    <div>{o.user?.name}</div>
                    <div className="text-xs">{o.user?.email}</div>
                  </td>
                  <td className="py-4 px-6 mono-data text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 mono-data text-right font-bold">${Number(o.totalAmount).toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    {o.status === 'DELIVERED' || o.status === 'CANCELED' ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-badge)] label-caps ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    ) : (
                      <select 
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`inline-flex items-center px-2 py-1 rounded-[var(--radius-badge)] label-caps outline-none border-none cursor-pointer ${getStatusColor(o.status)}`}
                      >
                        <option value="PENDING" className="bg-white text-black">PENDING</option>
                        <option value="PROCESSING" className="bg-white text-black">PROCESSING</option>
                        <option value="SHIPPED" className="bg-white text-black">SHIPPED</option>
                        <option value="DELIVERED" className="bg-white text-black">DELIVERED</option>
                        <option value="CANCELED" className="bg-white text-black">CANCELED</option>
                      </select>
                    )}
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

export default AdminOrders;
