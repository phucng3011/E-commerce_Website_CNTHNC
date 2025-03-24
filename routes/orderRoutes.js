const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.put('/:id', authMiddleware, updateOrderStatus);

module.exports = router;