import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';
import * as AuthContext from '../../src/context/AuthContext';
import axios from 'axios';

vi.mock('axios');
const authMock = (user: ReturnType<typeof AuthContext.useAuth>['user']) => ({ user, token: user ? 'test-token' : null, isLoading: false, login: vi.fn(), logout: vi.fn() });

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.get).mockResolvedValue({ data: [] });
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders logo and catalog link', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(authMock(null));
    renderNavbar();

    expect(screen.getByText(/TECH/i)).toBeInTheDocument();
    expect(screen.getByText(/SPEC/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Catálogo' })).toBeInTheDocument();
  });

  it('shows "Ingresar" when user is not logged in', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(authMock(null));
    renderNavbar();

    expect(await screen.findByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('shows "Mi perfil" when user is logged in', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(authMock({ id: '1', name: 'User', email: 'test@example.com', role: 'CLIENT' }));
    vi.mocked(axios.get).mockResolvedValue({ data: [] });
    renderNavbar();

    expect(await screen.findByRole('link', { name: 'Mi perfil' })).toBeInTheDocument();
  });

  it('fetches and displays cart item count for logged-in users', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(authMock({ id: '1', name: 'User', email: 'test@example.com', role: 'CLIENT' }));
    vi.mocked(axios.get).mockResolvedValue({
      data: [{ quantity: 2 }, { quantity: 3 }]
    });

    renderNavbar();

    await waitFor(() => {
      // The sum is 2 + 3 = 5
      expect(screen.getByText('5')).toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledWith('/cart');
  });

  it('displays 0 items in cart for non-logged-in users without fetching', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(authMock(null));
    
    renderNavbar();

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(axios.get).not.toHaveBeenCalledWith('/cart');
  });
});
