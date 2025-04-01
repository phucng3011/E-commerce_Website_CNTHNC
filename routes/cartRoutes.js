// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart, // Add this
} = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.put('/', authMiddleware, updateCartItem);
router.delete('/:productId', authMiddleware, removeFromCart);
router.delete('/', authMiddleware, clearCart); // New route to clear cart

module.exports = router;