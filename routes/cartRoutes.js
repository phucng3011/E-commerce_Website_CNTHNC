const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.put('/', authMiddleware, updateCartItem);
router.delete('/:productId', authMiddleware, removeFromCart);

module.exports = router;