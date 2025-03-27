// frontend/src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const newProductsResponse = await axios.get('http://localhost:5000/api/products?limit=4&sort=-createdAt');
      setNewProducts(newProductsResponse.data.products || []);

      const topSellingResponse = await axios.get('http://localhost:5000/api/products?limit=8&sort=-rating');
      setTopSellingProducts(topSellingResponse.data.products || []);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="section">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-10">
          <form onSubmit={handleSearch} className="flex justify-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="border border-gray-300 rounded-l p-2 w-full max-w-md"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded-r hover:bg-red-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="relative bg-gray-200 h-64 rounded-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x300?text=Laptop+Collection"
              alt="Laptop Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-30">
              <h3 className="text-2xl font-bold">Laptop Collection</h3>
              <Link
                to="/products?category=Laptops"
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="relative bg-gray-200 h-64 rounded-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x300?text=Accessories"
              alt="Accessories"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-30">
              <h3 className="text-2xl font-bold">Accessories</h3>
              <Link
                to="/products?category=Accessories"
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="relative bg-gray-200 h-64 rounded-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x300?text=Cameras+Collection"
              alt="Cameras Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-30">
              <h3 className="text-2xl font-bold">Cameras Collection</h3>
              <Link
                to="/products?category=Cameras"
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* New Products Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">New Products</h2>
          <div className="flex justify-center mb-4">
            <div className="space-x-4">
              <Link to="/products?category=Laptops" className="text-gray-600 hover:text-red-600">
                Laptops
              </Link>
              <Link to="/products?category=Smartphones" className="text-gray-600 hover:text-red-600">
                Smartphones
              </Link>
              <Link to="/products?category=Cameras" className="text-gray-600 hover:text-red-600">
                Cameras
              </Link>
              <Link to="/products?category=Accessories" className="text-gray-600 hover:text-red-600">
                Accessories
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        {/* Hot Deal This Week Banner */}
        <div className="relative bg-gray-100 h-64 rounded-lg overflow-hidden mb-10">
          <div className="absolute inset-0 flex items-center justify-between px-10">
            <img
              src="https://via.placeholder.com/300x200?text=Laptop"
              alt="Hot Deal Product"
              className="w-1/3 h-auto"
            />
            <div className="text-center">
              <h3 className="text-2xl font-bold">Hot Deal This Week</h3>
              <p className="text-lg">New Collection Up to 50% Off</p>
              <div className="flex justify-center space-x-2 my-4">
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  02
                </div>
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  10
                </div>
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  34
                </div>
              </div>
              <Link
                to="/products"
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Shop Now
              </Link>
            </div>
            <img
              src="https://via.placeholder.com/300x200?text=Headphones"
              alt="Hot Deal Product"
              className="w-1/3 h-auto"
            />
          </div>
        </div>

        {/* Top Selling Section 1 */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Top Selling</h2>
          <div className="flex justify-center mb-4">
            <div className="space-x-4">
              <Link to="/products?category=Laptops" className="text-gray-600 hover:text-red-600">
                Laptops
              </Link>
              <Link to="/products?category=Smartphones" className="text-gray-600 hover:text-red-600">
                Smartphones
              </Link>
              <Link to="/products?category=Cameras" className="text-gray-600 hover:text-red-600">
                Cameras
              </Link>
              <Link to="/products?category=Accessories" className="text-gray-600 hover:text-red-600">
                Accessories
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {topSellingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        {/* Top Selling Section 2 */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Top Selling</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {topSellingProducts.slice(4, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;