import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';
import * as AuthContext from '../../src/context/AuthContext';
import axios from 'axios';

vi.mock('axios');

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders logo and catalog link', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null } as any);
    renderNavbar();

    expect(screen.getByText(/TECH/i)).toBeInTheDocument();
    expect(screen.getByText(/SPEC/i)).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
  });

  it('shows "Ingresar" when user is not logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null } as any);
    renderNavbar();

    expect(screen.getByText('Ingresar')).toBeInTheDocument();
  });

  it('shows "Mi perfil" when user is logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { id: '1', name: 'User' } } as any);
    vi.mocked(axios.get).mockResolvedValue({ data: [] });
    renderNavbar();

    expect(screen.getByText('Mi perfil')).toBeInTheDocument();
  });

  it('fetches and displays cart item count for logged-in users', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { id: '1', name: 'User' } } as any);
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
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null } as any);
    
    renderNavbar();

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(axios.get).not.toHaveBeenCalled();
  });
});
