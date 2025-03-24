const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUserOrders } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.get('/orders', authMiddleware, getUserOrders);

module.exports = router;