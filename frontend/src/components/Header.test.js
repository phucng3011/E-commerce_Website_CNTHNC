import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear();
    axios.get.mockResolvedValue({ data: { items: [] } });
  });

  test('renders correctly for guests (not logged in)', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  test('renders correctly for logged-in users', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', isAdmin: false }));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
  });

  test('renders correctly for admin users', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Admin User', isAdmin: true }));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });

  test('displays cart count', async () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', isAdmin: false }));
    localStorage.setItem('token', 'fake-token');
    axios.get.mockResolvedValue({ data: { items: [{ quantity: 2 }, { quantity: 3 }] } });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const cartCount = await screen.findByText('5');
    expect(cartCount).toBeInTheDocument();
  });

  test('handles logout', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', isAdmin: false }));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Logout/i));
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
