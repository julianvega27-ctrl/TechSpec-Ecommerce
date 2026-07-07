import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import AdminDashboard from '../../src/pages/Admin/Dashboard';
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

describe('Admin Panel Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    server.resetHandlers();
  });

  const renderAdminDashboard = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('redirects to home if user is not admin', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', role: 'CLIENT' }));

    renderAdminDashboard();

    // Since it's a client, it should redirect or show unauthorized
    // If the component uses an effect to redirect:
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('loads and displays dashboard stats for admin user', async () => {
    localStorage.setItem('token', 'admin-token');
    localStorage.setItem('user', JSON.stringify({ id: '2', name: 'Admin', role: 'ADMIN' }));

    server.use(
      http.get('http://localhost:3000/api/admin/dashboard', () => {
        return HttpResponse.json({
          data: {
            todaysSales: 1500.5,
            pendingOrders: 5,
            activeUsers: 120,
            lowStockProducts: 3,
            recentOrders: []
          }
        });
      })
    );

    renderAdminDashboard();

    // Dashboard should load these stats
    expect(await screen.findByText(/\$1,500.50/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // pendingOrders
    expect(screen.getByText('120')).toBeInTheDocument(); // activeUsers
    expect(screen.getByText('3')).toBeInTheDocument(); // lowStockProducts
  });

  it('handles API errors gracefully', async () => {
    localStorage.setItem('token', 'admin-token');
    localStorage.setItem('user', JSON.stringify({ id: '2', name: 'Admin', role: 'ADMIN' }));

    server.use(
      http.get('http://localhost:3000/api/admin/dashboard', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderAdminDashboard();

    await waitFor(() => {
      // It should display an error message
      expect(screen.getByText(/Error loading dashboard stats/i)).toBeInTheDocument();
    });
  });
});
