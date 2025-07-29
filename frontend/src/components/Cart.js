// frontend/src/components/Cart.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Cart Response:', response.data); // Debug log
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart.');
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/cart`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
      toast.success('Cart updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
      toast.success('Item removed from cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item.');
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0; // Fallback to 0 if price is undefined
      return total + price * item.quantity;
    }, 0);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="section">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        {cart.items.length === 0 ? (
          <div className="text-center py-10">
            Your cart is empty.{' '}
            <Link to="/products" className="text-red-600 hover:underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items */}
            <div className="col-md-8">
              <div className="space-y-4">
                {cart.items.map((item) => {
                  if (!item.productId) {
                    console.warn('Invalid cart item, productId is undefined:', item);
                    return null;
                  }
                  const price = item.productId?.price || 0;
                  return (
                    <div key={item.productId._id} className="flex items-center border p-4 rounded bg-white shadow-sm">
                      <img
                        src={item.productId.images?.[0] || './img/product01.png'}
                        alt={item.productId.name}
                        className="w-24 h-24 object-cover mr-4 rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{item.productId.name}</h3>
                        <p className="text-gray-600">Price: {price.toLocaleString()}₫</p> {/* Use cart price */}
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{(price * item.quantity).toLocaleString()}₫</p>
                        <button
                          onClick={() => handleRemoveItem(item.productId._id)}
                          className="text-red-600 hover:underline mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>{calculateTotal().toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{calculateTotal().toLocaleString()}₫</span>
                </div>
                <Link
                  to="/checkout"
                  className="block mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;