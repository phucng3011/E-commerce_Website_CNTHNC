const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, getOrderById, deleteOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.delete('/:id', authMiddleware, deleteOrder);
router.put('/:id', authMiddleware, updateOrderStatus);

module.exports = router;