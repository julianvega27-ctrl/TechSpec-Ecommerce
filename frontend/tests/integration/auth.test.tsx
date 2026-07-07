import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import Login from '../../src/pages/Login';
import Register from '../../src/pages/Register';
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

describe('Auth Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    server.resetHandlers();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  describe('Login Flow', () => {
    it('successfully logs in and redirects', async () => {
      server.use(
        http.post('http://localhost:3000/api/auth/login', () => {
          return HttpResponse.json({
            success: true,
            data: {
              token: 'fake-token',
              user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'CLIENT' }
            }
          });
        })
      );

      renderWithProviders(<Login />);

      fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
      
      fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('fake-token');
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('shows error on invalid credentials', async () => {
      server.use(
        http.post('http://localhost:3000/api/auth/login', () => {
          return new HttpResponse(JSON.stringify({ success: false, message: 'Invalid credentials' }), { status: 401 });
        })
      );

      renderWithProviders(<Login />);

      fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'wrong@example.com' } });
      fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrongpass' } });
      
      fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Register Flow', () => {
    it('successfully registers and redirects', async () => {
      server.use(
        http.post('http://localhost:3000/api/auth/register', () => {
          return HttpResponse.json({
            success: true,
            data: {
              token: 'fake-register-token',
              user: { id: '2', name: 'New User', email: 'new@example.com', role: 'CLIENT' }
            }
          });
        })
      );

      renderWithProviders(<Register />);

      fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: 'New User' } });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'new@example.com' } });
      fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByLabelText(/Acepto los términos y condiciones/i));
      
      fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('fake-register-token');
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('shows error if passwords do not match', async () => {
      renderWithProviders(<Register />);

      fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: 'New User' } });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'new@example.com' } });
      fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password321' } }); // Mismatch
      fireEvent.click(screen.getByLabelText(/Acepto los términos y condiciones/i));
      
      fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      });
    });
  });
});
