const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

const createOrder = async (req, res) => {
  const { billingDetails, paymentMethod, cartItems, total } = req.body;
  const userId = req.user.id;

  try {
    // Validate cartItems
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create order
    const order = new Order({
      userId,
      items: cartItems.map(item => ({
        productId: item.productId._id || item.productId, // Handle nested productId
        quantity: item.quantity,
        price: item.price || item.productId.price, // Fallback if price is nested
      })),
      total,
      paymentStatus: paymentMethod === 'stripe' ? 'pending' : 'pending', // Adjust as needed
    });

    await order.save();

    // Clear the cart
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );

    res.status(201).json({ orderId: order._id, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrders = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
  try {
    const order = await Order.findByIdAndUpdate(id, { paymentStatus }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };