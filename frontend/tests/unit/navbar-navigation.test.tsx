import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../src/components/Navbar';
import Catalog from '../../src/pages/Catalog';
import * as AuthContext from '../../src/context/AuthContext';

vi.mock('axios');

const categories = [{ id: 'laptops', name: 'Laptops' }, { id: 'parts', name: 'Componentes' }];
const Location = () => {
  const location = useLocation();
  return <output aria-label="Ruta actual">{location.pathname}{location.search}</output>;
};
const renderHeader = (path = '/', catalog = false) => render(
  <MemoryRouter initialEntries={[path]}>
    <Navbar />
    <Location />
    {catalog && <Routes><Route path="/catalog" element={<Catalog />} /></Routes>}
  </MemoryRouter>
);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
    user: null, token: null, isLoading: false, login: vi.fn(), logout: vi.fn()
  });
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn()
  })));
  vi.mocked(axios.get).mockImplementation(async (url) => {
    if (url === '/categories') return { data: { data: categories } };
    if (url === '/cart') return { data: { data: [{ quantity: 2 }, { quantity: 1 }] } };
    return { data: { data: { products: [], totalPages: 3, total: 0 } } };
  });
});

describe('Header navigation', () => {
  it('submits the existing product search with encoded text and keeps the selected category', async () => {
    renderHeader('/catalog?category=laptops&page=3');
    const search = screen.getByRole('search', { name: 'Buscar productos' });
    fireEvent.change(within(search).getByRole('searchbox'), { target: { value: '  SSD & RAM  ' } });
    fireEvent.submit(search);
    await waitFor(() => {
      const url = new URL(screen.getByLabelText('Ruta actual').textContent || '', 'http://localhost');
      expect(url.pathname).toBe('/catalog');
      expect(url.searchParams.get('search')).toBe('SSD & RAM');
      expect(url.searchParams.get('category')).toBe('laptops');
      expect(url.searchParams.has('page')).toBe(false);
    });
  });

  it('feeds header search into the real catalog request and supports category navigation on the same route', async () => {
    renderHeader('/catalog', true);
    const search = screen.getByRole('search', { name: 'Buscar productos' });
    fireEvent.change(within(search).getByRole('searchbox'), { target: { value: 'SSD & RAM' } });
    fireEvent.submit(search);
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/products?page=1&limit=12&search=SSD%20%26%20RAM'));
    const navigation = within(screen.getByRole('navigation', { name: 'Navegación principal' }));
    fireEvent.click(await navigation.findByRole('button', { name: 'Categorías' }));
    fireEvent.click(screen.getByRole('link', { name: 'Laptops' }));
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/products?page=1&limit=12&category=laptops'));
    expect(navigation.getByRole('button', { name: 'Categorías' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens categories from the keyboard, focuses a real link and restores focus on Escape', async () => {
    renderHeader();
    const button = await screen.findByRole('button', { name: 'Categorías' });
    fireEvent.keyDown(button, { key: 'ArrowDown' });
    const laptop = screen.getByRole('link', { name: 'Laptops' });
    expect(laptop).toHaveFocus();
    expect(laptop).toHaveAttribute('href', '/catalog?category=laptops');
    fireEvent.keyDown(laptop, { key: 'Escape' });
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Laptops' })).not.toBeInTheDocument();
  });

  it('closes the mobile menu on navigation and on an outside pointer interaction', async () => {
    renderHeader();
    await screen.findByRole('button', { name: 'Categorías' });
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    const menu = screen.getByRole('navigation', { name: 'Navegación móvil' });
    expect(within(menu).getByRole('link', { name: 'Catálogo' })).toHaveFocus();
    fireEvent.click(within(menu).getByRole('link', { name: 'Componentes' }));
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/catalog?category=parts');
    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    fireEvent.pointerDown(document.body);
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('refreshes cart quantity on cartUpdated and resets it after logout', async () => {
    const auth = vi.spyOn(AuthContext, 'useAuth');
    auth.mockReturnValue({ user: { id: '1', name: 'Cliente', email: 'test@example.com', role: 'CLIENT' }, token: 'test', isLoading: false, login: vi.fn(), logout: vi.fn() });
    const view = renderHeader();
    expect(await screen.findByRole('link', { name: 'Carrito, 3 productos' })).toHaveAttribute('href', '/cart');
    vi.mocked(axios.get).mockImplementation(async (url) => url === '/cart' ? { data: [{ quantity: 12 }] } : { data: categories });
    fireEvent(window, new Event('cartUpdated'));
    await screen.findByRole('link', { name: 'Carrito, 12 productos' });
    auth.mockReturnValue({ user: null, token: null, isLoading: false, login: vi.fn(), logout: vi.fn() });
    view.rerender(<MemoryRouter><Navbar /><Location /></MemoryRouter>);
    await screen.findByRole('link', { name: 'Carrito, 0 productos' });
    expect(screen.getByRole('link', { name: 'Ingresar' })).toHaveAttribute('href', '/login');
  });

  it('keeps catalog, search and account navigation usable if category loading fails', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Categories unavailable'));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderHeader();
    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: 'Categorías' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('href', '/catalog');
    expect(screen.getByRole('search')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
