const express = require('express');
const router = express.Router();
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

// Route to create PaymentIntent (requires authentication)
router.post('/create-payment-intent', authMiddleware, createPaymentIntent);

// Route for Stripe webhook (no authentication, raw body)
router.post('/webhook', handleWebhook);

module.exports = router;