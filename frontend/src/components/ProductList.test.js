import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProductList from './ProductList';

// Mock axios
jest.mock('axios');

// Mock the ProductCard component to include a test-id for specific querying
jest.mock('./ProductCard', () => ({ product }) => <div data-testid={`product-${product._id}`}>{product.name}</div>);

const mockProducts = [
  { _id: '1', name: 'Laptop', price: 1200, category: 'Laptops', images: [] },
  { _id: '2', name: 'Mouse', price: 25, category: 'Accessories', images: [] },
  { _id: '3', name: 'Keyboard', price: 75, category: 'Accessories', images: [] },
];

describe('ProductList Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ 
      data: { 
        products: mockProducts, 
        currentPage: 1, 
        totalPages: 1, 
        totalProducts: 3 
      } 
    });
  });

  const renderProductList = (initialEntries = ['/products']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders products on initial load', async () => {
    renderProductList();
    expect(await screen.findByTestId('product-1')).toHaveTextContent('Laptop');
    expect(await screen.findByTestId('product-2')).toHaveTextContent('Mouse');
    expect(await screen.findByTestId('product-3')).toHaveTextContent('Keyboard');
  });

  test('filters products by category', async () => {
    renderProductList();
    await screen.findByTestId('product-1'); // Wait for initial load

    fireEvent.change(screen.getByLabelText(/Filter by category/i), { target: { value: 'Laptops' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenLastCalledWith(expect.stringContaining('category=Laptops'));
    });
  });

  test('sorts products by price', async () => {
    renderProductList();
    await screen.findByTestId('product-1'); // Wait for initial load

    fireEvent.change(screen.getByLabelText(/Sort products/i), { target: { value: 'price' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenLastCalledWith(expect.stringContaining('sort=price'));
    });
  });

  test('handles pagination', async () => {
    axios.get.mockResolvedValue({ 
      data: { 
        products: mockProducts, 
        currentPage: 1, 
        totalPages: 2, 
        totalProducts: 6 
      } 
    });
    renderProductList();
    await screen.findByTestId('product-1'); // Wait for initial load

    fireEvent.click(screen.getByLabelText(/Next page/i));

    await waitFor(() => {
      expect(axios.get).toHaveBeenLastCalledWith(expect.stringContaining('page=2'));
    });
  });

  test('displays message when no products are found', async () => {
    axios.get.mockResolvedValue({ data: { products: [], currentPage: 1, totalPages: 1, totalProducts: 0 } });
    renderProductList();

    expect(await screen.findByText(/No products found/i)).toBeInTheDocument();
  });
});
