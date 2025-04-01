// frontend/src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [hotDealProduct, setHotDealProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProductCategory, setNewProductCategory] = useState('All');
  const [topSellingCategory, setTopSellingCategory] = useState('All');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch new products
        const newResponse = await axios.get('http://localhost:5000/api/products?new=true&limit=4');
        console.log('New products response:', newResponse.data);
        setNewProducts(newResponse.data.products || []);

        // Fetch top-selling products
        const topResponse = await axios.get('http://localhost:5000/api/products?topSelling=true&limit=8');
        console.log('Top selling products response:', topResponse.data);
        setTopSellingProducts(topResponse.data.products || []);

        // Fetch hot deal product with error handling
        try {
          const hotDealResponse = await axios.get('http://localhost:5000/api/products/hot-deal');
          console.log('Hot deal product response:', hotDealResponse.data);
          setHotDealProduct(hotDealResponse.data);
        } catch (hotDealError) {
          console.error('Error fetching hot deal product:', hotDealError.response?.data || hotDealError.message);
          setHotDealProduct(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Countdown timer for Hot Deal
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const filterProducts = (products, category) => {
    if (!Array.isArray(products)) return [];
    if (category === 'All') return products;
    return products.filter(product => product.category === category);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* New Products Section (Static Grid) */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">New Products</h2>
        <div className="flex justify-center space-x-4 mb-6">
          {['All', 'Laptops', 'Smartphones', 'Cameras', 'Accessories'].map(category => (
            <button
              key={category}
              onClick={() => setNewProductCategory(category)}
              className={`text-gray-600 hover:text-red-600 ${newProductCategory === category ? 'text-red-600 font-semibold' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
        {filterProducts(newProducts, newProductCategory).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filterProducts(newProducts, newProductCategory).map(product => (
              <div key={product._id} className="bg-white p-4 rounded shadow relative">
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    -20%
                  </span>
                )}
                <img
                  src={product.image || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-red-600 font-semibold">${product.price.toFixed(2)}</p>
                <div className="flex space-x-2 mt-2">
                  <button className="text-gray-600 hover:text-red-600">♥</button>
                  <button className="text-gray-600 hover:text-red-600">↔</button>
                  <button className="text-gray-600 hover:text-red-600">🛒</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No new products available.</p>
        )}
      </div>

      {/* Hot Deal Banner */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative bg-gray-200 rounded shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center">
            <div className="p-6">
              <img
                src={hotDealProduct?.image || 'https://via.placeholder.com/300?text=Hot+Deal+Product'}
                alt={hotDealProduct?.name || 'Hot Deal Product'}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Hot Deal This Week</h3>
              <p className="text-gray-600 mb-4">
                {hotDealProduct ? `Save ${hotDealProduct.discount}% on ${hotDealProduct.name}` : 'New Collection Up to 50% Off'}
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
              </div>
              <Link
                to={hotDealProduct ? `/product/${hotDealProduct._id}` : '/products?category=Hot Deals'}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Shop Now
              </Link>
            </div>
            <div className="p-6">
              <img
                src={hotDealProduct?.image || 'https://via.placeholder.com/300?text=Hot+Deal+Product'}
                alt={hotDealProduct?.name || 'Hot Deal Product'}
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Section (Static Grid) */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Top Selling</h2>
        <div className="flex justify-center space-x-4 mb-6">
          {['All', 'Laptops', 'Smartphones', 'Cameras', 'Accessories'].map(category => (
            <button
              key={category}
              onClick={() => setTopSellingCategory(category)}
              className={`text-gray-600 hover:text-red-600 ${topSellingCategory === category ? 'text-red-600 font-semibold' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filterProducts(topSellingProducts, topSellingCategory).map(product => (
            <div key={product._id} className="bg-white p-4 rounded shadow relative">
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  -20%
                </span>
              )}
              <img
                src={product.image || 'https://via.placeholder.com/200'}
                alt={product.name}
                className="w-full h-40 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-red-600 font-semibold">${product.price.toFixed(2)}</p>
              <div className="flex space-x-2 mt-2">
                <button className="text-gray-600 hover:text-red-600">♥</button>
                <button className="text-gray-600 hover:text-red-600">↔</button>
                <button className="text-gray-600 hover:text-red-600">🛒</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;