import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsLoggingOut } = useContext(CartContext);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const name = query.get('name');
    const email = query.get('email');

    if (token) {
      localStorage.setItem('token', token);
      const userData = { name, email };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      setIsLoggingOut(false);
      navigate(userData.isAdmin ? '/admin' : '/');
    }
  }, [location, navigate, setUser, setIsLoggingOut]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggingOut(false);
      navigate(userData.isAdmin ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  return (
    <div className="section">
      <div className="container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter your email"
              required
              aria-label="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter your password"
              required
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Or login with:</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.24 10.32V14.4h4.32c-.18 1.14-.66 2.04-1.44 2.76-.96.9-2.28 1.44-3.84 1.44-3 0-5.4-2.46-5.4-5.52s2.4-5.52 5.4-5.52c1.38 0 2.64.54 3.6 1.44l2.88-2.88C16.56 4.44 14.64 3.6 12.24 3.6 7.8 3.6 4.32 7.08 4.32 11.52s3.48 7.92 7.92 7.92c2.28 0 4.26-.9 5.76-2.4 1.5-1.5 2.16-3.6 2.16-6 0-.66-.06-1.32-.18-1.92h-7.98z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;