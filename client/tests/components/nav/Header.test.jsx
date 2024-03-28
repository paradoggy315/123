import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../../src/components/nav/Header';
import { MemoryRouter } from 'react-router-dom';

// Mock the useAuth hook to provide a user object
jest.mock('../../../src/pages/auth/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User' },
    logout: jest.fn(),
  }),
}));

describe('Header Component', () => {
  test('renders logout link when user is logged in', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  // Add more tests...
});
