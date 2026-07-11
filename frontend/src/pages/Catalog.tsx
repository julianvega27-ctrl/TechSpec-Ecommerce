import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { Search, ChevronDown } from 'lucide-react';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        const payload = response.data.data || response.data;
        setCategories(payload);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?page=${page}&limit=12`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (sortOption === 'Menor a Mayor') {
          url += `&sort=price_asc`;
        } else if (sortOption === 'Mayor a Menor') {
          url += `&sort=price_desc`;
        }
        const response = await axios.get(url);
        const payload = response.data.data || response.data;
        setProducts(payload.products || []);
        setTotalPages(payload.totalPages || 1);
        setTotal(payload.total || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, selectedCategory, searchQuery, sortOption]);

  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-obsidian)]">CATÁLOGO DE HARDWARE</h1>
        <p className="text-[var(--color-obsidian-light)] mt-2">Equipamiento técnico de precisión.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="col-span-12 md:col-span-3 border-r border-[var(--color-outline-subtle)] pr-6 mb-8 md:mb-0">
          <div className="mb-8 border-b border-[var(--color-outline-subtle)] pb-6">
            <h3 className="label-caps mb-4">Categorías</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => { setSelectedCategory(''); setPage(1); }}
                  className="mr-2 accent-[var(--color-primary)]"
                />
                <span className="text-[var(--color-obsidian)]">Todas</span>
              </li>
              {categories.map(cat => (
                <li key={cat.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.id}
                    onChange={() => { setSelectedCategory(cat.id); setPage(1); }}
                    className="mr-2 accent-[var(--color-primary)]"
                  />
                  <span className="text-[var(--color-obsidian)]">{cat.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="label-caps mb-4">Precio</h3>
            <div className="relative">
              <select
                className="w-full appearance-none border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-2 pr-10 bg-[var(--color-surface-container)] text-[var(--color-obsidian)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all cursor-pointer"
                value={sortOption}
                onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
              >
                <option value="">Destacados</option>
                <option value="Menor a Mayor">Menor a Mayor</option>
                <option value="Mayor a Menor">Mayor a Menor</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-outline)] pointer-events-none" size={18} />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="col-span-12 md:col-span-9">
          <div className="flex justify-between items-center mb-6 border-b border-[var(--color-outline-subtle)] pb-4">
            <span className="mono-data text-sm text-[var(--color-obsidian-light)]">{total} RESULTADOS</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-outline)] pointer-events-none" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] py-2 pl-10 pr-4 bg-[var(--color-surface-container)] text-[var(--color-obsidian)] outline-none w-64 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500 mono-data">CARGANDO...</div>
            ) : products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product.id} {...product} category={product.category?.name || 'UNCATEGORIZED'} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 mono-data">NO SE ENCONTRARON PRODUCTOS</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center border-t border-[var(--color-outline-subtle)] pt-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  className="px-3"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >&lt;</Button>

                <span className="text-[var(--color-obsidian)] px-4 font-bold mono-data">
                  {page} / {totalPages}
                </span>

                <Button
                  variant="secondary"
                  className="px-3"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >&gt;</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
