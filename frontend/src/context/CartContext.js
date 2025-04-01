// frontend/src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]); // Fallback to empty cart on error
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/cart',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.items);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      throw error;
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
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, handleNewsletterSubmit }}>
      {children}
    </CartContext.Provider>
  );
};