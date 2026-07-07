import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import Catalog from '../../src/pages/Catalog';
import Cart from '../../src/pages/Cart';
import { AuthProvider } from '../../src/context/AuthContext';
import Navbar from '../../src/components/Navbar';

describe('Catalog & Cart Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    server.resetHandlers();
    // Simulate user logged in for Cart tests
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', role: 'CLIENT' }));
  });

  const renderCatalogWithProviders = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Catalog />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  const renderCartWithProviders = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Cart />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  describe('Catalog Flow', () => {
    it('displays products and categories, and allows adding to cart', async () => {
      let cartItems = 0;
      server.use(
        http.get('http://localhost:3000/api/categories', () => {
          return HttpResponse.json({
            data: [{ id: 'c1', name: 'Laptops' }]
          });
        }),
        http.get('http://localhost:3000/api/products', () => {
          return HttpResponse.json({
            data: {
              products: [
                { id: 'p1', name: 'Gaming Laptop', price: 1500, categoryId: 'c1', stock: 10, category: { name: 'Laptops' } }
              ],
              total: 1,
              totalPages: 1
            }
          });
        }),
        http.get('http://localhost:3000/api/cart', () => {
          return HttpResponse.json({ data: [] }); // Initially empty
        }),
        http.post('http://localhost:3000/api/cart', () => {
          cartItems += 1;
          return HttpResponse.json({
            success: true,
            data: { id: 'ci1', productId: 'p1', quantity: 1 }
          });
        })
      );

      renderCatalogWithProviders();

      // Wait for products and categories to load
      expect(await screen.findByText('Gaming Laptop')).toBeInTheDocument();
      expect(await screen.findByText('Laptops')).toBeInTheDocument();

      // Find "Agregar al carrito" button
      const addToCartBtn = await screen.findByRole('button', { name: /Agregar/i });
      fireEvent.click(addToCartBtn);

      await waitFor(() => {
        expect(cartItems).toBe(1);
      });
    });
  });

  describe('Cart Flow', () => {
    it('displays cart items, updates quantity, and removes items', async () => {
      let cart = [
        { id: 'ci1', productId: 'p1', quantity: 1, product: { id: 'p1', name: 'Gaming Laptop', price: 1500, stock: 10 } }
      ];

      server.use(
        http.get('http://localhost:3000/api/cart', () => {
          return HttpResponse.json({ data: cart });
        }),
        http.put('http://localhost:3000/api/cart/:id', async ({ params, request }) => {
          const body = await request.json() as { quantity: number };
          cart[0].quantity = body.quantity;
          return HttpResponse.json({ success: true, data: cart[0] });
        }),
        http.delete('http://localhost:3000/api/cart/:id', () => {
          cart = [];
          return HttpResponse.json({ success: true });
        })
      );

      renderCartWithProviders();

      expect(await screen.findByText('Gaming Laptop')).toBeInTheDocument();
      expect(screen.getByText(/\$1,500.00/)).toBeInTheDocument();

      // Update quantity
      const incrementBtn = screen.getByRole('button', { name: '+' });
      fireEvent.click(incrementBtn);

      await waitFor(() => {
        expect(cart[0].quantity).toBe(2);
      });

      // Remove item
      const removeBtn = screen.getByRole('button', { name: /Eliminar/i });
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(cart.length).toBe(0);
        expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
      });
    });
  });
});
