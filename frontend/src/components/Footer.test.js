import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';

// Mock axios
jest.mock('axios');

describe('Footer Component', () => {
  test('renders footer content correctly', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Check for newsletter section
    expect(screen.getByRole('heading', { name: /Sign Up for the Newsletter/i })).toBeInTheDocument();

    // Check for about us section
    expect(screen.getByRole('heading', { name: /About Us/i })).toBeInTheDocument();

    // Check for categories section
    expect(screen.getByRole('heading', { name: /Categories/i })).toBeInTheDocument();

    // Check for information section
    expect(screen.getByRole('heading', { name: /Information/i })).toBeInTheDocument();

    // Check for follow us section
    expect(screen.getByRole('heading', { name: /Follow Us/i })).toBeInTheDocument();

    // Check for copyright
    expect(screen.getByText(/© 2025 Tech Store. All Rights Reserved./i)).toBeInTheDocument();
  });

  test('handles newsletter subscription successfully', async () => {
    axios.post.mockResolvedValue({ data: {} });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Your Email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/Thank you for subscribing!/i)).toBeInTheDocument();
    });
  });

  test('handles newsletter subscription failure', async () => {
    axios.post.mockRejectedValue(new Error('Failed to subscribe'));

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Your Email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to subscribe. Please try again./i)).toBeInTheDocument();
    });
  });
});