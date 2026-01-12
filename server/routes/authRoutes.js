const express = require('express');
const { register, login, logout, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// New Route: Check if I am logged in
router.get('/me', verifyToken, getMe);

// New Route: Logout
router.post('/logout', logout);

module.exports = router;