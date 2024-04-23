import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../src/pages/auth/AuthContext';

// Helper to mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Helper component to use the context
const ConsumerComponent = () => {
  const { token, user, login, logout } = useAuth();

  return (
    <>
      <div data-testid="token">{token}</div>
      <div data-testid="username">{user && user.username}</div>
      <button onClick={() => login({ token: '12345', username: 'johndoe', role: 'admin', user_id: '1' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  it('should set initial auth state from localStorage', () => {
    localStorage.setItem('token', '12345');
    const { getByTestId } = render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );
    expect(getByTestId('token').textContent).toBe('12345');
  });

  it('should handle login and update localStorage', () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );
    act(() => {
      getByText('Login').click();
    });
    expect(getByTestId('token').textContent).toBe('12345');
    expect(getByTestId('username').textContent).toBe('johndoe');
    expect(localStorage.getItem('token')).toBe('12345');
  });

  it('should handle logout and update localStorage', () => {
    localStorage.setItem('token', '12345');
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );
    act(() => {
      getByText('Logout').click();
    });
    expect(getByTestId('token').textContent).toBe('');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
