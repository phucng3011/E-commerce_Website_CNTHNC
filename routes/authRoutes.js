const express = require('express');
const passport = require('passport');
const { googleCallback, facebookCallback } = require('../controllers/authController');

const router = express.Router();

// Google Login Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  googleCallback
);

module.exports = router;