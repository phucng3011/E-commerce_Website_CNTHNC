import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImage, setCurrentImage] = useState(0);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
      alert('Product added to cart!');
    } catch (error) {
      alert('Please log in to add items to your cart.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10">Product not found.</div>;

  const images = product.images || [
    '/img/product01.png',
    '/img/product03.png',
    '/img/product06.png',
    '/img/product08.png',
  ];

  return (
    <div className="section">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div id="breadcrumb" className="mb-6">
          <ul className="breadcrumb-tree flex space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-red-600">Home</Link></li>
            <li><Link to="/products" className="hover:text-red-600">All Categories</Link></li>
            <li><Link to="/products" className="hover:text-red-600">{product.category}</Link></li>
            <li className="text-gray-800">{product.name}</li>
          </ul>
        </div>

        <div className="row grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Main Image */}
          <div className="col-md-5 col-md-push-2 order-2 md:order-1">
            <div id="product-main-img">
              <div className="product-preview">
                <img
                  src={images[currentImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Product Thumbnail Images */}
          <div className="col-md-2 col-md-pull-5 order-1 md:order-2">
            <div id="product-imgs" className="flex flex-col space-y-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`product-preview cursor-pointer ${
                    currentImage === index ? 'border-2 border-red-600' : ''
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-5 order-3">
            <div className="product-details">
              <h2 className="product-name text-2xl font-bold">{product.name}</h2>
              <div className="flex items-center space-x-2">
                <div className="product-rating flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa fa-star${i < (product.rating || 4) ? '' : '-o'}`}
                    ></i>
                  ))}
                </div>
                <Link to="#reviews" className="review-link text-gray-600 hover:text-red-600">
                  {product.reviews?.length || 10} Review(s) | Add your review
                </Link>
              </div>
              <div className="mt-2">
                <h3 className="product-price text-red-600 text-xl font-bold">
                  ${product.price.toFixed(2)}{' '}
                  {product.oldPrice && (
                    <del className="product-old-price text-gray-400">
                      ${product.oldPrice.toFixed(2)}
                    </del>
                  )}
                </h3>
                <span className="product-available text-green-600">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <p className="mt-4 text-gray-700">{product.description}</p>

              <div className="product-options mt-4">
                <label className="mr-4">
                  Size
                  <select className="input-select border border-gray-300 rounded p-2 ml-2">
                    <option value="0">X</option>
                    {product.sizes?.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Color
                  <select className="input-select border border-gray-300 rounded p-2 ml-2">
                    <option value="0">Red</option>
                    {product.colors?.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="add-to-cart mt-4 flex items-center space-x-4">
                <div className="qty-label">
                  Qty
                  <div className="input-number flex items-center border border-gray-300 rounded">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                      className="w-16 p-2 text-center border-0"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="qty-up px-2 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-down px-2 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      -
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="add-to-cart-btn bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 flex items-center"
                  disabled={!product.inStock}
                >
                  <i className="fa fa-shopping-cart mr-2"></i> Add to Cart
                </button>
              </div>

              <ul className="product-btns mt-4 flex space-x-4">
                <li>
                  <button className="text-gray-600 hover:text-red-600 flex items-center">
                    <i className="fa fa-heart-o mr-1"></i> Add to Wishlist
                  </button>
                </li>
                <li>
                  <button className="text-gray-600 hover:text-red-600 flex items-center">
                    <i className="fa fa-exchange mr-1"></i> Add to Compare
                  </button>
                </li>
              </ul>

              <ul className="product-links mt-4 flex space-x-2">
                <li className="text-gray-600">Category:</li>
                <li>
                  <Link to="/products" className="hover:text-red-600">
                    {product.category}
                  </Link>
                </li>
              </ul>

              <ul className="product-links mt-2 flex space-x-2">
                <li className="text-gray-600">Share:</li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-400">
                    <i className="fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600">
                    <i className="fa fa-google-plus"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-800">
                    <i className="fa fa-envelope"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="col-md-12 mt-8">
          <div id="product-tab">
            <ul className="tab-nav flex border-b border-gray-200">
              <li className={activeTab === 'description' ? 'active' : ''}>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-2 px-4 font-semibold ${
                    activeTab === 'description'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600'
                    }`}
                    aria-selected={activeTab === 'description'}
                    role="tab"
                >
                  Description
                </button>
              </li>
              <li className={activeTab === 'details' ? 'active' : ''}>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-4 font-semibold ${
                    activeTab === 'details'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  Details
                </button>
              </li>
              <li className={activeTab === 'reviews' ? 'active' : ''}>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-4 font-semibold ${
                    activeTab === 'reviews'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  Reviews ({product.reviews?.length || 3})
                </button>
              </li>
            </ul>

            <div className="tab-content mt-4">
              {activeTab === 'description' && (
                <div id="tab1" className="tab-pane fade in active">
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === 'details' && (
                <div id="tab2" className="tab-pane fade in">
                  <p>{product.details || 'Additional product details go here.'}</p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div id="tab3" className="tab-pane fade in">
                  <div className="row grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Rating Summary */}
                    <div className="col-md-3">
                      <div id="rating">
                        <div className="rating-avg flex items-center space-x-2">
                          <span className="text-2xl font-bold">
                            {product.rating || 4.5}
                          </span>
                          <div className="rating-stars flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fa fa-star${i < (product.rating || 4) ? '' : '-o'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        {/* Add more rating details if needed */}
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="col-md-6">
                      <div id="reviews">
                        <ul className="reviews space-y-4">
                          {(product.reviews || []).map((review, index) => (
                            <li key={index}>
                              <div className="review-heading flex justify-between">
                                <h5 className="name font-semibold">{review.name}</h5>
                                <p className="date text-gray-500">{review.date}</p>
                                <div className="review-rating flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <i
                                      key={i}
                                      className={`fa fa-star${i < review.rating ? '' : '-o'}`}
                                    ></i>
                                  ))}
                                </div>
                              </div>
                              <div className="review-body">
                                <p>{review.comment}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Review Form */}
                    <div className="col-md-3">
                      <div id="review-form">
                        <form className="review-form space-y-4">
                          <input
                            className="input w-full p-2 border border-gray-300 rounded"
                            type="text"
                            placeholder="Your Name"
                          />
                          <input
                            className="input w-full p-2 border border-gray-300 rounded"
                            type="email"
                            placeholder="Your Email"
                          />
                          <textarea
                            className="input w-full p-2 border border-gray-300 rounded"
                            placeholder="Your Review"
                          ></textarea>
                          <div className="input-rating flex items-center space-x-2">
                            <span>Your Rating:</span>
                            <div className="stars flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <input
                                  key={i}
                                  type="radio"
                                  name="rating"
                                  value={5 - i}
                                  id={`star${5 - i}`}
                                  className="hidden"
                                />
                              ))}
                              {[...Array(5)].map((_, i) => (
                                <label
                                  key={i}
                                  htmlFor={`star${5 - i}`}
                                  className="cursor-pointer"
                                >
                                  <i className="fa fa-star"></i>
                                </label>
                              ))}
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="primary-btn bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;