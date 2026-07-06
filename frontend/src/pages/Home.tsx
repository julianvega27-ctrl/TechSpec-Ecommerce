import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductCard from '../components/ui/ProductCard';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products?limit=4');
        setFeaturedProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Hero />
      
      <section className="page-wrapper py-16">
        <div className="flex justify-between items-end mb-8 border-b border-[var(--color-outline-subtle)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--color-obsidian)]">PRODUCTOS DESTACADOS</h2>
          <span className="label-caps text-[var(--color-primary)] cursor-pointer hover:underline">Ver Todo</span>
        </div>
        
        <div className="grid-container">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <div key={product.id} className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                <ProductCard {...product} category={product.category?.name || 'UNCATEGORIZED'} />
              </div>
            ))
          ) : (
            <div className="col-span-12 text-center py-8 text-gray-500 mono-data">CARGANDO PRODUCTOS...</div>
          )}
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
            <div className="col-span-12 md:col-span-4 lg:col-span-6 flex items-center justify-center bg-[var(--color-surface-container)] rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" alt="Hero Placeholder" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
