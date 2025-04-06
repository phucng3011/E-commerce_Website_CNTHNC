const mongoose = require('mongoose');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save hook
    });

    await user.save();
    console.log('User registered:', { email, hashedPassword: user.password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, deleted: { $ne: true } }); // Exclude deleted users
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Login password check:', { email, enteredPassword: password, isMatch });

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (err) {
    console.error('Error in loginUser:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User Password
const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Debug log before password comparison
    console.log('Checking current password:', {
      userId,
      currentPassword,
      storedPassword: user.password,
    });

    // Validate current password
    const isMatch = await user.matchPassword(currentPassword);
    console.log('Password match result:', { isMatch });

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Update the password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();
    console.log('Password updated:', { userId, newHashedPassword: user.password });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in updateUserPassword:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Current User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getMe:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  console.log('Entering getUserOrders, req.user:', req.user);
  const userId = req.user?.id || req.user?._id;
  if (!userId) {
    console.error('No userId found in req.user');
    return res.status(401).json({ message: 'User authentication failed: No user ID' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error('Invalid userId format:', userId);
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    console.log('Fetching orders for userId:', userId);
    let orders = await Order.find({ userId })
      .populate({
        path: 'orderItems.productId',
        select: 'name images price description',
        model: 'Product',
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      console.log('No orders found for userId:', userId);
      return res.status(200).json([]);
    }

    // Normalize orderItems to match Profile.js expectations
    orders = orders.map(order => ({
      ...order,
      orderItems: order.orderItems.map(item => ({
        ...item,
        productId: item.productId?._id || item.productId,
        name: item.productId?.name || item.name || 'Unknown Product',
        price: item.price, // Use stored price from order
        image: item.productId?.images?.[0] || item.image || null,
        description: item.productId?.description || item.description || '',
      })),
    }));

    console.log('Orders fetched successfully:', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getUserOrders:', {
      message: error.message,
      stack: error.stack,
      userId,
    });
    res.status(500).json({ message: 'Server error: Unable to fetch user orders' });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    // Check if the email is already in use by another user
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.json({ message: 'Profile updated successfully', user: { ...user._doc, password: undefined } });
  } catch (err) {
    console.error('Error in updateUserProfile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    console.log('User deleted:', userId);

    // Reassign orders to a placeholder "deleted user" account
    const placeholderUser = await User.findOne({ email: 'deleted@placeholder.com' });
    if (placeholderUser) {
      await Order.updateMany({ userId: userId }, { userId: placeholderUser._id });
      console.log('Reassigned user orders to placeholder:', placeholderUser._id);
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error in deleteUser:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUserOrders,
  updateUserProfile,
  updateUserPassword,
  deleteUser
};