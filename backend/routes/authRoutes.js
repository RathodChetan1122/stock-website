const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register  — create new account
router.post('/register', register);

// POST /api/auth/login  — login
router.post('/login', login);

// GET /api/auth/me  — get logged in user (protected)
router.get('/me', protect, getMe);

// POST /api/auth/logout
router.post('/logout', protect, logout);

module.exports = router;
