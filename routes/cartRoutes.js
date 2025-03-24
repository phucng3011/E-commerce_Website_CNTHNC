const express = require('express');
const router = express.Router();
const { addToCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

router.post('/add', authMiddleware, addToCart);

module.exports = router;