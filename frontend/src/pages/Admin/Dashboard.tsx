import React, { useState, useEffect } from 'react';
import axios from 'axios';
const ORDER_STATUS_MAP: Record<string, string> = {
  'PENDING': 'PENDIENTE',
  'PROCESSING': 'PROCESANDO',
  'SHIPPED': 'ENVIADO',
  'DELIVERED': 'ENTREGADO',
  'CANCELED': 'CANCELADO'
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="mono-data py-10 text-center">Cargando panel de control...</div>;
  }

  if (!stats) {
    return <div className="mono-data py-10 text-center text-[var(--color-error)]">Error al cargar datos.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">RESUMEN DEL SISTEMA</h1>
        <span className="mono-data text-sm text-[var(--color-outline)]">ACTUALIZADO: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
          <h3 className="label-caps text-[var(--color-obsidian-light)] mb-2">VENTAS DE HOY</h3>
          <p className="mono-data text-3xl font-bold text-[var(--color-obsidian)] mb-4">${Number(stats.todaysSales || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
          <h3 className="label-caps text-[var(--color-obsidian-light)] mb-2">ÓRDENES PENDIENTES</h3>
          <p className="mono-data text-3xl font-bold text-[var(--color-obsidian)] mb-4">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
          <h3 className="label-caps text-[var(--color-obsidian-light)] mb-2">USUARIOS CLIENTES</h3>
          <p className="mono-data text-3xl font-bold text-[var(--color-obsidian)] mb-4">{stats.activeUsers}</p>
        </div>
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
          <h3 className="label-caps text-[var(--color-obsidian-light)] mb-2">ALERTA DE STOCK</h3>
          <p className="mono-data text-3xl font-bold text-[var(--color-error)] mb-4">{stats.lowStockProducts}</p>
          <p className="text-xs text-[var(--color-outline)] mt-2">Productos por debajo del mínimo (10)</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-outline-subtle)] flex justify-between items-center">
          <h3 className="label-caps text-[var(--color-obsidian)]">ÓRDENES RECIENTES</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
            <tr>
              <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ID ORDEN</th>
              <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">CLIENTE</th>
              <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)]">ESTADO</th>
              <th className="py-3 px-6 label-caps text-[var(--color-obsidian-light)] text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders && stats.recentOrders.length > 0 ? stats.recentOrders.map((order: any, index: number) => (
              <tr key={order.id} className={`border-b border-[var(--color-outline-subtle)] last:border-b-0 ${index % 2 !== 0 ? 'bg-[var(--color-surface)]' : 'bg-white'}`}>
                <td className="py-4 px-6 mono-data font-medium text-[var(--color-obsidian)] truncate max-w-[150px]">{order.id}</td>
                <td className="py-4 px-6 text-[var(--color-obsidian)]">{order.user?.name}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-badge)] label-caps ${order.status === 'PENDING' ? 'bg-[var(--color-surface-container-high)] text-[var(--color-obsidian)]' : 'bg-[var(--color-primary)] text-white'}`}>
                    {ORDER_STATUS_MAP[order.status] || order.status}
                  </span>
                </td>
                <td className="py-4 px-6 mono-data text-right font-bold">${Number(order.totalAmount).toFixed(2)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[var(--color-obsidian-light)]">No hay órdenes recientes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
