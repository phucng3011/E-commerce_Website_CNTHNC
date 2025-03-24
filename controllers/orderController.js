const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

const createOrder = async (req, res) => {
  const userId = req.user.id; // From auth middleware
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cart.items.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // Stripe uses cents
      currency: 'usd',
      metadata: { userId: userId.toString() },
    });

    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      total,
      paymentIntentId: paymentIntent.id,
    });

    await order.save();
    await Cart.findOneAndDelete({ userId }); // Clear cart
    res.status(201).json({ order, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
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