import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute'; 
import { useAuth } from '../../src/pages/auth/AuthContext';  
import '@testing-library/jest-dom';


jest.mock('../../src/pages/auth/AuthContext');

const setup = (user, requiredRole, children) => {
  useAuth.mockImplementation(() => ({ user }));
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/protected" element={<ProtectedRoute requiredRole={requiredRole}>{children}</ProtectedRoute>} />
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/" element={<h1>Home Page</h1>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  it('redirects to login page if user is not logged in', () => {
    setup(null, 'admin', <h1>Protected Content</h1>);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  it('redirects to home page if user does not have the required role', () => {
    setup({ role: 'user' }, 'admin', <h1>Protected Content</h1>);
    expect(screen.getByText(/home page/i)).toBeInTheDocument();
  });

  it('renders children if user has the required role', () => {
    setup({ role: 'admin' }, 'admin', <h1>Protected Content</h1>);
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });
});
