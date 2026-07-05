import React from 'react';
import { ProgressBar } from '../../components/ui/Indicators';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">RESUMEN DEL SISTEMA</h1>
        <span className="mono-data text-sm text-[var(--color-outline)]">ACTUALIZADO: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
          <h3 className="label-caps text-[var(--color-obsidian-light)] mb-2">VENTAS DEL DÍA</h3>
          <p className="mono-data text-3xl font-bold text-[var(--color-obsidian)] mb-4">$12,450.00</p>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-primary)] text-sm font-bold">↑ 14.5%</span>
            <span className="text-xs text-[var(--color-outline)]">vs ayer</span>
          </div>
        </div>
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
          <h3 className="label-caps text-[var(--color-obsidian-light)] mb-2">ÓRDENES PENDIENTES</h3>
          <p className="mono-data text-3xl font-bold text-[var(--color-obsidian)] mb-4">42</p>
          <ProgressBar progress={65} />
          <p className="text-xs text-[var(--color-outline)] mt-2">65% procesadas (Target: 90%)</p>
        </div>
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
          <h3 className="label-caps text-[var(--color-obsidian-light)] mb-2">USUARIOS ACTIVOS</h3>
          <p className="mono-data text-3xl font-bold text-[var(--color-obsidian)] mb-4">1,893</p>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-primary)] text-sm font-bold">↑ 2.1%</span>
            <span className="text-xs text-[var(--color-outline)]">esta semana</span>
          </div>
        </div>
        <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
          <h3 className="label-caps text-[var(--color-obsidian-light)] mb-2">ALERTA DE STOCK</h3>
          <p className="mono-data text-3xl font-bold text-[var(--color-error)] mb-4">5</p>
          <p className="text-xs text-[var(--color-outline)] mt-2">Productos por debajo del mínimo</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-outline-subtle)] flex justify-between items-center">
          <h3 className="label-caps text-[var(--color-obsidian)]">ÓRDENES RECIENTES</h3>
          <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver Todas</button>
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
            {[1, 2, 3, 4, 5].map((item, index) => (
              <tr key={item} className={`border-b border-[var(--color-outline-subtle)] last:border-b-0 ${index % 2 !== 0 ? 'bg-[var(--color-surface)]' : 'bg-white'}`}>
                <td className="py-4 px-6 mono-data font-medium text-[var(--color-obsidian)]">#ORD-9932{item}</td>
                <td className="py-4 px-6 text-[var(--color-obsidian)]">Cliente {item}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-badge)] label-caps ${item === 1 ? 'bg-[var(--color-surface-container-high)] text-[var(--color-obsidian)]' : 'bg-[var(--color-primary)] text-white'}`}>
                    {item === 1 ? 'PENDING' : 'PROCESSING'}
                  </span>
                </td>
                <td className="py-4 px-6 mono-data text-right font-bold">${(149.99 * item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
