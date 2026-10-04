import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductCard, { ProductCardSkeleton, type ProductCardProps } from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import CatalogState from '../components/ui/CatalogState';
import { ChevronLeft, ChevronRight, Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Catalog.css';

interface Category { id: string; name: string }

const Catalog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [categoryRetry, setCategoryRetry] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const setPage = (next: number | ((current: number) => number)) => {
    setSearchParams(previous => {
      const params = new URLSearchParams(previous);
      const value = typeof next === 'function' ? next(page) : next;
      if (value === 1) params.delete('page');
      else params.set('page', String(value));
      return params;
    });
  };
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const setFilter = (key: 'category' | 'search', value: string) => {
    setSearchParams(previous => {
      const params = new URLSearchParams(previous);
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page');
      return params;
    }, { replace: true });
  };
  const [sortOption, setSortOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterButtonRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLElement>(null);
  const categoryName = categories.find(category => category.id === selectedCategory)?.name;

  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(false);
      try {
        const response = await axios.get('/categories');
        const payload = response.data.data || response.data;
        if (!cancelled) setCategories(payload);
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (!cancelled) setCategoriesError(true);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    };
    void fetchCategories();
    return () => { cancelled = true; };
  }, [categoryRetry]);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      setError(false);
      try {
        let url = `/products?page=${page}&limit=12`;
        if (selectedCategory) url += `&category=${selectedCategory}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
        if (sortOption === 'Menor a Mayor') url += '&sort=price_asc';
        else if (sortOption === 'Mayor a Menor') url += '&sort=price_desc';
        const response = await axios.get(url);
        const payload = response.data.data || response.data;
        if (!cancelled) {
          setProducts(payload.products || []);
          setTotalPages(payload.totalPages || 1);
          setTotal(payload.total || 0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchProducts();
    return () => { cancelled = true; };
  }, [page, selectedCategory, searchQuery, sortOption, retry]);

  useEffect(() => {
    if (filtersOpen) filtersRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
  }, [filtersOpen]);

  const addToCart = async (productId: string) => {
    if (!user) {
      navigate('/login');
      return false;
    }
    await axios.post('/cart', { productId, quantity: 1 });
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  };
  const resetFilters = () => {
    setSearchParams({});
    setSortOption('');
  };

  return (
    <div className="techspec-catalog page-wrapper py-8 lg:py-10">
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
        <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
        <ChevronRight aria-hidden="true" size={14} />
        <span aria-current="page" className="text-primary">Catálogo</span>
      </nav>
      <div className="mb-6">
        <h1 className="ds-page-title text-primary">Catálogo</h1>
        <p className="mt-2 text-text-secondary">Encuentra el equipo que va contigo.</p>
      </div>

      <div className="catalog-toolbar ds-card mb-6">
        <div className="relative min-w-0">
          <label htmlFor="catalog-search" className="sr-only">Buscar en el catálogo</label>
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
          <input id="catalog-search" type="search" placeholder="Buscar por nombre o marca…" className="ds-control pl-10" value={searchQuery} onChange={(event) => setFilter('search', event.target.value)} />
        </div>
        <div className="catalog-sort flex items-center gap-3">
          <label htmlFor="catalog-sort" className="sr-only sm:not-sr-only text-sm text-text-secondary shrink-0">Ordenar por</label>
          <div className="relative flex-1 min-w-0">
            <select id="catalog-sort" className="ds-control appearance-none pr-9 cursor-pointer text-sm" value={sortOption} onChange={(event) => { setSortOption(event.target.value); setPage(1); }}>
              <option value="">Destacados</option>
              <option value="Menor a Mayor">Precio: menor a mayor</option>
              <option value="Mayor a Menor">Precio: mayor a menor</option>
            </select>
            <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
          </div>
        </div>
        <div ref={filterButtonRef} className="lg:hidden catalog-filter-toggle">
          <Button type="button" variant="secondary" fullWidth aria-label="Categorías" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(value => !value)}>
            <SlidersHorizontal aria-hidden="true" size={18} /><span className="hidden min-[480px]:inline">Categorías</span>
          </Button>
        </div>
      </div>

      <div className="catalog-layout">
        <aside id="catalog-filters" ref={filtersRef} aria-label="Filtros del catálogo" className={`catalog-filters ds-card ${filtersOpen ? 'block' : 'hidden'} lg:block`} onKeyDown={(event) => {
          if (event.key === 'Escape') { setFiltersOpen(false); filterButtonRef.current?.querySelector('button')?.focus(); }
        }}>
          <fieldset>
            <legend className="text-base font-semibold text-primary mb-4">Categorías</legend>
            <div className="space-y-1">
              <label className={`catalog-category ${!selectedCategory ? 'is-selected' : ''}`}>
                <input type="radio" name="category" checked={!selectedCategory} onChange={() => setFilter('category', '')} />
                <span>Todas las categorías</span>
              </label>
              {categoriesLoading ? <div role="status" className="text-sm text-text-secondary px-3 py-4">Cargando categorías…</div> : categoriesError ? <div role="alert" className="text-sm text-error px-3 py-3">
                <p>No se pudieron cargar las categorías.</p>
                <Button type="button" variant="ghost" className="mt-2" onClick={() => setCategoryRetry(value => value + 1)}>Reintentar</Button>
              </div> : categories.map(category => (
                <label key={category.id} className={`catalog-category ${selectedCategory === category.id ? 'is-selected' : ''}`}>
                  <input type="radio" name="category" checked={selectedCategory === category.id} onChange={() => setFilter('category', category.id)} />
                  <span className="min-w-0 break-words">{category.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </aside>

        <section className="min-w-0" aria-label="Productos del catálogo" aria-busy={loading}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 min-h-8">
            <p role="status" aria-live="polite" className="text-sm text-text-secondary">
              {loading ? 'Buscando productos…' : error ? 'Productos' : `${total} ${total === 1 ? 'producto' : 'productos'}`}
            </p>
            {categoryName && <button type="button" className="catalog-selection" onClick={() => setFilter('category', '')} aria-label={`Quitar categoría ${categoryName}`}>
              <span className="min-w-0 break-words">{categoryName}</span><X aria-hidden="true" size={14} className="shrink-0" />
            </button>}
          </div>
          {loading ? <div className="catalog-grid">{Array.from({ length: 6 }, (_, index) => <ProductCardSkeleton key={index} />)}</div> : error ? (
            <CatalogState variant="error" title="No pudimos cargar el catálogo" description="Inténtalo de nuevo para ver los productos con tu selección actual." action={<Button type="button" variant="secondary" onClick={() => setRetry(value => value + 1)}>Volver a intentar</Button>} />
          ) : products.length > 0 ? <div className="catalog-grid">{products.map(product => <ProductCard key={product.id} {...product} onAddToCart={addToCart} />)}</div> : (
            <CatalogState variant="empty" title="No encontramos productos" description={searchQuery || selectedCategory ? 'Prueba con otra búsqueda o cambia la categoría seleccionada.' : 'No hay productos para mostrar en este momento.'} action={searchQuery || selectedCategory ? <Button type="button" variant="secondary" onClick={resetFilters}>Ver todo el catálogo</Button> : undefined} />
          )}

          {!loading && !error && products.length > 0 && totalPages > 1 && <nav aria-label="Paginación de productos" className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-border">
            <Button type="button" variant="secondary" aria-label="Página anterior" disabled={page === 1} onClick={() => setPage(current => Math.max(1, current - 1))}><ChevronLeft aria-hidden="true" size={18} /><span className="hidden sm:inline">Anterior</span></Button>
            <span className="text-sm text-text-secondary tabular-nums">Página <strong className="font-medium text-primary">{page}</strong> de {totalPages}</span>
            <Button type="button" variant="secondary" aria-label="Página siguiente" disabled={page === totalPages} onClick={() => setPage(current => Math.min(totalPages, current + 1))}><span className="hidden sm:inline">Siguiente</span><ChevronRight aria-hidden="true" size={18} /></Button>
          </nav>}
        </section>
      </div>
    </div>
  );
};

export default Catalog;
