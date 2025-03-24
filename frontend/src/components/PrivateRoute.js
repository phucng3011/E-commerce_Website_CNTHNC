import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ isAdminRoute = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
        setIsAdmin(res.data.isAdmin);
      } catch (err) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    if (token) verifyToken();
    else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [token]);

  if (isAuthenticated === null) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdminRoute && !isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default PrivateRoute;