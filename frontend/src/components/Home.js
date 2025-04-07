import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch new products (sorted by creation date or filtered by "isNew")
        const newResponse = await axios.get('http://localhost:5000/api/products?sort=-createdAt&limit=8');
        setNewProducts(newResponse.data.products || []);

        // Fetch top-selling products (sorted by sales count)
        const topResponse = await axios.get('http://localhost:5000/api/products?sort=-salesCount&limit=8');
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
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: '.swiper-button-next-new',
              prevEl: '.swiper-button-prev-new',
            }}
            pagination={{
              el: '.swiper-pagination-new',
              clickable: true,
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-12" // Add padding-bottom to make space for pagination
          >
            {newProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom Navigation Arrows */}
          <div className="swiper-button-prev-new absolute top-1/2 left-[-40px] transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </div>
          <div className="swiper-button-next-new absolute top-1/2 right-[-40px] transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          {/* Custom Pagination */}
          <div className="swiper-pagination-new mt-4"></div>
        </div>
      </div>

      {/* Top Selling Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Top Selling</h2>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: '.swiper-button-next-top',
              prevEl: '.swiper-button-prev-top',
            }}
            pagination={{
              el: '.swiper-pagination-top',
              clickable: true,
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-12" // Add padding-bottom to make space for pagination
          >
            {topSellingProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom Navigation Arrows */}
          <div className="swiper-button-prev-top absolute top-1/2 left-[-40px] transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </div>
          <div className="swiper-button-next-top absolute top-1/2 right-[-40px] transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          {/* Custom Pagination */}
          <div className="swiper-pagination-top mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;