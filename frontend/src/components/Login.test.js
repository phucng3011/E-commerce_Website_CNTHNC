import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import Login from './Login';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const mockCartContext = {
  setUser: jest.fn(),
  setIsLoggingOut: jest.fn(),
};

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
    mockCartContext.setUser.mockClear();
    mockCartContext.setIsLoggingOut.mockClear();
  });

  const renderLogin = () => {
    return render(
      <CartContext.Provider value={mockCartContext}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </CartContext.Provider>
    );
  };

  test('renders login form correctly', () => {
    renderLogin();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const userData = { token: 'fake-token', name: 'Test User', isAdmin: false };
    axios.post.mockResolvedValue({ data: userData });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(userData.token);
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles failed login', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('handles social login', () => {
    delete window.location;
    window.location = { href: '' };

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: /Google/i }));
    expect(window.location.href).toBe(`${process.env.REACT_APP_API_URL}/auth/google`);
  });
});
