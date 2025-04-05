const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUserOrders, updateUserProfile, updateUserPassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const User = require('../models/userModel');

// Middleware to check if the user is an admin
const adminMiddleware = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.get('/orders', authMiddleware, getUserOrders);

// Admin-only routes (already exists in your code)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/:id/admin', authMiddleware, adminMiddleware, async (req, res) => {
  const { isAdmin } = req.body;
  if (typeof isAdmin !== 'boolean') {
    return res.status(400).json({ message: 'isAdmin must be a boolean' });
  }
  if (req.user._id.toString() === req.params.id) {
    return res.status(403).json({ message: 'Cannot modify your own admin status' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isAdmin = isAdmin;
    await user.save();
    res.json({ message: 'User admin status updated', user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    return res.status(403).json({ message: 'Cannot delete your own account' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// New routes for profile management
router.put('/me', authMiddleware, updateUserProfile); // Update profile
router.put('/me/password', authMiddleware, updateUserPassword); // Change password

module.exports = router;