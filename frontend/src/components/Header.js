// frontend/src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(count);
        }
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };
    fetchCartCount();
    const updateCartCount = () => fetchCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, [user]); // Re-fetch cart count when user changes (e.g., login/logout)

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600">
          Electro
        </Link>
        <nav className="flex space-x-4">
          <Link to="/" className="text-gray-600 hover:text-red-600">
            Home
          </Link>
          <Link to="/products" className="text-gray-600 hover:text-red-600">
            Products
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-red-600 relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-red-600">
                Profile
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="text-gray-600 hover:text-red-600">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-red-600">
                Login
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-red-600">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;