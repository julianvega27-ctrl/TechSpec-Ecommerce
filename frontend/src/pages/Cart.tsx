import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const mockCartItems = [
  { id: '1', name: 'TS-Mechanica Keyboard V2', sku: 'TS-MK2-01', price: 149.99, quantity: 1, imageUrl: '' },
  { id: '2', name: 'Precision Mouse Pro', sku: 'TS-MP-04', price: 89.99, quantity: 2, imageUrl: '' },
];

const Cart: React.FC = () => {
  const subtotal = mockCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">CARRITO DE COMPRAS</h1>
      </div>

      <div className="grid-container">
        <div className="col-span-12 lg:col-span-8">
          <div className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-white overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
                <tr>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] w-1/2">PRODUCTO</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] text-center">CANTIDAD</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] text-right">PRECIO</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {mockCartItems.map((item, index) => (
                  <tr key={item.id} className={`border-b border-[var(--color-outline-subtle)] last:border-b-0 ${index % 2 !== 0 ? 'bg-[var(--color-surface)]' : 'bg-white'}`}>
                    <td className="py-4 px-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-[var(--color-surface-container)] border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)]"></div>
                      <div>
                        <p className="font-medium text-[var(--color-obsidian)]">{item.name}</p>
                        <p className="mono-data text-xs text-[var(--color-outline)]">SKU: {item.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input type="number" defaultValue={item.quantity} min={1} className="w-16 border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-1 text-center mono-data outline-none" />
                    </td>
                    <td className="py-4 px-4 mono-data text-right">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-4 mono-data text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-[var(--color-surface-container)] p-6 sticky top-24">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">RESUMEN DE ORDEN</h3>
            
            <div className="flex justify-between mb-4">
              <span className="text-[var(--color-obsidian-light)]">Subtotal</span>
              <span className="mono-data">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 border-b border-[var(--color-outline-subtle)] pb-4">
              <span className="text-[var(--color-obsidian-light)]">Impuestos (18%)</span>
              <span className="mono-data">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-bold text-[var(--color-obsidian)]">TOTAL ESTIMADO</span>
              <span className="mono-data text-2xl font-bold">${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout">
              <Button fullWidth variant="primary" className="h-12">
                PROCEDER AL PAGO
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
