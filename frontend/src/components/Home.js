import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch new products
        const newResponse = await axios.get('http://localhost:5000/api/products?limit=4');
        setNewProducts(newResponse.data.products || []);

        // Fetch top-selling products
        const topResponse = await axios.get('http://localhost:5000/api/products?limit=4');
        setTopSellingProducts(topResponse.data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full p-3 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* New Products Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">New Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Top Selling Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Top Selling</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {topSellingProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;