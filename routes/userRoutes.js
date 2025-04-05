const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUserOrders } = require('../controllers/userController');
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

// Get all users (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user admin status (Admin only)
router.put('/:id/admin', authMiddleware, adminMiddleware, async (req, res) => {
  const { isAdmin } = req.body;
  if (typeof isAdmin !== 'boolean') {
    return res.status(400).json({ message: 'isAdmin must be a boolean' });
  }

  // Prevent admins from modifying their own admin status
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

// Delete user (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  // Prevent admins from deleting themselves
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

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.get('/orders', authMiddleware, getUserOrders);

module.exports = router;