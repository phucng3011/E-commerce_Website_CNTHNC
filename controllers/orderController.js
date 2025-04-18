const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Create Order
const createOrder = async (req, res) => {
  const {
    billingDetails,
    paymentMethod,
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentIntentId, // Added for Stripe
  } = req.body;
  const userId = req.user.id;

  try {
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!billingDetails || !billingDetails.address || !billingDetails.city || !billingDetails.postalCode || !billingDetails.country) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    const productIds = cartItems.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select('price');
    const productPriceMap = new Map(products.map(p => [p._id.toString(), p.price]));

    const orderItems = cartItems.map((item) => {
      const price = item.price || productPriceMap.get(item.productId.toString());
      if (!price) {
        console.error('No price found for product:', item);
        throw new Error(`Price missing for product ID: ${item.productId}`);
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
        name: item.name || 'Unknown Product',
        image: item.image || null,
      };
    });

    const calculatedItemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calculatedTaxPrice = taxPrice || calculatedItemsPrice * 0.1;
    const calculatedShippingPrice = shippingPrice || 0;
    const calculatedTotalPrice = calculatedItemsPrice + calculatedTaxPrice + calculatedShippingPrice;

    const order = new Order({
      userId,
      orderItems,
      shippingAddress: billingDetails,
      paymentMethod,
      itemsPrice: calculatedItemsPrice,
      shippingPrice: calculatedShippingPrice,
      taxPrice: calculatedTaxPrice,
      totalPrice: calculatedTotalPrice,
      paymentStatus: paymentMethod === 'stripe' ? 'pending' : 'pending',
      status: 'Pending',
      paymentIntentId: paymentMethod === 'stripe' ? paymentIntentId : undefined,
    });

    await order.save();
    await Cart.findOneAndUpdate({ userId }, { items: [] }, { new: true });

    res.status(201).json({
      orderId: order._id,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get All Orders (Admin)
const getOrders = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('orderItems.productId', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      currentPage: pageNum,
      totalPages: Math.ceil(totalOrders / limitNum),
      totalOrders,
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({ message: 'Server error: Unable to fetch orders' });
  }
};

// Get Order by ID (Admin)
const getOrderById = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('orderItems.productId', 'name images price')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: 'Server error: Unable to fetch order' });
  }
};

// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { status, paymentStatus, isPaid, isDelivered } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) {
      if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      order.status = status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (status === 'Cancelled') {
        order.isDelivered = false;
        order.deliveredAt = null;
      }
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (typeof isPaid === 'boolean') {
      order.isPaid = isPaid;
      order.paidAt = isPaid ? Date.now() : null;
    }
    if (typeof isDelivered === 'boolean') {
      order.isDelivered = isDelivered;
      if (isDelivered) {
        order.deliveredAt = Date.now();
        order.status = 'Delivered';
      } else {
        order.deliveredAt = null;
        if (order.status === 'Delivered') order.status = 'Shipped';
      }
    }

    await order.save();
    const updatedOrder = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('orderItems.productId', 'name images price')
      .lean();

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Server error: Unable to update order' });
  }
};

// Delete Order (Admin)
const deleteOrder = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    res.status(500).json({ message: 'Server error: Unable to delete order' });
  }
};

// Get User's Orders
const getUserOrders = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  if (!userId) {
    console.error('No userId found in req.user');
    return res.status(401).json({ message: 'User authentication failed: No user ID' });
  }

  try {
    let orders = await Order.find({ userId })
      .populate({
        path: 'orderItems.productId',
        select: 'name images price description',
        model: 'Product',
      })
      .sort({ createdAt: -1 })
      .lean();

    orders = orders.map(order => ({
      ...order,
      orderItems: order.orderItems.map(item => ({
        ...item,
        productId: item.productId?._id || item.productId,
        name: item.productId?.name || item.name,
        price: item.price,
        image: item.productId?.images?.[0] || item.image,
        description: item.productId?.description || '',
      })),
    }));

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ message: 'Server error: Unable to fetch user orders' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
};