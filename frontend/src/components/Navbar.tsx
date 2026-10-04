import React, { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Navbar.css';

interface Category {
  id: string;
  name: string;
}
interface CartItem { quantity: number }
type Panel = 'categories' | 'mobile';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [itemCount, setItemCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [panel, setPanel] = useState<{ name: Panel; locationKey: string } | null>(null);
  const openPanel = panel?.locationKey === location.key ? panel.name : null;
  const headerRef = useRef<HTMLElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const categoryPanelRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLElement>(null);
  const panelId = useId();
  const categoryPanelId = `${panelId}-categories`;
  const mobilePanelId = `${panelId}-mobile`;
  const query = new URLSearchParams(location.search);
  const currentCategory = location.pathname === '/catalog' ? query.get('category') : null;
  const accountLabel = user ? 'Mi perfil' : 'Ingresar';
  const accountPath = user ? '/profile' : '/login';

  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        const payload = response.data.data || response.data;
        if (!cancelled && Array.isArray(payload)) {
          setCategories(payload.filter((category: Category) => category.id && category.name));
        }
      } catch (error) {
        console.error('Error fetching navigation categories:', error);
      }
    };
    void fetchCategories();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      if (!user) {
        setItemCount(0);
        return;
      }
      try {
        const response = await axios.get('/cart');
        const payload = response.data.data || response.data;
        const count = payload.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
        if (!cancelled) setItemCount(count);
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };
    void fetchCount();
    const handleCartUpdate = () => { void fetchCount(); };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  useEffect(() => {
    if (!openPanel) return;
    const closeWithKeyboard = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setPanel(null);
      (openPanel === 'mobile' ? mobileButtonRef : categoryButtonRef).current?.focus();
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setPanel(null);
    };
    const breakpoint = window.matchMedia('(min-width: 1024px)');
    const closeOnResize = () => { setPanel(null); };
    document.addEventListener('keydown', closeWithKeyboard);
    document.addEventListener('pointerdown', closeOutside);
    breakpoint.addEventListener('change', closeOnResize);
    return () => {
      document.removeEventListener('keydown', closeWithKeyboard);
      document.removeEventListener('pointerdown', closeOutside);
      breakpoint.removeEventListener('change', closeOnResize);
    };
  }, [openPanel]);

  useEffect(() => {
    if (openPanel) {
      (openPanel === 'mobile' ? mobilePanelRef : categoryPanelRef).current?.querySelector<HTMLAnchorElement>('a')?.focus();
    }
  }, [openPanel]);

  const togglePanel = (name: Panel) => {
    setPanel(openPanel === name ? null : { name, locationKey: location.key });
  };
  const closePanel = () => { setPanel(null); };
  const categoryPath = (id: string) => `/catalog?${new URLSearchParams({ category: id })}`;
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = String(new FormData(event.currentTarget).get('search') || '').trim();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (currentCategory) params.set('category', currentCategory);
    closePanel();
    navigate(`/catalog${params.size ? `?${params}` : ''}`);
  };

  return (
    <header ref={headerRef} onBlur={(event) => {
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) closePanel();
    }} className="techspec-header relative border-b border-border bg-card lg:sticky lg:top-0 z-40">
      <div className="page-wrapper py-0">
        <div className="flex flex-wrap items-center gap-x-4 lg:gap-x-6">
          <Link to="/" aria-label="TechSpec, inicio" onClick={closePanel} className="header-logo shrink-0 rounded-control py-2 text-xl sm:text-2xl font-bold tracking-[-0.06em] text-primary">
            TECH<span className="text-accent">SPEC</span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-1">
            <Link to="/catalog" className="header-link" aria-current={location.pathname === '/catalog' && !currentCategory ? 'page' : undefined} onClick={closePanel}>Catálogo</Link>
            {categories.length > 0 && (
              <div className="relative" onBlur={(event) => {
                if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) closePanel();
              }}>
                <button ref={categoryButtonRef} type="button" className="header-link gap-1" aria-expanded={openPanel === 'categories'} aria-controls={categoryPanelId} onClick={() => togglePanel('categories')} onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    if (openPanel === 'categories') categoryPanelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
                    else setPanel({ name: 'categories', locationKey: location.key });
                  }
                }}>
                  Categorías <ChevronDown aria-hidden="true" size={16} className={`header-chevron ${openPanel === 'categories' ? 'rotate-180' : ''}`} />
                </button>
                  <div id={categoryPanelId} ref={categoryPanelRef} hidden={openPanel !== 'categories'} inert={openPanel !== 'categories' || undefined} aria-hidden={openPanel !== 'categories' || undefined} className="ds-presence ds-panel header-category-panel ds-card absolute left-0 top-[calc(100%+0.5rem)] z-10 w-64 max-h-[min(24rem,60dvh)] overflow-y-auto p-2 shadow-card-hover">
                    {categories.map(category => (
                      <Link key={category.id} to={categoryPath(category.id)} className="header-link w-full justify-between gap-4" aria-current={currentCategory === category.id ? 'page' : undefined} onClick={closePanel}>
                        <span className="min-w-0 break-words">{category.name}</span><ArrowRight aria-hidden="true" size={16} className="shrink-0 text-text-secondary" />
                      </Link>
                    ))}
                  </div>
              </div>
            )}
            <Link to="/support" className="header-link" aria-current={location.pathname === '/support' ? 'page' : undefined} onClick={closePanel}>Soporte</Link>
          </nav>

          <form key={location.key} role="search" aria-label="Buscar productos" onSubmit={submitSearch} className="header-search order-last lg:order-none w-full lg:w-auto lg:flex-1 min-w-0 mb-3 lg:mb-0">
            <label htmlFor={`${panelId}-search`} className="sr-only">Buscar productos</label>
            <Search aria-hidden="true" size={18} className="ml-3 shrink-0 text-text-secondary" />
            <input id={`${panelId}-search`} name="search" type="search" defaultValue={location.pathname === '/catalog' ? query.get('search') || '' : ''} placeholder="Buscar productos…" className="min-w-0 min-h-[var(--control-height)] flex-1 w-full bg-transparent px-3 py-2 text-base text-primary placeholder:text-text-secondary" />
            <button type="submit" className="header-icon shrink-0 text-accent" aria-label="Enviar búsqueda"><ArrowRight aria-hidden="true" size={18} /></button>
          </form>

          <div className="ml-auto flex h-16 lg:h-20 shrink-0 items-center gap-1 sm:gap-2">
            <Link to={accountPath} aria-label={accountLabel} aria-current={location.pathname === accountPath ? 'page' : undefined} className="header-icon gap-2 xl:px-3" onClick={closePanel}>
              <User aria-hidden="true" size={20} strokeWidth={1.75} /><span className="hidden xl:inline text-sm font-medium">{accountLabel}</span>
            </Link>
            <Link to="/cart" aria-label={`Carrito, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`} aria-current={location.pathname === '/cart' ? 'page' : undefined} className="header-icon relative" onClick={closePanel}>
              <ShoppingCart aria-hidden="true" size={20} strokeWidth={1.75} />
              <span key={itemCount} aria-hidden="true" className="ds-cart-count absolute right-0.5 top-0.5 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[10px] font-semibold leading-4 text-center tabular-nums">{itemCount}</span>
            </Link>
            <button ref={mobileButtonRef} type="button" className="header-icon lg:hidden" aria-label={openPanel === 'mobile' ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={openPanel === 'mobile'} aria-controls={mobilePanelId} onClick={() => togglePanel('mobile')}>
              {openPanel === 'mobile' ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
            </button>
          </div>
        </div>
          <nav id={mobilePanelId} ref={mobilePanelRef} hidden={openPanel !== 'mobile'} inert={openPanel !== 'mobile' || undefined} aria-hidden={openPanel !== 'mobile' || undefined} aria-label="Navegación móvil" className="ds-presence ds-panel header-mobile-panel lg:hidden border-t border-border max-h-[calc(100dvh-8rem)] overflow-y-auto">
            <Link to="/catalog" className="header-link w-full" aria-current={location.pathname === '/catalog' && !currentCategory ? 'page' : undefined} onClick={closePanel}>Catálogo</Link>
            {categories.length > 0 && (
              <div className="border-y border-border py-3 my-2">
                <p className="px-3 mb-2 text-xs font-medium text-text-secondary">Categorías</p>
                {categories.map(category => (
                  <Link key={category.id} to={categoryPath(category.id)} className="header-link w-full justify-between gap-4" aria-current={currentCategory === category.id ? 'page' : undefined} onClick={closePanel}>
                    <span className="min-w-0 break-words">{category.name}</span><ArrowRight aria-hidden="true" size={16} className="shrink-0 text-text-secondary" />
                  </Link>
                ))}
              </div>
            )}
            <Link to="/support" className="header-link w-full" aria-current={location.pathname === '/support' ? 'page' : undefined} onClick={closePanel}>Soporte</Link>
            <Link to={accountPath} className="header-link w-full gap-2" onClick={closePanel}><User aria-hidden="true" size={18} />{accountLabel}</Link>
          </nav>
      </div>
    </header>
  );
};

export default Navbar;
