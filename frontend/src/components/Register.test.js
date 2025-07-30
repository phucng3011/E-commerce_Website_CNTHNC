import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Register from './Register';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock window.location.reload
Object.defineProperty(window, 'location', {
  configurable: true,
  value: { reload: jest.fn() },
});

describe('Register Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
    window.location.reload.mockClear();
  });

  test('renders register form correctly', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    const userData = { token: 'fake-token', name: 'Test User', email: 'test@example.com' };
    axios.post.mockResolvedValue({ data: userData });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(userData.token);
      expect(mockedNavigate).toHaveBeenCalledWith('/');
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test('handles failed registration', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'User already exists' } } });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    });
  });
});
