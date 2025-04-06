import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('direct-bank-transfer');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchCart();
    }
    setLoading(false);
  }, [fetchCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!billingDetails.firstName) newErrors.firstName = 'First name is required';
    if (!billingDetails.lastName) newErrors.lastName = 'Last name is required';
    if (!billingDetails.address) newErrors.address = 'Address is required';
    if (!billingDetails.city) newErrors.city = 'City is required';
    if (!billingDetails.state) newErrors.state = 'State is required';
    if (!billingDetails.zip) newErrors.zip = 'ZIP code is required';
    if (!billingDetails.country) newErrors.country = 'Country is required';
    if (!billingDetails.email || !/\S+@\S+\.\S+/.test(billingDetails.email))
      newErrors.email = 'Valid email is required';
    if (!billingDetails.phone) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotals = () => {
    const itemsPrice = cart.reduce((total, item) => {
      const price = item.price || item.productId?.price || 0; // Fallback to product price or 0
      if (!item.price) console.warn('Missing price in cart item:', item);
      return total + price * item.quantity;
    }, 0);
    const shippingPrice = 0;
    const taxPrice = itemsPrice * 0.1;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to place an order.');
      navigate('/login');
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    try {
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals();

      const orderData = {
        billingDetails: {
          address: billingDetails.address,
          city: billingDetails.city,
          postalCode: billingDetails.zip,
          country: billingDetails.country,
        },
        paymentMethod,
        cartItems: cart.map((item) => {
          const price = item.price || item.productId?.price;
          if (!price) throw new Error(`Price missing for product: ${item.productId.name}`);
          return {
            productId: item.productId._id,
            quantity: item.quantity,
            price,
            name: item.productId.name,
            image: item.productId.images?.[0],
          };
        }),
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      console.log('Sending order data:', orderData);

      const orderResponse = await axios.post(
        'http://localhost:5000/api/orders/create',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.delete('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchCart();
      toast.success('Order placed successfully!');
      navigate('/success');
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error);
      toast.error(error.response?.data?.message || error.message || 'Failed to place order.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!cart || cart.length === 0) return <div className="text-center py-10">Your cart is empty.</div>;

  const { itemsPrice, totalPrice } = calculateTotals();

  return (
    <div className="section">
      <div className="container mx-auto px-4">
        <div id="breadcrumb" className="mb-6">
          <ul className="breadcrumb-tree flex space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-red-600">Home</Link></li>
            <li><Link to="/cart" className="hover:text-red-600">Cart</Link></li>
            <li className="text-gray-800">Checkout</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="section-title mb-4">
              <h3 className="text-2xl font-bold">Billing Details</h3>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    className={`w-full p-3 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={billingDetails.firstName}
                    onChange={handleInputChange}
                    aria-label="First Name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input
                    className={`w-full p-3 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={billingDetails.lastName}
                    onChange={handleInputChange}
                    aria-label="Last Name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <input
                className="w-full p-3 border border-gray-300 rounded"
                type="text"
                name="company"
                placeholder="Company (optional)"
                value={billingDetails.company}
                onChange={handleInputChange}
                aria-label="Company"
              />
              <input
                className={`w-full p-3 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                type="text"
                name="address"
                placeholder="Address"
                value={billingDetails.address}
                onChange={handleInputChange}
                aria-label="Address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    className={`w-full p-3 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    type="text"
                    name="city"
                    placeholder="City"
                    value={billingDetails.city}
                    onChange={handleInputChange}
                    aria-label="City"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <input
                    className={`w-full p-3 border rounded ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    type="text"
                    name="state"
                    placeholder="State"
                    value={billingDetails.state}
                    onChange={handleInputChange}
                    aria-label="State"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
                <div>
                  <input
                    className={`w-full p-3 border rounded ${errors.zip ? 'border-red-500' : 'border-gray-300'}`}
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    value={billingDetails.zip}
                    onChange={handleInputChange}
                    aria-label="ZIP Code"
                  />
                  {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                </div>
              </div>
              <input
                className={`w-full p-3 border rounded ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                type="text"
                name="country"
                placeholder="Country"
                value={billingDetails.country}
                onChange={handleInputChange}
                aria-label="Country"
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              <input
                className={`w-full p-3 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                type="email"
                name="email"
                placeholder="Email"
                value={billingDetails.email}
                onChange={handleInputChange}
                aria-label="Email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              <input
                className={`w-full p-3 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                type="tel"
                name="phone"
                placeholder="Phone"
                value={billingDetails.phone}
                onChange={handleInputChange}
                aria-label="Phone"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              <textarea
                className="w-full p-3 border border-gray-300 rounded"
                name="notes"
                placeholder="Order Notes (optional)"
                value={billingDetails.notes}
                onChange={handleInputChange}
                aria-label="Order Notes"
              />
            </form>
          </div>

          <div>
            <div className="section-title mb-4">
              <h3 className="text-2xl font-bold">Your Order</h3>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex justify-between font-semibold mb-2">
                <span>Product</span>
                <span>Total</span>
              </div>
              {cart.map((item) => (
                <div key={item.productId._id} className="flex justify-between mb-2">
                  <span>{item.productId.name} x {item.quantity}</span>
                  <span>{((item.price || item.productId?.price || 0) * item.quantity).toLocaleString()}₫</span>
                </div>
              ))}
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{itemsPrice.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Payment Method</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bank-transfer"
                    name="payment"
                    value="direct-bank-transfer"
                    checked={paymentMethod === 'direct-bank-transfer'}
                    onChange={() => setPaymentMethod('direct-bank-transfer')}
                    className="mr-2"
                  />
                  <label htmlFor="bank-transfer" className="flex-1">
                    Direct Bank Transfer
                    {paymentMethod === 'direct-bank-transfer' && (
                      <p className="text-gray-600 mt-2">
                        Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                      </p>
                    )}
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cheque"
                    name="payment"
                    value="cheque"
                    checked={paymentMethod === 'cheque'}
                    onChange={() => setPaymentMethod('cheque')}
                    className="mr-2"
                  />
                  <label htmlFor="cheque" className="flex-1">
                    Cheque Payment
                    {paymentMethod === 'cheque' && (
                      <p className="text-gray-600 mt-2">
                        Please send a cheque to Store Name, Store Street, Store Town, Store State, Store Postcode.
                      </p>
                    )}
                  </label>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;