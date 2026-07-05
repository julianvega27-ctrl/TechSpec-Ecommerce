import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ui/ProductCard';

const mockFeaturedProducts = [
  { id: '1', name: 'TS-Mechanica Keyboard V2', brand: 'TECHSPEC', price: 149.99, imageUrl: '', sku: 'TS-MK2-01', category: 'PERIPHERALS' },
  { id: '2', name: 'Precision Mouse Pro', brand: 'TECHSPEC', price: 89.99, imageUrl: '', sku: 'TS-MP-04', category: 'PERIPHERALS' },
  { id: '3', name: 'Obsidian Monitor 27"', brand: 'TECHSPEC', price: 349.99, imageUrl: '', sku: 'TS-MN-27', category: 'DISPLAYS' },
  { id: '4', name: 'Core Compute Node', brand: 'TECHSPEC', price: 1299.99, imageUrl: '', sku: 'TS-CN-88', category: 'SYSTEMS' },
];

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      
      <section className="page-wrapper py-16">
        <div className="flex justify-between items-end mb-8 border-b border-[var(--color-outline-subtle)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--color-obsidian)]">PRODUCTOS DESTACADOS</h2>
          <span className="label-caps text-[var(--color-primary)] cursor-pointer hover:underline">Ver Todo</span>
        </div>
        
        <div className="grid-container">
          {mockFeaturedProducts.map(product => (
            <div key={product.id} className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-obsidian)] text-white py-24">
        <div className="page-wrapper">
          <div className="grid-container">
            <div className="col-span-12 md:col-span-8 lg:col-span-6">
              <h2 className="text-4xl font-bold mb-6">INGENIERÍA SIN COMPROMISOS</h2>
              <p className="text-lg text-gray-300 mb-8">
                Cada componente ha sido diseñado con especificaciones estrictas para asegurar durabilidad, precisión y rendimiento. No hacemos concesiones en calidad.
              </p>
              <div className="flex gap-4">
                <div className="border border-[var(--color-outline)] p-4 rounded-[var(--radius-soft)] w-1/2">
                  <p className="mono-data text-2xl font-bold text-[var(--color-primary-container)]">99.9%</p>
                  <p className="label-caps text-gray-400 mt-2">CONFIABILIDAD</p>
                </div>
                <div className="border border-[var(--color-outline)] p-4 rounded-[var(--radius-soft)] w-1/2">
                  <p className="mono-data text-2xl font-bold text-[var(--color-primary-container)]">&lt; 1ms</p>
                  <p className="label-caps text-gray-400 mt-2">LATENCIA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
