import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ORDER_STATUS_MAP: Record<string, string> = {
  'PENDING': 'PENDIENTE',
  'PROCESSING': 'PROCESANDO',
  'SHIPPED': 'ENVIADO',
  'DELIVERED': 'ENTREGADO',
  'CANCELED': 'CANCELADO'
};

const ORDER_STATUSES = Object.keys(ORDER_STATUS_MAP);

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">PEDIDOS</h1>
      </div>

      {loading ? (
        <div className="mono-data text-center py-10">Cargando pedidos...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
                <tr>
                  <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ID / FECHA</th>
                  <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">CLIENTE</th>
                  <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">TOTAL</th>
                  <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`border-b border-[var(--color-outline-subtle)] last:border-b-0 cursor-pointer hover:bg-gray-50 ${selectedOrder?.id === o.id ? 'bg-[var(--color-surface-container-high)]' : ''}`}
                  >
                    <td className="py-4 px-6">
                      <div className="mono-data text-xs text-[var(--color-obsidian)] truncate w-24" title={o.id}>{o.id}</div>
                      <div className="text-xs text-[var(--color-obsidian-light)] mt-1">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-6 text-[var(--color-obsidian)] font-medium">
                      {o.user.name}
                      <div className="text-xs text-[var(--color-obsidian-light)] font-normal">{o.user.email}</div>
                    </td>
                    <td className="py-4 px-6 mono-data">${Number(o.totalAmount).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={o.status === 'DELIVERED' || o.status === 'CANCELED'}
                        className="text-xs rounded border border-[var(--color-outline-subtle)] px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{ORDER_STATUS_MAP[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No hay pedidos registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6 sticky top-6">
                <h3 className="label-caps mb-4 border-b border-[var(--color-outline-subtle)] pb-2">DETALLE DEL PEDIDO</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="block text-xs text-[var(--color-obsidian-light)] uppercase">ID de Pedido</span>
                    <span className="mono-data text-sm break-all">{selectedOrder.id}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-[var(--color-obsidian-light)] uppercase">Cliente</span>
                    <span className="block text-sm font-medium">{selectedOrder.user.name}</span>
                    <span className="block text-sm text-[var(--color-obsidian-light)]">{selectedOrder.user.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-[var(--color-obsidian-light)] uppercase">Fecha</span>
                    <span className="block text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-[var(--color-obsidian-light)] uppercase">Estado Actual</span>
                    <span className="inline-block mt-1 px-3 py-1 bg-[var(--color-surface-container)] text-[var(--color-obsidian)] text-xs font-bold rounded">
                      {ORDER_STATUS_MAP[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </div>
                </div>

                <h4 className="label-caps mb-3">PRODUCTOS ({selectedOrder.orderItems.length})</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {selectedOrder.orderItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                      <div className="flex-1 pr-2">
                        <span className="block font-medium truncate" title={item.product.name}>{item.product.name}</span>
                        <span className="text-[var(--color-obsidian-light)]">{item.quantity} x ${Number(item.unitPrice).toFixed(2)}</span>
                      </div>
                      <span className="mono-data font-medium">${(item.quantity * Number(item.unitPrice)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--color-outline-subtle)] flex justify-between items-center">
                  <span className="font-bold text-[var(--color-obsidian)]">TOTAL</span>
                  <span className="mono-data text-lg text-[var(--color-primary)]">${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--color-surface-container)] border border-[var(--color-outline-subtle)] border-dashed rounded-[var(--radius-soft)] p-8 text-center text-[var(--color-obsidian-light)]">
                Selecciona un pedido de la tabla para ver sus detalles.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
