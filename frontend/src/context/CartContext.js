import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Hàm debounce để giới hạn tần suất gọi
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartVersion, setCartVersion] = useState(0); // State để trigger fetchCart

  const fetchCart = useCallback(async () => {
    console.log('Fetching cart at:', new Date().toISOString());
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Cart fetched:', response.data.items);
        setCart(response.data.items || []);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
      toast.error('Failed to fetch cart');
    }
  }, []);

  // Debounced fetchCart
  const debouncedFetchCart = debounce(fetchCart, 500);

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/cart',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.items);
      setCartVersion(prev => prev + 1); // Trigger fetchCart
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart([]);
        setCartVersion(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      await axios.post('http://localhost:5000/api/newsletter', { email });
      toast.success('Subscribed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    }
  };

  useEffect(() => {
    fetchCart(); // Gọi lần đầu khi mount
  }, [fetchCart]);

  // Fetch cart khi cartVersion thay đổi
  useEffect(() => {
    if (cartVersion > 0) {
      debouncedFetchCart(); // Gọi debounced fetchCart
    }
  }, [cartVersion]);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, clearCart, handleNewsletterSubmit }}>
      {children}
    </CartContext.Provider>
  );
};