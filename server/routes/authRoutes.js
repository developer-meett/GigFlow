const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken'); // Import this!
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// New Route: Check if I am logged in
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json(req.user);
});

// New Route: Logout
router.post('/logout', (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out" });
});

module.exports = router;