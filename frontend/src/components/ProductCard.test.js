import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

// Mock product data for testing
const mockProduct = {
  _id: '1',
  name: 'Sample Laptop',
  price: 25000000,
  images: ['/img/product01.png'],
  category: 'Laptops',
  rating: 4,
  inStock: true,
};

describe('ProductCard Component', () => {
  test('renders product information correctly', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    // Check if product name is displayed
    // We look for a link with the product name
    const productName = screen.getByRole('link', { name: /sample laptop/i });
    expect(productName).toBeInTheDocument();

    // Check if product price is displayed
    // The price is formatted, so we look for the number part
    const productPrice = screen.getByText(/25,000,000/i);
    expect(productPrice).toBeInTheDocument();

    // Check if the product image is rendered with the correct alt text
    const productImage = screen.getByAltText(/sample laptop/i);
    expect(productImage).toBeInTheDocument();
    expect(productImage.src).toContain(mockProduct.images[0]);

    // Check if the "Add to Cart" button is present
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).not.toBeDisabled();
  });

  test('disables "Add to Cart" button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    render(
      <MemoryRouter>
        <ProductCard product={outOfStockProduct} />
      </MemoryRouter>
    );

    // Check if the "Add to Cart" button is disabled
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeDisabled();
  });
});
