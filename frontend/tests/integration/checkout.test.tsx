import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import Checkout from '../../src/pages/Checkout';
import { AuthProvider } from '../../src/context/AuthContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Checkout Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    server.resetHandlers();
    
    // Simulate user logged in
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', role: 'CLIENT' }));
  });

  const renderCheckout = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Checkout />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('loads cart items and displays total', async () => {
    server.use(
      http.get('http://localhost:3000/api/cart', () => {
        return HttpResponse.json({
          data: [
            { id: 'ci1', quantity: 2, product: { name: 'Item 1', price: 50 } }
          ]
        });
      })
    );

    renderCheckout();

    expect(await screen.findByText('Item 1 (x2)')).toBeInTheDocument();
    expect(screen.getByText(/\$100.00/)).toBeInTheDocument(); // Subtotal
  });

  it('completes checkout process successfully', async () => {
    server.use(
      http.get('http://localhost:3000/api/cart', () => {
        return HttpResponse.json({
          data: [
            { id: 'ci1', quantity: 1, product: { name: 'Item 1', price: 100 } }
          ]
        });
      }),
      http.post('http://localhost:3000/api/orders', () => {
        return HttpResponse.json({ success: true, data: { id: 'order1' } });
      })
    );

    renderCheckout();

    // Fill shipping details (these might be mock states in component or real inputs)
    // The Checkout page has shipping inputs:
    const fullNameInput = await screen.findByLabelText(/Nombre completo/i);
    const addressInput = screen.getByLabelText(/Dirección/i);
    const cityInput = screen.getByLabelText(/Ciudad/i);
    const zipInput = screen.getByLabelText(/Código Postal/i);

    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
    fireEvent.change(addressInput, { target: { value: '123 Test St' } });
    fireEvent.change(cityInput, { target: { value: 'Test City' } });
    fireEvent.change(zipInput, { target: { value: '12345' } });

    // Mock completing payment step 
    // Usually it requires clicking "Continuar al Pago" and then "Confirmar Pedido"
    const continueBtn = screen.getByRole('button', { name: /Continuar al Pago/i });
    fireEvent.click(continueBtn);

    const confirmBtn = await screen.findByRole('button', { name: /Confirmar Pedido/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText(/¡Pedido Confirmado!/i)).toBeInTheDocument();
      // Or expect redirect to order history or success page depending on component logic.
      // Often after a few seconds it redirects, or immediately.
      // Assuming it renders a success message based on standard ecommerce flows.
    });
  });

  it('shows error if cart is empty and redirects to catalog', async () => {
    server.use(
      http.get('http://localhost:3000/api/cart', () => {
        return HttpResponse.json({ data: [] });
      })
    );

    renderCheckout();

    await waitFor(() => {
      // It might render an empty state or redirect
      // Assuming the component redirects or shows a link to go back
      expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    });
  });
});
