import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import Dashboard from '../../src/pages/Admin/Dashboard';
import AdminLayout from '../../src/pages/Admin/AdminLayout';
import { AuthProvider } from '../../src/context/AuthContext';
const renderDashboard = () => render(<MemoryRouter initialEntries={['/admin/dashboard']}><AuthProvider><Routes><Route path="/" element={<h1>Tienda pública</h1>} /><Route path="/admin" element={<AdminLayout />}><Route path="dashboard" element={<Dashboard />} /></Route></Routes></AuthProvider></MemoryRouter>);
describe('Admin Panel Integration', () => {
  beforeEach(() => {
    localStorage.clear(); localStorage.setItem('token', 'admin-token');
    localStorage.setItem('user', JSON.stringify({ id: '2', name: 'Admin', role: 'ADMIN' }));
  });
  it('protects the actual admin layout from client users', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', role: 'CLIENT' }));
    renderDashboard();
    expect(await screen.findByRole('heading', { name: 'Tienda pública' })).toBeInTheDocument();
  });
  it('displays returned dashboard statistics', async () => {
    server.use(http.get('http://localhost:3000/api/admin/dashboard', () => HttpResponse.json({ data: { todaysSales: 1500.5, pendingOrders: 5, activeUsers: 120, lowStockProducts: 3, recentOrders: [] } })));
    renderDashboard();
    expect(await screen.findByText('$1,500.50')).toBeInTheDocument();
    for (const count of ['5', '120', '3']) expect(screen.getByText(count)).toBeInTheDocument();
  });
  it('presents the existing error state when loading fails', async () => {
    server.use(http.get('http://localhost:3000/api/admin/dashboard', () => new HttpResponse(null, { status: 500 })));
    renderDashboard();
    expect(await screen.findByRole('alert')).toHaveTextContent('Error al cargar datos.');
  });
});
