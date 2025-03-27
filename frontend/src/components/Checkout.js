import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

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
  const [processing, setProcessing] = useState(false);

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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        billingDetails,
        paymentMethod,
        cartItems: cart,
        total: calculateTotal(),
      };

      // Send order to backend
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If using Stripe, redirect to payment gateway
      if (paymentMethod === 'stripe') {
        const stripeResponse = await axios.post(
          'http://localhost:5000/api/payment/stripe',
          { orderId: response.data.orderId, amount: calculateTotal() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.location.href = stripeResponse.data.url; // Redirect to Stripe checkout
      } else {
        // Clear cart after successful order
        await axios.delete('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCart();
        navigate('/success');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (cart.length === 0) return <div className="text-center py-10">Your cart is empty.</div>;

  return (
    <div className="section">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div id="breadcrumb" className="mb-6">
          <ul className="breadcrumb-tree flex space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-red-600">Home</Link></li>
            <li><Link to="/cart" className="hover:text-red-600">Cart</Link></li>
            <li className="text-gray-800">Checkout</li>
          </ul>
        </div>

        <div className="row grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Billing Details */}
          <div className="col-md-7">
            <div className="billing-details">
              <div className="section-title mb-4">
                <h3 className="title text-2xl font-bold">Billing Details</h3>
              </div>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={billingDetails.firstName}
                    onChange={handleInputChange}
                    aria-label="First Name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={billingDetails.lastName}
                    onChange={handleInputChange}
                    aria-label="Last Name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="input w-full p-3 border border-gray-300 rounded"
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={billingDetails.company}
                    onChange={handleInputChange}
                    aria-label="Company"
                  />
                </div>
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={billingDetails.address}
                    onChange={handleInputChange}
                    aria-label="Address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="city"
                    placeholder="City"
                    value={billingDetails.city}
                    onChange={handleInputChange}
                    aria-label="City"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="state"
                    placeholder="State"
                    value={billingDetails.state}
                    onChange={handleInputChange}
                    aria-label="State"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.zip ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    value={billingDetails.zip}
                    onChange={handleInputChange}
                    aria-label="ZIP Code"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={billingDetails.country}
                    onChange={handleInputChange}
                    aria-label="Country"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={billingDetails.email}
                    onChange={handleInputChange}
                    aria-label="Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className={`input w-full p-3 border rounded ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={billingDetails.phone}
                    onChange={handleInputChange}
                    aria-label="Phone"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div className="form-group">
                  <textarea
                    className="input w-full p-3 border border-gray-300 rounded"
                    name="notes"
                    placeholder="Order Notes"
                    value={billingDetails.notes}
                    onChange={handleInputChange}
                    aria-label="Order Notes"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-5 order-details">
            <div className="section-title mb-4">
              <h3 className="title text-2xl font-bold">Your Order</h3>
            </div>
            <div className="order-summary">
              <div className="order-col flex justify-between font-semibold">
                <div>Product</div>
                <div>Total</div>
              </div>
              {cart.map((item) => (
                <div key={item._id} className="order-products">
                  <div className="order-col flex justify-between">
                    <div>
                      {item.product.name} x {item.quantity}
                    </div>
                    <div>${(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              <div className="order-col flex justify-between">
                <div>Shipping</div>
                <div>Free</div>
              </div>
              <div className="order-col flex justify-between font-bold text-lg">
                <div>Total</div>
                <div>${calculateTotal().toFixed(2)}</div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-method mt-6">
              <div className="input-radio">
                <input
                  type="radio"
                  name="payment"
                  id="payment-1"
                  value="direct-bank-transfer"
                  checked={paymentMethod === 'direct-bank-transfer'}
                  onChange={() => setPaymentMethod('direct-bank-transfer')}
                />
                <label htmlFor="payment-1" className="ml-2">
                  <span></span>
                  Direct Bank Transfer
                </label>
                <div
                  className={`payment-instructions mt-2 text-gray-600 ${
                    paymentMethod === 'direct-bank-transfer' ? 'block' : 'hidden'
                  }`}
                >
                  Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                </div>
              </div>
              <div className="input-radio mt-4">
                <input
                  type="radio"
                  name="payment"
                  id="payment-2"
                  value="cheque"
                  checked={paymentMethod === 'cheque'}
                  onChange={() => setPaymentMethod('cheque')}
                />
                <label htmlFor="payment-2" className="ml-2">
                  <span></span>
                  Cheque Payment
                </label>
                <div
                  className={`payment-instructions mt-2 text-gray-600 ${
                    paymentMethod === 'cheque' ? 'block' : 'hidden'
                  }`}
                >
                  Please send a cheque to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
                </div>
              </div>
              <div className="input-radio mt-4">
                <input
                  type="radio"
                  name="payment"
                  id="payment-3"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <label htmlFor="payment-3" className="ml-2">
                  <span></span>
                  PayPal
                </label>
                <div
                  className={`payment-instructions mt-2 text-gray-600 ${
                    paymentMethod === 'paypal' ? 'block' : 'hidden'
                  }`}
                >
                  Pay via PayPal; you can pay with your credit card if you don’t have a PayPal account.
                </div>
              </div>
              <div className="input-radio mt-4">
                <input
                  type="radio"
                  name="payment"
                  id="payment-4"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                />
                <label htmlFor="payment-4" className="ml-2">
                  <span></span>
                  Stripe (Credit/Debit Card)
                </label>
                <div
                  className={`payment-instructions mt-2 text-gray-600 ${
                    paymentMethod === 'stripe' ? 'block' : 'hidden'
                  }`}
                >
                  Pay securely using your credit or debit card via Stripe.
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="primary-btn order-submit w-full mt-6 bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-colors"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;