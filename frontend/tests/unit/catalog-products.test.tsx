import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import axios from 'axios';
import Catalog from '../../src/pages/Catalog';
import ProductCard from '../../src/components/ui/ProductCard';
import * as AuthContext from '../../src/context/AuthContext';

vi.mock('axios');

const product = {
  id: 'p1', name: 'Laptop de prueba', brand: 'Marca de prueba',
  price: '1299.90', imageUrl: '/product.jpg', stock: 5,
  description: 'Descripción recibida del producto', category: { name: 'Laptops' }
};
const auth = { user: { id: 'u1', name: 'Cliente', email: 'test@example.com', role: 'CLIENT' }, token: 'test', isLoading: false, login: vi.fn(), logout: vi.fn() };
const categories = [{ id: 'cat1', name: 'Laptops' }];
const payload = { products: [product], total: 27, totalPages: 3 };
const Location = () => {
  const location = useLocation();
  return <output aria-label="Ruta actual">{location.pathname}{location.search}</output>;
};
const renderCatalog = (path = '/catalog') => render(<MemoryRouter initialEntries={[path]}><Catalog /><Location /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(AuthContext, 'useAuth').mockReturnValue(auth);
  vi.mocked(axios.get).mockImplementation(async url => ({ data: { data: url === '/categories' ? categories : payload } }));
  vi.mocked(axios.post).mockResolvedValue({ data: {} });
});

describe('Product cards and catalog', () => {
  it('formats the received price and description without adding unavailable metadata', () => {
    render(<MemoryRouter><ProductCard {...product} /></MemoryRouter>);
    expect(screen.getByText('$1,299.90')).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver producto' })).toHaveAttribute('href', '/product/p1');
    expect(screen.queryByText(/descuento|valoración|disponible/i)).not.toBeInTheDocument();
  });

  it('shows unavailable images after a failed load and never substitutes a missing price with zero', () => {
    render(<MemoryRouter><ProductCard id="missing" name="Producto sin precio" imageUrl="/broken.jpg" /></MemoryRouter>);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('Imagen no disponible')).toBeInTheDocument();
    expect(screen.getByText('Precio no disponible')).toBeInTheDocument();
    expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
  });

  it('adds exactly one unit with the existing endpoint, prevents repeated pending clicks and notifies the counter', async () => {
    let complete: (value: { data: object }) => void = () => {};
    vi.mocked(axios.post).mockReturnValue(new Promise(resolve => { complete = resolve; }));
    const cartUpdated = vi.fn();
    window.addEventListener('cartUpdated', cartUpdated);
    renderCatalog();
    const button = await screen.findByRole('button', { name: `Añadir ${product.name} al carrito` });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(axios.post).toHaveBeenCalledOnce();
    expect(axios.post).toHaveBeenCalledWith('/cart', { productId: 'p1', quantity: 1 });
    await act(async () => complete({ data: {} }));
    expect(button).toHaveTextContent('Añadido');
    expect(screen.getByRole('link', { name: 'Ver carrito' })).toHaveAttribute('href', '/cart');
    expect(cartUpdated).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/catalog');
    window.removeEventListener('cartUpdated', cartUpdated);
  });

  it('keeps the existing login requirement and does not send an unauthenticated cart request', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ ...auth, user: null, token: null });
    renderCatalog();
    fireEvent.click(await screen.findByRole('button', { name: `Añadir ${product.name} al carrito` }));
    await waitFor(() => expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/login'));
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('shows a cart error and permits retrying without reporting success', async () => {
    vi.mocked(axios.post).mockRejectedValueOnce(new Error('Cart unavailable'));
    renderCatalog();
    const button = await screen.findByRole('button', { name: `Añadir ${product.name} al carrito` });
    fireEvent.click(button);
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo añadir');
    expect(screen.queryByRole('link', { name: 'Ver carrito' })).not.toBeInTheDocument();
    fireEvent.click(button);
    await screen.findByRole('link', { name: 'Ver carrito' });
    expect(axios.post).toHaveBeenCalledTimes(2);
  });

  it('uses only reported stock to disable purchase and keeps details available when stock is absent', () => {
    const add = vi.fn();
    const view = render(<MemoryRouter><ProductCard {...product} stock={0} onAddToCart={add} /></MemoryRouter>);
    expect(screen.getByRole('button', { name: `${product.name}: sin stock` })).toBeDisabled();
    view.rerender(<MemoryRouter><ProductCard {...product} stock={undefined} onAddToCart={add} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Ver producto' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('preserves category, search, price sorting and pagination query parameters', async () => {
    renderCatalog('/catalog?page=3');
    await screen.findByRole('link', { name: product.name });
    fireEvent.click(screen.getByLabelText('Laptops'));
    fireEvent.change(screen.getByLabelText('Buscar en el catálogo'), { target: { value: 'SSD & RAM' } });
    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'Menor a Mayor' } });
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/products?page=1&limit=12&category=cat1&search=SSD%20%26%20RAM&sort=price_asc'));
    await screen.findByRole('button', { name: 'Página siguiente' });
    fireEvent.click(screen.getByRole('button', { name: 'Página siguiente' }));
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/products?page=2&limit=12&category=cat1&search=SSD%20%26%20RAM&sort=price_asc'));
  });

  it('distinguishes a loading error from empty results and retries the same filter selection', async () => {
    let fail = true;
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(axios.get).mockImplementation(async url => {
      if (url === '/categories') return { data: categories };
      if (fail) throw new Error('Products unavailable');
      return { data: payload };
    });
    renderCatalog('/catalog?category=cat1&search=SSD');
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar el catálogo');
    expect(screen.queryByText('No encontramos productos')).not.toBeInTheDocument();
    fail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Volver a intentar' }));
    await screen.findByRole('link', { name: product.name });
    expect(axios.get).toHaveBeenLastCalledWith('/products?page=1&limit=12&category=cat1&search=SSD');
    vi.mocked(console.error).mockRestore();
  });

  it('clears the existing selection from the empty state and shows no invented products', async () => {
    vi.mocked(axios.get).mockImplementation(async url => ({ data: url === '/categories' ? categories : { products: [], total: 0, totalPages: 0 } }));
    renderCatalog('/catalog?search=missing&category=cat1');
    await screen.findByText('No encontramos productos');
    expect(screen.getByText('0 productos')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver todo el catálogo' }));
    await waitFor(() => expect(screen.getByLabelText('Ruta actual').textContent).toBe('/catalog'));
  });
});
