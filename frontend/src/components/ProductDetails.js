import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [newsletterEmail, setNewsletterEmail] = useState(''); // State for newsletter input

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.image);

        if (response.data.category) {
          console.log('Fetching related products for category:', response.data.category);
          const relatedResponse = await axios.get(
            `http://localhost:5000/api/products?category=${response.data.category}&limit=4`
          );
          console.log('Related Response:', relatedResponse);
          console.log('Related Response Data:', relatedResponse.data);
          const relatedData = Array.isArray(relatedResponse.data) ? relatedResponse.data : [];
          setRelatedProducts(relatedData.filter(p => p._id !== id));
        }
      } catch (err) {
        console.error('Error fetching product:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    // Cleanup: Reset newsletter email when component unmounts
    return () => {
      setNewsletterEmail('');
    };
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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/newsletter', { email: newsletterEmail });
      toast.success('Subscribed successfully!');
      setNewsletterEmail(''); // Clear input after successful submission
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
        <ul className="flex space-x-2 text-gray-600 text-sm">
          <li><Link to="/" className="hover:text-red-600">Home</Link></li>
          <li>/</li>
          <li><Link to="/products" className="hover:text-red-600">All Categories</Link></li>
          <li>/</li>
          <li><Link to={`/products?category=${product.category}`} className="hover:text-red-600">{product.category}</Link></li>
          <li>/</li>
          <li className="text-gray-800">{product.name}</li>
        </ul>
      </div>

      <div className="container mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex">
            <div className="flex flex-col space-y-4 mr-4">
              {[product.image, product.image, product.image].map((img, index) => (
                <img
                  key={index}
                  src={img || 'https://via.placeholder.com/100'}
                  alt={`Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover cursor-pointer border-2 ${selectedImage === img ? 'border-red-600' : 'border-gray-300'}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
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
              <span className="text-yellow-500">{'★'.repeat(Math.round(product.rating))}</span>
              <span className="text-gray-500 ml-2">({product.reviews?.length || 0} reviews)</span>
              <Link to="#reviews" className="ml-2 text-red-600 hover:underline">Add a Review</Link>
            </div>
            <p className="text-2xl font-semibold text-red-600 mb-2">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{product.description || 'No description available'}</p>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Availability: </span>
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Size</label>
              <select className="w-32 p-2 border border-gray-300 rounded">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Color</label>
              <select className="w-32 p-2 border border-gray-300 rounded">
                <option>Red</option>
                <option>Black</option>
                <option>Silver</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Qty</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
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

            <div className="mt-4 flex space-x-2">
              <span className="font-semibold">Share:</span>
              <button className="text-gray-600 hover:text-red-600">F</button>
              <button className="text-gray-600 hover:text-red-600">T</button>
              <button className="text-gray-600 hover:text-red-600">G</button>
              <button className="text-gray-600 hover:text-red-600">P</button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'description' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === 'reviews' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <p className="text-gray-600">{product.description || 'No description available'}</p>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="mr-6">
                    <p className="text-2xl font-bold">{product.rating.toFixed(1)}</p>
                    <span className="text-yellow-500">{'★'.repeat(Math.round(product.rating))}</span>
                    <p className="text-gray-600">({product.reviews?.length || 0} reviews)</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = product.reviews?.filter(r => Math.round(r.rating) === star).length || 0;
                      const percentage = product.reviews?.length ? (count / product.reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center mb-1">
                          <span className="w-8">{star} ★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-red-600 rounded" style={{ width: `${percentage}%` }}></div>
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
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                        <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
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
                      <label className="block mb-1 font-semibold">Your Name</label>
                      <input
                        type="text"
                        value={localStorage.getItem('userName') || ''}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Your Email</label>
                      <input
                        type="email"
                        value={localStorage.getItem('userEmail') || ''}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Your Review</label>
                      <textarea
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
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
                            className={`text-2xl ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
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

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((related) => (
            <div key={related._id} className="bg-white p-4 rounded shadow">
              <img
                src={related.image || 'https://via.placeholder.com/200'}
                alt={related.name}
                className="w-full h-40 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold">{related.name}</h3>
              <p className="text-red-600 font-semibold">${related.price.toFixed(2)}</p>
              <div className="flex space-x-2 mt-2">
                <button className="text-gray-600 hover:text-red-600">♥</button>
                <button className="text-gray-600 hover:text-red-600">↔</button>
                <button className="text-gray-600 hover:text-red-600">🛒</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign Up for the Newsletter</h2>
          <form className="flex justify-center" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="p-2 border border-gray-300 rounded-l w-64"
              required
            />
            <button className="bg-red-600 text-white py-2 px-4 rounded-r hover:bg-red-700">
              Subscribe
            </button>
          </form>
          <div className="flex justify-center space-x-4 mt-4">
            <button className="text-gray-600 hover:text-red-600">F</button>
            <button className="text-gray-600 hover:text-red-600">T</button>
            <button className="text-gray-600 hover:text-red-600">G</button>
            <button className="text-gray-600 hover:text-red-600">P</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;