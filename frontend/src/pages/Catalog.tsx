import React from 'react';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i + 1}`,
  name: `TechSpec Product ${i + 1}`,
  brand: 'TECHSPEC',
  price: 99.99 + (i * 10),
  imageUrl: '',
  sku: `TS-00${i + 1}`,
  category: i % 2 === 0 ? 'SYSTEMS' : 'PERIPHERALS'
}));

const Catalog: React.FC = () => {
  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">CATÁLOGO DE HARDWARE</h1>
        <p className="text-[var(--color-obsidian-light)] mt-2">Equipamiento técnico de precisión.</p>
      </div>

      <div className="grid-container">
        {/* Sidebar Filters */}
        <aside className="col-span-12 md:col-span-3 border-r border-[var(--color-outline-subtle)] pr-6 hidden md:block">
          <div className="mb-8 border-b border-[var(--color-outline-subtle)] pb-6">
            <h3 className="label-caps mb-4">Categorías</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <input type="checkbox" className="mr-2 accent-[var(--color-primary)]" />
                <span className="text-[var(--color-obsidian)]">Systems</span>
              </li>
              <li className="flex items-center">
                <input type="checkbox" className="mr-2 accent-[var(--color-primary)]" />
                <span className="text-[var(--color-obsidian)]">Peripherals</span>
              </li>
              <li className="flex items-center">
                <input type="checkbox" className="mr-2 accent-[var(--color-primary)]" />
                <span className="text-[var(--color-obsidian)]">Displays</span>
              </li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="label-caps mb-4">Precio</h3>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" className="w-full p-2 border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-[var(--color-surface-container)] mono-data text-sm" />
              <input type="number" placeholder="Max" className="w-full p-2 border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-[var(--color-surface-container)] mono-data text-sm" />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="col-span-12 md:col-span-9">
          <div className="flex justify-between items-center mb-6 border-b border-[var(--color-outline-subtle)] pb-4">
            <span className="mono-data text-sm text-[var(--color-obsidian-light)]">12 RESULTADOS</span>
            <select className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-2 bg-[var(--color-surface-container)] label-caps text-[var(--color-obsidian)] outline-none">
              <option>Ordenar: Destacados</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center border-t border-[var(--color-outline-subtle)] pt-8">
            <div className="flex items-center space-x-2">
              <Button variant="secondary" className="px-3" disabled>&lt;</Button>
              <Button variant="primary" className="px-4">1</Button>
              <Button variant="secondary" className="px-4">2</Button>
              <Button variant="secondary" className="px-4">3</Button>
              <span className="text-[var(--color-obsidian-light)] px-2">...</span>
              <Button variant="secondary" className="px-4">10</Button>
              <Button variant="secondary" className="px-3">&gt;</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
