import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import axios from 'axios';

const TestComponent = () => {
  const { user, token, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-id">{user?.id || 'none'}</div>
      <div data-testid="token">{token || 'none'}</div>
      <button onClick={() => login('test-token', { id: '1', name: 'Test', email: 't@t.com', role: 'CLIENT' })}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides default values and no user initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-id').textContent).toBe('none');
    expect(screen.getByTestId('token').textContent).toBe('none');
  });

  it('loads user and token from localStorage on mount', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify({ id: '2', name: 'Stored', email: 's@s.com', role: 'CLIENT' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-id').textContent).toBe('2');
    expect(screen.getByTestId('token').textContent).toBe('stored-token');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer stored-token');
  });

  it('updates state and localStorage on login', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('user-id').textContent).toBe('1');
    expect(screen.getByTestId('token').textContent).toBe('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('user')).toContain('"id":"1"');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
  });

  it('clears state and localStorage on logout', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify({ id: '2', name: 'Stored', email: 's@s.com', role: 'CLIENT' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('user-id').textContent).toBe('none');
    expect(screen.getByTestId('token').textContent).toBe('none');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  });
});
