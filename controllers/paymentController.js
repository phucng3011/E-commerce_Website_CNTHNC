const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');

// Create PaymentIntent for Stripe
const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;
  const userId = req.user.id;

  try {
    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      payment_method_types: ['card'],
      metadata: { userId },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ message: error.message || 'Failed to create payment intent' });
  }
};

// Handle Stripe Webhook
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  // Handle specific events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      try {
        const order = await Order.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          {
            paymentStatus: 'paid',
            isPaid: true,
            paidAt: new Date(),
            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: paymentIntent.receipt_email || '',
            },
          },
          { new: true }
        );
        if (!order) {
          console.error('Order not found for PaymentIntent:', paymentIntent.id);
        } else {
          console.log('Order updated for PaymentIntent:', paymentIntent.id);
        }
      } catch (error) {
        console.error('Error updating order for PaymentIntent:', error);
      }
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      try {
        await Order.findOneAndUpdate(
          { paymentIntentId: failedPaymentIntent.id },
          {
            paymentStatus: 'failed',
            paymentResult: {
              id: failedPaymentIntent.id,
              status: failedPaymentIntent.status,
              update_time: new Date().toISOString(),
            },
          }
        );
        console.log('PaymentIntent failed:', failedPaymentIntent.id);
      } catch (error) {
        console.error('Error updating order for failed PaymentIntent:', error);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};

module.exports = {
  createPaymentIntent,
  handleWebhook,
};