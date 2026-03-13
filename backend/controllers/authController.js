const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'stockapp_super_secret_jwt_key_2024';
const JWT_EXPIRE = '7d';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    }

    // Create user
    const user = await User.create({ fullName, email, password, phone });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to StockWebsite.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me  (protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
