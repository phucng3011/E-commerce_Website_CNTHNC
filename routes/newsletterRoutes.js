const express = require('express');
const router = express.Router();
const Newsletter = require('../models/newsletterModel');

router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email is already subscribed' });
    }

    // Save the email to the database
    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;