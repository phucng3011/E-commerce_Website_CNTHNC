import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ billingDetails, cart, paymentMethod, calculateTotals, handlePlaceOrder }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [stripeError, setStripeError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleStripePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

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

    setProcessing(true);
    try {
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals();
      console.log('Total Price for Stripe:', totalPrice);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/create-payment-intent`,
        { amount: Math.round(totalPrice), currency: 'vnd' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${billingDetails.firstName} ${billingDetails.lastName}`,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              state: billingDetails.state,
              postal_code: billingDetails.zip,
              country: billingDetails.country,
            },
          },
        },
      });

      if (result.error) {
        setStripeError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        const orderData = {
          billingDetails: {
            address: billingDetails.address,
            city: billingDetails.city,
            postalCode: billingDetails.zip,
            country: billingDetails.country,
          },
          paymentMethod: 'stripe',
          cartItems: cart.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.price,
            name: item.productId.name,
            image: item.productId.images?.[0],
          })),
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          paymentIntentId: result.paymentIntent.id,
        };

        // Create the order in the backend
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/orders/create`,
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // If order creation is successful, clear cart and navigate
        if (res.status === 201) {
          await clearCart();
          toast.success('Order placed successfully!');
          navigate('/success');
        }
      }
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      setStripeError(error.response?.data?.message || error.message || 'Failed to process payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={paymentMethod === 'stripe' ? handleStripePayment : handlePlaceOrder}>
      {paymentMethod === 'stripe' && (
        <div className="mt-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }}
          />
          {stripeError && <p className="text-red-500 text-sm mt-2">{stripeError}</p>}
        </div>
      )}
      <button
        type="submit"
        disabled={processing || (!stripe && paymentMethod === 'stripe')}
        className={`w-full mt-6 bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-colors ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {processing ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cart, fetchCart, clearCart } = useContext(CartContext);
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
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching initial cart and user data');
        await fetchCart();
        const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = userRes.data;

        if (!isPrefilled) {
          setBillingDetails(prevDetails => ({
            ...prevDetails,
            firstName: user.name.split(' ')[0] || '',
            lastName: user.name.split(' ').slice(1).join(' ') || '',
            company: user.company || '',
            address: user.address?.address || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            zip: user.address?.postalCode || '',
            country: user.address?.country || '',
            email: user.email || '',
            phone: user.phone || '',
          }));
          setIsPrefilled(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchCart, isPrefilled]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
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
      const price = item.price || item.productId?.price || 0;
      if (!price) {
        console.error('Missing price for product:', item.productId?.name, item);
        toast.error(`Price missing for product: ${item.productId?.name}`);
      }
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

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/create`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await clearCart();
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
    <Elements stripe={stripePromise}>
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
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="stripe"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="mr-2"
                    />
                    <label htmlFor="stripe" className="flex-1">
                      Credit/Debit Card (Stripe)
                      {paymentMethod === 'stripe' && (
                        <p className="text-gray-600 mt-2">
                          Pay securely using your credit or debit card via Stripe.
                        </p>
                      )}
                    </label>
                  </div>
                </div>
                <CheckoutForm
                  billingDetails={billingDetails}
                  cart={cart}
                  paymentMethod={paymentMethod}
                  calculateTotals={calculateTotals}
                  handlePlaceOrder={handlePlaceOrder}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default Checkout;