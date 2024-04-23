import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from '../../../src/components/nav/Header';
import * as AuthContext from '../../../src/pages/auth/AuthContext'; 

// Mocking the necessary hooks and modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain the original functionalities
  useNavigate: () => jest.fn().mockImplementation(() => jest.fn()), // Mock navigate function
}));

describe('Header Component', () => {
  const mockLogout = jest.fn();

  const mockUseAuth = jest.spyOn(AuthContext, 'useAuth');

  beforeEach(() => {
    mockLogout.mockClear();
    mockUseAuth.mockImplementation(() => ({ user: null, logout: mockLogout }));
  });

  it('should render login and register options when not logged in', () => {
    const { getByText } = render(
      <Router>
        <Header />
      </Router>
    );
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('Register')).toBeInTheDocument();
  });

  it('should render profile and logout options when logged in', () => {
    mockUseAuth.mockImplementation(() => ({ user: { username: 'johndoe' }, logout: mockLogout }));

    const { getByText } = render(
      <Router>
        <Header />
      </Router>
    );
    expect(getByText('Profile')).toBeInTheDocument();
    expect(getByText('Logout')).toBeInTheDocument();
  });

  it('should handle logout click', () => {
    mockUseAuth.mockImplementation(() => ({ user: { username: 'johndoe' }, logout: mockLogout }));

    const { getByText } = render(
      <Router>
        <Header />
      </Router>
    );
    fireEvent.click(getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('should change selected menu item on click', () => {
    const { getByText, container } = render(
      <Router>
        <Header />
      </Router>
    );
    const homeLink = getByText('Home');
    fireEvent.click(homeLink);
    expect(container.querySelector('.ant-menu-item-selected')).toContainHTML('Home');
  });
});