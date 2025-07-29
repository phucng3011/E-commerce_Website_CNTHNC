import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [user, setUser] = useState(null);
  const [cartVersion, setCartVersion] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchCart = useCallback(async () => {
    console.log('Fetching cart at:', new Date().toISOString());
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
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

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const debouncedFetchCart = debounce(fetchCart, 500);

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cart`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.items);
      setCartVersion(prev => prev + 1);
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
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart([]);
        setCartVersion(prev => prev + 1);
        toast.success('Cart cleared');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/newsletter`, { email });
      toast.success('Subscribed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, [fetchCart, fetchUser]);

  useEffect(() => {
    if (cartVersion > 0) {
      debouncedFetchCart();
    }
  }, [cartVersion, debouncedFetchCart]);

  return (
    <CartContext.Provider value={{
      cart,
      user,
      setUser,
      fetchCart,
      addToCart,
      clearCart,
      handleNewsletterSubmit,
      isLoggingOut,
      setIsLoggingOut,
      fetchUser,
    }}>
      {children}
    </CartContext.Provider>
  );
};