import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductDetail from '../../src/pages/ProductDetail';
import Cart from '../../src/pages/Cart';
import Login from '../../src/pages/Login';
import Register from '../../src/pages/Register';
import Profile from '../../src/pages/Profile';
import * as AuthContext from '../../src/context/AuthContext';
vi.mock('axios');
vi.mock('@react-oauth/google', () => ({ GoogleLogin: ({ onSuccess }: { onSuccess: (response: { credential: string }) => void }) => <button type="button" onClick={() => onSuccess({ credential: 'test-credential' })}>Google de prueba</button> }));
const auth = { user: { id: 'u1', name: 'Cliente', email: 'test@example.com', role: 'CLIENT' }, token: 'test', isLoading: false, login: vi.fn(), logout: vi.fn() };
const product = { id: 'p1', name: 'Laptop de prueba', brand: 'Marca', price: '1299.90', stock: 5, imageUrl: '/first.jpg', images: [{ url: '/second.jpg' }], specifications: [{ label: 'Dato recibido', value: 'Valor recibido' }] };
function Location() { const location = useLocation(); return <output aria-label="Ruta actual">{location.pathname}</output>; }
function renderProduct() { return render(<MemoryRouter initialEntries={['/product/p1']}><Routes><Route path="/product/:id" element={<ProductDetail />} /></Routes><Location /></MemoryRouter>); }
beforeEach(() => { vi.clearAllMocks(); vi.spyOn(AuthContext, 'useAuth').mockReturnValue(auth); vi.mocked(axios.get).mockResolvedValue({ data: { data: product } }); vi.mocked(axios.post).mockResolvedValue({ data: {} }); });
describe('Product detail redesign', () => {
  it('keeps the real gallery, specs, quantity payload and cart navigation with a pending state', async () => {
    let finish: (value: { data: object }) => void = () => {};
    vi.mocked(axios.post).mockReturnValue(new Promise(resolve => { finish = resolve; }));
    const updated = vi.fn(); window.addEventListener('cartUpdated', updated);
    renderProduct();
    await screen.findByRole('heading', { name: product.name });
    expect(axios.get).toHaveBeenCalledWith('/products/p1');
    expect(screen.getByText('$1,299.90')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: `Ver imagen 2 de ${product.name}` }));
    expect(screen.getByRole('img', { name: product.name })).toHaveAttribute('src', '/second.jpg');
    expect(screen.getByText('Valor recibido')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));
    expect(screen.getByRole('button', { name: 'Agregando…' })).toBeDisabled();
    expect(axios.post).toHaveBeenCalledWith('/cart', { productId: 'p1', quantity: 3 });
    await act(async () => finish({ data: {} }));
    await waitFor(() => expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/cart'));
    expect(updated).toHaveBeenCalledOnce(); window.removeEventListener('cartUpdated', updated);
  });
  it('preserves guest login and disables purchasing only for reported zero stock', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ ...auth, user: null, token: null });
    const view = renderProduct();
    fireEvent.click(await screen.findByRole('button', { name: 'Añadir al carrito' }));
    await waitFor(() => expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/login'));
    expect(axios.post).not.toHaveBeenCalled(); view.unmount();
    vi.mocked(axios.get).mockResolvedValue({ data: { ...product, stock: 0 } }); renderProduct();
    expect(await screen.findByRole('button', { name: 'Sin stock' })).toBeDisabled();
  });
  it('shows purchase failures inline and preserves the quantity for retry', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(axios.post).mockRejectedValueOnce(new Error('Temporary failure'));
    renderProduct(); fireEvent.click(await screen.findByRole('button', { name: 'Añadir al carrito' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Hubo un error al agregar');
    expect(screen.getByLabelText('Cantidad')).toHaveValue(1);
    expect(screen.getByRole('button', { name: 'Añadir al carrito' })).toBeEnabled();
    vi.mocked(console.error).mockRestore();
  });
});

describe('Cart redesign', () => {
  const cart = [{ id: 'item-1', quantity: 2, product }];
  const renderCart = () => render(<MemoryRouter initialEntries={['/cart']}><Cart /><Location /></MemoryRouter>);
  it('keeps subtotal, the existing 18% tax, checkout and successful quantity/removal requests', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { data: cart } });
    vi.mocked(axios.put).mockResolvedValue({ data: {} });
    vi.mocked(axios.delete).mockResolvedValue({ data: {} });
    await act(async () => { renderCart(); });
    await screen.findByRole('heading', { name: product.name });
    expect(screen.getAllByText('$2,599.80')).toHaveLength(2);
    expect(screen.getByText('$467.96')).toBeInTheDocument();
    expect(screen.getByText('$3,067.76')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Proceder al pago' })).toHaveAttribute('href', '/checkout');
    fireEvent.change(screen.getByLabelText(`Cantidad de ${product.name}`), { target: { value: '3' } });
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith('/cart/item-1', { quantity: 3 }));
    await waitFor(() => expect(screen.getByLabelText(`Cantidad de ${product.name}`)).toHaveValue(3));
    fireEvent.click(screen.getByRole('button', { name: `Eliminar ${product.name}` }));
    await screen.findByText('Tu carrito está vacío');
    expect(axios.delete).toHaveBeenCalledWith('/cart/item-1');
  });
  it('blocks pending controls and retains the item and totals after an update fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(axios.get).mockResolvedValue({ data: cart });
    let fail: (reason: Error) => void = () => {};
    vi.mocked(axios.put).mockReturnValue(new Promise((_resolve, reject) => { fail = reject; }));
    await act(async () => { renderCart(); });
    const input = await screen.findByLabelText(`Cantidad de ${product.name}`);
    fireEvent.change(input, { target: { value: '4' } });
    expect(input).toBeDisabled();
    expect(screen.getByRole('button', { name: `Eliminar ${product.name}` })).toBeDisabled();
    await act(async () => fail(new Error('Temporary failure')));
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo actualizar');
    expect(input).toHaveValue(2); expect(input).toBeEnabled();
    vi.mocked(console.error).mockRestore();
  });
});

describe('Login redesign', () => {
  const renderLogin = () => render(<MemoryRouter><Login /><Location /></MemoryRouter>);
  it('retains existing validation and sends credentials through the same authentication operation', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByText('El correo electrónico es requerido')).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secret123' } });
    vi.mocked(axios.post).mockResolvedValue({ data: { data: { token: 'test', user: auth.user } } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await waitFor(() => expect(auth.login).toHaveBeenCalledWith('test', auth.user));
    expect(axios.post).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'secret123' });
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/profile');
  });
  it('preserves Google authentication and recovery/registration links', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { data: { token: 'test', user: auth.user } } });
    renderLogin();
    expect(screen.getByRole('link', { name: /Olvidaste/ })).toHaveAttribute('href', '/forgot-password');
    expect(screen.getByRole('link', { name: 'crea una cuenta' })).toHaveAttribute('href', '/register');
    fireEvent.click(screen.getByRole('button', { name: 'Google de prueba' }));
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/auth/google', { idToken: 'test-credential' }));
    await waitFor(() => expect(auth.login).toHaveBeenCalled());
  });
});

describe('Registration redesign', () => {
  it('keeps password matching validation and the complete registration payload', async () => {
    render(<MemoryRouter><Register /><Location /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Cliente' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secret123' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'secret123' } });
    vi.mocked(axios.post).mockResolvedValue({ data: { data: { token: 'test', user: auth.user } } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await waitFor(() => expect(auth.login).toHaveBeenCalledWith('test', auth.user));
    expect(axios.post).toHaveBeenCalledWith('/auth/register', { name: 'Cliente', email: 'test@example.com', password: 'secret123', confirmPassword: 'secret123' });
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/profile');
  });
  it('reports authentication failures and leaves the form available for retry', async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error('Temporary failure'));
    render(<MemoryRouter><Register /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Google de prueba' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Error al registrarse con Google');
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveAttribute('href', '/login');
  });
});

describe('Profile redesign', () => {
  const renderProfile = () => render(<MemoryRouter initialEntries={['/profile']}><Profile /><Location /></MemoryRouter>);
  it('preserves editing, the profile payload, disabled email and cancellation after a successful save', async () => {
    let finish: (value: { data: object }) => void = () => {};
    vi.mocked(axios.put).mockReturnValue(new Promise(resolve => { finish = resolve; }));
    renderProfile(); fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByLabelText('Correo electrónico')).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Nuevo nombre' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(screen.getByRole('button', { name: 'Guardando…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(axios.put).toHaveBeenCalledWith('/users/profile', { name: 'Nuevo nombre' });
    await act(async () => finish({ data: {} }));
    expect(await screen.findByText('Perfil actualizado correctamente')).toBeInTheDocument();
    expect(screen.getByText('Nuevo nombre')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Cambio cancelado' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByText('Nuevo nombre')).toBeInTheDocument();
  });
  it('retains the draft on failure and keeps admin navigation and logout', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ ...auth, user: { ...auth.user, role: 'ADMIN' } });
    vi.mocked(axios.put).mockRejectedValue(new Error('Temporary failure'));
    renderProfile();
    expect(screen.getByRole('link', { name: 'Gestión de productos' })).toHaveAttribute('href', '/admin/products');
    expect(screen.getByRole('link', { name: 'Contraseña' })).toHaveAttribute('href', '/security');
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Borrador' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Error al actualizar el perfil');
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Borrador');
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(auth.logout).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/');
    vi.mocked(console.error).mockRestore();
  });
  it('keeps the redirect for unauthenticated users', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ ...auth, user: null, token: null });
    renderProfile();
    await waitFor(() => expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/login'));
  });
  it('keeps home navigation when logout clears authentication', async () => {
    const view = renderProfile();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ ...auth, user: null, token: null });
    view.rerender(<MemoryRouter initialEntries={['/profile']}><Profile /><Location /></MemoryRouter>);
    await waitFor(() => expect(screen.getByLabelText('Ruta actual').textContent).toBe('/'));
  });
});
