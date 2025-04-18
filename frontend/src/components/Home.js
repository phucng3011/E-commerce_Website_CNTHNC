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
        const newResponse = await axios.get('http://localhost:5000/api/products?sort=-createdAt&limit=8');
        setNewProducts(newResponse.data.products || []);

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
        <div className="relative px-8">
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
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3.5 },
              1280: { slidesPerView: 4.5 },
            }}
            className="pb-12"
          >
            {newProducts.map((product) => (
              <SwiperSlide key={product._id} className="flex justify-center">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows - New */}
          <div className="swiper-button-prev-new absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 text-red-600 hover:text-red-700">
            <i className="fa fa-chevron-left text-2xl" />
          </div>
          <div className="swiper-button-next-new absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-red-600 hover:text-red-700">
            <i className="fa fa-chevron-right text-2xl" />
          </div>

          <div className="swiper-pagination-new mt-4 flex justify-center" />
        </div>
      </div>

      {/* Top Selling Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Top Selling</h2>
        <div className="relative px-8">
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
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3.5 },
              1280: { slidesPerView: 4.5 },
            }}
            className="pb-12"
          >
            {topSellingProducts.map((product) => (
              <SwiperSlide key={product._id} className="flex justify-center">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows - Top */}
          <div className="swiper-button-prev-top absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 text-red-600 hover:text-red-700">
            <i className="fa fa-chevron-left text-2xl" />
          </div>
          <div className="swiper-button-next-top absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-red-600 hover:text-red-700">
            <i className="fa fa-chevron-right text-2xl" />
          </div>

          <div className="swiper-pagination-top mt-4 flex justify-center" />
        </div>
      </div>
    </div>
  );
};

export default Home;
