import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const originalPrice = product.price;
  const discountPercentage = product.discount || 0;
  const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        <div>
          Product added to cart!{' '}
          <Link to="/cart" className="text-blue-600 hover:underline">
            View Cart
          </Link>
        </div>
      );
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(err.response?.data?.message || 'Failed to add product to cart.');
    }
  };

  return (
    <div className="mx-auto"> {/* Đã xoá margin ngoài */}
      <div className="product bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-72 h-[450px] flex flex-col">
        {/* Product Image */}
        <div className="product-img relative flex-shrink-0">
          <img
            src={product.images[0] || './img/product01.png'}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {discountPercentage > 0 && (
            <div className="product-label absolute top-2 left-2">
              <span className="sale bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            </div>
          )}
          {product.isNew && (
            <div className="product-label absolute top-2 right-2">
              <span className="new bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            </div>
          )}
        </div>

        {/* Product Body */}
        <div className="product-body p-4 flex-grow flex flex-col">
          <p className="product-category text-gray-500 text-sm truncate">
            {product.category || 'Category'}
          </p>
          <h3 className="product-name text-lg font-semibold truncate">
            <Link to={`/product/${product._id}`} className="text-gray-800 hover:text-red-600">
              {product.name}
            </Link>
          </h3>
          <h4 className="product-price text-red-600 font-bold">
            {discountPercentage > 0 ? (
              <>
                <span className="line-through text-gray-400">
                  {originalPrice.toLocaleString()}₫
                </span>
                <span className="mx-1"> </span>
                <span>{discountedPrice.toLocaleString()}₫</span>
              </>
            ) : (
              <span>{originalPrice.toLocaleString()}₫</span>
            )}
          </h4>
          <div className="product-rating flex space-x-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fa fa-star${i < (product.rating || 0) ? '' : '-o'}`}
              ></i>
            ))}
          </div>
          <p className="product-sales text-gray-500 text-sm mt-2">
            <span className="font-semibold">Sales:</span> {product.salesCount || 0}
          </p>
          <div className="product-btns flex space-x-2 mt-2">
            <button className="add-to-wishlist text-gray-600 hover:text-red-600">
              <i className="fa fa-heart-o"></i>
            </button>
            <button className="add-to-compare text-gray-600 hover:text-red-600">
              <i className="fa fa-exchange"></i>
            </button>
            <button className="quick-view text-gray-600 hover:text-red-600">
              <i className="fa fa-eye"></i>
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <div className="add-to-cart p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!product.inStock}
          >
            <i className="fa fa-shopping-cart mr-2"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
