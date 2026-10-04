import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import type { ProductCardProps } from '../components/ui/ProductCard';
import ProductCard from '../components/ui/ProductCard';
import { Notice } from '../components/ui/Interior';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductCardProps[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products?limit=4');
        const payload = response.data.data || response.data;
        setFeaturedProducts(payload.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Hero />

      <section className="page-wrapper py-16">
        <div className="flex flex-wrap gap-4 justify-between items-end mb-6 border-b border-[var(--color-outline-subtle)] pb-4">
          <h2 className="ds-section-title text-primary">Productos destacados</h2>
          <Link to="/catalog" className="inline-flex min-h-11 items-center text-sm font-medium text-accent hover:underline underline-offset-4">Ver catálogo</Link>
        </div>

        <div className="grid-container">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <div key={product.id} className="col-span-12 min-[480px]:col-span-6 md:col-span-4 lg:col-span-3">
                <ProductCard {...product} category={product.category} />
              </div>
            ))
          ) : (
            <div className="col-span-12">{loading ? <Notice variant="loading">Cargando productos…</Notice> : loadFailed ? <Notice>No pudimos cargar los productos destacados.</Notice> : <p role="status" className="text-center py-8 text-text-secondary">No hay productos destacados disponibles.</p>}</div>
          )}
        </div>
      </section>

      <section className="bg-[var(--color-obsidian)] text-white py-24">
        <div className="page-wrapper">
          <div className="grid-container">
            <div className="col-span-12 md:col-span-8 lg:col-span-6">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">INGENIERÍA SIN COMPROMISOS</h2>
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
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" alt="Detalle de una placa electrónica" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
