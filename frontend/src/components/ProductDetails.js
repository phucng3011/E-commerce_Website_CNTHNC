// frontend/src/components/ProductDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share'; // Import social sharing components

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);
        setSelectedImage(
          fetchedProduct.images && fetchedProduct.images.length > 0
            ? fetchedProduct.images[0]
            : 'https://via.placeholder.com/400'
        );

        if (fetchedProduct.category) {
          const relatedResponse = await axios.get(
            `http://localhost:5000/api/products?category=${fetchedProduct.category}&limit=4`
          );
          const relatedData = Array.isArray(relatedResponse.data.products)
            ? relatedResponse.data.products
            : [];
          setRelatedProducts(relatedData.filter((p) => p._id !== id));
        }

        // Scroll to the top of the page when the product changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to submit a review');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { rating: review.rating, comment: review.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted successfully!');
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top when navigating
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  const productUrl = `${window.location.origin}/product/${id}`; // URL of the product page
  const productTitle = product?.name || 'Product';

  const productRating = product.rating || 0;
  const roundedRating = Math.round(productRating);
  const reviewCount = product.reviews ? product.reviews.length : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
        <ul className="flex space-x-2 text-gray-600 text-sm">
          <li>
            <Link to="/" className="hover:text-red-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/products" className="hover:text-red-600">
              All Categories
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to={`/products?category=${product.category}`}
              className="hover:text-red-600"
            >
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-800">{product.name}</li>
        </ul>
      </div>

      <div className="container mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex">
            <div className="flex flex-col space-y-4 mr-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img || 'https://via.placeholder.com/100'}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover cursor-pointer border-2 ${
                      selectedImage === img ? 'border-red-600' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))
              ) : (
                <img
                  src="https://via.placeholder.com/100"
                  alt="No thumbnail available"
                  className="w-20 h-20 object-cover border-2 border-gray-300"
                />
              )}
            </div>
            <div className="flex-1">
              <img
                src={selectedImage || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="w-full h-auto object-cover rounded"
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500">
                {'★'.repeat(roundedRating)}
                {'☆'.repeat(5 - roundedRating)}
              </span>
              <span className="text-gray-500 ml-2">({reviewCount} reviews)</span>
            </div>
            <p className="text-2xl font-semibold text-red-600 mb-2">
              {product.price ? product.price.toLocaleString() : '0'} ₫
              {product.discount > 0 && (
                <span className="text-sm text-green-600 ml-2">
                  ({product.discount}% off)
                </span>
              )}
            </p>
            <p className="text-gray-600 mb-4">
              {product.description || 'No description available'}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Availability: </span>
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Qty</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 p-2 border border-gray-300 rounded"
                disabled={!product.inStock}
              />
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded text-white transition-colors ${
                product.inStock
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!product.inStock}
            >
              Add to Cart
            </button>

            {/* Social Sharing Buttons */}
            <div className="mt-4 flex space-x-4">
              <FacebookShareButton url={productUrl} quote={productTitle}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={productUrl} title={productTitle}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <WhatsappShareButton url={productUrl} title={productTitle}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <EmailShareButton url={productUrl} subject={productTitle} body="Check out this product!">
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-semibold ${
                activeTab === 'description'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`py-2 px-4 font-semibold ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <p className="text-gray-600">
                {product.description || 'No description available'}
              </p>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="mr-6">
                    <p className="text-2xl font-bold">
                      {productRating.toFixed(1)}
                    </p>
                    <span className="text-yellow-500">
                      {'★'.repeat(roundedRating)}
                      {'☆'.repeat(5 - roundedRating)}
                    </span>
                    <p className="text-gray-600">({reviewCount} reviews)</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = product.reviews
                        ? product.reviews.filter((r) => Math.round(r.rating) === star)
                            .length
                        : 0;
                      const percentage = product.reviews?.length
                        ? (count / product.reviews.length) * 100
                        : 0;
                      return (
                        <div key={star} className="flex items-center mb-1">
                          <span className="w-8">{star} ★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded">
                            <div
                              className="h-2 bg-red-600 rounded"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-gray-600">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {product.reviews?.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4">
                        <p className="font-semibold">{review.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                        <span className="text-yellow-500">
                          {'★'.repeat(Math.round(review.rating))}
                          {'☆'.repeat(5 - Math.round(review.rating))}
                        </span>
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}

                <div id="reviews" className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-semibold">Your Review</label>
                      <textarea
                        value={review.comment}
                        onChange={(e) =>
                          setReview({ ...review, comment: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="4"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Your Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReview({ ...review, rating: star })}
                            className={`text-2xl ${
                              star <= review.rating
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((related) => (
              <div key={related._id} onClick={() => handleNavigateToProduct(related._id)}>
                <ProductCard product={related} />
              </div>
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-600">
              No related products found.
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-100 py-8">
      </div>
    </div>
  );
};

export default ProductDetails;