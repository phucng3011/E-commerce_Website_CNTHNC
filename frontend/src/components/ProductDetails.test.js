import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import ProductDetails from './ProductDetails';

// Mock axios
jest.mock('axios');

// Mock ProductCard to simplify testing
jest.mock('./ProductCard', () => ({ product }) => <div data-testid={`product-card-${product._id}`}>{product.name}</div>);

const mockProduct = {
  _id: '1',
  name: 'Test Laptop',
  price: 1500,
  description: 'A great laptop',
  images: ['image1.jpg'],
  category: 'Laptops',
  inStock: true,
  reviews: [],
};

const mockRelatedProducts = [
  { _id: '2', name: 'Another Laptop', category: 'Laptops', images: [] },
];

const mockCartContext = {
  addToCart: jest.fn(),
};

describe('ProductDetails Component', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/products/1')) {
        return Promise.resolve({ data: mockProduct });
      }
      if (url.includes('/api/products?category=Laptops')) {
        return Promise.resolve({ data: { products: mockRelatedProducts } });
      }
      return Promise.reject(new Error('not found'));
    });
    mockCartContext.addToCart.mockClear();
  });

  const renderProductDetails = () => {
    return render(
      <CartContext.Provider value={mockCartContext}>
        <MemoryRouter initialEntries={['/product/1']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </MemoryRouter>
      </CartContext.Provider>
    );
  };

  test('renders product details correctly', async () => {
    renderProductDetails();
    expect(await screen.findByRole('heading', { name: /Test Laptop/i })).toBeInTheDocument();
    expect(screen.getByText(/1,500/i)).toBeInTheDocument();
    // There may be multiple 'A great laptop', just check at least one exists
    expect(screen.getAllByText(/A great laptop/i).length).toBeGreaterThan(0);
  });

  test('adds product to cart', async () => {
    renderProductDetails();
    await screen.findByRole('heading', { name: /Test Laptop/i }); // Wait for product to load

    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));

    expect(mockCartContext.addToCart).toHaveBeenCalledWith('1', 1);
  });

  test('renders related products', async () => {
    renderProductDetails();
    expect(await screen.findByTestId('product-card-2')).toHaveTextContent('Another Laptop');
  });

  test('submits a review when logged in', async () => {
    localStorage.setItem('token', 'fake-token');
    axios.post.mockResolvedValue({ data: {} });

    renderProductDetails();
    await screen.findByRole('heading', { name: /Test Laptop/i }); // Wait for product to load

    fireEvent.click(screen.getByRole('button', { name: /Reviews/i }));
    // Try to find textarea by placeholder or role if label is not associated
    const reviewInput = screen.queryByPlaceholderText(/Your Review/i) || screen.queryByRole('textbox');
    expect(reviewInput).toBeTruthy();
    fireEvent.change(reviewInput, { target: { value: 'Great product!' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/products/1/reviews'),
        { rating: 5, comment: 'Great product!' },
        expect.any(Object)
      );
    });
  });

  test('switches between description and reviews tabs', async () => {
    renderProductDetails();
    await screen.findByRole('heading', { name: /Test Laptop/i }); // Wait for product to load

    // Initially shows description (should be visible in the tab panel)
    const descriptionPanels = screen.getAllByText(/A great laptop/i);
    expect(descriptionPanels.length).toBeGreaterThan(0);

    // Switch to reviews tab
    fireEvent.click(screen.getByRole('button', { name: /Reviews/i }));
    expect(await screen.findByText(/No reviews yet/i)).toBeInTheDocument();

    // Switch back to description
    fireEvent.click(screen.getByRole('button', { name: /Description/i }));
    // Check again for description text
    expect(screen.getAllByText(/A great laptop/i).length).toBeGreaterThan(0);
  });
});