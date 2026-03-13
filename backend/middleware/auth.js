const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'stockapp_super_secret_jwt_key_2024';

const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login to continue.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists. Please login again.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.'
    });
  }
};

module.exports = { protect };
