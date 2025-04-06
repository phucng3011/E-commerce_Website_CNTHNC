const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, provider: 'google' });
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              provider: 'google',
              providerId: profile.id,
            });
            await user.save();
          } else {
            // Link existing email to Google
            user.provider = 'google';
            user.providerId = profile.id;
            await user.save();
          }
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Generate JWT for user
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = { passport, generateToken };