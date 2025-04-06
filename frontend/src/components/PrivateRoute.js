import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PrivateRoute = ({ isAdminRoute = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          throw new Error('No token found');
        }

        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAuthenticated(true);
        setIsAdmin(res.data.isAdmin || false);
      } catch (err) {
        console.error('Error verifying token:', err.message);
        setIsAuthenticated(false);
        setIsAdmin(false);

        if (err.message === 'No token found') {
          toast.error('Please log in to access this page.');
        } else if (err.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token'); // Clear invalid token
        } else {
          toast.error('Failed to authenticate. Please try again.');
        }
      }
    };

    // Only verify token if it exists
    if (token) {
      verifyToken();
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      toast.error('Please log in to access this page.');
    }
  }, [token]);

  // Improved loading state with styling
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-solid mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not admin (for admin routes)
  if (isAdminRoute && !isAdmin) {
    toast.error('You do not have permission to access this page.');
    return <Navigate to="/" replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default PrivateRoute;