import React from 'react';
import { Badge } from '../components/ui/Indicators';
import Button from '../components/ui/Button';

const OrderHistory: React.FC = () => {
  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">HISTORIAL DE ÓRDENES</h1>
      </div>

      <div className="grid-container">
        <aside className="col-span-12 md:col-span-3 border-r border-[var(--color-outline-subtle)] pr-6 hidden md:block">
          <ul className="space-y-4">
            <li>
              <span className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Información Personal</span>
            </li>
            <li>
              <span className="text-[var(--color-primary)] font-medium block">Historial de Órdenes</span>
            </li>
            <li>
              <span className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Seguridad</span>
            </li>
          </ul>
        </aside>

        <div className="col-span-12 md:col-span-9">
          <div className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-white overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
                <tr>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)]">ID ORDEN</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)]">FECHA</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)]">ESTADO</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] text-right">TOTAL</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-outline-subtle)] bg-white">
                  <td className="py-4 px-4 mono-data font-medium text-[var(--color-obsidian)]">#ORD-99321</td>
                  <td className="py-4 px-4 mono-data text-[var(--color-outline)]">2026-06-25</td>
                  <td className="py-4 px-4">
                    <Badge variant="outline">DELIVERED</Badge>
                  </td>
                  <td className="py-4 px-4 mono-data text-right font-bold">$404.36</td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="secondary" className="px-3 py-1 text-xs label-caps">VER DETALLE</Button>
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-outline-subtle)] bg-[var(--color-surface)]">
                  <td className="py-4 px-4 mono-data font-medium text-[var(--color-obsidian)]">#ORD-98102</td>
                  <td className="py-4 px-4 mono-data text-[var(--color-outline)]">2026-05-12</td>
                  <td className="py-4 px-4">
                    <Badge variant="outline">DELIVERED</Badge>
                  </td>
                  <td className="py-4 px-4 mono-data text-right font-bold">$1,299.99</td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="secondary" className="px-3 py-1 text-xs label-caps">VER DETALLE</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
