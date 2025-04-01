// backend/controllers/cartController.js
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (!product.inStock) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    // Populate the productId field in the response
    const populatedCart = await Cart.findOne({ userId }).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(200).json({ userId, items: [] });
    }
    // Log the cart to debug
    console.log('Fetched Cart:', cart);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity < 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    // Populate the productId field in the response
    const populatedCart = await Cart.findOne({ userId }).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();
    // Populate the productId field in the response
    const populatedCart = await Cart.findOne({ userId }).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart, clearCart };