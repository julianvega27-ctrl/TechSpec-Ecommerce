import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import Checkout from '../../src/pages/Checkout';
import { AuthProvider } from '../../src/context/AuthContext';
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({ ...await vi.importActual<typeof import('react-router-dom')>('react-router-dom'), useNavigate: () => mockNavigate }));
const cart = [{ id: 'ci1', quantity: 2, product: { name: 'Item 1', price: 50 } }];
const renderCheckout = () => render(<BrowserRouter><AuthProvider><Checkout /></AuthProvider></BrowserRouter>);
describe('Checkout Integration', () => {
  beforeEach(() => {
    localStorage.clear(); mockNavigate.mockClear();
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', role: 'CLIENT' }));
    server.use(http.get('http://localhost:3000/api/cart', () => HttpResponse.json({ data: cart })));
  });
  it('loads quantities, subtotal, tax and total from the cart', async () => {
    renderCheckout();
    expect(await screen.findByText('2x Item 1')).toBeInTheDocument();
    expect(screen.getAllByText('$100.00')).toHaveLength(2);
    expect(screen.getByText('$18.00')).toBeInTheDocument();
    expect(screen.getByText('$118.00')).toBeInTheDocument();
  });
  it('submits the existing checkout endpoint and redirects to orders', async () => {
    const submitted = vi.fn();
    server.use(http.post('http://localhost:3000/api/orders/checkout', () => { submitted(); return HttpResponse.json({ data: { id: 'order1' } }); }));
    renderCheckout(); await screen.findByText('2x Item 1');
    const fields: [RegExp, string][] = [[/DIRECCIÓN COMPLETA/i, '123 Test St'], [/^CIUDAD$/i, 'Test City'], [/ESTADO\/PROVINCIA/i, 'Lima'], [/CÓDIGO POSTAL/i, '12345'], [/NÚMERO DE TARJETA/i, '4111111111111111'], [/EXPIRACIÓN/i, '12/28'], [/^CVC$/i, '123']];
    for (const [label, value] of fields) fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pago/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/orders'));
    expect(submitted).toHaveBeenCalledOnce();
  });
  it('redirects an empty cart to the existing cart page', async () => {
    server.use(http.get('http://localhost:3000/api/cart', () => HttpResponse.json({ data: [] })));
    renderCheckout();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/cart'));
  });
});
